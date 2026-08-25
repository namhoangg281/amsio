-- ============================================================
-- MIGRATION 20260820000006 -- W-097 fix: cms schema role grants
-- Date: 2026-08-20
-- Reason: Migrations 20260820000001..000005 created the cms schema, its four
--         content tables and their RLS policies, but never issued a single
--         GRANT. RLS policies only narrow access that a GRANT has already
--         given, so the `public_read` / `public_read_published` /
--         `public_read_active` policies -- written explicitly FOR anon --
--         could never match: anon lacked USAGE on the schema itself.
--
--         Observed effect: amsio.org read cms.translation_strings through the
--         anon client, the request failed on permissions, the caller swallowed
--         the error and returned an empty map, and the site silently fell back
--         to the compiled TS locale files. Every CMS text edit was invisible on
--         the public site. The CMS dashboard showed empty lists for the same
--         reason.
--
--         Evidence at time of writing (postgres-owner query):
--           has_schema_privilege('anon','cms','USAGE')            = false
--           has_schema_privilege('authenticated','cms','USAGE')   = false
--           has_schema_privilege('service_role','cms','USAGE')    = false
--         while every other domain schema (core, exam, lms, finance, pathway,
--         study_abroad, crm, notification, audit) has anon USAGE.
--
-- Scope: restores the access the existing policies were authored to gate.
--        It does NOT widen the security model -- RLS still decides every row,
--        and cms.activity_log deliberately gets no anon grant because it has
--        no anon-facing policy.
--
-- APPLY: owner runs manually in Supabase SQL Editor (amsio project).
--   Do NOT use `supabase db push` against itran-core project.
--   After applying, register in amsio supabase_migrations:
--     INSERT INTO supabase_migrations.schema_migrations(version, name)
--     VALUES ('20260820000006', 'cms_schema_grants') ON CONFLICT DO NOTHING;
--
-- PREREQUISITE: 20260820000001..20260820000005 applied.
-- LOCK SAFETY: GRANT takes a short ACCESS EXCLUSIVE lock per object only.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Schema reachability
-- ──────────────────────────────────────────────────────────────
GRANT USAGE ON SCHEMA cms TO anon, authenticated, service_role;

-- ──────────────────────────────────────────────────────────────
-- 2. Public read surface
--    Exactly the four tables carrying an anon-facing SELECT policy.
--    RLS still restricts rows (published-only, active-only, tenant scope).
-- ──────────────────────────────────────────────────────────────
GRANT SELECT ON cms.articles            TO anon, authenticated;
GRANT SELECT ON cms.collection_items    TO anon, authenticated;
GRANT SELECT ON cms.media_assets        TO anon, authenticated;
GRANT SELECT ON cms.translation_strings TO anon, authenticated;

-- ──────────────────────────────────────────────────────────────
-- 3. Authoring surface
--    Writes are gated by the marketing_staff_write policy, which tests
--    app_metadata.roles from the JWT. activity_log is read-only to staff.
-- ──────────────────────────────────────────────────────────────
GRANT INSERT, UPDATE, DELETE ON cms.articles            TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.collection_items    TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.media_assets        TO authenticated;
GRANT INSERT, UPDATE, DELETE ON cms.translation_strings TO authenticated;
GRANT SELECT                  ON cms.activity_log       TO authenticated;
GRANT INSERT                  ON cms.activity_log       TO authenticated;

-- ──────────────────────────────────────────────────────────────
-- 4. service_role -- server-side admin client
--    RLS is FORCED on these tables (INV-RLS-FORCE-01), so service_role is
--    still subject to policy evaluation; the grant only restores reachability.
-- ──────────────────────────────────────────────────────────────
GRANT ALL ON ALL TABLES IN SCHEMA cms TO service_role;

-- ──────────────────────────────────────────────────────────────
-- 5. Future tables in this schema inherit the same shape
-- ──────────────────────────────────────────────────────────────
ALTER DEFAULT PRIVILEGES IN SCHEMA cms
  GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA cms
  GRANT ALL ON TABLES TO service_role;

-- ──────────────────────────────────────────────────────────────
-- 6. VERIFY
-- ──────────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT has_schema_privilege('anon', 'cms', 'USAGE') THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000006: anon still lacks USAGE on cms';
  END IF;

  IF NOT has_table_privilege('anon', 'cms.translation_strings', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000006: anon still lacks SELECT on cms.translation_strings';
  END IF;

  IF NOT has_table_privilege('authenticated', 'cms.translation_strings', 'UPDATE') THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000006: authenticated still lacks UPDATE on cms.translation_strings';
  END IF;

  -- activity_log must stay off the anon surface: no anon policy exists for it.
  IF has_table_privilege('anon', 'cms.activity_log', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000006: anon must not hold SELECT on cms.activity_log';
  END IF;

  RAISE NOTICE 'OK Migration 20260820000006: cms schema grants in place';
END $$;
