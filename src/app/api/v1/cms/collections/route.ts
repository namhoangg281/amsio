/**
 * GET  /api/v1/cms/collections  — list collection items (admin, all statuses)
 * POST /api/v1/cms/collections  — create new collection item
 *
 * Auth: marketing_staff role required (Q2 — auth first).
 * Zod:  CollectionsQuerySchema (GET params), CreateCollectionItemSchema (POST body).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { fetchAdminCollectionItems, createCollectionItem } from '@/lib/cms/queries';
import { CollectionsQuerySchema, CreateCollectionItemSchema } from '@/lib/cms/schemas';
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

  // Q3 — Zod validate query params
  const { searchParams } = request.nextUrl;
  const parsed = CollectionsQuerySchema.safeParse({
    collection_key: searchParams.get('collection_key') ?? undefined,
    include_hidden: searchParams.get('include_hidden') ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid query parameters', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const items = await fetchAdminCollectionItems(
      parsed.data.collection_key,
      parsed.data.include_hidden,
    );
    return NextResponse.json({ data: items, count: items.length });
  } catch (err) {
    console.error('[cms/collections GET]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Failed to fetch collection items' },
      { status: 500 },
    );
  }
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

  // M-4 — rate limit: 30 req/min per authenticated user
  if (!(await checkRateLimitAsync(`cms:${identity.userId}`, 30, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  // Q3 — Zod validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ type: 'parse_error', message: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = CreateCollectionItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid request body', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const item = await createCollectionItem(parsed.data, identity.userId);
    revalidateTag('cms-collections');
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err) {
    console.error('[cms/collections POST]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500' },
      { status: 500 },
    );
  }
}
