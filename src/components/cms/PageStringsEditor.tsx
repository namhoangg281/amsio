'use client';

// CMS page strings editor — inline editor for all text sections of a page.
// Auto-saves on blur via PATCH /api/v1/cms/strings.
// W-097: CMS Phase 3.

import { useState, useCallback } from 'react';

export interface StringRow {
  /** Full dot-path: "namespace.sub.key" */
  dotPath: string;
  /** Human-friendly label: "Namespace › Sub › Key" */
  label: string;
  /** TypeScript fallback value (shown dimmed when no DB override). */
  tsValue: string;
  /** Current DB value, if any. */
  dbValue: string | null;
}

export interface SectionData {
  sectionLabel: string;
  rows: StringRow[];
}

interface SaveState {
  [dotPath: string]: 'idle' | 'saving' | 'saved' | 'error';
}

function splitDotPath(dotPath: string): { namespace: string; key: string } | null {
  const idx = dotPath.indexOf('.');
  if (idx === -1) return null;
  return { namespace: dotPath.slice(0, idx), key: dotPath.slice(idx + 1) };
}

async function saveString(
  dotPath: string,
  locale: string,
  value: string,
): Promise<boolean> {
  const parts = splitDotPath(dotPath);
  if (!parts) return false;
  try {
    const res = await fetch('/api/v1/cms/strings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, namespace: parts.namespace, key: parts.key, value }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const LOCALES: { code: string; label: string; rtl?: boolean }[] = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'zh', label: '中文' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية', rtl: true },
];

interface LocaleValues {
  [locale: string]: string;
}

interface PageStringsEditorProps {
  sections: SectionData[];
  /** Initial DB values per locale: { locale: { dotPath: value } } */
  dbValues: Record<string, Record<string, string>>;
  pageId: string;
  pageUrl: string;
}

export default function PageStringsEditor({
  sections,
  dbValues,
  pageId,
  pageUrl,
}: PageStringsEditorProps) {
  const [saveState, setSaveState] = useState<SaveState>({});
  const [localValues, setLocalValues] = useState<Record<string, LocaleValues>>(() => {
    // Build initial state: DB value if present, otherwise TS fallback
    const state: Record<string, LocaleValues> = {};
    for (const section of sections) {
      for (const row of section.rows) {
        state[row.dotPath] = {};
        for (const { code } of LOCALES) {
          state[row.dotPath][code] = dbValues[code]?.[row.dotPath] ?? row.tsValue;
        }
      }
    }
    return state;
  });
  const [publishState, setPublishState] = useState<'idle' | 'publishing' | 'done' | 'error'>('idle');

  const handleChange = useCallback(
    (dotPath: string, locale: string, value: string) => {
      setLocalValues((prev) => ({
        ...prev,
        [dotPath]: { ...prev[dotPath], [locale]: value },
      }));
    },
    [],
  );

  const handleBlur = useCallback(
    async (dotPath: string, locale: string, value: string) => {
      const stateKey = `${dotPath}:${locale}`;
      setSaveState((prev) => ({ ...prev, [stateKey]: 'saving' }));
      const ok = await saveString(dotPath, locale, value);
      setSaveState((prev) => ({ ...prev, [stateKey]: ok ? 'saved' : 'error' }));
      // Clear status after 2s
      setTimeout(() => {
        setSaveState((prev) => ({ ...prev, [stateKey]: 'idle' }));
      }, 2000);
    },
    [],
  );

  const handlePublish = useCallback(async () => {
    setPublishState('publishing');
    try {
      const res = await fetch(`/api/v1/cms/pages/${pageId}/publish`, { method: 'POST' });
      setPublishState(res.ok ? 'done' : 'error');
      if (res.ok) {
        setTimeout(() => setPublishState('idle'), 3000);
      }
    } catch {
      setPublishState('error');
    }
  }, [pageId]);

  return (
    <div>
      {/* Publish bar */}
      <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-gray-200">
        <div>
          <span className="text-sm font-medium text-gray-700">Page: </span>
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-navy hover:underline font-mono"
          >
            {pageUrl} ↗
          </a>
        </div>
        <button
          onClick={() => void handlePublish()}
          disabled={publishState === 'publishing'}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            publishState === 'done'
              ? 'bg-green-500 text-white'
              : publishState === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-navy text-white hover:bg-navy/80 disabled:opacity-50'
          }`}
        >
          {publishState === 'publishing'
            ? 'Publishing…'
            : publishState === 'done'
              ? 'Published!'
              : publishState === 'error'
                ? 'Error — retry'
                : 'Publish page'}
        </button>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.sectionLabel} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {section.sectionLabel}
          </h2>

          <div className="space-y-6">
            {section.rows.map((row) => {
              const isLong = row.tsValue.length > 80;
              return (
                <div key={row.dotPath} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">{row.label}</span>
                    <span className="text-xs text-gray-400 font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                      {row.dotPath}
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {LOCALES.map(({ code, label, rtl }) => {
                      const stateKey = `${row.dotPath}:${code}`;
                      const state = saveState[stateKey] ?? 'idle';
                      const currentValue = localValues[row.dotPath]?.[code] ?? '';
                      const hasDbValue = (dbValues[code]?.[row.dotPath] ?? null) !== null;

                      return (
                        <div key={code} className="flex items-start gap-3">
                          <span
                            className="text-xs font-medium text-gray-500 w-20 shrink-0 pt-2 text-right"
                            title={label}
                          >
                            {code.toUpperCase()}
                          </span>
                          <div className="flex-1 relative">
                            {isLong ? (
                              <textarea
                                className={`w-full px-3 py-2 text-sm border rounded-lg resize-y min-h-[72px] transition-colors focus:outline-none focus:ring-2 focus:ring-navy/30 ${
                                  !hasDbValue ? 'text-gray-400' : 'text-gray-900'
                                } border-gray-200`}
                                dir={rtl ? 'rtl' : 'ltr'}
                                value={currentValue}
                                placeholder={row.tsValue}
                                onChange={(e) => handleChange(row.dotPath, code, e.target.value)}
                                onBlur={(e) => void handleBlur(row.dotPath, code, e.target.value)}
                              />
                            ) : (
                              <input
                                type="text"
                                className={`w-full px-3 py-2 text-sm border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-navy/30 ${
                                  !hasDbValue ? 'text-gray-400' : 'text-gray-900'
                                } border-gray-200`}
                                dir={rtl ? 'rtl' : 'ltr'}
                                value={currentValue}
                                placeholder={row.tsValue}
                                onChange={(e) => handleChange(row.dotPath, code, e.target.value)}
                                onBlur={(e) => void handleBlur(row.dotPath, code, e.target.value)}
                              />
                            )}
                            <span
                              className={`absolute right-2 top-2 text-xs transition-opacity ${
                                state === 'idle' ? 'opacity-0' : 'opacity-100'
                              } ${
                                state === 'saving'
                                  ? 'text-gray-400'
                                  : state === 'saved'
                                    ? 'text-green-500'
                                    : 'text-red-500'
                              }`}
                            >
                              {state === 'saving' ? '…' : state === 'saved' ? '✓' : state === 'error' ? '!' : ''}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
