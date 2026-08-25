/**
 * GET  /api/v1/cms/media  — list media assets (admin)
 * POST /api/v1/cms/media  — upload file to cms-assets bucket + register DB record
 *
 * Auth: marketing_staff role required (Q2).
 * Upload: multipart/form-data with 'file' field.
 * Constraints: PNG/JPG/WebP only, max 5 MB (per W-096 spec).
 *
 * NOTE on public access: the cms-assets Storage bucket is private (public=false).
 * To serve images directly to browsers on public pages, either:
 *   (a) Set the bucket to public via Supabase Dashboard > Storage, OR
 *   (b) Use GET /api/v1/cms/media/[id] which generates a signed URL for admin preview.
 * The storage_path returned in the response can be used to build a signed URL
 * server-side via buildMediaSignedUrl() from lib/cms/queries.ts.
 */

import { type NextRequest, NextResponse } from 'next/server';
import { requireMarketingStaff } from '@/lib/cms/auth';
import { fetchMediaAssets, createMediaAsset } from '@/lib/cms/queries';
import { MediaQuerySchema } from '@/lib/cms/schemas';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimitAsync } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

function buildAdminStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

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
  const parsed = MediaQuerySchema.safeParse({
    usage_tag: searchParams.get('usage_tag') ?? undefined,
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
    const assets = await fetchMediaAssets({
      usage_tag: parsed.data.usage_tag,
      limit: parsed.data.limit,
      offset: parsed.data.offset,
    });
    return NextResponse.json({ data: assets, count: assets.length });
  } catch (err) {
    console.error('[cms/media GET]', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Failed to fetch media assets' },
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

  // M-4 — rate limit: 10 req/min per authenticated user (upload endpoint)
  if (!(await checkRateLimitAsync(`cms:media:upload:${identity.userId}`, 10, 60_000))) {
    return NextResponse.json({ type: 'rate_limit_exceeded', message: 'ITRAN-CMS-429' }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ type: 'parse_error', message: 'Invalid multipart body' }, { status: 400 });
  }

  const fileEntry = formData.get('file');
  if (!(fileEntry instanceof File)) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Missing or invalid "file" field' },
      { status: 422 },
    );
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(fileEntry.type)) {
    return NextResponse.json(
      {
        type: 'validation_error',
        message: 'Only PNG, JPEG, and WebP images are accepted',
      },
      { status: 422 },
    );
  }

  // Validate size
  if (fileEntry.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { type: 'validation_error', message: 'File exceeds 5 MB limit' },
      { status: 422 },
    );
  }

  // Optional fields from form
  const altText = typeof formData.get('alt_text') === 'string'
    ? (formData.get('alt_text') as string).trim() || null
    : null;
  const usageTag = typeof formData.get('usage_tag') === 'string'
    ? (formData.get('usage_tag') as string) || undefined
    : undefined;

  // Validate usage_tag if provided
  const VALID_USAGE_TAGS = new Set([
    'article_cover',
    'press_kit',
    'team_photo',
    'partner_logo',
    'og_image',
  ]);
  if (usageTag && !VALID_USAGE_TAGS.has(usageTag)) {
    return NextResponse.json(
      { type: 'validation_error', message: 'Invalid usage_tag value' },
      { status: 422 },
    );
  }

  // Build storage path: {year}/{uuid-prefix}-{filename}
  const now = new Date();
  const year = now.getFullYear();
  const randomPrefix = crypto.randomUUID().slice(0, 8);
  const sanitizedName = fileEntry.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${year}/${randomPrefix}-${sanitizedName}`;

  // Upload to Supabase Storage
  const storageClient = buildAdminStorageClient();
  const fileBuffer = await fileEntry.arrayBuffer();

  // M-2: Validate magic bytes — client-supplied Content-Type can be spoofed.
  // Read first 12 bytes to detect PNG / JPEG / WebP signatures.
  const sig = new Uint8Array(fileBuffer, 0, Math.min(12, fileBuffer.byteLength));
  const isPNG  = sig[0] === 0x89 && sig[1] === 0x50 && sig[2] === 0x4E && sig[3] === 0x47;
  const isJPEG = sig[0] === 0xFF && sig[1] === 0xD8 && sig[2] === 0xFF;
  const isWebP = sig[0] === 0x52 && sig[1] === 0x49 && sig[2] === 0x46 && sig[3] === 0x46
               && sig[8] === 0x57 && sig[9] === 0x45 && sig[10] === 0x42 && sig[11] === 0x50;
  if (!isPNG && !isJPEG && !isWebP) {
    return NextResponse.json(
      { type: 'validation_error', message: 'File content does not match a supported image format (PNG/JPEG/WebP)' },
      { status: 422 },
    );
  }
  const { error: uploadError } = await storageClient.storage
    .from('cms-assets')
    .upload(storagePath, fileBuffer, {
      contentType: fileEntry.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('[cms/media POST] storage upload failed:', uploadError.message);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500: Upload failed' },
      { status: 500 },
    );
  }

  // Register DB record
  try {
    const asset = await createMediaAsset(
      {
        filename: fileEntry.name,
        storage_path: storagePath,
        mime_type: fileEntry.type,
        size_bytes: fileEntry.size,
        alt_text: altText ?? undefined,
        usage_tag: usageTag as Parameters<typeof createMediaAsset>[0]['usage_tag'],
        seo_meta: {},
      },
      identity.userId,
    );
    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (err) {
    // DB registration failed — attempt cleanup of the uploaded file.
    await storageClient.storage.from('cms-assets').remove([storagePath]).catch(() => undefined);
    console.error('[cms/media POST] DB registration failed:', err);
    return NextResponse.json(
      { type: 'server_error', message: 'ITRAN-CMS-500' },
      { status: 500 },
    );
  }
}
