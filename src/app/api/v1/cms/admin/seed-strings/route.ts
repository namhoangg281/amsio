/**
 * POST /api/v1/cms/admin/seed-strings
 *
 * Seeds translation_strings from the TypeScript locale files.
 * Idempotent: existing rows are skipped (not overwritten).
 * Returns { inserted, skipped } so the caller knows what happened.
 *
 * Auth: marketing_staff role required (Q2).
 * Rate-limit: 5 req/min per user (heavy operation).
 * IMPORTANT: Do NOT call this from production automation — owner / migration staff only.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { seedTranslationStrings } from '@/lib/cms/queries';
import { checkRateLimitAsync } from '@/lib/rate-limit';
import { flattenObject } from '@/lib/i18n/db-override';
import type { ArticleLocale } from '@/lib/cms/types';

// Static locale imports — these are compiled-time TS files, not DB.
import en from '@/lib/i18n/locales/en';
import vi from '@/lib/i18n/locales/vi';
import zh from '@/lib/i18n/locales/zh';
import fr from '@/lib/i18n/locales/fr';
import ar from '@/lib/i18n/locales/ar';

export const runtime = 'nodejs';

const LOCALES: { code: ArticleLocale; data: typeof en }[] = [
  { code: 'en', data: en },
  { code: 'vi', data: vi as unknown as typeof en },
  { code: 'zh', data: zh as unknown as typeof en },
  { code: 'fr', data: fr as unknown as typeof en },
  { code: 'ar', data: ar as unknown as typeof en },
];

/**
 * Build seed rows from TypeScript locale files.
 * Namespace = first dot-segment; key = remaining dot-segments joined.
 * Excludes portal.* namespace (CMS does not manage portal auth strings).
 */
function buildSeedRows(
  locale: ArticleLocale,
  flat: Record<string, string>,
): { locale: ArticleLocale; namespace: string; key: string; value: string }[] {
  const rows: { locale: ArticleLocale; namespace: string; key: string; value: string }[] = [];
  for (const [dotPath, value] of Object.entries(flat)) {
    const dotIndex = dotPath.indexOf('.');
    if (dotIndex === -1) continue; // must have at least namespace.key
    const namespace = dotPath.slice(0, dotIndex);
    const key = dotPath.slice(dotIndex + 1);
    // Exclude portal.* — auth strings are not managed via CMS dashboard
    if (namespace === 'portal') continue;
    rows.push({ locale, namespace, key, value });
  }
  return rows;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Q2 — auth first
  let identity: Awaited<ReturnType<typeof requireMarketingStaff>>;
  try {
    identity = await requireMarketingStaff();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    const status = msg.includes('401') ? 401 : 403;
    return NextResponse.json({ type: 'auth_error', message: msg }, { status });
  }

  // Rate-limit: heavy operation — 5 req/min per user
  if (!(await checkRateLimitAsync(`cms:seed:${identity.userId}`, 5, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  try {
    let totalInserted = 0;
    let totalSkipped = 0;

    for (const { code, data } of LOCALES) {
      const flat = flattenObject(data as unknown as Record<string, unknown>);
      const rows = buildSeedRows(code, flat);
      const result = await seedTranslationStrings(rows, identity.userId);
      totalInserted += result.inserted;
      totalSkipped += result.skipped;
    }

    return NextResponse.json({
      inserted: totalInserted,
      skipped: totalSkipped,
      message: `Seed complete: ${totalInserted} inserted, ${totalSkipped} already existed`,
    });
  } catch (err) {
    console.error('[cms/seed-strings POST]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Seed failed' },
      { status: 500 },
    );
  }
}
