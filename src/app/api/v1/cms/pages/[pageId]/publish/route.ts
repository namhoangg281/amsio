/**
 * POST /api/v1/cms/pages/[pageId]/publish
 *
 * Revalidates (publishes) a page by its pageId from the page manifest.
 * Marketing staff make string edits via auto-save; clicking "Publish" flushes
 * the ISR cache for that page so visitors see the latest DB content immediately.
 *
 * Auth: marketing_staff role required (Q2).
 * Rate-limit: 20 req/min per user.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { checkRateLimitAsync } from '@/lib/rate-limit';
import { getPageManifest } from '@/lib/cms/page-manifest';
import { revalidatePath, revalidateTag } from 'next/cache';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{ pageId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  // Q2 — auth first
  let identity: Awaited<ReturnType<typeof requireMarketingStaff>>;
  try {
    identity = await requireMarketingStaff();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    const status = msg.includes('401') ? 401 : 403;
    return NextResponse.json({ type: 'auth_error', message: msg }, { status });
  }

  // Rate-limit: 20 req/min per user
  if (!(await checkRateLimitAsync(`cms:publish:${identity.userId}`, 20, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  const { pageId } = await params;

  const manifest = getPageManifest(pageId);
  if (!manifest) {
    return NextResponse.json(
      { type: 'not_found', message: `ITRAN-CMS-404: Unknown pageId "${pageId}"` },
      { status: 404 },
    );
  }

  try {
    // Invalidate the specific page URL and the shared cms-strings cache tag.
    revalidatePath(manifest.url, 'page');
    revalidateTag('cms-strings');

    const publishedAt = new Date().toISOString();

    console.info(`[cms/pages/publish] pageId=${pageId} url=${manifest.url} by=${identity.userId}`);

    return NextResponse.json({
      revalidated: true,
      pageId,
      url: manifest.url,
      publishedAt,
    });
  } catch (err) {
    console.error('[cms/pages/publish POST]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Revalidation failed' },
      { status: 500 },
    );
  }
}
