-- ============================================================
-- AMSIO STANDALONE — COMPLETE DATABASE SETUP
-- Target: Supabase project nnqwjreinqiohdxtqzkk
-- Date: 2026-08-25
--
-- Run this ONCE in Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- on the NEW amsio Supabase project.
--
-- This script creates:
--   1. Extensions (moddatetime)
--   2. Schemas: cms, core, exam
--   3. CMS tables: articles, collection_items, translation_strings,
--      media_assets, activity_log
--   4. Core tables: users (profile mirror), institutions
--   5. Exam tables: competitions, competition_results, certificates
--   6. Storage bucket: cms-assets
--   7. RLS policies for all tables
--   8. Grants for anon/authenticated/service_role
--   9. Auth hook: custom_access_token_hook (injects roles into JWT)
--
-- IMPORTANT: After running this script, also:
--   (a) Enable the custom_access_token_hook in Dashboard > Authentication >
--       Hooks > Customize Access Token (select the function
--       public.custom_access_token_hook)
--   (b) Create a CMS admin user via Dashboard > Authentication > Users > Add User
--       Then run the admin setup SQL at the bottom of this file.
-- ============================================================

-- ══════════════════════════════════════════════════════════════
-- 0. Extensions
-- ══════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- ══════════════════════════════════════════════════════════════
-- 1. SCHEMAS
-- ══════════════════════════════════════════════════════════════
CREATE SCHEMA IF NOT EXISTS cms;
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS exam;

-- Grant schema usage
GRANT USAGE ON SCHEMA cms  TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA core TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA exam TO anon, authenticated, service_role;

-- ══════════════════════════════════════════════════════════════
-- 2. CMS TABLES
-- ══════════════════════════════════════════════════════════════

