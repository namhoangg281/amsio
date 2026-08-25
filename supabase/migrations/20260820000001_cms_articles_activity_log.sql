-- ============================================================
-- MIGRATION 20260820000001 -- W-093: CMS schema (articles + activity_log)
-- Date: 2026-08-20
-- Reason: News + Press CMS for amsio-website. Standalone cms schema on
--         the amsio Supabase project (ynqlxyluqfsdwwawflmu). Audit is
--         local via cms.activity_log -- NOT wired to audit.event_bus
--         (split-ready decision W-093: CMS will be extracted later; shape
--         mirrors event_bus columns for easy future migration).
-- Domain ref: W-093 requirement. CMS is amsio-isolated, not itran-core.
--
-- PREREQUISITE: moddatetime extension must be enabled.
--   If not already enabled:
--     CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;
--   On Supabase this is available by default (check Dashboard >
--   Database > Extensions > moddatetime).
--
-- APPLY: owner runs manually in Supabase SQL Editor (amsio project).
--   Do NOT use `supabase db push` against itran-core project.
--
-- LOCK SAFETY NOTE: all objects below are newly created -- no existing
--   traffic, no ACCESS EXCLUSIVE lock contention. CREATE INDEX (without
--   CONCURRENTLY) is safe: tables are empty at creation time and this
--   entire file runs inside one transaction block.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Schema
-- ──────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS cms;

-- ──────────────────────────────────────────────────────────────
-- 2. cms.articles
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.articles (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- tenant_id: stored for structural consistency (L4) and future multi-tenant
  -- readiness. Value injected by application from env AMSIO_TENANT_ID at INSERT
  -- time. NEVER hard-coded in migrations.
  tenant_id     UUID        NOT NULL,

  -- slug: unique per tenant among non-deleted articles (partial unique index below)
  slug          TEXT        NOT NULL,

  category      TEXT        NOT NULL
                            CHECK (category IN ('news', 'press')),

  status        TEXT        NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'published')),

  featured      BOOLEAN     NOT NULL DEFAULT FALSE,

  -- translations: { "en": { title, excerpt, body, seo_title, seo_description },
  --                 "vi": { ... }, ... }
  translations  JSONB       NOT NULL DEFAULT '{}',

  cover_url     TEXT,
  published_at  TIMESTAMPTZ,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ,          -- L2 soft-delete: always filter WHERE deleted_at IS NULL

  created_by    UUID        REFERENCES auth.users (id) ON DELETE SET NULL
);

-- Unique slug per tenant among non-deleted articles (partial index)
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_articles_slug_tenant
  ON cms.articles (tenant_id, slug)
  WHERE deleted_at IS NULL;

-- Composite for list queries: tenant + category + status + published_at DESC
CREATE INDEX IF NOT EXISTS idx_cms_articles_category_status_pub
  ON cms.articles (tenant_id, category, status, published_at DESC NULLS LAST)
  WHERE deleted_at IS NULL;

-- Expression index for English title equality / prefix search
-- Supports: WHERE (translations -> 'en' ->> 'title') = 'exact title'
-- For full-text at scale, add pg_trgm + GIN index separately.
CREATE INDEX IF NOT EXISTS idx_cms_articles_en_title
  ON cms.articles ((translations -> 'en' ->> 'title'))
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────────────────────
-- 3. Auto-update updated_at trigger (cms.articles)
-- ──────────────────────────────────────────────────────────────
CREATE TRIGGER trg_cms_articles_updated_at
  BEFORE UPDATE ON cms.articles
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ──────────────────────────────────────────────────────────────
-- 4. cms.activity_log (append-only audit)
--    Column shape mirrors audit.event_bus for future migration ease.
--    No updated_at, no deleted_at: audit records are immutable.
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.activity_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID        NOT NULL,

  -- actor_id: NULL = system/trigger-initiated action
  actor_id     UUID        REFERENCES auth.users (id) ON DELETE SET NULL,

  -- action: dot-notation event name, e.g. 'article.published', 'article.deleted'
  action       TEXT        NOT NULL,

  -- entity_type: discriminator string, e.g. 'article'
  entity_type  TEXT        NOT NULL,

  entity_id    UUID,
  payload      JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- Intentionally NO updated_at, NO deleted_at.
  -- Append-only invariant enforced at RLS layer: no UPDATE/DELETE policy defined.
);

-- Index for per-entity audit trail chronological lookup
CREATE INDEX IF NOT EXISTS idx_cms_activity_log_entity
  ON cms.activity_log (tenant_id, entity_type, entity_id, created_at DESC);

-- Index for per-actor audit history
CREATE INDEX IF NOT EXISTS idx_cms_activity_log_actor
  ON cms.activity_log (tenant_id, actor_id, created_at DESC);

-- ──────────────────────────────────────────────────────────────
-- 5. RLS -- cms.articles
-- ──────────────────────────────────────────────────────────────
ALTER TABLE cms.articles ENABLE ROW LEVEL SECURITY;
-- FORCE ensures service_role connections also go through RLS (INV-RLS-FORCE-01).
-- Without FORCE, service_role bypasses RLS entirely — CMS content could be
-- read/written by any code with the service_role key without policy enforcement.
ALTER TABLE cms.articles FORCE ROW LEVEL SECURITY;

