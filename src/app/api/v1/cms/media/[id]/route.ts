/**
 * GET    /api/v1/cms/media/[id]  — get asset + signed URL for preview
 * DELETE /api/v1/cms/media/[id]  — soft-delete asset record (L2: does NOT delete from Storage)
 *
 * Auth: marketing_staff role required (Q2).
 * L2: Soft delete — sets deleted_at. Physical file removal from Storage is
 *     a separate manual step for the owner (to avoid accidental data loss).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { fetchMediaAssetById, softDeleteMediaAsset, buildMediaSignedUrl } from '@/lib/cms/queries';
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
  const asset = await fetchMediaAssetById(id).catch(() => null);
  if (!asset) {
    return NextResponse.json({ type: 'not_found', message: 'ITRAN-CMS-404' }, { status: 404 });
  }

  // Generate signed URL (1-hour expiry) for admin preview
  const signedUrl = await buildMediaSignedUrl(asset.storage_path, 3600);

  return NextResponse.json({ data: { ...asset, signed_url: signedUrl } });
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
    await softDeleteMediaAsset(id, identity.userId);
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error('[cms/media/:id DELETE]', err);
    return NextResponse.json({ type: 'server_error', message: 'ITRAN-CMS-500' }, { status: 500 });
  }
}
