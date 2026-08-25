import 'server-only';

// CMS DB query functions — server-side only (requires SUPABASE_SERVICE_ROLE_KEY).
// DO NOT import this from Client Components.
//
// Public reads use anon key (RLS filters to published + not deleted).
// Admin mutations use service role (auth already verified by requireMarketingStaff).

import { createClient } from '@supabase/supabase-js';
import type {
  Article,
  ArticleCategory,
  ArticleDisplayItem,
  ArticleLocale,
  CollectionItem,
  CollectionKey,
  CollectionItemStatus,
  TranslationString,
  MediaAsset,
  MediaUsageTag,
} from './types';
import { articleToDisplayItem } from './types';
import type {
  CreateArticleInput,
  UpdateArticleInput,
  CreateCollectionItemInput,
  UpdateCollectionItemInput,
  TranslationStringUpsertInput,
  MediaAssetCreateInput,
} from './schemas';

function getRequiredEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`AMSIO-CMS-ENV: ${name} is not configured`);
  return val;
}

function getTenantId(): string {
  return getRequiredEnv('AMSIO_TENANT_ID');
}

function buildPublicClient() {
  return createClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

function buildAdminClient() {
  return createClient(
    getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

// Public reads

export async function fetchPublishedArticles(
  category: ArticleCategory,
): Promise<ArticleDisplayItem[]> {
  const supabase = buildPublicClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .select(
      'id, slug, category, status, featured, translations, cover_url, published_at, deleted_at, created_by, created_at, updated_at, tenant_id',
    )
    .eq('tenant_id', getTenantId())
    .eq('category', category)
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .returns<Article[]>();

  if (error || !data) return [];
  return data.map(articleToDisplayItem);
}

export async function fetchFeaturedArticle(
  category: ArticleCategory,
): Promise<ArticleDisplayItem | null> {
  const supabase = buildPublicClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .select(
      'id, slug, category, status, featured, translations, cover_url, published_at, deleted_at, created_by, created_at, updated_at, tenant_id',
    )
    .eq('tenant_id', getTenantId())
    .eq('category', category)
    .eq('status', 'published')
    .eq('featured', true)
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle<Article>();

  if (error || !data) return null;
  return articleToDisplayItem(data);
}

/**
 * Fetch one published article by slug. Returns the full row, translations included,
 * so the detail page can resolve the reader's locale on the client — the list pages
 * flatten to English because they only ever show a title and excerpt.
 * Returns null for a draft, a soft-deleted row, or a slug that does not exist.
 */
export async function fetchPublishedArticleBySlug(
  category: ArticleCategory,
  slug: string,
): Promise<Article | null> {
  const supabase = buildPublicClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .select(
      'id, slug, category, status, featured, translations, cover_url, published_at, deleted_at, created_by, created_at, updated_at, tenant_id',
    )
    .eq('tenant_id', getTenantId())
    .eq('category', category)
    .eq('slug', slug)
    .eq('status', 'published')
    .is('deleted_at', null)
    .maybeSingle<Article>();

  if (error) {
    console.error(`[cms/fetchPublishedArticleBySlug] ${category}/${slug} failed:`, error.message);
    return null;
  }
  return data ?? null;
}

/** Slugs of every published article in a category — feeds generateStaticParams. */
export async function fetchPublishedArticleSlugs(
  category: ArticleCategory,
): Promise<string[]> {
  const supabase = buildPublicClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .select('slug')
    .eq('tenant_id', getTenantId())
    .eq('category', category)
    .eq('status', 'published')
    .is('deleted_at', null)
    .returns<{ slug: string }[]>();

  if (error || !data) return [];
  return data.map((r) => r.slug);
}

// Admin reads (service role)

export async function fetchAllArticles(filter?: {
  category?: ArticleCategory;
  status?: 'draft' | 'published';
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  const supabase = buildAdminClient();
  let query = supabase
    .schema('cms')
    .from('articles')
    .select(
      'id, slug, category, status, featured, translations, cover_url, published_at, deleted_at, created_by, created_at, updated_at, tenant_id',
    )
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (filter?.category) query = query.eq('category', filter.category);
  if (filter?.status) query = query.eq('status', filter.status);
  if (filter?.limit) query = query.limit(filter.limit);
  if (filter?.offset) query = query.range(filter.offset, (filter.offset ?? 0) + (filter.limit ?? 50) - 1);

  const { data, error } = await query.returns<Article[]>();
  if (error || !data) return [];
  return data;
}

export async function fetchArticleById(id: string): Promise<Article | null> {
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .select(
      'id, slug, category, status, featured, translations, cover_url, published_at, deleted_at, created_by, created_at, updated_at, tenant_id',
    )
    .eq('id', id)
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .maybeSingle<Article>();

  if (error || !data) return null;
  return data;
}

// Admin mutations (service role)

export async function createArticle(
  input: CreateArticleInput,
  userId: string,
): Promise<Article> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .insert({
      tenant_id: tenantId,
      slug: input.slug,
      category: input.category,
      status: 'draft',
      featured: input.featured ?? false,
      cover_url: input.cover_url ?? null,
      translations: input.translations,
      created_by: userId,
    })
    .select()
    .single<Article>();

  // M-2: server-side log only; generic code to caller.
  if (error || !data) {
    console.error('[cms/createArticle] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({ entity_id: data.id, entity_type: 'article', action: 'created', actor_id: userId, tenant_id: tenantId });
  return data;
}

export async function updateArticle(
  id: string,
  input: UpdateArticleInput,
  userId: string,
): Promise<Article> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .update({
      ...(input.slug !== undefined && { slug: input.slug }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.featured !== undefined && { featured: input.featured }),
      ...(input.cover_url !== undefined && { cover_url: input.cover_url }),
      ...(input.translations !== undefined && { translations: input.translations }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .select()
    .single<Article>();

  // M-2: server-side log only; generic code to caller.
  if (error || !data) {
    console.error('[cms/updateArticle] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({ entity_id: id, entity_type: 'article', action: 'updated', actor_id: userId, tenant_id: tenantId });
  return data;
}

export async function publishArticle(
  id: string,
  publish: boolean,
  userId: string,
): Promise<Article> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('articles')
    .update({
      status: publish ? 'published' : 'draft',
      published_at: publish ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .select()
    .single<Article>();

  // M-2: server-side log only; generic code to caller.
  if (error || !data) {
    console.error('[cms/publishArticle] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: id,
    entity_type: 'article',
    action: publish ? 'published' : 'unpublished',
    actor_id: userId,
    tenant_id: tenantId,
  });
  return data;
}

export async function softDeleteArticle(id: string, userId: string): Promise<void> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { error } = await supabase
    .schema('cms')
    .from('articles')
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  // M-2: server-side log only; generic code to caller.
  if (error) {
    console.error('[cms/softDeleteArticle] failed:', error.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({ entity_id: id, entity_type: 'article', action: 'deleted', actor_id: userId, tenant_id: tenantId });
}

// ── W-094: Collection Items ────────────────────────────────────────────────

const COLLECTION_COLUMNS =
  'id, tenant_id, collection_key, sort_order, status, translations, metadata, created_at, updated_at, deleted_at, created_by';

/**
 * Public read: returns active (non-deleted) items for a collection, ordered by sort_order.
 * Uses anon key — RLS filters to status='active' and deleted_at IS NULL.
 */
export async function fetchPublicCollectionItems(
  collectionKey: CollectionKey,
): Promise<CollectionItem[]> {
  const supabase = buildPublicClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('collection_items')
    .select(COLLECTION_COLUMNS)
    .eq('tenant_id', getTenantId())
    .eq('collection_key', collectionKey)
    .eq('status', 'active')
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })
    .returns<CollectionItem[]>();

  if (error || !data) return [];
  return data;
}

/** Admin read: all items (including hidden) for a collection. */
export async function fetchAdminCollectionItems(
  collectionKey?: CollectionKey,
  includeHidden = false,
): Promise<CollectionItem[]> {
  const supabase = buildAdminClient();
  let query = supabase
    .schema('cms')
    .from('collection_items')
    .select(COLLECTION_COLUMNS)
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .order('collection_key', { ascending: true })
    .order('sort_order', { ascending: true });

  if (collectionKey) query = query.eq('collection_key', collectionKey);
  if (!includeHidden) query = query.eq('status', 'active');

  const { data, error } = await query.returns<CollectionItem[]>();
  if (error || !data) return [];
  return data;
}

export async function fetchCollectionItemById(id: string): Promise<CollectionItem | null> {
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('collection_items')
    .select(COLLECTION_COLUMNS)
    .eq('id', id)
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .maybeSingle<CollectionItem>();

  if (error || !data) return null;
  return data;
}

export async function createCollectionItem(
  input: CreateCollectionItemInput,
  userId: string,
): Promise<CollectionItem> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('collection_items')
    .insert({
      tenant_id: tenantId,
      collection_key: input.collection_key,
      sort_order: input.sort_order,
      status: input.status,
      translations: input.translations,
      metadata: input.metadata,
      created_by: userId,
    })
    .select(COLLECTION_COLUMNS)
    .single<CollectionItem>();

  if (error || !data) {
    console.error('[cms/createCollectionItem] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: data.id,
    entity_type: 'collection_item',
    action: 'created',
    actor_id: userId,
    tenant_id: tenantId,
  });
  return data;
}

export async function updateCollectionItem(
  id: string,
  input: UpdateCollectionItemInput,
  userId: string,
): Promise<CollectionItem> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('collection_items')
    .update({
      ...(input.sort_order !== undefined && { sort_order: input.sort_order }),
      ...(input.translations !== undefined && { translations: input.translations }),
      ...(input.metadata !== undefined && { metadata: input.metadata }),
    })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .select(COLLECTION_COLUMNS)
    .single<CollectionItem>();

  if (error || !data) {
    console.error('[cms/updateCollectionItem] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: id,
    entity_type: 'collection_item',
    action: 'updated',
    actor_id: userId,
    tenant_id: tenantId,
  });
  return data;
}

export async function setCollectionItemStatus(
  id: string,
  status: CollectionItemStatus,
  userId: string,
): Promise<CollectionItem> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('collection_items')
    .update({ status })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null)
    .select(COLLECTION_COLUMNS)
    .single<CollectionItem>();

  if (error || !data) {
    console.error('[cms/setCollectionItemStatus] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: id,
    entity_type: 'collection_item',
    action: status === 'active' ? 'activated' : 'hidden',
    actor_id: userId,
    tenant_id: tenantId,
  });
  return data;
}

export async function softDeleteCollectionItem(id: string, userId: string): Promise<void> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { error } = await supabase
    .schema('cms')
    .from('collection_items')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (error) {
    console.error('[cms/softDeleteCollectionItem] failed:', error.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: id,
    entity_type: 'collection_item',
    action: 'deleted',
    actor_id: userId,
    tenant_id: tenantId,
  });
}

// ── W-095: Translation Strings ─────────────────────────────────────────────

const TRANSLATION_STRING_COLUMNS = 'id, tenant_id, locale, namespace, key, value, updated_at, updated_by';

/**
 * W-097: Fetch all translation strings for ALL 5 locales in a single query.
 * Returns a map keyed by locale: { [locale]: { "namespace.key": value } }.
 * Used by layout.tsx to hydrate DB overrides at render time.
 * Falls back to empty maps on any DB error — caller must handle gracefully.
 */
export async function fetchAllLocalesTranslationMap(): Promise<
  Record<ArticleLocale, Record<string, string>>
> {
  const empty: Record<ArticleLocale, Record<string, string>> = {
    en: {},
    vi: {},
    zh: {},
    fr: {},
    ar: {},
  };
  try {
    const supabase = buildPublicClient();
    const tenantId = getTenantId();

    const result: Record<ArticleLocale, Record<string, string>> = {
      en: {},
      vi: {},
      zh: {},
      fr: {},
      ar: {},
    };
    const validLocales: ArticleLocale[] = ['en', 'vi', 'zh', 'fr', 'ar'];

    // PostgREST caps a response at its configured maximum (1000 rows by default),
    // and says nothing when it truncates. One key per locale across five locales
    // passes that cap easily, so an unpaginated read silently drops whole languages:
    // measured 2026-08-20 as en 596 / vi 404 / zh 0 / fr 0 / ar 0 out of 3006 rows.
    const PAGE = 1000;
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .schema('cms')
        .from('translation_strings')
        .select('locale, namespace, key, value')
        .eq('tenant_id', tenantId)
        .neq('namespace', 'portal')
        .is('deleted_at', null)
        // Stable order so page boundaries cannot skip or repeat a row. Rows have no
        // natural order otherwise, and UPDATE rewrites a tuple at the end of the heap.
        .order('locale', { ascending: true })
        .order('namespace', { ascending: true })
        .order('key', { ascending: true })
        .range(from, from + PAGE - 1)
        .returns<{ locale: string; namespace: string; key: string; value: string }[]>();

      if (error) {
        // Falling back to the TS locale files is invisible to visitors, so the reason
        // has to reach the logs or a misconfiguration looks identical to "no content".
        console.error(
          '[cms/fetchAllLocalesTranslationMap] read failed, serving TS locale files:',
          error.message,
        );
        return empty;
      }
      if (!data || data.length === 0) break;

      for (const row of data) {
        const locale = row.locale as ArticleLocale;
        if (!validLocales.includes(locale)) continue;
        result[locale][`${row.namespace}.${row.key}`] = row.value;
      }

      if (data.length < PAGE) break;
    }

    return result;
  } catch (err) {
    // Most likely AMSIO_TENANT_ID missing — getTenantId() throws by design, and
    // swallowing it silently turns a config error into "the CMS looks empty".
    console.error(
      '[cms/fetchAllLocalesTranslationMap] threw, serving TS locale files:',
      err instanceof Error ? err.message : String(err),
    );
    return empty;
  }
}

/**
 * Public read: fetch all translation strings for a locale (optionally filtered by namespace).
 * Returns a map: { [namespace.key]: value }.
 */
export async function fetchTranslationMap(
  locale: ArticleLocale,
  namespace?: string,
): Promise<Record<string, string>> {
  const supabase = buildPublicClient();
  const tenantId = getTenantId();
  const map: Record<string, string> = {};

  // Paginated for the same reason as fetchAllLocalesTranslationMap: PostgREST
  // truncates at its row cap without reporting it.
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    let query = supabase
      .schema('cms')
      .from('translation_strings')
      .select('namespace, key, value')
      .eq('tenant_id', tenantId)
      .eq('locale', locale)
      .is('deleted_at', null);

    if (namespace) query = query.eq('namespace', namespace);

    const { data, error } = await query
      .order('namespace', { ascending: true })
      .order('key', { ascending: true })
      .range(from, from + PAGE - 1)
      .returns<{ namespace: string; key: string; value: string }[]>();

    if (error) {
      console.error(
        `[cms/fetchTranslationMap] ${locale}/${namespace ?? '*'} read failed:`,
        error.message,
      );
      return {};
    }
    if (!data || data.length === 0) break;

    for (const row of data) {
      map[`${row.namespace}.${row.key}`] = row.value;
    }

    if (data.length < PAGE) break;
  }

  return map;
}

/** Admin read: list translation strings with optional filters. */
export async function fetchTranslationStrings(filter?: {
  locale?: ArticleLocale;
  namespace?: string;
  key?: string;
  limit?: number;
  offset?: number;
}): Promise<TranslationString[]> {
  const supabase = buildAdminClient();
  let query = supabase
    .schema('cms')
    .from('translation_strings')
    .select(TRANSLATION_STRING_COLUMNS)
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .order('namespace', { ascending: true })
    .order('key', { ascending: true });

  if (filter?.locale) query = query.eq('locale', filter.locale);
  if (filter?.namespace) query = query.eq('namespace', filter.namespace);
  if (filter?.key) query = query.ilike('key', `%${filter.key}%`);
  if (filter?.limit) query = query.limit(filter.limit);
  if (filter?.offset)
    query = query.range(filter.offset, (filter.offset ?? 0) + (filter.limit ?? 200) - 1);

  const { data, error } = await query.returns<TranslationString[]>();
  if (error || !data) return [];
  return data;
}

/**
 * Upsert a translation string (locale+namespace+key unique per tenant, soft-delete aware).
 *
 * IMPORTANT: The unique index on translation_strings is a PARTIAL index:
 *   UNIQUE (locale, namespace, key) WHERE deleted_at IS NULL
 * Postgres cannot resolve a bare `onConflict: 'locale,namespace,key'` against a partial
 * unique index (no WHERE predicate → "no unique or exclusion constraint matching the ON
 * CONFLICT specification"). We therefore use update-then-insert instead of .upsert().
 */
export async function upsertTranslationString(
  input: TranslationStringUpsertInput,
  userId: string,
): Promise<TranslationString> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();

  // Step 1: UPDATE existing active row (deleted_at IS NULL)
  const { data: updated, error: updateError } = await supabase
    .schema('cms')
    .from('translation_strings')
    .update({ value: input.value, updated_by: userId })
    .eq('tenant_id', tenantId)
    .eq('locale', input.locale)
    .eq('namespace', input.namespace)
    .eq('key', input.key)
    .is('deleted_at', null)
    .select(TRANSLATION_STRING_COLUMNS)
    .returns<TranslationString[]>();

  if (updateError) {
    console.error('[cms/upsertTranslationString] update failed:', updateError.message);
    throw new Error('ITRAN-CMS-500');
  }

  if (updated && updated.length > 0) {
    const row = updated[0];
    await insertActivityLog({
      entity_id: row.id,
      entity_type: 'translation_string',
      action: 'upserted',
      actor_id: userId,
      tenant_id: tenantId,
    });
    return row;
  }

  // Step 2: No active row found → INSERT
  const { data: inserted, error: insertError } = await supabase
    .schema('cms')
    .from('translation_strings')
    .insert({
      tenant_id: tenantId,
      locale: input.locale,
      namespace: input.namespace,
      key: input.key,
      value: input.value,
      updated_by: userId,
    })
    .select(TRANSLATION_STRING_COLUMNS)
    .single<TranslationString>();

  if (insertError || !inserted) {
    console.error('[cms/upsertTranslationString] insert failed:', insertError?.message);
    throw new Error('ITRAN-CMS-500');
  }

  await insertActivityLog({
    entity_id: inserted.id,
    entity_type: 'translation_string',
    action: 'upserted',
    actor_id: userId,
    tenant_id: tenantId,
  });
  return inserted;
}

// ── W-096: Media Assets ─────────────────────────────────────────────────────

const MEDIA_ASSET_COLUMNS =
  'id, tenant_id, filename, storage_path, mime_type, size_bytes, alt_text, usage_tag, seo_meta, created_at, deleted_at, created_by';

/** Admin read: list media assets. */
export async function fetchMediaAssets(filter?: {
  usage_tag?: MediaUsageTag;
  limit?: number;
  offset?: number;
}): Promise<MediaAsset[]> {
  const supabase = buildAdminClient();
  let query = supabase
    .schema('cms')
    .from('media_assets')
    .select(MEDIA_ASSET_COLUMNS)
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (filter?.usage_tag) query = query.eq('usage_tag', filter.usage_tag);
  if (filter?.limit) query = query.limit(filter.limit);
  if (filter?.offset)
    query = query.range(filter.offset, (filter.offset ?? 0) + (filter.limit ?? 50) - 1);

  const { data, error } = await query.returns<MediaAsset[]>();
  if (error || !data) return [];
  return data;
}

export async function fetchMediaAssetById(id: string): Promise<MediaAsset | null> {
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('media_assets')
    .select(MEDIA_ASSET_COLUMNS)
    .eq('id', id)
    .eq('tenant_id', getTenantId())
    .is('deleted_at', null)
    .maybeSingle<MediaAsset>();

  if (error || !data) return null;
  return data;
}

/**
 * Register a media asset record after the file has been uploaded to Storage.
 * Call this AFTER a successful storage.from('cms-assets').upload().
 */
export async function createMediaAsset(
  input: MediaAssetCreateInput,
  userId: string,
): Promise<MediaAsset> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { data, error } = await supabase
    .schema('cms')
    .from('media_assets')
    .insert({
      tenant_id: tenantId,
      filename: input.filename,
      storage_path: input.storage_path,
      mime_type: input.mime_type ?? null,
      size_bytes: input.size_bytes ?? null,
      alt_text: input.alt_text ?? null,
      usage_tag: input.usage_tag ?? null,
      seo_meta: input.seo_meta,
      created_by: userId,
    })
    .select(MEDIA_ASSET_COLUMNS)
    .single<MediaAsset>();

  if (error || !data) {
    console.error('[cms/createMediaAsset] failed:', error?.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: data.id,
    entity_type: 'media_asset',
    action: 'uploaded',
    actor_id: userId,
    tenant_id: tenantId,
  });
  return data;
}

