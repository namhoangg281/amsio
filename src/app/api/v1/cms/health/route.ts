/**
 * GET /api/v1/cms/health — report whether the server can read the cms schema.
 *
 * Diagnostic for the content pipeline. The read path falls back to the compiled
 * TS locale files on any failure, which is invisible on screen, so this surfaces
 * the actual reason. Reports configuration presence and row counts only — never
 * the tenant id, keys or credentials.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchAllLocalesTranslationMap } from '@/lib/cms/queries';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const tenantId = process.env.AMSIO_TENANT_ID;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const config = {
    amsioTenantIdSet: Boolean(tenantId),
    supabaseUrlSet: Boolean(url),
    anonKeySet: Boolean(anonKey),
    serviceKeySet: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };

  if (!tenantId || !url || !anonKey) {
    return NextResponse.json({
      ok: false,
      stage: 'config',
      config,
      hint: 'A required environment variable is missing on this deployment.',
    });
  }

  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error, count } = await supabase
    .schema('cms')
    .from('translation_strings')
    .select('locale', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .neq('namespace', 'portal')
    .is('deleted_at', null)
    .limit(1)
    .returns<{ locale: string }[]>();

  if (error) {
    return NextResponse.json({
      ok: false,
      stage: 'query',
      config,
      error: { message: error.message, code: error.code, hint: error.hint },
    });
  }

  // Run the exact function the root layout uses, uncached, so a difference between
  // "the DB is readable" and "the page has strings" points at the cache, not the query.
  const viaLayoutFn = await fetchAllLocalesTranslationMap();
  const perLocale = Object.fromEntries(
    Object.entries(viaLayoutFn).map(([loc, map]) => [loc, Object.keys(map).length]),
  );

  return NextResponse.json({
    ok: true,
    stage: 'query',
    deployment: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 9) ?? 'unknown',
    config,
    directQuery: { rowCount: count ?? null, sampleReturned: Array.isArray(data) ? data.length : 0 },
    viaLayoutFn: { perLocale, faqSearchEn: viaLayoutFn.en?.['faq.search'] ?? null },
  });
}
