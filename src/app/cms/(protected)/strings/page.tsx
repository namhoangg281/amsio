// /cms/strings — i18n translation strings editor (Server Component, auth from layout)
// W-095: DB-first i18n management UI.
// The public site uses TS locale files as fallback; strings added here override them
// for Server Components that call resolveServerStrings() from lib/cms/i18n-server.ts.

import { fetchTranslationStrings } from '@/lib/cms/queries';
import StringsEditor from '@/components/cms/StringsEditor';
import SeedStringsButton from '@/components/cms/SeedStringsButton';

export const metadata = {
  title: 'Translation Strings — AMSIO CMS',
};

interface PageProps {
  searchParams: Promise<{ namespace?: string; key?: string }>;
}

export default async function CmsStringsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const strings = await fetchTranslationStrings({
    namespace: params.namespace,
    key: params.key,
    limit: 200,
  }).catch(() => []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Translation Strings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Every string here overrides the public site on save — no redeploy needed. The built-in
          locale files stay underneath as a compile-time floor, so a missing key can never render
          blank.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Use <span className="font-mono text-orange">namespace=&quot;seo&quot;</span> for per-page
          SEO metadata. Key convention:{' '}
          <span className="font-mono">page.&lt;slug&gt;.title</span>,{' '}
          <span className="font-mono">page.&lt;slug&gt;.description</span>,{' '}
          <span className="font-mono">page.&lt;slug&gt;.og_title</span>.
        </p>
      </div>

      <SeedStringsButton />

      {/* Namespace quick-filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'ui', 'nav', 'seo', 'email'].map((ns) => (
          <a
            key={ns || 'all'}
            href={ns ? `/cms/strings?namespace=${ns}` : '/cms/strings'}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              (params.namespace ?? '') === ns
                ? 'border-navy bg-navy text-white'
                : 'border-gray-200 text-gray-600 hover:border-navy/40'
            }`}
          >
            {ns || 'All namespaces'}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <StringsEditor initialStrings={strings} />
      </div>
    </div>
  );
}
