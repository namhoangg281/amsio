-- ============================================================
-- MIGRATION 20260820000004 -- W-096: cms.media_assets + Storage bucket
-- Date: 2026-08-20
-- Reason: Media asset registry and Supabase Storage bucket for amsio CMS.
--         Tracks uploaded files with usage tagging and SEO metadata.
--         Standalone cms schema on amsio Supabase (ynqlxyluqfsdwwawflmu).
-- Domain ref: W-096 requirement. CMS is amsio-isolated, not itran-core.
--
-- PREREQUISITE: W-093 (20260820000001) must be applied first (cms schema).
--
-- APPLY: owner runs manually in Supabase SQL Editor (amsio project).
--   Do NOT use `supabase db push` against itran-core project.
--   After applying, register in amsio supabase_migrations:
--     INSERT INTO supabase_migrations.schema_migrations(version, name)
--     VALUES ('20260820000004', 'cms_media_assets') ON CONFLICT DO NOTHING;
--
-- STORAGE SECTION NOTE (Section 3-4 below):
--   This file inserts into storage.buckets and adds policies to storage.objects.
--   Both run in the SQL Editor of the amsio Supabase project (same DB).
--   If Section 3-4 fails with "permission denied for table objects" or
--   "permission denied for table buckets":
--     (a) Run Sections 1-2 first (cms.media_assets table + RLS).
--     (b) Create the bucket via Dashboard > Storage > New bucket
--         (name: cms-assets, Public: OFF, 50 MB limit, allowed types as below).
--     (c) Add storage policies via Dashboard > Storage > Policies
--         using the policy names and USING/WITH CHECK expressions from Section 4.
--
-- LOCK SAFETY NOTE: all objects below are newly created -- no existing
--   traffic, no ACCESS EXCLUSIVE lock contention. CREATE INDEX (without
--   CONCURRENTLY) is safe here.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. cms.media_assets
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cms.media_assets (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- tenant_id: L4 structural consistency. Value injected by app from env
  -- AMSIO_TENANT_ID at write time. NEVER hard-coded in migrations.
  tenant_id     UUID        NOT NULL,

  -- filename: original filename as uploaded (for display in asset picker)
  filename      TEXT        NOT NULL,

  -- storage_path: object path within the cms-assets bucket,
  --   e.g. 'articles/2026/hero.jpg' or 'team/2026/john-doe.png'
  storage_path  TEXT        NOT NULL,

  mime_type     TEXT,

  -- size_bytes: file size; BIGINT supports files > 2 GB if needed
  size_bytes    BIGINT,

  -- alt_text: accessibility text for images; used as figure caption where appropriate
  alt_text      TEXT,

  -- usage_tag: classifies intended use to guide asset picker in admin UI.
  --   NULL = untagged / general purpose.
  usage_tag     TEXT
                CHECK (usage_tag IN (
                  'article_cover',
                  'press_kit',
                  'team_photo',
                  'partner_logo',
                  'og_image'
                )),

  -- seo_meta: { title, description, caption } for media SEO / Open Graph integration
  seo_meta      JSONB       NOT NULL DEFAULT '{}',

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ,          -- L2 soft-delete: always filter WHERE deleted_at IS NULL

  created_by    UUID        REFERENCES auth.users (id) ON DELETE SET NULL
  -- No updated_at: media assets are immutable once uploaded. Replacement =
  -- soft-delete old record + insert new record with new storage_path.
);

-- ──────────────────────────────────────────────────────────────
-- 2. Indexes
-- ──────────────────────────────────────────────────────────────

-- Index for asset picker: list by usage_tag within a tenant, excluding deleted
CREATE INDEX IF NOT EXISTS idx_cms_media_assets_tenant_usage
  ON cms.media_assets (tenant_id, usage_tag)
  WHERE deleted_at IS NULL;

-- ──────────────────────────────────────────────────────────────
-- 3. RLS -- cms.media_assets
-- ──────────────────────────────────────────────────────────────
ALTER TABLE cms.media_assets ENABLE ROW LEVEL SECURITY;
-- FORCE ensures service_role connections also go through RLS (INV-RLS-FORCE-01).
ALTER TABLE cms.media_assets FORCE ROW LEVEL SECURITY;

-- Tầng 1: RESTRICTIVE -- tenant isolation (L4 / Q6 mandate).
--
-- SINGLE-TENANT NOTE: same as W-093. JWT does not inject tenant_id on this
-- amsio instance. USING (TRUE) satisfies the structural mandate.
-- TO UPGRADE for multi-tenant: replace with tenant_id JWT claim check.
CREATE POLICY "tenant_isolation"
  ON cms.media_assets
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);  -- INV-RLS-CHECK-01: FOR ALL requires both clauses.