export async function softDeleteMediaAsset(id: string, userId: string): Promise<void> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  const { error } = await supabase
    .schema('cms')
    .from('media_assets')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .is('deleted_at', null);

  if (error) {
    console.error('[cms/softDeleteMediaAsset] failed:', error.message);
    throw new Error('ITRAN-CMS-500');
  }
  await insertActivityLog({
    entity_id: id,
    entity_type: 'media_asset',
    action: 'deleted',
    actor_id: userId,
    tenant_id: tenantId,
  });
}

/**
 * Build the public download URL for a media asset.
 * NOTE: The cms-assets bucket is private (public=false in migration). Files are
 * accessible to anon via the RLS policy `cms_assets_public_read`, but browsers
 * cannot load them via the CDN shortcut URL. For public image access on the site,
 * either: (a) flip the bucket to public via Dashboard, or (b) use signed URLs
 * generated server-side. This helper returns the CDN URL; if the bucket is private,
 * use supabase.storage.from('cms-assets').createSignedUrl(path, 3600) instead.
 */
export function buildMediaPublicUrl(storagePath: string): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return `${url}/storage/v1/object/public/cms-assets/${storagePath}`;
}

/** Generate a short-lived signed URL (admin preview). Requires service role. */
export async function buildMediaSignedUrl(
  storagePath: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const supabase = buildAdminClient();
  const { data, error } = await supabase.storage
    .from('cms-assets')
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error || !data) return null;
  return data.signedUrl;
}

