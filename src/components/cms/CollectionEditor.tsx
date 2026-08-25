'use client';

import { useState } from 'react';
import type { CollectionItem, ArticleLocale, CollectionItemTranslation, CollectionKey } from '@/lib/cms/types';

const LOCALES: { code: ArticleLocale; label: string }[] = [
  { code: 'en', label: 'EN (required)' },
  { code: 'vi', label: 'VI' },
  { code: 'zh', label: 'ZH' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
];

interface CollectionEditorProps {
  item: CollectionItem;
  /** Redirect here after save */
  returnUrl: string;
}

export default function CollectionEditor({ item, returnUrl }: CollectionEditorProps) {
  const [activeLocale, setActiveLocale] = useState<ArticleLocale>('en');
  const [translations, setTranslations] = useState<CollectionItem['translations']>(
    item.translations,
  );
  const [metadata, setMetadata] = useState<CollectionItem['metadata']>(item.metadata);
  const [sortOrder, setSortOrder] = useState<number>(item.sort_order);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function setLocaleField(
    locale: ArticleLocale,
    field: keyof CollectionItemTranslation,
    value: string,
  ) {
    setTranslations((prev) => ({
      ...prev,
      [locale]: {
        ...(prev[locale] ?? {}),
        [field]: value,
      },
    }));
  }

  function setMetaField(field: keyof CollectionItem['metadata'], value: string) {
    setMetadata((prev) => ({ ...prev, [field]: value || undefined }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/v1/cms/collections/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: sortOrder, translations, metadata }),
      });
      if (!res.ok) {
        const json = (await res.json()) as { message?: string };
        throw new Error(json.message ?? 'Save failed');
      }
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const locTrans = translations[activeLocale] ?? {};
  const showNameField: CollectionKey[] = ['team', 'partners'];
  const showTitleField: CollectionKey[] = ['mission_blocks', 'olympiad_intro'];

  return (
    <div className="space-y-6">
      {/* Locale tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setActiveLocale(l.code)}
              className={`px-4 py-2 text-sm font-semibold rounded-t border-b-2 transition-colors ${
                activeLocale === l.code
                  ? 'border-navy text-navy bg-white'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Translation fields */}
      <div className="space-y-4">
        {showNameField.includes(item.collection_key) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Name ({activeLocale})
            </label>
            <input
              type="text"
              value={locTrans.name ?? ''}
              onChange={(e) => setLocaleField(activeLocale, 'name', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
              placeholder="Organisation or person name"
            />
          </div>
        )}
        {showTitleField.includes(item.collection_key) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title ({activeLocale})
            </label>
            <input
              type="text"
              value={locTrans.title ?? ''}
              onChange={(e) => setLocaleField(activeLocale, 'title', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
              placeholder="Block title"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Body / Description ({activeLocale})
          </label>
          <textarea
            rows={4}
            value={locTrans.body ?? ''}
            onChange={(e) => setLocaleField(activeLocale, 'body', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 resize-y"
            placeholder="Description text"
          />
        </div>
      </div>

      {/* Metadata fields */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Metadata</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Sort Order</label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          {(item.collection_key === 'team' || item.collection_key === 'partners') && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Role Label</label>
              <input
                type="text"
                value={metadata.role ?? ''}
                onChange={(e) => setMetaField('role', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                placeholder="e.g. Secretary-General"
              />
            </div>
          )}
          {item.collection_key === 'team' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={metadata.email ?? ''}
                onChange={(e) => setMetaField('email', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                placeholder="info@amsio.org"
              />
            </div>
          )}
          {item.collection_key === 'partners' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={metadata.logo_url ?? ''}
                  onChange={(e) => setMetaField('logo_url', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Website URL</label>
                <input
                  type="url"
                  value={metadata.website_url ?? ''}
                  onChange={(e) => setMetaField('website_url', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Country Code</label>
                <input
                  type="text"
                  value={metadata.country_code ?? ''}
                  onChange={(e) => setMetaField('country_code', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  placeholder="e.g. vn"
                  maxLength={5}
                />
              </div>
            </>
          )}
          {(item.collection_key === 'mission_blocks' ||
            item.collection_key === 'olympiad_intro') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Icon (emoji)</label>
                <input
                  type="text"
                  value={metadata.icon ?? ''}
                  onChange={(e) => setMetaField('icon', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  placeholder="🏅"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Image URL</label>
                <input
                  type="url"
                  value={metadata.image_url ?? ''}
                  onChange={(e) => setMetaField('image_url', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                  placeholder="https://..."
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <a
          href={returnUrl}
          className="px-6 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Back
        </a>
        {saved && (
          <span className="text-sm text-green-600 font-semibold">Saved!</span>
        )}
        {error && (
          <span className="text-sm text-red-600">{error}</span>
        )}
      </div>
    </div>
  );
}