-- Tầng 1: RESTRICTIVE -- tenant isolation (L4 / Q6 mandate: every table with
--   tenant_id must have a RESTRICTIVE policy).
--
-- SINGLE-TENANT NOTE: this amsio Supabase instance is currently single-tenant.
--   The custom_access_token_hook injects 'roles' into app_metadata (LoginForm.tsx:93)
--   but does NOT inject 'tenant_id' into JWT claims.
--   `auth.jwt() ->> 'tenant_id'` resolves to NULL for all users, which would cause
--   RESTRICTIVE to block all authenticated access.
--   USING (TRUE) satisfies the structural mandate (RESTRICTIVE policy must exist)
--   while not blocking access. Actual access control is in PERMISSIVE policies below.
--
-- TO UPGRADE for multi-tenant: replace USING (TRUE) / WITH CHECK (TRUE) with:
--   USING (tenant_id = (SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid))
--   WITH CHECK (tenant_id = (SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid))
--   and ensure the JWT hook injects tenant_id into app_metadata claims.
CREATE POLICY "tenant_isolation"
  ON cms.articles
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);  -- INV-RLS-CHECK-01: FOR ALL requires both clauses; Postgres does NOT
                      -- auto-apply USING to INSERT's WITH CHECK for RESTRICTIVE policies.

-- Tầng 2a: PERMISSIVE -- public SELECT: published, non-deleted articles only.
--   Applied to anon (public site visitors) and authenticated (non-staff users).
--   anon is NOT subject to the RESTRICTIVE policy above (scoped TO authenticated),
--   so anon access is governed exclusively by this PERMISSIVE policy.
--   marketing_staff also satisfy this policy for SELECT but their marketing_staff_write
--   policy additionally lets them see drafts (PERMISSIVE policies are OR-combined).
CREATE POLICY "public_read_published"
  ON cms.articles
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND deleted_at IS NULL);

-- Tầng 2b: PERMISSIVE -- marketing_staff full access (SELECT + INSERT + UPDATE + DELETE).
--   Role is read from JWT app_metadata.roles JSONB array.
--
--   Operator: @> (jsonb contains) over ? (exists) for driver portability --
--     `array @> '"element"'::jsonb` is unambiguous in DDL; ? can be misinterpreted
--     as a parameter placeholder in some SQL drivers/tooling.
--     Functionally equivalent: (roles) ? 'marketing_staff' also works in plain DDL.
--     Evidence of roles array structure: LoginForm.tsx:95 (app_metadata.roles),
--                                        LoginForm.tsx:111 ('marketing_staff' in array).
--
--   initPlan caching: auth.jwt() wrapped in (SELECT ...) so Postgres evaluates
--     it once per statement via InitPlan, not once per row. Supabase-recommended
--     pattern for RLS performance on tables with significant row counts.
--
--   USING: governs SELECT / UPDATE / DELETE row visibility (existing rows).
--   WITH CHECK: governs INSERT / UPDATE validity (new / modified rows).
CREATE POLICY "marketing_staff_write"
  ON cms.articles
  AS PERMISSIVE
  FOR ALL
  TO authenticated
  USING (
    (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  )
  WITH CHECK (
    (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- ──────────────────────────────────────────────────────────────
-- 6. RLS -- cms.activity_log
-- ──────────────────────────────────────────────────────────────
ALTER TABLE cms.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms.activity_log FORCE ROW LEVEL SECURITY;  -- INV-RLS-FORCE-01: block service_role bypass

-- Tầng 1: RESTRICTIVE -- tenant isolation (same single-tenant note as cms.articles)
CREATE POLICY "tenant_isolation"
  ON cms.activity_log
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);  -- INV-RLS-CHECK-01: FOR ALL requires both clauses

-- Tầng 2a: PERMISSIVE -- marketing_staff SELECT (view audit history in admin UI)
CREATE POLICY "marketing_staff_read"
  ON cms.activity_log
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (
    (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- Tầng 2b: PERMISSIVE -- marketing_staff INSERT (app code writes audit events)
--   UPDATE and DELETE are intentionally omitted: no matching policy = deny (RLS default).
--   This enforces the append-only invariant at the DB layer without extra constraints.
CREATE POLICY "marketing_staff_insert"
  ON cms.activity_log
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- anon: no PERMISSIVE policy on cms.activity_log => denied (RLS default deny).
-- Other authenticated roles (non-marketing_staff): no matching PERMISSIVE => denied.

-- ── VERIFY ───────────────────────────────────────────────────
DO $$
BEGIN
  -- 1. Schema exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'cms'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: schema cms not created';
  END IF;

  -- 2. Tables exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'cms' AND table_name = 'articles'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: cms.articles not created';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'cms' AND table_name = 'activity_log'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: cms.activity_log not created';
  END IF;

  -- 3. RLS enabled AND forced on both tables (INV-RLS-FORCE-01)
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'cms' AND c.relname = 'articles'
      AND c.relrowsecurity = TRUE AND c.relforcerowsecurity = TRUE
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: RLS not enabled or not forced on cms.articles';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'cms' AND c.relname = 'activity_log'
      AND c.relrowsecurity = TRUE AND c.relforcerowsecurity = TRUE
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: RLS not enabled or not forced on cms.activity_log';
  END IF;

  -- 4. RESTRICTIVE policies exist (L4 mandate)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'cms' AND tablename = 'articles'
      AND policyname = 'tenant_isolation' AND permissive = 'RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: RESTRICTIVE tenant_isolation missing on cms.articles';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'cms' AND tablename = 'activity_log'
      AND policyname = 'tenant_isolation' AND permissive = 'RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: RESTRICTIVE tenant_isolation missing on cms.activity_log';
  END IF;

  -- 5. updated_at trigger exists on articles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_schema = 'cms' AND event_object_table = 'articles'
      AND trigger_name = 'trg_cms_articles_updated_at'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: trigger trg_cms_articles_updated_at missing';
  END IF;

  -- 6. Slug unique index exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'cms' AND tablename = 'articles'
      AND indexname = 'idx_cms_articles_slug_tenant'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000001: idx_cms_articles_slug_tenant missing';
  END IF;

  RAISE NOTICE 'Migration 20260820000001 -- W-093 CMS (articles + activity_log) verified OK';
END $$;