-- ── 2.1 cms.articles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.articles (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID        NOT NULL,
  slug          TEXT        NOT NULL,
  category      TEXT        NOT NULL CHECK (category IN ('news', 'press')),
  status        TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured      BOOLEAN     NOT NULL DEFAULT FALSE,
  translations  JSONB       NOT NULL DEFAULT '{}',
  cover_url     TEXT,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ,
  created_by    UUID        REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_articles_slug_tenant
  ON cms.articles (tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cms_articles_category_status_pub
  ON cms.articles (tenant_id, category, status, published_at DESC NULLS LAST) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_cms_articles_en_title
  ON cms.articles ((translations -> 'en' ->> 'title')) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_cms_articles_updated_at
  BEFORE UPDATE ON cms.articles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── 2.2 cms.activity_log ────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.activity_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID        NOT NULL,
  actor_id     UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
  action       TEXT        NOT NULL,
  entity_type  TEXT        NOT NULL,
  entity_id    UUID,
  payload      JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cms_activity_log_entity
  ON cms.activity_log (tenant_id, entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cms_activity_log_actor
  ON cms.activity_log (tenant_id, actor_id, created_at DESC);

-- ── 2.3 cms.collection_items ────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.collection_items (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID        NOT NULL,
  collection_key  TEXT        NOT NULL CHECK (collection_key IN ('team','partners','mission_blocks','olympiad_intro')),
  sort_order      INT         NOT NULL DEFAULT 0,
  status          TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  translations    JSONB       NOT NULL DEFAULT '{}',
  metadata        JSONB       NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID        REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_collection_items_tenant_key_sort
  ON cms.collection_items (tenant_id, collection_key, sort_order) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_cms_collection_items_updated_at
  BEFORE UPDATE ON cms.collection_items
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── 2.4 cms.translation_strings ─────────────────────────────
CREATE TABLE IF NOT EXISTS cms.translation_strings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID        NOT NULL,
  locale      TEXT        NOT NULL CHECK (locale IN ('en', 'vi', 'zh', 'fr', 'ar')),
  namespace   TEXT        NOT NULL DEFAULT 'ui',
  key         TEXT        NOT NULL,
  value       TEXT        NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by  UUID        REFERENCES auth.users (id) ON DELETE SET NULL,
  deleted_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_translation_strings_locale_ns_key
  ON cms.translation_strings (locale, namespace, key);
CREATE INDEX IF NOT EXISTS idx_cms_translation_strings_ns_key
  ON cms.translation_strings (namespace, key);

CREATE TRIGGER trg_cms_translation_strings_updated_at
  BEFORE UPDATE ON cms.translation_strings
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ── 2.5 cms.media_assets ────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.media_assets (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID        NOT NULL,
  filename      TEXT        NOT NULL,
  storage_path  TEXT        NOT NULL,
  mime_type     TEXT,
  size_bytes    BIGINT,
  alt_text      TEXT,
  usage_tag     TEXT CHECK (usage_tag IN ('article_cover','press_kit','team_photo','partner_logo','og_image')),
  seo_meta      JSONB       NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ,
  created_by    UUID        REFERENCES auth.users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_media_assets_tenant_usage
  ON cms.media_assets (tenant_id, usage_tag) WHERE deleted_at IS NULL;

-- ══════════════════════════════════════════════════════════════
-- 3. CORE TABLES (minimal for AMSIO standalone)
-- ══════════════════════════════════════════════════════════════

-- ── 3.1 core.users — profile mirror of auth.users ───────────
-- Used by competition results page to display student names.
-- In the full itran platform this is the master identity table;
-- here it is a lightweight mirror.
CREATE TABLE IF NOT EXISTS core.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL DEFAULT '',
  email       TEXT,
  tenant_id   UUID,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_core_users_tenant
  ON core.users (tenant_id) WHERE deleted_at IS NULL;

-- Auto-sync: when a user signs up, create a core.users row
CREATE OR REPLACE FUNCTION core.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO core.users (id, full_name, email, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    '00000000-0000-0000-0000-000000000002'::uuid
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_core
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION core.handle_new_user();

-- ── 3.2 core.institutions — school/partner registry ─────────
-- Used by school registration form and school-code API.
CREATE TABLE IF NOT EXISTS core.institutions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID        NOT NULL DEFAULT '00000000-0000-0000-0000-000000000002'::uuid,
  name              TEXT        NOT NULL,
  institution_code  TEXT,
  country_code      TEXT,
  province_city     TEXT,
  contact_email     TEXT,
  contract_details  JSONB       NOT NULL DEFAULT '{}',
  type              TEXT        NOT NULL DEFAULT 'school',
  source            TEXT,
  status            TEXT        NOT NULL DEFAULT 'pending',
  is_active         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_core_institutions_code
  ON core.institutions (institution_code) WHERE deleted_at IS NULL AND institution_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_core_institutions_tenant_type
  ON core.institutions (tenant_id, type) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_core_institutions_updated_at
  BEFORE UPDATE ON core.institutions
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ══════════════════════════════════════════════════════════════
-- 4. EXAM TABLES (minimal for AMSIO standalone)
-- ══════════════════════════════════════════════════════════════

-- ── 4.1 exam.competitions ───────────────────────────────────
CREATE TABLE IF NOT EXISTS exam.competitions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID        NOT NULL DEFAULT '00000000-0000-0000-0000-000000000002'::uuid,
  name        TEXT        NOT NULL,
  year        INT,
  status      TEXT        NOT NULL DEFAULT 'draft'
              CHECK (status IN ('draft','active','closed','archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_exam_competitions_tenant_status
  ON exam.competitions (tenant_id, status, year DESC);

-- ── 4.2 exam.competition_results ────────────────────────────
CREATE TABLE IF NOT EXISTS exam.competition_results (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID        NOT NULL DEFAULT '00000000-0000-0000-0000-000000000002'::uuid,
  user_id         UUID        NOT NULL,
  competition_id  UUID        NOT NULL REFERENCES exam.competitions (id) ON DELETE CASCADE,
  r1_score        NUMERIC,
  r2_score        NUMERIC,
  gf_qualified    BOOLEAN     NOT NULL DEFAULT FALSE,
  medal           TEXT        CHECK (medal IN ('Gold','Silver','Bronze')),
  subjects        TEXT[]      NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_exam_results_comp_tenant
  ON exam.competition_results (tenant_id, competition_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_exam_results_user
  ON exam.competition_results (user_id);

-- ── 4.3 exam.certificates ───────────────────────────────────
CREATE TABLE IF NOT EXISTS exam.certificates (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID        NOT NULL DEFAULT '00000000-0000-0000-0000-000000000002'::uuid,
  user_id     UUID        NOT NULL,
  cert_type   TEXT        NOT NULL DEFAULT 'exam_prize',
  pdf_url     TEXT,
  is_official BOOLEAN     NOT NULL DEFAULT FALSE,
  is_revoked  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_exam_certificates_user_tenant
  ON exam.certificates (tenant_id, user_id, cert_type) WHERE is_revoked = FALSE;

-- ══════════════════════════════════════════════════════════════
-- 5. ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════

-- ── 5.1 CMS tables ──────────────────────────────────────────

-- cms.articles
ALTER TABLE cms.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.articles FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON cms.articles
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read_published" ON cms.articles
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "marketing_staff_write" ON cms.articles
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb))
  WITH CHECK ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb));

-- cms.activity_log
ALTER TABLE cms.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.activity_log FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON cms.activity_log
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "marketing_staff_read" ON cms.activity_log
  AS PERMISSIVE FOR SELECT TO authenticated
  USING ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb));

CREATE POLICY "marketing_staff_insert" ON cms.activity_log
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb));

-- cms.collection_items
ALTER TABLE cms.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.collection_items FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON cms.collection_items
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read_active" ON cms.collection_items
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "marketing_staff_write" ON cms.collection_items
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb))
  WITH CHECK ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb));

