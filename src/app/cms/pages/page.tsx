// /cms/pages — Pages dashboard: grid of all static marketing pages.
// Server Component — auth is enforced by cms/layout.tsx.
// W-097: CMS Phase 3 — page-level content management.

import { pageManifests } from '@/lib/cms/page-manifest';
import { fetchTranslationStrings } from '@/lib/cms/queries';

export const metadata = {
  title: 'Pages — AMSIO CMS',
};

/** Fetch the last-edited timestamp across all namespaces for a set of namespaces. */
async function fetchLastEditedMap(
  namespaces: string[],
): Promise<Record<string, string | null>> {
  if (namespaces.length === 0) return {};
  try {
    const strings = await fetchTranslationStrings({ limit: 500 });
    const map: Record<string, string | null> = {};
    for (const ns of namespaces) {
      const relevant = strings.filter((s) => s.namespace === ns);
      if (relevant.length === 0) {
        map[ns] = null;
        continue;
      }
      const latest = relevant.reduce((a, b) =>
        new Date(a.updated_at) > new Date(b.updated_at) ? a : b,
      );
      map[ns] = latest.updated_at;
    }
    return map;
  } catch {
    return {};
  }
}

function formatRelative(isoString: string | null): string {
  if (!isoString) return 'Never edited';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default async function CmsPagesListPage() {
  // Collect all unique namespaces across all pages for a single fetch
  const allNamespaces = [
    ...new Set(pageManifests.flatMap((p) => p.textSections.map((s) => s.namespace))),
  ];
  const lastEditedMap = await fetchLastEditedMap(allNamespaces);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <p className="text-sm text-gray-500 mt-1">
          Edit text content for each marketing page. Changes auto-save; click{' '}
          <strong>Publish</strong> inside a page to flush the cache and make edits live.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pageManifests.map((page) => {
          // Find the most recent edit across this page's namespaces
          const pageTimes = page.textSections
            .map((s) => lastEditedMap[s.namespace])
            .filter((t): t is string => t !== null && t !== undefined);
          const lastEdited =
            pageTimes.length > 0
              ? pageTimes.reduce((a, b) => (new Date(a) > new Date(b) ? a : b))
              : null;

          return (
            <a
              key={page.pageId}
              href={`/cms/pages/${page.pageId}`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-navy/40 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-navy transition-colors truncate">
                    {page.label}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">{page.url}</p>
                </div>
                <span className="text-gray-300 group-hover:text-navy transition-colors mt-0.5">
                  →
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {page.textSections.length} section{page.textSections.length !== 1 ? 's' : ''}
                </span>
                {page.collections.length > 0 && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {page.collections.length} collection{page.collections.length !== 1 ? 's' : ''}
                  </span>
                )}
                {page.media.length > 0 && (
                  <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                    media
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-400">{formatRelative(lastEdited)}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