// Activity log

// M-1: corrected column names to match cms.activity_log schema:
//   entity_id UUID (not article_id), entity_type TEXT NOT NULL.
async function insertActivityLog(entry: {
  entity_id: string;
  entity_type: string;
  action: string;
  actor_id: string;
  tenant_id: string;
}): Promise<void> {
  const supabase = buildAdminClient();
  const { error } = await supabase
    .schema('cms')
    .from('activity_log')
    .insert({
      entity_id: entry.entity_id,
      entity_type: entry.entity_type,
      action: entry.action,
      actor_id: entry.actor_id,
      tenant_id: entry.tenant_id,
    });

  if (error) {
    // Non-fatal — log server-side, do not surface to caller.
    console.error('[cms/activity_log] insert failed:', error.message);
  }
}

// ── W-097: Seed helpers ────────────────────────────────────────────────────

export interface SeedRow {
  locale: ArticleLocale;
  namespace: string;
  key: string;
  value: string;
}

export interface SeedResult {
  inserted: number;
  skipped: number;
}

/**
 * Idempotent bulk seed for translation strings.
 * Seed is INSERT-ONLY — existing rows are skipped, not overwritten, so that any
 * edits made by marketing staff via the CMS dashboard are never reverted by a
 * subsequent seed run.
 * For each row: SELECT to check existence; skip if found; INSERT if absent.
 * Returns counts of inserted vs skipped (already existed) rows.
 * Uses service role client — must be called only from auth-gated admin routes.
 */