-- cms.translation_strings
ALTER TABLE cms.translation_strings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.translation_strings FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON cms.translation_strings
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read" ON cms.translation_strings
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (TRUE);

CREATE POLICY "marketing_staff_write" ON cms.translation_strings
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb))
  WITH CHECK ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb));

-- cms.media_assets
ALTER TABLE cms.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.media_assets FORCE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON cms.media_assets
  AS RESTRICTIVE FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read" ON cms.media_assets
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);

CREATE POLICY "marketing_staff_write" ON cms.media_assets
  AS PERMISSIVE FOR ALL TO authenticated
  USING ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb))
  WITH CHECK ((SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb));

-- ── 5.2 Core tables ─────────────────────────────────────────

-- core.users
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON core.users
  AS PERMISSIVE FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "user_read_own" ON core.users
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- core.institutions
ALTER TABLE core.institutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON core.institutions
  AS PERMISSIVE FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- Anon can read institutions (school code lookup)
CREATE POLICY "anon_read" ON core.institutions
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);

-- Anon can insert (school registration form)
CREATE POLICY "anon_insert_school" ON core.institutions
  AS PERMISSIVE FOR INSERT TO anon
  WITH CHECK (
    type = 'school'
    AND source = 'schools_view_insert'
    AND status = 'verified'
    AND is_active = TRUE
    AND tenant_id = '00000000-0000-0000-0000-000000000002'::uuid
  );

-- ── 5.3 Exam tables ─────────────────────────────────────────

-- exam.competitions (read-only public, service_role manages)
ALTER TABLE exam.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON exam.competitions
  AS PERMISSIVE FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read" ON exam.competitions
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (status IN ('active','closed') AND deleted_at IS NULL);

-- exam.competition_results
ALTER TABLE exam.competition_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON exam.competition_results
  AS PERMISSIVE FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read" ON exam.competition_results
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (deleted_at IS NULL);

-- exam.certificates
ALTER TABLE exam.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON exam.certificates
  AS PERMISSIVE FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "public_read" ON exam.certificates
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (is_official = TRUE AND is_revoked = FALSE);

-- ══════════════════════════════════════════════════════════════
-- 6. GRANTS
-- ══════════════════════════════════════════════════════════════

-- CMS tables
GRANT SELECT ON cms.articles            TO anon, authenticated;
GRANT SELECT ON cms.collection_items    TO anon, authenticated;
GRANT SELECT ON cms.media_assets        TO anon, authenticated;
GRANT SELECT ON cms.translation_strings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.articles            TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.collection_items    TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.media_assets        TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.translation_strings TO authenticated;
GRANT SELECT, INSERT ON cms.activity_log TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA cms TO service_role;

-- Core tables
GRANT SELECT ON core.users        TO anon, authenticated;
GRANT SELECT ON core.institutions TO anon, authenticated;
GRANT INSERT ON core.institutions TO anon;  -- school registration
GRANT ALL ON ALL TABLES IN SCHEMA core TO service_role;

