// CMS domain types — no @itran/* imports (split-ready seam).

export type ArticleLocale = 'en' | 'vi' | 'zh' | 'fr' | 'ar';

// ── W-094: Collection Items ────────────────────────────────────────────────

export type CollectionKey = 'team' | 'partners' | 'mission_blocks' | 'olympiad_intro';
export type CollectionItemStatus = 'active' | 'hidden';

export interface CollectionItemTranslation {
  /** Person/org name (team, partners). */
  name?: string;
  /** Block heading (mission_blocks, olympiad_intro). */
  title?: string;
  /** Description / body text (all types). */
  body?: string;
}

export type CollectionItemTranslations = Partial<Record<ArticleLocale, CollectionItemTranslation>>;

export interface CollectionItemMetadata {
  // team fields
  role?: string;
  photo_asset_id?: string;
  email?: string;
  // partners fields
  country_code?: string;
  logo_url?: string;
  website_url?: string;
  // mission_blocks / olympiad_intro fields
  icon?: string;
  image_url?: string;
}

export interface CollectionItem {
  id: string;
  tenant_id: string;
  collection_key: CollectionKey;
  sort_order: number;
  status: CollectionItemStatus;
  translations: CollectionItemTranslations;
  metadata: CollectionItemMetadata;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
}

// ── W-095: Translation Strings ─────────────────────────────────────────────

export interface TranslationString {
  id: string;
  tenant_id: string;
  locale: ArticleLocale;
  namespace: string;
  key: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
}

// ── W-096: Media Assets ────────────────────────────────────────────────────

export interface MediaAssetSeoMeta {
  title?: string;
  description?: string;
  caption?: string;
}

export type MediaUsageTag =
  | 'article_cover'
  | 'press_kit'
  | 'team_photo'
  | 'partner_logo'
  | 'og_image';

export interface MediaAsset {
  id: string;
  tenant_id: string;
  filename: string;
  storage_path: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_text: string | null;
  usage_tag: MediaUsageTag | null;
  seo_meta: MediaAssetSeoMeta;
  created_at: string;
  deleted_at: string | null;
  created_by: string | null;
}

export interface ArticleTranslation {
  title: string;
  excerpt: string;
  body: string;
  seo_title: string;
  seo_description: string;
}

export interface ArticleTranslations {
  en: ArticleTranslation;
  vi?: Partial<ArticleTranslation>;
  zh?: Partial<ArticleTranslation>;
  fr?: Partial<ArticleTranslation>;
  ar?: Partial<ArticleTranslation>;
}

export type ArticleCategory = 'news' | 'press';
export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: string;
  tenant_id: string;
  slug: string;
  category: ArticleCategory;
  status: ArticleStatus;
  featured: boolean;
  translations: ArticleTranslations;
  cover_url: string | null;
  published_at: string | null;
  deleted_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Minimal flattened shape for public-facing list pages (locale resolved to en)
export interface ArticleDisplayItem {
  id: string;
  slug: string;
  category: ArticleCategory;
  featured: boolean;
  cover_url: string | null;
  published_at: string | null;
  created_at: string;
  title: string;
  excerpt: string;
  body: string;
  seo_title: string;
  seo_description: string;
}

export function articleToDisplayItem(article: Article): ArticleDisplayItem {
  const en = article.translations.en;
  return {
    id: article.id,
    slug: article.slug,
    category: article.category,
    featured: article.featured,
    cover_url: article.cover_url,
    published_at: article.published_at,
    created_at: article.created_at,
    title: en.title,
    excerpt: en.excerpt,
    body: en.body,
    seo_title: en.seo_title,
    seo_description: en.seo_description,
  };
}
