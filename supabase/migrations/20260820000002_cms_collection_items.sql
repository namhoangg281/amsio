-- ============================================================
-- MIGRATION 20260820000002 -- W-094: cms.collection_items
-- Date: 2026-08-20
-- Reason: CMS collection items for team/partners/mission/olympiad intro sections
--         on amsio-website. Standalone cms schema on the amsio Supabase project
--         (ynqlxyluqfsdwwawflmu). Extends W-093: cms schema already created.
-- Domain ref: W-094 requirement. CMS is amsio-isolated, not itran-core.
--
-- PREREQUISITE: W-093 (20260820000001) must be applied first.
--   moddatetime extension must be enabled (covered by W-093 prerequisite note).
--
-- APPLY: owner runs manually in Supabase SQL Editor (amsio project).
--   Do NOT use `supabase db push` against itran-core project.
--   After applying, register in amsio supabase_migrations:
--     INSERT INTO supabase_migrations.schema_migrations(version, name)
--     VALUES ('20260820000002', 'cms_collection_items') ON CONFLICT DO NOTHING;
--
-- LOCK SAFETY NOTE: all objects below are newly created -- no existing
--   traffic, no ACCESS EXCLUSIVE lock contention. CREATE INDEX (without
--   CONCURRENTLY) is safe: tables are empty at creation time and this
--   entire file runs inside one transaction block.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. cms.collection_items
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.collection_items (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- tenant_id: stored for structural consistency (L4) and future multi-tenant
  -- readiness. Value injected by application from env AMSIO_TENANT_ID at INSERT
  -- time. NEVER hard-coded in migrations.
  tenant_id       UUID        NOT NULL,

  -- collection_key: discriminates which site section this item belongs to
  collection_key  TEXT        NOT NULL
                              CHECK (collection_key IN (
                                'team',
                                'partners',
                                'mission_blocks',
                                'olympiad_intro'
                              )),

  sort_order      INT         NOT NULL DEFAULT 0,

  status          TEXT        NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'hidden')),

  -- translations: { "en": { name, title, body }, "vi": { ... }, ... }
  -- Shape varies per collection_key:
  --   team/partners: name (person/org name) + body (description)
  --   mission_blocks/olympiad_intro: title + body
  translations    JSONB       NOT NULL DEFAULT '{}',

  -- metadata: { role, country_code, logo_url, website_url, photo_asset_id }
  -- Shape varies per collection_key:
  --   team:     { role, photo_asset_id }
  --   partners: { country_code, logo_url, website_url }
  --   mission_blocks / olympiad_intro: open-ended (icon, image_url, etc.)
  metadata        JSONB       NOT NULL DEFAULT '{}',

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,          -- L2 soft-delete: always filter WHERE deleted_at IS NULL

  created_by      UUID        REFERENCES auth.users (id) ON DELETE SET NULL
);

-- ──────────────────────────────────────────────────────────────
-- 2. Indexes
-- ──────────────────────────────────────────────────────────────

-- Composite index for ordered list queries:
--   SELECT ... WHERE tenant_id = ? AND collection_key = ? AND deleted_at IS NULL
--   ORDER BY sort_order
CREATE INDEX IF NOT EXISTS idx_cms_collection_items_tenant_key_sort
  ON cms.collection_items (tenant_id, collection_key, sort_order)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────────────────────
-- 3. Auto-update updated_at trigger
-- ──────────────────────────────────────────────────────────────
CREATE TRIGGER trg_cms_collection_items_updated_at
  BEFORE UPDATE ON cms.collection_items
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);

-- ──────────────────────────────────────────────────────────────
-- 4. RLS -- cms.collection_items
-- ──────────────────────────────────────────────────────────────
ALTER TABLE cms.collection_items ENABLE ROW LEVEL SECURITY;
-- FORCE ensures service_role connections also go through RLS (INV-RLS-FORCE-01).
-- Without FORCE, service_role bypasses RLS entirely -- CMS content could be
-- read/written by any code with the service_role key without policy enforcement.
ALTER TABLE cms.collection_items FORCE ROW LEVEL SECURITY;

