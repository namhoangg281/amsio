// Zod v4 schemas for CMS API boundaries.
// All API routes validate input against these schemas before touching the DB.

import { z } from 'zod';

const ArticleTranslationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().default(''),
  body: z.string().default(''),
  seo_title: z.string().default(''),
  seo_description: z.string().default(''),
});

const ArticleTranslationPartialSchema = z.object({
  title: z.string().optional(),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

const ArticleTranslationsSchema = z.object({
  en: ArticleTranslationSchema,
  vi: ArticleTranslationPartialSchema.optional(),
  zh: ArticleTranslationPartialSchema.optional(),
  fr: ArticleTranslationPartialSchema.optional(),
  ar: ArticleTranslationPartialSchema.optional(),
});

const ArticleCategoryEnum = z.enum(['news', 'press']);
const ArticleStatusEnum = z.enum(['draft', 'published']);

export const CreateArticleSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'),
  category: ArticleCategoryEnum,
  featured: z.boolean().default(false),
  cover_url: z.string().url().nullable().optional(),
  translations: ArticleTranslationsSchema,
});

export const UpdateArticleSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  category: ArticleCategoryEnum.optional(),
  featured: z.boolean().optional(),
  cover_url: z.string().url().nullable().optional(),
  translations: ArticleTranslationsSchema.optional(),
});

export const PublishSchema = z.object({
  publish: z.boolean(),
});

export const ArticlesQuerySchema = z.object({
  category: ArticleCategoryEnum.optional(),
  status: ArticleStatusEnum.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type CreateArticleInput = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleInput = z.infer<typeof UpdateArticleSchema>;
export type PublishInput = z.infer<typeof PublishSchema>;
export type ArticlesQueryInput = z.infer<typeof ArticlesQuerySchema>;

// ── W-094: Collection Items ────────────────────────────────────────────────

const CollectionKeyEnum = z.enum(['team', 'partners', 'mission_blocks', 'olympiad_intro']);
const CollectionStatusEnum = z.enum(['active', 'hidden']);

const CollectionItemTranslationSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
});

const CollectionItemTranslationsSchema = z.object({
  en: CollectionItemTranslationSchema.optional(),
  vi: CollectionItemTranslationSchema.optional(),
  zh: CollectionItemTranslationSchema.optional(),
  fr: CollectionItemTranslationSchema.optional(),
  ar: CollectionItemTranslationSchema.optional(),
});

const CollectionItemMetadataSchema = z.object({
  role: z.string().optional(),
  photo_asset_id: z.string().uuid().optional(),
  email: z.string().email().optional(),
  country_code: z.string().optional(),
  logo_url: z.string().url().optional(),
  website_url: z.string().url().optional(),
  icon: z.string().optional(),
  image_url: z.string().url().optional(),
});

export const CreateCollectionItemSchema = z.object({
  collection_key: CollectionKeyEnum,
  sort_order: z.number().int().min(0).default(0),
  status: CollectionStatusEnum.default('active'),
  translations: CollectionItemTranslationsSchema.default({}),
  metadata: CollectionItemMetadataSchema.default({}),
});

export const UpdateCollectionItemSchema = z.object({
  sort_order: z.number().int().min(0).optional(),
  translations: CollectionItemTranslationsSchema.optional(),
  metadata: CollectionItemMetadataSchema.optional(),
});

export const SetCollectionStatusSchema = z.object({
  status: CollectionStatusEnum,
});

export const CollectionsQuerySchema = z.object({
  collection_key: CollectionKeyEnum.optional(),
  include_hidden: z.coerce.boolean().default(false),
});

export type CreateCollectionItemInput = z.infer<typeof CreateCollectionItemSchema>;
export type UpdateCollectionItemInput = z.infer<typeof UpdateCollectionItemSchema>;
export type SetCollectionStatusInput = z.infer<typeof SetCollectionStatusSchema>;
export type CollectionsQueryInput = z.infer<typeof CollectionsQuerySchema>;

// ── W-095: Translation Strings ─────────────────────────────────────────────

const LocaleEnum = z.enum(['en', 'vi', 'zh', 'fr', 'ar']);

export const TranslationStringUpsertSchema = z.object({
  locale: LocaleEnum,
  namespace: z.string().min(1).max(64),
  key: z.string().min(1).max(256),
  value: z.string(),
});

export const TranslationStringsQuerySchema = z.object({
  locale: LocaleEnum.optional(),
  namespace: z.string().optional(),
  key: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200),
  offset: z.coerce.number().int().min(0).default(0),
});

export type TranslationStringUpsertInput = z.infer<typeof TranslationStringUpsertSchema>;
export type TranslationStringsQueryInput = z.infer<typeof TranslationStringsQuerySchema>;

// ── W-096: Media Assets ────────────────────────────────────────────────────

const MediaUsageTagEnum = z.enum([
  'article_cover',
  'press_kit',
  'team_photo',
  'partner_logo',
  'og_image',
]);

export const MediaAssetCreateSchema = z.object({
  filename: z.string().min(1).max(255),
  storage_path: z.string().min(1),
  mime_type: z.string().optional(),
  size_bytes: z.number().int().positive().optional(),
  alt_text: z.string().max(512).optional(),
  usage_tag: MediaUsageTagEnum.optional(),
  seo_meta: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      caption: z.string().optional(),
    })
    .default({}),
});

export const MediaQuerySchema = z.object({
  usage_tag: MediaUsageTagEnum.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export type MediaAssetCreateInput = z.infer<typeof MediaAssetCreateSchema>;
export type MediaQueryInput = z.infer<typeof MediaQuerySchema>;
