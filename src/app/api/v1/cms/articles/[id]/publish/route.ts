/**
 * POST /api/v1/cms/articles/[id]/publish
 *
 * Body: { publish: boolean }
 * publish=true  → status='published', published_at=now()
 * publish=false → status='draft', published_at=null (unpublish)
 *
 * After state change, revalidates /news and /press paths so pages reflect the update.
 *
 * Auth: marketing_staff role required (Q2 — auth first).
 * Zod:  PublishSchema.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { publishArticle } from '@/lib/cms/queries';
import { PublishSchema } from '@/lib/cms/schemas';
import { checkRateLimitAsync } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
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

  const { id } = await context.params;

  // Q3 — Zod validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ type: 'parse_error', message: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = PublishSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid request body', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const article = await publishArticle(id, parsed.data.publish, identity.userId);

    // Revalidate public pages so they pick up the new publish state
    revalidatePath('/news');
    revalidatePath('/press');

    return NextResponse.json({ data: article });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to publish';
    console.error('[cms/articles/[id]/publish POST]', msg);
    return NextResponse.json({ type: 'server_error', message: msg }, { status: 500 });
  }
}
