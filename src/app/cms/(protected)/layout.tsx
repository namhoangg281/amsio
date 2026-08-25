// CMS layout — auth gate for all /cms/* routes.
// Zero @itran/* imports (split-ready seam).
// Uses lib/cms/auth.ts to check marketing_staff role server-side.

import { redirect } from 'next/navigation';
import { checkMarketingStaff } from '@/lib/cms/auth';
import { resolveServerStrings } from '@/lib/cms/i18n-server';

export const metadata = {
  title: 'CMS — AMSIO International',
};

/**
 * The CMS is an internal tool for the Vietnamese marketing team, so its chrome is
 * pinned to Vietnamese rather than following the public site's language switcher.
 * Wording comes from the `cms` namespace in the DB, which means staff can reword the
 * interface from inside /cms/strings without a deploy. English literals below are the
 * compile-time fallback for when the DB is unreachable.
 */
const CMS_UI_LOCALE = 'vi';

interface NavItem {
  href: string;
  labelKey: string;
  labelFallback: string;
  hintKey: string;
  hintFallback: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/cms/pages',
    labelKey: 'cms.nav.pages',
    labelFallback: 'Pages',
    hintKey: 'cms.nav.pages.hint',
    hintFallback: 'Edit the text shown on each page of the website.',
  },
  {
    href: '/cms/articles',
    labelKey: 'cms.nav.articles',
    labelFallback: 'Articles',
    hintKey: 'cms.nav.articles.hint',
    hintFallback: 'Write, edit and publish news and press releases.',
  },
  {
    href: '/cms/collections',
    labelKey: 'cms.nav.collections',
    labelFallback: 'Collections',
    hintKey: 'cms.nav.collections.hint',
    hintFallback: 'Repeating blocks on pages: team, partners, mission blocks, olympiad intro.',
  },
  {
    href: '/cms/strings',
    labelKey: 'cms.nav.strings',
    labelFallback: 'Strings',
    hintKey: 'cms.nav.strings.hint',
    hintFallback: 'Every piece of text on the site, in all 5 languages.',
  },
  {
    href: '/cms/media',
    labelKey: 'cms.nav.media',
    labelFallback: 'Media',
    hintKey: 'cms.nav.media.hint',
    hintFallback: 'Image library for articles, page covers and the press kit.',
  },
];

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const identity = await checkMarketingStaff();

  if (!identity) {
    // Not authenticated or missing role — redirect to portal login
    redirect('/cms/login?redirect=/cms');
  }

  const ui = await resolveServerStrings(CMS_UI_LOCALE, 'cms');
  const s = (key: string, fallback: string) => ui.get(key) ?? fallback;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-navy">AMSIO CMS</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            {s('cms.badge.role', 'marketing staff')}
          </span>
        </div>
        <nav className="flex items-end gap-5 text-sm flex-wrap">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              title={s(item.hintKey, item.hintFallback)}
              className="group flex flex-col max-w-[190px] text-gray-600 hover:text-navy transition-colors"
            >
              <span className="font-medium">{s(item.labelKey, item.labelFallback)}</span>
              <span className="text-[11px] leading-tight text-gray-400 group-hover:text-navy/60 line-clamp-2">
                {s(item.hintKey, item.hintFallback)}
              </span>
            </a>
          ))}
          <span className="text-gray-200 self-center">|</span>
          <a
            href="/news"
            title={s('cms.link.news.hint', 'Open the public news page to see the result.')}
            className="text-gray-400 hover:text-navy transition-colors text-xs self-center"
          >
            ↗ /news
          </a>
          <a
            href="/press"
            title={s('cms.link.press.hint', 'Open the public press page to see the result.')}
            className="text-gray-400 hover:text-navy transition-colors text-xs self-center"
          >
            ↗ /press
          </a>
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
