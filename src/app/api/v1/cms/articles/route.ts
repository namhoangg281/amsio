/**
 * GET  /api/v1/cms/articles  — list articles (admin, all statuses)
 * POST /api/v1/cms/articles  — create new article
 *
 * Auth: marketing_staff role required (Q2 — auth first).
 * Zod:  ArticlesQuerySchema (GET params), CreateArticleSchema (POST body).
 * Errors: ITRAN-CMS-{code} format.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { fetchAllArticles, createArticle } from '@/lib/cms/queries';
import { ArticlesQuerySchema, CreateArticleSchema } from '@/lib/cms/schemas';
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
  const rawParams = {
    category: searchParams.get('category') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    offset: searchParams.get('offset') ?? undefined,
  };
  const parsed = ArticlesQuerySchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid query parameters', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const articles = await fetchAllArticles({
      category: parsed.data.category,
      status: parsed.data.status,
      limit: parsed.data.limit,
      offset: parsed.data.offset,
    });
    return NextResponse.json({ data: articles, count: articles.length });
  } catch (err) {
    console.error('[cms/articles GET]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Failed to fetch articles' },
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

  const parsed = CreateArticleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid request body', issues: parsed.error.issues },
      { status: 422 },
    );
  }

  try {
    const article = await createArticle(parsed.data, identity.userId);
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create article';
    console.error('[cms/articles POST]', msg);
    return NextResponse.json({ type: 'server_error', message: msg }, { status: 500 });
  }
}