export async function seedTranslationStrings(
  rows: SeedRow[],
  userId: string,
): Promise<SeedResult> {
  const tenantId = getTenantId();
  const supabase = buildAdminClient();
  let inserted = 0;
  let skipped = 0;

  for (const row of rows) {
    // Step 1: check existence — seed never overwrites existing edits
    const { data: existing, error: selectError } = await supabase
      .schema('cms')
      .from('translation_strings')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('locale', row.locale)
      .eq('namespace', row.namespace)
      .eq('key', row.key)
      .is('deleted_at', null)
      .limit(1)
      .returns<{ id: string }[]>();

    if (selectError) {
      console.error('[cms/seedTranslationStrings] select failed:', selectError.message);
      continue;
    }

    if (existing && existing.length > 0) {
      // Row already exists — preserve marketing staff edits
      skipped++;
      continue;
    }

    // Step 2: INSERT new row
    const { error: insertError } = await supabase
      .schema('cms')
      .from('translation_strings')
      .insert({
        tenant_id: tenantId,
        locale: row.locale,
        namespace: row.namespace,
        key: row.key,
        value: row.value,
        updated_by: userId,
      });

    if (insertError) {
      console.error('[cms/seedTranslationStrings] insert failed:', insertError.message);
      continue;
    }
    inserted++;
  }

  return { inserted, skipped };
}
