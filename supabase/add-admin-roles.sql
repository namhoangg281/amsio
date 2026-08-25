-- ============================================================
-- AMSIO Admin RBAC Migration
-- Add 5-role system: super_admin, hq_staff, exam_manager, marketing, finance
-- Run in Supabase > SQL Editor > New query
-- ============================================================

-- Drop old CHECK constraint
ALTER TABLE public.admin_profiles DROP CONSTRAINT IF EXISTS admin_profiles_role_check;

-- Add new CHECK constraint with all 5 roles
ALTER TABLE public.admin_profiles
  ADD CONSTRAINT admin_profiles_role_check
  CHECK (role IN ('super_admin', 'hq_staff', 'exam_manager', 'marketing', 'finance'));

-- Migrate old 'content' role → 'marketing'
UPDATE public.admin_profiles SET role = 'marketing' WHERE role = 'content';

-- Update trigger to support new roles
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_role TEXT;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'hq_staff');

  IF v_role IN ('super_admin', 'hq_staff', 'exam_manager', 'marketing', 'finance') THEN
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
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$;
