// /cms/pages/[pageId] — Page content editor.
// Server Component — auth enforced by cms/layout.tsx.
// W-097: CMS Phase 3.

import { notFound } from 'next/navigation';
import { getPageManifest, toFriendlyLabel } from '@/lib/cms/page-manifest';
import { fetchTranslationStrings } from '@/lib/cms/queries';
import { flattenObject } from '@/lib/i18n/db-override';
import PageStringsEditor from '@/components/cms/PageStringsEditor';
import type { SectionData, StringRow } from '@/components/cms/PageStringsEditor';
import type { ArticleLocale } from '@/lib/cms/types';

// Static locale imports for TS fallback values
import en from '@/lib/i18n/locales/en';
import vi from '@/lib/i18n/locales/vi';
import zh from '@/lib/i18n/locales/zh';
import fr from '@/lib/i18n/locales/fr';
import ar from '@/lib/i18n/locales/ar';

const ALL_LOCALES: ArticleLocale[] = ['en', 'vi', 'zh', 'fr', 'ar'];

const tsLocaleMap: Record<ArticleLocale, Record<string, unknown>> = {
  en: en as unknown as Record<string, unknown>,
  vi: vi as unknown as Record<string, unknown>,
  zh: zh as unknown as Record<string, unknown>,
  fr: fr as unknown as Record<string, unknown>,
  ar: ar as unknown as Record<string, unknown>,
};

interface PageProps {
  params: Promise<{ pageId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { pageId } = await params;
  const manifest = getPageManifest(pageId);
  return { title: manifest ? `${manifest.label} — AMSIO CMS` : 'Page Not Found — AMSIO CMS' };
}

export default async function CmsPageDetailPage({ params }: PageProps) {
  const { pageId } = await params;
  const manifest = getPageManifest(pageId);
  if (!manifest) notFound();

  // Collect unique namespaces used by this page
  const namespaces = [...new Set(manifest.textSections.map((s) => s.namespace))];

  // Fetch DB strings for all locales × all relevant namespaces
  const dbValuesByLocale: Record<string, Record<string, string>> = {};
  for (const locale of ALL_LOCALES) {
    dbValuesByLocale[locale] = {};
  }

  try {
    // One query per namespace (translation_strings table filters by namespace)
    for (const ns of namespaces) {
      const strings = await fetchTranslationStrings({ namespace: ns, limit: 500 });
      for (const s of strings) {
        const locale = s.locale as ArticleLocale;
        if (!dbValuesByLocale[locale]) dbValuesByLocale[locale] = {};
        dbValuesByLocale[locale][`${s.namespace}.${s.key}`] = s.value;
      }
    }
  } catch {
    // Non-fatal — DB empty → show TS fallback values dimmed
  }

  // Build flat TS fallback maps for all locales
  const tsFlatByLocale: Record<string, Record<string, string>> = {};
  for (const locale of ALL_LOCALES) {
    tsFlatByLocale[locale] = flattenObject(tsLocaleMap[locale]);
  }

  // Build section data for the editor
  const sections: SectionData[] = manifest.textSections.map((section) => {
    // All dot-paths in the en locale that belong to this namespace + keyPrefix
    const prefix = section.keyPrefix
      ? `${section.namespace}.${section.keyPrefix}.`
      : `${section.namespace}.`;
    const allEnFlat = tsFlatByLocale['en'] ?? {};
    const matchingKeys = Object.keys(allEnFlat)
      .filter((k) => k.startsWith(prefix) || k === prefix.slice(0, -1))
      .sort();

    const rows: StringRow[] = matchingKeys.map((dotPath) => ({
      dotPath,
      label: toFriendlyLabel(dotPath),
      tsValue: allEnFlat[dotPath] ?? '',
      dbValue: dbValuesByLocale['en']?.[dotPath] ?? null,
    }));

    return { sectionLabel: section.label, rows };
  });

  // Only show sections with at least one key
  const nonEmptySections = sections.filter((s) => s.rows.length > 0);

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/cms/pages" className="hover:text-navy transition-colors">
          Pages
        </a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{manifest.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{manifest.label}</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit text for each locale. Changes auto-save on blur. Click{' '}
          <strong>Publish page</strong> to flush cache and push live.
        </p>
      </div>

      {/* Related resources */}
      {(manifest.collections.length > 0 || manifest.media.length > 0) && (
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm">
          <p className="font-medium text-blue-800 mb-2">Related editors</p>
          <div className="flex flex-wrap gap-3">
            {manifest.collections.map((col) => (
              <a
                key={col}
                href={`/cms/collections?key=${col}`}
                className="text-blue-700 hover:underline"
              >
                Collection: {col}
              </a>
            ))}
            {manifest.media.map((tag) => (
              <a
                key={tag}
                href={`/cms/media?usage_tag=${tag}`}
                className="text-blue-700 hover:underline"
              >
                Media: {tag}
              </a>
            ))}
          </div>
        </div>
      )}

      {nonEmptySections.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No text keys found for this page. Check the page manifest.
        </div>
      ) : (
        <PageStringsEditor
          sections={nonEmptySections}
          dbValues={dbValuesByLocale}
          pageId={pageId}
          pageUrl={manifest.url}
        />
      )}
    </div>
  );
}
