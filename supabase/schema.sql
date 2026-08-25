-- ============================================================
-- AMSIO International — Supabase Schema
-- Chạy file này trong Supabase > SQL Editor > New query
-- ============================================================

-- 1. COUNTRIES
CREATE TABLE IF NOT EXISTS countries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  code        CHAR(2) NOT NULL UNIQUE,        -- "MY", "SG"
  flag        TEXT NOT NULL,                  -- "🇲🇾"
  status      TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Onboarding','Coming Soon')),
  partner_name  TEXT,
  partner_email TEXT,
  partner_rep   TEXT,
  schools_count INT NOT NULL DEFAULT 0,
  students_count INT NOT NULL DEFAULT 0,
  revenue     NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. SCHOOLS
CREATE TABLE IF NOT EXISTS schools (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  code             TEXT UNIQUE,                -- "MY-KL-001" — null while Pending
  country_id       UUID REFERENCES countries(id) ON DELETE SET NULL,
  city             TEXT,
  type             TEXT DEFAULT 'Private' CHECK (type IN ('Public','Private','International')),
  coordinator_name  TEXT,
  coordinator_email TEXT,
  students_count   INT NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Active','Pending','Onboarding','Inactive','Suspended')),
  joined_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. STUDENTS
CREATE TABLE IF NOT EXISTS students (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name   TEXT NOT NULL,
  email       TEXT,
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  country_id  UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  grade       SMALLINT NOT NULL CHECK (grade BETWEEN 1 AND 12),
  subjects    TEXT[] NOT NULL DEFAULT '{}',   -- {"Math","Science"}
  r1_result   TEXT CHECK (r1_result IN ('Distinction','Pass','Fail','Pending')),
  r2_result   TEXT CHECK (r2_result IN ('Distinction','Pass','Fail','Pending')),
  gf_qualified BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. ADMIN PROFILES (links to Supabase Auth users)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'hq_staff' CHECK (role IN ('super_admin','hq_staff','finance','content')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject     TEXT NOT NULL,
  body        TEXT NOT NULL DEFAULT '',
  target      TEXT NOT NULL DEFAULT 'All Partners',
  status      TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Sent','Draft')),
  sent_at     TIMESTAMPTZ,
  opens       INT NOT NULL DEFAULT 0,
  recipients  INT NOT NULL DEFAULT 0,
  created_by  UUID NOT NULL REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE countries      ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools        ENABLE ROW LEVEL SECURITY;
ALTER TABLE students       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements  ENABLE ROW LEVEL SECURITY;

-- Public: read countries (for public website)
CREATE POLICY "public_read_countries" ON countries FOR SELECT USING (true);

-- Public: insert school registration requests (status = 'Pending' enforced by API)
CREATE POLICY "public_insert_school_registration" ON schools FOR INSERT WITH CHECK (status = 'Pending');

-- Admin-only read and write (all tables)
CREATE POLICY "admin_read_schools"           ON schools        FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_write_schools"          ON schools        FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_countries"          ON countries      FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_students"           ON students       FOR ALL    USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_profiles"       ON admin_profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "admin_all_announcements"  ON announcements  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — 12 thành viên
-- ============================================================

INSERT INTO countries (name, code, flag, status, partner_name, partner_email, partner_rep, schools_count, students_count, revenue) VALUES
  ('Australia',    'AU', '🇦🇺', 'Active',     'Apex Education Pty Ltd',      'info@amsio.org',    'Sarah Mitchell',   42, 5100, 153000),
  ('Cambodia',     'KH', '🇰🇭', 'Active',     'Mekong Learning Co.',         'info@amsio.org',     'Sopheak Dara',     14, 1200, 36000),
  ('China',        'CN', '🇨🇳', 'Active',     'SinoOlympiad Group',          'info@amsio.org',        'Wei Zhonghua',     65, 8900, 267000),
  ('India',        'IN', '🇮🇳', 'Active',     'BrightMinds India Pvt.',      'info@amsio.org',        'Arjun Sharma',     58, 7200, 216000),
  ('Indonesia',    'ID', '🇮🇩', 'Active',     'Nusantara Edu Partners',      'info@amsio.org',    'Budi Santoso',     35, 4500, 135000),
  ('Japan',        'JP', '🇯🇵', 'Active',     'Sakura Academic Corp.',       'info@amsio.org',        'Kenji Tanaka',     38, 4200, 126000),
  ('Malaysia',     'MY', '🇲🇾', 'Active',     'EduNation Sdn. Bhd.',         'info@amsio.org',     'Ahmad Razif',      28, 3100, 93000),
  ('Philippines',  'PH', '🇵🇭', 'Active',     'PH Scholars Institute',       'info@amsio.org',  'Maria Santos',     22, 2400, 72000),
  ('Singapore',    'SG', '🇸🇬', 'Active',     'Pinnacle Learning Pte.',      'info@amsio.org',    'James Lim',        18, 2100, 63000),
  ('South Korea',  'KR', '🇰🇷', 'Active',     'HanStar Education Ltd.',      'info@amsio.org',   'Park Jisoo',       30, 3200, 96000),
  ('Thailand',     'TH', '🇹🇭', 'Active',     'AsiaMath Co. Ltd.',           'info@amsio.org',     'Somchai Pongpan',  21, 1980, 59400),
  ('Vietnam',      'VN', '🇻🇳', 'Active',     'VietScholar JSC',             'info@amsio.org',      'Nguyen Van Minh',  16, 1350, 33600)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- Auto-create admin_profile on user signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_admin_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO admin_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'hq_staff')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_admin_user();
