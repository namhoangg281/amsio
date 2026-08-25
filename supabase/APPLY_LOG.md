# AMSIO Supabase — Migration Apply Log

**Project:** amsio-website CMS schema trên Supabase `ynqlxyluqfsdwwawflmu` (itran_core project — cms schema riêng biệt).
**BẢNG NÀY KHÁC** `docs/reference/DB_SCHEMA_TRUTH.md` (đó là log core platform migrations).
**Nguồn sự thật duy nhất** cho apply-status các migration cms amsio-website.

Flip status → ✅PROD CHỈ khi có RO-query OBJECT THẬT.

---

## Migration Apply Status

| # | File | Status | Applied | Notes |
|---|------|--------|---------|-------|
| 1 | `20260605000001_amsio_public_students_admin_profiles.sql` | SUPERSEDED | n/a | No-op (SELECT 1). Ref: `20260605000005_fix_amsio_tenant_independent.sql`. |
| 2 | `20260820000001_cms_articles_activity_log.sql` | ✅PROD | 2026-08-20 | W-093: cms schema + cms.articles + cms.activity_log. RO-verify: tables ✅ 6 policies ✅ rls+force=true ✅. |
| 3 | `20260820000002_cms_collection_items.sql` | ✅PROD | 2026-08-20 | W-094: cms.collection_items. RO-verify: table ✅ 3 policies ✅ rls+force=true ✅. |
| 4 | `20260820000003_cms_translation_strings.sql` | ✅PROD | 2026-08-20 | W-095: cms.translation_strings (tanpa deleted_at — ver gốc). RO-verify: table ✅ 3 policies ✅ rls+force=true ✅. L2 gap vá bởi row 6. |
| 5 | `20260820000004_cms_media_assets.sql` | ✅PROD | 2026-08-20 | W-096: cms.media_assets + Storage bucket `cms-assets`. RO-verify: table ✅ 3 policies ✅ rls+force=true ✅ bucket public=false ✅. |
| 6 | `20260820000005_cms_translation_strings_add_deleted_at.sql` | ✅PROD | 2026-08-20 | W-095 patch: ADD COLUMN deleted_at TIMESTAMPTZ. Owner decision post-apply. RO-verify (Mig-Runner, postgres-owner, 2026-08-20): `deleted_at` TIMESTAMPTZ nullable DEFAULT null ✅. L2 exception flag từ row 4 = RESOLVED. |

---

## Apply Order

```
W-093 → W-094 → W-095(gốc) → W-096 → W-095-patch(deleted_at)
```

Tất cả applied 2026-08-20 — Mig-Runner auto-apply (inline node BEGIN/COMMIT), owner pre-authorized.

---

## Verify Queries

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='cms' ORDER BY 1;
SELECT tablename, policyname, permissive, cmd FROM pg_policies WHERE schemaname='cms' ORDER BY 1, 2;
SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class c JOIN pg_namespace n ON c.relnamespace=n.oid WHERE n.nspname='cms' AND c.relkind='r';
SELECT id, name, public FROM storage.buckets WHERE id='cms-assets';
SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_schema='cms' AND table_name='translation_strings' ORDER BY 1;
```

---

*Maintained by Mig-Runner. Last updated: 2026-08-20.*
