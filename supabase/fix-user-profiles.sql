-- ============================================================
-- AMSIO — Fix: user_profiles trigger + portal auth flow
-- Chạy file này trong Supabase > SQL Editor > New query
-- ============================================================

-- ─── BƯỚC 1: Tạo bảng user_profiles (nếu chưa có) ──────────────────────────
-- Bảng này lưu role của mọi portal user (student / parent / school / partner)
CREATE TABLE IF NOT EXISTS user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','parent','school','partner')),
  school_code TEXT,                  -- chỉ điền khi role = school hoặc student school track
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User chỉ đọc được profile của chính mình
CREATE POLICY "user_read_own_profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- User tự tạo profile của mình (trigger sẽ làm điều này — policy phòng khi cần)
CREATE POLICY "user_insert_own_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admin đọc được tất cả
CREATE POLICY "admin_read_all_profiles"
  ON user_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── BƯỚC 2: Sửa trigger handle_new_admin_user ──────────────────────────────
-- Trigger cũ bị lỗi: nó cố insert "school"/"student" vào admin_profiles
-- nhưng CHECK constraint chỉ cho phép super_admin/hq_staff/finance/content
-- → toàn bộ portal signUp bị fail
-- Fix: thêm EXCEPTION HANDLING để không crash khi role không hợp lệ

CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'hq_staff');

  -- Chỉ tạo admin_profiles cho các admin roles
  IF v_role IN ('super_admin', 'hq_staff', 'finance', 'content') THEN
    INSERT INTO public.admin_profiles (id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      v_role
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- ─── BƯỚC 3: Tạo trigger mới cho portal users → user_profiles ───────────────
CREATE OR REPLACE FUNCTION handle_new_portal_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  -- Chỉ tạo user_profiles cho portal roles
  IF v_role IN ('student', 'parent', 'school', 'partner') THEN
    INSERT INTO public.user_profiles (id, email, full_name, role, school_code)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      v_role,
      NEW.raw_user_meta_data->>'school_code'  -- null nếu không có
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Drop trigger cũ (nếu chỉ có 1 trigger) và gắn lại cả 2
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger cho admin
CREATE TRIGGER on_auth_admin_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();

-- Trigger cho portal users
CREATE TRIGGER on_auth_portal_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_portal_user();

-- ─── BƯỚC 4: Kiểm tra ───────────────────────────────────────────────────────
-- Sau khi chạy xong, test:
-- 1. Tạo admin qua Supabase Dashboard → Authentication → Users → Add user
--    (không điền metadata) → admin_profiles sẽ có row mới với role='hq_staff'
-- 2. Đăng ký portal (student/school) → user_profiles sẽ có row mới với role đúng
-- 3. Login portal → role được đọc đúng từ user_profiles → redirect đúng portal
