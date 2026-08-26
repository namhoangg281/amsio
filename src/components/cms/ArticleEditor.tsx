'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n/context';
import type { Article, ArticleLocale, ArticleTranslation } from '@/lib/cms/types';
import LocaleTabBar from './LocaleTabBar';
import PublishToggle from './PublishToggle';
import CoverImageField from './CoverImageField';

interface ArticleEditorProps {
  article: Article | null;
}

const EMPTY_TRANSLATION: ArticleTranslation = {
  title: '',
  excerpt: '',
  body: '',
  seo_title: '',
  seo_description: '',
};

type TranslationsState = Record<ArticleLocale, Partial<ArticleTranslation>>;

function buildInitialTranslations(article: Article | null): TranslationsState {
  return {
    en: article?.translations.en ?? { ...EMPTY_TRANSLATION },
    vi: article?.translations.vi ?? {},
    zh: article?.translations.zh ?? {},
    fr: article?.translations.fr ?? {},
    ar: article?.translations.ar ?? {},
  };
}

export default function ArticleEditor({ article }: ArticleEditorProps) {
  const { t } = useI18n();
  const router = useRouter();

  const [activeLocale, setActiveLocale] = useState<ArticleLocale>('en');
  const [translations, setTranslations] = useState<TranslationsState>(
    () => buildInitialTranslations(article),
  );
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(!!article?.slug);
  const [category, setCategory] = useState<'news' | 'press'>(article?.category ?? 'news');
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [coverUrl, setCoverUrl] = useState(article?.cover_url ?? '');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-{2,}/g, '-');
  }

  function updateTranslationField(locale: ArticleLocale, field: keyof ArticleTranslation, value: string) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }));
    if (locale === 'en' && field === 'title' && !slugTouched) {
      setSlug(toSlug(value));
    }
  }

  const currentTranslation = translations[activeLocale];

  async function saveArticle(): Promise<string | null> {
    const body = {
      slug,
      category,
      featured,
      cover_url: coverUrl || null,
      translations: {
        en: {
          title: translations.en.title ?? '',
          excerpt: translations.en.excerpt ?? '',
          body: translations.en.body ?? '',
          seo_title: translations.en.seo_title ?? '',
          seo_description: translations.en.seo_description ?? '',
        },
        ...(Object.keys(translations.vi ?? {}).length > 0 && { vi: translations.vi }),
        ...(Object.keys(translations.zh ?? {}).length > 0 && { zh: translations.zh }),
        ...(Object.keys(translations.fr ?? {}).length > 0 && { fr: translations.fr }),
        ...(Object.keys(translations.ar ?? {}).length > 0 && { ar: translations.ar }),
      },
    };

    const url = article ? `/api/v1/cms/articles/${article.id}` : '/api/v1/cms/articles';
    const method = article ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = (await res.json()) as { data?: { id: string }; message?: string };
    if (!res.ok) throw new Error(data.message ?? 'Failed to save');

    return article?.id ?? data.data?.id ?? null;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const savedId = await saveArticle();
      if (savedId && !article) {
        router.push(`/cms/articles/${savedId}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    setError(null);
    try {
      const savedId = await saveArticle();
      if (!savedId) throw new Error('Failed to save before publishing');

      const res = await fetch(`/api/v1/cms/articles/${savedId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: true }),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(data.message ?? 'Failed to publish');

      if (!article) {
        router.push(`/cms/articles/${savedId}/edit`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publish failed');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top bar: slug, category, featured, cover, publish toggle */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Slug */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {t.cms.slug}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
              placeholder="auto-generated-from-title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {t.cms.category}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as 'news' | 'press')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 bg-white"
            >
              <option value="news">{t.cms.news}</option>
              <option value="press">{t.cms.press}</option>
            </select>
          </div>
        </div>

        {/* Cover image — upload in place or paste a URL */}
        <CoverImageField label={t.cms.coverUrl} value={coverUrl} onChange={setCoverUrl} />

        {/* Featured + Publish */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 accent-navy"
            />
            <span className="text-sm font-medium text-gray-700">{t.cms.featured}</span>
          </label>

          {article && (
            <PublishToggle articleId={article.id} currentStatus={article.status} />
          )}
        </div>
      </div>

      {/* Translation fields */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <LocaleTabBar activeLocale={activeLocale} onLocaleChange={setActiveLocale} />

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {t.cms.titleField}
              {activeLocale === 'en' && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={currentTranslation.title ?? ''}
              onChange={(e) => updateTranslationField(activeLocale, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {t.cms.excerpt}
            </label>
            <textarea
              value={currentTranslation.excerpt ?? ''}
              onChange={(e) => updateTranslationField(activeLocale, 'excerpt', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 resize-y"
            />
          </div>

          {/* Body (Markdown) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {t.cms.body}
            </label>
            <textarea
              value={currentTranslation.body ?? ''}
              onChange={(e) => updateTranslationField(activeLocale, 'body', e.target.value)}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-navy/30 resize-y"
            />
          </div>

          {/* SEO fields */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t.cms.seoTitle}
              </label>
              <input
                type="text"
                value={currentTranslation.seo_title ?? ''}
                onChange={(e) => updateTranslationField(activeLocale, 'seo_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {t.cms.seoDescription}
              </label>
              <input
                type="text"
                value={currentTranslation.seo_description ?? ''}
                onChange={(e) => updateTranslationField(activeLocale, 'seo_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save action bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || publishing}
          className="px-6 py-2.5 rounded-lg border border-navy text-navy font-semibold text-sm hover:bg-navy/5 transition-colors disabled:opacity-60"
        >
          {saving ? t.cms.saving : t.cms.saveDraft}
        </button>
        <button
          type="button"
          onClick={handlePublish}
          disabled={saving || publishing}
          className="px-6 py-2.5 rounded-lg bg-navy text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {publishing ? t.cms.publishing : t.cms.publish}
        </button>
        <a
          href="/cms/articles"
          className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          {t.cms.cancel}
        </a>
        {error && (
          <span className="text-red-500 text-sm">{error}</span>
        )}
      </div>
    </div>
  );
}
