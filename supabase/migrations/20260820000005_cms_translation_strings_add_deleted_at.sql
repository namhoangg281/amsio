-- MIGRATION 20260820000005 -- W-095 patch: ADD deleted_at to cms.translation_strings
-- Date: 2026-08-20
-- Reason: W-095 original migration (20260820000003) applied without deleted_at.
--         Owner decision post-apply: enforce L2 soft-delete on all CMS tables.
--         Safe: ADD COLUMN IF NOT EXISTS + nullable + DEFAULT NULL (no lock on empty table).
-- Prereq: 20260820000003 already applied (table exists).

ALTER TABLE cms.translation_strings
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'cms'
      AND table_name = 'translation_strings'
      AND column_name = 'deleted_at'
  ) THEN
    RAISE EXCEPTION 'W-095-patch VERIFY FAIL: deleted_at column still missing';
  END IF;
  RAISE NOTICE 'W-095-patch VERIFY OK: cms.translation_strings.deleted_at EXISTS';
END $$;
