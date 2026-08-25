/**
 * GET   /api/v1/cms/strings  — list translation strings (admin, all locales)
 * PATCH /api/v1/cms/strings  — upsert a single translation string
 *
 * Auth: marketing_staff role required (Q2).
 * Zod:  TranslationStringsQuerySchema (GET), TranslationStringUpsertSchema (PATCH).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { fetchTranslationStrings, upsertTranslationString } from '@/lib/cms/queries';
import { TranslationStringsQuerySchema, TranslationStringUpsertSchema } from '@/lib/cms/schemas';
import { revalidateTag } from 'next/cache';
import { checkRateLimitAsync } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Q2 — auth first
  let identity: Awaited<ReturnType<typeof requireMarketingStaff>>;
  try {
    identity = await requireMarketingStaff();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    const status = msg.includes('401') ? 401 : 403;
    return NextResponse.json({ type: 'auth_error', message: msg }, { status });
  }

  // M-4 — rate limit: 30 req/min per authenticated user
  if (!(await checkRateLimitAsync(`cms:${identity.userId}`, 30, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  const { searchParams } = request.nextUrl;
  const parsed = TranslationStringsQuerySchema.safeParse({
    locale: searchParams.get('locale') ?? undefined,
    namespace: searchParams.get('namespace') ?? undefined,
    key: searchParams.get('key') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    offset: searchParams.get('offset') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid query parameters', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const strings = await fetchTranslationStrings({
      locale: parsed.data.locale,
      namespace: parsed.data.namespace,
      key: parsed.data.key,
      limit: parsed.data.limit,
      offset: parsed.data.offset,
    });
    return NextResponse.json({ data: strings, count: strings.length });
  } catch (err) {
    console.error('[cms/strings GET]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Failed to fetch strings' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  // Q2 — auth first
  let identity: Awaited<ReturnType<typeof requireMarketingStaff>>;
  try {
    identity = await requireMarketingStaff();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    const status = msg.includes('401') ? 401 : 403;
    return NextResponse.json({ type: 'auth_error', message: msg }, { status });
  }

  // M-4 — rate limit: 30 req/min per authenticated user
  if (!(await checkRateLimitAsync(`cms:${identity.userId}`, 30, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ type: 'parse_error', message: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = TranslationStringUpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid request body', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const str = await upsertTranslationString(parsed.data, identity.userId);
    revalidateTag('cms-strings');
    return NextResponse.json({ data: str });
  } catch (err) {
    console.error('[cms/strings PATCH]', err);
    return NextResponse.json({ type: 'server_error', message: 'ITRAN-CMS-500' }, { status: 500 });
  }
}
