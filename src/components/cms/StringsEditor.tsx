'use client';

import { useState, useCallback } from 'react';
import type { TranslationString, ArticleLocale } from '@/lib/cms/types';

const ALL_LOCALES: ArticleLocale[] = ['en', 'vi', 'zh', 'fr', 'ar'];

/** Locale treated as the source text staff translate from. */
const SOURCE_LOCALE: ArticleLocale = 'en';

interface StringRow {
  namespace: string;
  key: string;
  values: Partial<Record<ArticleLocale, string>>;
  /** id per locale — needed to track existing rows */
  ids: Partial<Record<ArticleLocale, string>>;
  /** last save time per locale — drives the out-of-date marker */
  updated: Partial<Record<ArticleLocale, string>>;
}

function groupStrings(strings: TranslationString[]): StringRow[] {
  const map = new Map<string, StringRow>();
  for (const s of strings) {
    const compositeKey = `${s.namespace}|||${s.key}`;
    if (!map.has(compositeKey)) {
      map.set(compositeKey, {
        namespace: s.namespace,
        key: s.key,
        values: {},
        ids: {},
        updated: {},
      });
    }
    const row = map.get(compositeKey)!;
    row.values[s.locale as ArticleLocale] = s.value;
    row.ids[s.locale as ArticleLocale] = s.id;
    row.updated[s.locale as ArticleLocale] = s.updated_at;
  }
  return Array.from(map.values());
}

/**
 * A translation is out of date once the source text has been saved more recently
 * than it has. Nothing translates automatically, so this is the only signal staff
 * get that a locale still carries the old wording.
 */
function isOutOfDate(row: StringRow, locale: ArticleLocale): boolean {
  if (locale === SOURCE_LOCALE) return false;
  const source = row.updated[SOURCE_LOCALE];
  const mine = row.updated[locale];
  if (!source || !mine) return false;
  return new Date(mine).getTime() < new Date(source).getTime();
}

interface StringsEditorProps {
  initialStrings: TranslationString[];
}

export default function StringsEditor({ initialStrings }: StringsEditorProps) {
  const [rows, setRows] = useState<StringRow[]>(() => groupStrings(initialStrings));
  const [searchKey, setSearchKey] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [staleOnly, setStaleOnly] = useState(false);

  const copyValue = useCallback(async (cellKey: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(cellKey);
      window.setTimeout(() => setCopiedKey((k) => (k === cellKey ? null : k)), 1200);
    } catch {
      setError('Could not copy — your browser blocked clipboard access.');
    }
  }, []);

  async function saveLocaleValue(
    namespace: string,
    key: string,
    locale: ArticleLocale,
    value: string,
  ) {
    const compositeKey = `${namespace}|||${key}`;
    setSavingKey(`${compositeKey}|||${locale}`);
    setError(null);
    try {
      const res = await fetch('/api/v1/cms/strings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, namespace, key, value }),
      });
      if (!res.ok) {
        const json = (await res.json()) as { message?: string };
        throw new Error(json.message ?? 'Save failed');
      }
      const json = (await res.json()) as { data: TranslationString };
      setRows((prev) =>
        prev.map((row) => {
          if (row.namespace === namespace && row.key === key) {
            return {
              ...row,
              values: { ...row.values, [locale]: json.data.value },
              ids: { ...row.ids, [locale]: json.data.id },
              updated: { ...row.updated, [locale]: json.data.updated_at },
            };
          }
          return row;
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSavingKey(null);
    }
  }

  const bySearch = searchKey
    ? rows.filter(
        (r) =>
          r.key.toLowerCase().includes(searchKey.toLowerCase()) ||
          r.namespace.toLowerCase().includes(searchKey.toLowerCase()),
      )
    : rows;

  const staleCount = rows.filter((r) =>
    ALL_LOCALES.some((l) => isOutOfDate(r, l)),
  ).length;

  const filtered = staleOnly
    ? bySearch.filter((r) => ALL_LOCALES.some((l) => isOutOfDate(r, l)))
    : bySearch;

  const handleValueChange = useCallback(
    (namespace: string, key: string, locale: ArticleLocale, value: string) => {
      setRows((prev) =>
        prev.map((row) => {
          if (row.namespace === namespace && row.key === key) {
            return { ...row, values: { ...row.values, [locale]: value } };
          }
          return row;
        }),
      );
    },
    [],
  );

  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="font-medium">No translation strings in DB yet.</p>
        <p className="text-sm mt-1">
          The site uses TypeScript locale files as fallback. Add strings here to override them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input
          type="search"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Search by namespace or key…"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
        />
        <button
          type="button"
          onClick={() => setStaleOnly((v) => !v)}
          disabled={staleCount === 0}
          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors disabled:opacity-40 ${
            staleOnly
              ? 'border-amber-500 bg-amber-500 text-white'
              : 'border-gray-200 text-gray-600 hover:border-amber-400'
          }`}
        >
          Needs retranslation ({staleCount})
        </button>
        <span className="text-xs text-gray-400">{filtered.length} of {rows.length} strings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3 py-2 font-semibold text-gray-700 w-48">Namespace / Key</th>
              {ALL_LOCALES.map((l) => (
                <th key={l} className="text-left px-3 py-2 font-semibold text-gray-700 min-w-[160px]">
                  {l.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const compositeKey = `${row.namespace}|||${row.key}`;
              return (
                <tr key={compositeKey} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3 align-top">
                    <span className="block font-mono text-xs text-orange">{row.namespace}</span>
                    <span className="block font-mono text-xs text-gray-700">{row.key}</span>
                  </td>
                  {ALL_LOCALES.map((locale) => {
                    const cellKey = `${compositeKey}|||${locale}`;
                    const isSaving = savingKey === cellKey;
                    const isCopied = copiedKey === cellKey;
                    const stale = isOutOfDate(row, locale);
                    const value = row.values[locale] ?? '';
                    return (
                      <td key={locale} className="px-3 py-2 align-top">
                        {stale && (
                          <span className="block mb-1 text-[10px] font-semibold text-amber-700">
                            ● English changed later — retranslate
                          </span>
                        )}
                        <div className="flex gap-1">
                          <textarea
                            rows={2}
                            value={value}
                            onChange={(e) =>
                              handleValueChange(row.namespace, row.key, locale, e.target.value)
                            }
                            className={`flex-1 border rounded px-2 py-1 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-navy/30 ${
                              stale ? 'border-amber-400 bg-amber-50/50' : 'border-gray-200'
                            }`}
                          />
                          <div className="flex flex-col gap-1 flex-shrink-0">
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() =>
                                saveLocaleValue(row.namespace, row.key, locale, value)
                              }
                              className="px-2 py-1 rounded bg-navy text-white text-xs font-semibold hover:opacity-90 disabled:opacity-40"
                            >
                              {isSaving ? '…' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyValue(cellKey, value)}
                              title="Copy this text to paste into a translator"
                              className="px-2 py-1 rounded border border-gray-200 text-gray-600 text-xs font-semibold hover:border-navy/40"
                            >
                              {isCopied ? '✓' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