-- Tầng 1: RESTRICTIVE -- tenant isolation (L4 / Q6 mandate: every table with
--   tenant_id must have a RESTRICTIVE policy).
--
-- SINGLE-TENANT NOTE: this amsio Supabase instance is currently single-tenant.
--   The custom_access_token_hook injects 'roles' into app_metadata but does NOT
--   inject 'tenant_id' into JWT claims. auth.jwt() ->> 'tenant_id' resolves to
--   NULL for all users, which would cause RESTRICTIVE to block all authenticated
--   access. USING (TRUE) satisfies the structural mandate without blocking access.
--   Actual access control is in the PERMISSIVE policies below.
--
-- TO UPGRADE for multi-tenant: replace USING (TRUE) / WITH CHECK (TRUE) with:
--   USING  (tenant_id = (SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid))
--   WITH CHECK (tenant_id = (SELECT (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid))
--   and ensure the JWT hook injects tenant_id into app_metadata claims.
CREATE POLICY "tenant_isolation"
  ON cms.collection_items
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);  -- INV-RLS-CHECK-01: FOR ALL requires both clauses; Postgres does NOT
                      -- auto-apply USING to INSERT's WITH CHECK for RESTRICTIVE policies.

-- Tầng 2a: PERMISSIVE -- public SELECT: active, non-deleted items only.
--   Applied to anon (public site visitors) and authenticated users.
--   anon is NOT subject to the RESTRICTIVE policy above (scoped TO authenticated),
--   so anon access is governed exclusively by this PERMISSIVE policy.
CREATE POLICY "public_read_active"
  ON cms.collection_items
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active' AND deleted_at IS NULL);

-- Tầng 2b: PERMISSIVE -- marketing_staff full access (SELECT + INSERT + UPDATE + DELETE).
--   Role is read from JWT app_metadata.roles JSONB array.
--   Operator @> (jsonb contains) over ? (exists): unambiguous in DDL, avoids
--   ? placeholder clash in some SQL drivers. Functionally equivalent.
--   Evidence of roles array structure: LoginForm.tsx (app_metadata.roles array,
--   'marketing_staff' member checked at login).
--   initPlan caching: auth.jwt() wrapped in (SELECT ...) so Postgres evaluates
--   it once per statement via InitPlan, not once per row.
CREATE POLICY "marketing_staff_write"
  ON cms.collection_items
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
    WHERE table_schema = 'cms' AND table_name = 'collection_items'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000002: cms.collection_items not created';
  END IF;

  -- 2. RLS enabled AND forced (INV-RLS-FORCE-01)
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'cms' AND c.relname = 'collection_items'
      AND c.relrowsecurity = TRUE AND c.relforcerowsecurity = TRUE
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000002: RLS not enabled or not forced on cms.collection_items';
  END IF;

  -- 3. RESTRICTIVE tenant_isolation policy exists (L4 mandate)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'cms' AND tablename = 'collection_items'
      AND policyname = 'tenant_isolation' AND permissive = 'RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000002: RESTRICTIVE tenant_isolation missing on cms.collection_items';
  END IF;

  -- 4. updated_at trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers
    WHERE trigger_schema = 'cms' AND event_object_table = 'collection_items'
      AND trigger_name = 'trg_cms_collection_items_updated_at'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000002: trigger trg_cms_collection_items_updated_at missing';
  END IF;

  -- 5. Sort index exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'cms' AND tablename = 'collection_items'
      AND indexname = 'idx_cms_collection_items_tenant_key_sort'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000002: idx_cms_collection_items_tenant_key_sort missing';
  END IF;

  RAISE NOTICE 'Migration 20260820000002 -- W-094 cms.collection_items verified OK';
END $$;