-- Tầng 2a: PERMISSIVE -- public SELECT: non-deleted assets visible to all.
--   Media assets referenced from public pages must be readable by anon.
--   No status filter: assets are either live (deleted_at IS NULL) or deleted.
--   anon is NOT subject to RESTRICTIVE above (scoped TO authenticated).
CREATE POLICY "public_read"
  ON cms.media_assets
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- Tầng 2b: PERMISSIVE -- marketing_staff full access (SELECT + INSERT + UPDATE + DELETE).
--   Allows registering new asset records, updating metadata, and soft-deleting.
--   initPlan caching: auth.jwt() wrapped in (SELECT ...).
CREATE POLICY "marketing_staff_write"
  ON cms.media_assets
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
-- 4. Supabase Storage bucket: cms-assets
-- ──────────────────────────────────────────────────────────────
-- public = false: access is governed by storage.objects RLS policies below.
--   Files are served as public reads via the policy that opens SELECT to anon --
--   the bucket flag `public` controls only whether Supabase's CDN shortcut is
--   enabled; our RLS policies provide equivalent access control without it.
-- file_size_limit = 52428800 bytes (50 MB): suitable for high-res images + PDFs.
-- allowed_mime_types: covers all CMS media use cases; SVG included for logos.
INSERT INTO storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
VALUES (
  'cms-assets',
  'cms-assets',
  false,
  52428800,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- ──────────────────────────────────────────────────────────────
-- 5. Storage RLS -- storage.objects (cms-assets bucket only)
-- ──────────────────────────────────────────────────────────────
-- CONTEXT: storage.objects has RLS enabled by default in Supabase.
--   We do NOT call ENABLE/FORCE ROW LEVEL SECURITY on storage.objects here
--   (Supabase-managed table). We add PERMISSIVE policies scoped to
--   bucket_id = 'cms-assets' only -- no other buckets are affected.
--
-- No RESTRICTIVE policy here: storage.objects has no tenant_id column.
--   Isolation is via bucket_id scoping + the marketing_staff role check.
--
-- IF POLICIES FAIL with "permission denied":
--   Add them via Dashboard > Storage > Policies (UI), using the same
--   policy names and USING/WITH CHECK expressions shown below.

-- Public read: anyone (anon + authenticated) can GET files from cms-assets.
--   Required for public site images (team photos, partner logos, article covers).
CREATE POLICY "cms_assets_public_read"
  ON storage.objects
  AS PERMISSIVE
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'cms-assets');

-- marketing_staff upload (INSERT new object into bucket)
CREATE POLICY "cms_assets_marketing_staff_insert"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- marketing_staff replace / rename existing object (UPDATE)
CREATE POLICY "cms_assets_marketing_staff_update"
  ON storage.objects
  AS PERMISSIVE
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  )
  WITH CHECK (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- marketing_staff delete object (physical delete from bucket;
--   also soft-delete the cms.media_assets row via app code)
CREATE POLICY "cms_assets_marketing_staff_delete"
  ON storage.objects
  AS PERMISSIVE
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'cms-assets'
    AND (SELECT (auth.jwt() -> 'app_metadata' -> 'roles') @> '"marketing_staff"'::jsonb)
  );

-- ── VERIFY ───────────────────────────────────────────────────
DO $$
BEGIN
  -- 1. cms.media_assets table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'cms' AND table_name = 'media_assets'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: cms.media_assets not created';
  END IF;

  -- 2. RLS enabled AND forced on cms.media_assets (INV-RLS-FORCE-01)
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'cms' AND c.relname = 'media_assets'
      AND c.relrowsecurity = TRUE AND c.relforcerowsecurity = TRUE
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: RLS not enabled or not forced on cms.media_assets';
  END IF;

  -- 3. RESTRICTIVE tenant_isolation policy exists (L4 mandate)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'cms' AND tablename = 'media_assets'
      AND policyname = 'tenant_isolation' AND permissive = 'RESTRICTIVE'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: RESTRICTIVE tenant_isolation missing on cms.media_assets';
  END IF;

  -- 4. Usage tag index exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'cms' AND tablename = 'media_assets'
      AND indexname = 'idx_cms_media_assets_tenant_usage'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: idx_cms_media_assets_tenant_usage missing';
  END IF;

  -- 5. Storage bucket cms-assets exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'cms-assets'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: storage bucket cms-assets not created';
  END IF;

  -- 6. Storage public read policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'cms_assets_public_read'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: storage policy cms_assets_public_read missing';
  END IF;

  -- 7. Storage marketing_staff insert policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'cms_assets_marketing_staff_insert'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: storage policy cms_assets_marketing_staff_insert missing';
  END IF;

  -- 8. Storage marketing_staff delete policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'cms_assets_marketing_staff_delete'
  ) THEN
    RAISE EXCEPTION 'FAIL Migration 20260820000004: storage policy cms_assets_marketing_staff_delete missing';
  END IF;

  RAISE NOTICE 'Migration 20260820000004 -- W-096 cms.media_assets + Storage verified OK';
END $$;
