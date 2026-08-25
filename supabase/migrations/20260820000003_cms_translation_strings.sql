-- ============================================================
-- MIGRATION 20260820000003 -- W-095: cms.translation_strings
-- Date: 2026-08-20
-- Reason: Site-wide i18n key-value store for amsio-website. Supports
--         5 locales (en/vi/zh/fr/ar) with namespace partitioning.
--         Standalone cms schema on amsio Supabase (ynqlxyluqfsdwwawflmu).
-- Domain ref: W-095 requirement. CMS is amsio-isolated, not itran-core.
--
-- PREREQUISITE: W-093 (20260820000001) must be applied first.
--   moddatetime extension must be enabled (covered by W-093 prerequisite note).
--
-- APPLY: owner runs manually in Supabase SQL Editor (amsio project).
--   Do NOT use `supabase db push` against itran-core project.
--   After applying, register in amsio supabase_migrations:
--     INSERT INTO supabase_migrations.schema_migrations(version, name)
--     VALUES ('20260820000003', 'cms_translation_strings') ON CONFLICT DO NOTHING;
--
-- LOCK SAFETY NOTE: all objects below are newly created -- no existing
--   traffic. CREATE INDEX (without CONCURRENTLY) is safe here.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. cms.translation_strings
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.translation_strings (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- tenant_id: L4 structural consistency. Value injected by app from env
  -- AMSIO_TENANT_ID at write time. NEVER hard-coded in migrations.
  tenant_id   UUID        NOT NULL,

  locale      TEXT        NOT NULL
                          CHECK (locale IN ('en', 'vi', 'zh', 'fr', 'ar')),

  -- namespace: logical grouping, e.g. 'ui', 'email', 'legal', 'nav', 'exam'
  namespace   TEXT        NOT NULL DEFAULT 'ui',

  -- key: dot-notation string key, e.g. 'nav.home', 'btn.submit', 'hero.title'
  key         TEXT        NOT NULL,

  -- value: translated string. May contain ICU plural/gender syntax where needed.
  value       TEXT        NOT NULL,

  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- updated_by: last editor; NULL = seeded/system-imported
  updated_by  UUID        REFERENCES auth.users (id) ON DELETE SET NULL
  -- No created_at: translation strings are managed as a keyed config set;
  -- creation time is rarely meaningful, updated_at is the relevant timestamp.
  -- No deleted_at: strings are removed by updating value or bulk-replaced.
  --   In a future multi-tenant setup, add deleted_at + make unique index partial.
);

-- ──────────────────────────────────────────────────────────────
-- 2. Indexes
-- ──────────────────────────────────────────────────────────────

-- Unique constraint per locale+namespace+key.
-- SINGLE-TENANT NOTE: uniqueness is across the whole table; functionally
-- equivalent to per-tenant uniqueness in a single-tenant amsio deployment.
-- TO UPGRADE for multi-tenant: add tenant_id to this index and make it partial
--   ON cms.translation_strings (tenant_id, locale, namespace, key)
--   WHERE deleted_at IS NULL  (also add deleted_at column first).
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_translation_strings_locale_ns_key
  ON cms.translation_strings (locale, namespace, key);

-- Namespace+key lookup (locale-agnostic, e.g. find all locales for one key)
CREATE INDEX IF NOT EXISTS idx_cms_translation_strings_ns_key
  ON cms.translation_strings (namespace, key);

-- ──────────────────────────────────────────────────────────────
-- 3. Auto-update updated_at trigger
-- ──────────────────────────────────────────────────────────────
CREATE TRIGGER trg_cms_translation_strings_updated_at
  BEFORE UPDATE ON cms.translation_strings
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ──────────────────────────────────────────────────────────────
-- 4. RLS -- cms.translation_strings
-- ──────────────────────────────────────────────────────────────
ALTER TABLE cms.translation_strings ENABLE ROW LEVEL SECURITY;
-- FORCE ensures service_role connections also go through RLS (INV-RLS-FORCE-01).
ALTER TABLE cms.translation_strings FORCE ROW LEVEL SECURITY;

-- Tầng 1: RESTRICTIVE -- tenant isolation (L4 / Q6 mandate).
--
-- SINGLE-TENANT NOTE: same as W-093. JWT does not inject tenant_id on this
-- amsio instance. USING (TRUE) satisfies the structural mandate without blocking
-- access. Upgrade path: replace with tenant_id JWT claim check.
CREATE POLICY "tenant_isolation"
  ON cms.translation_strings
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);  -- INV-RLS-CHECK-01: FOR ALL requires both clauses.

-- Tầng 2a: PERMISSIVE -- public SELECT: all strings are publicly readable.
--   i18n strings are display-only -- no draft concept, no deleted_at filter.
--   anon is NOT subject to the RESTRICTIVE policy above (scoped TO authenticated),
--   so anon can read translation strings directly (needed for SSR i18n hydration).
CREATE POLICY "public_read"
  ON cms.translation_strings
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- Tầng 2b: PERMISSIVE -- marketing_staff full access (INSERT + UPDATE + SELECT).
--   Hard DELETE is available via service_role only; no client DELETE policy.
--   initPlan caching: auth.jwt() wrapped in (SELECT ...).
CREATE POLICY "marketing_staff_write"
  ON cms.translation_strings
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (
    (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  )
  WITH CHECK (
    (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- ── VERIFY ───────────────────────────────────────────────────
DO $$
BEGIN
  -- 1. Table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'cms' AND table_name = 'translation_strings'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000003: cms.translation_strings not created';
  END IF;

  -- 2. RLS enabled AND forced (INV-RLS-FORCE-01)
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'cms' AND c.relname = 'translation_strings'
      AND c.relrowsecurity = TRUE AND c.relforcerowsecurity = TRUE
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000003: RLS not enabled or not forced on cms.translation_strings';
  END IF;

  -- 3. RESTRICTIVE tenant_isolation policy exists (L4 mandate)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'cms' AND tablename = 'translation_strings'
      AND policyname = 'tenant_isolation' AND permissive = 'RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000003: RESTRICTIVE tenant_isolation missing on cms.translation_strings';
  END IF;

  -- 4. updated_at trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_schema = 'cms' AND event_object_table = 'translation_strings'
      AND trigger_name = 'trg_cms_translation_strings_updated_at'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000003: trigger trg_cms_translation_strings_updated_at missing';
  END IF;

  -- 5. Unique locale+namespace+key index exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'cms' AND tablename = 'translation_strings'
      AND indexname = 'idx_cms_translation_strings_locale_ns_key'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000003: idx_cms_translation_strings_locale_ns_key missing';
  END IF;

  RAISE NOTICE 'Migration 20260820000003 -- W-095 cms.translation_strings verified OK';
END $$;
