/**
 * GET    /api/v1/cms/articles/[id]  — fetch single article (admin, drafts included)
 * PATCH  /api/v1/cms/articles/[id]  — update article fields
 * DELETE /api/v1/cms/articles/[id]  — soft-delete article
 *
 * Auth: marketing_staff role required on all methods (Q2 — auth first).
 * Zod:  UpdateArticleSchema for PATCH body.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { fetchArticleById, updateArticle, softDeleteArticle } from '@/lib/cms/queries';
import { UpdateArticleSchema } from '@/lib/cms/schemas';
import { checkRateLimitAsync } from '@/lib/rate-limit';

export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  // Q2 — auth first
  let identityGet: Awaited<ReturnType<typeof requireMarketingStaff>>;
  try {
    identityGet = await requireMarketingStaff();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unauthorized';
    const status = msg.includes('401') ? 401 : 403;
    return NextResponse.json({ type: 'auth_error', message: msg }, { status });
  }

  // M-4 — rate limit: 30 req/min per authenticated user
  if (!(await checkRateLimitAsync(`cms:${identityGet.userId}`, 30, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  const { id } = await context.params;

  try {
    const article = await fetchArticleById(id);
    if (!article) {
      return NextResponse.json({ type: 'not_found', message: 'ITRAN-CMS-404: Article not found' }, { status: 404 });
    }
    return NextResponse.json({ data: article });
  } catch (err) {
    console.error('[cms/articles/[id] GET]', err);
    return NextResponse.json({ type: 'server_error', message: 'ITRAN-CMS-500: Failed to fetch article' }, { status: 500 });
  }
}

export async function PATCH(
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

  const parsed = UpdateArticleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid request body', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const article = await updateArticle(id, parsed.data, identity.userId);
    return NextResponse.json({ data: article });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to update';
    console.error('[cms/articles/[id] PATCH]', msg);
    const status = msg.includes('404') ? 404 : 500;
    return NextResponse.json({ type: 'server_error', message: msg }, { status });
  }
}

export async function DELETE(
  _request: NextRequest,
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

  try {
    await softDeleteArticle(id, identity.userId);
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to delete';
    console.error('[cms/articles/[id] DELETE]', msg);
    return NextResponse.json({ type: 'server_error', message: msg }, { status: 500 });
  }
}
