/**
 * GET    /api/v1/cms/collections/[id]  — fetch one item
 * PATCH  /api/v1/cms/collections/[id]  — update translations/metadata/sort_order
 * DELETE /api/v1/cms/collections/[id]  — soft delete
 *
 * Auth: marketing_staff role required (Q2).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import {
  fetchCollectionItemById,
  updateCollectionItem,
  softDeleteCollectionItem,
} from '@/lib/cms/queries';
import { UpdateCollectionItemSchema } from '@/lib/cms/schemas';
import { revalidateTag } from 'next/cache';
import { checkRateLimitAsync } from '@/lib/rate-limit';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
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

  const { id } = await params;
  const item = await fetchCollectionItemById(id).catch(() => null);
  if (!item) {
    return NextResponse.json({ type: 'not_found', message: 'ITRAN-CMS-404' }, { status: 404 });
  }
  return NextResponse.json({ data: item });
}

export async function PATCH(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
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

  const parsed = UpdateCollectionItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid request body', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const { id } = await params;
  try {
    const item = await updateCollectionItem(id, parsed.data, identity.userId);
    revalidateTag('cms-collections');
    return NextResponse.json({ data: item });
  } catch (err) {
    console.error('[cms/collections/:id PATCH]', err);
    return NextResponse.json({ type: 'server_error', message: 'ITRAN-CMS-500' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
): Promise<NextResponse> {
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

  const { id } = await params;
  try {
    await softDeleteCollectionItem(id, identity.userId);
    revalidateTag('cms-collections');
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error('[cms/collections/:id DELETE]', err);
    return NextResponse.json({ type: 'server_error', message: 'ITRAN-CMS-500' }, { status: 500 });
  }
}