-- Exam tables
GRANT SELECT ON exam.competitions        TO anon, authenticated;
GRANT SELECT ON exam.competition_results TO anon, authenticated;
GRANT SELECT ON exam.certificates        TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA exam TO service_role;

-- Future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA cms  GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA cms  GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA exam GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA exam GRANT ALL ON TABLES TO service_role;

-- ══════════════════════════════════════════════════════════════
-- 7. STORAGE BUCKET: cms-assets
-- ══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cms-assets', 'cms-assets', false, 52428800,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/svg+xml','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "cms_assets_public_read" ON storage.objects
  AS PERMISSIVE FOR SELECT TO anon, authenticated
  USING (bucket_id = 'cms-assets');

CREATE POLICY "cms_assets_marketing_staff_insert" ON storage.objects
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

CREATE POLICY "cms_assets_marketing_staff_update" ON storage.objects
  AS PERMISSIVE FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  )
  WITH CHECK (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

CREATE POLICY "cms_assets_marketing_staff_delete" ON storage.objects
  AS PERMISSIVE FOR DELETE TO authenticated
  USING (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- ══════════════════════════════════════════════════════════════
-- 8. AUTH HOOK: custom_access_token_hook
-- ══════════════════════════════════════════════════════════════
-- This function injects the 'roles' array from user_metadata into
-- the JWT's app_metadata.roles claim. This is how the CMS auth
-- checks work: middleware reads app_metadata.roles from the JWT.
--
-- After running this SQL, enable the hook in Supabase Dashboard:
--   Authentication > Hooks > Customize Access Token
--   Select function: public.custom_access_token_hook

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE
  claims jsonb;
  user_roles jsonb;
BEGIN
  claims := event->'claims';

  -- Read roles from raw_app_meta_data (set during user creation / admin update)
  SELECT COALESCE(raw_app_meta_data->'roles', '[]'::jsonb)
  INTO user_roles
  FROM auth.users
  WHERE id = (event->>'user_id')::uuid;

  -- Inject roles into the JWT claims under app_metadata.roles
  claims := jsonb_set(
    claims,
    '{app_metadata, roles}',
    COALESCE(user_roles, '[]'::jsonb)
  );

  -- Return modified event
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- Grant execute to supabase_auth_admin (required for auth hooks)
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
-- Revoke from public for security
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated;

-- ══════════════════════════════════════════════════════════════
-- 9. VERIFY
-- ══════════════════════════════════════════════════════════════
DO $$
BEGIN
  -- CMS tables
  ASSERT (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'cms') = 5,
    'Expected 5 CMS tables';

  -- Core tables
  ASSERT (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'core') = 2,
    'Expected 2 core tables';

  -- Exam tables
  ASSERT (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'exam') = 3,
    'Expected 3 exam tables';

  -- Storage bucket
  ASSERT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'cms-assets'),
    'Storage bucket cms-assets missing';

  -- Auth hook
  ASSERT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND p.proname = 'custom_access_token_hook'
  ), 'Auth hook function missing';

  -- Schema grants
  ASSERT has_schema_privilege('anon', 'cms', 'USAGE'),
    'anon lacks USAGE on cms';
  ASSERT has_schema_privilege('anon', 'core', 'USAGE'),
    'anon lacks USAGE on core';
  ASSERT has_schema_privilege('anon', 'exam', 'USAGE'),
    'anon lacks USAGE on exam';

  RAISE NOTICE '✅ AMSIO database setup verified OK — all 10 tables, bucket, hook, grants in place';
END $$;

-- ══════════════════════════════════════════════════════════════
-- 10. ADMIN USER SETUP (run AFTER creating user in Dashboard)
-- ══════════════════════════════════════════════════════════════
-- Replace <USER_ID> with the UUID of the admin user you created
-- in Dashboard > Authentication > Users.
--
-- UPDATE auth.users
-- SET raw_app_meta_data = raw_app_meta_data || '{"roles": ["marketing_staff"]}'::jsonb
-- WHERE id = '<USER_ID>';
--
-- INSERT INTO core.users (id, full_name, email, tenant_id)
-- VALUES ('<USER_ID>', 'Admin Name', 'admin@example.com', '00000000-0000-0000-0000-000000000002')
-- ON CONFLICT (id) DO NOTHING;
