// /cms/articles — article list page (Server Component, auth inherited from layout)

import Link from 'next/link';
import { fetchAllArticles } from '@/lib/cms/queries';
import ArticleList from '@/components/cms/ArticleList';

export const metadata = {
  title: 'Articles — AMSIO CMS',
};

export default async function CmsArticlesPage() {
  // Auth is enforced by app/cms/layout.tsx (redirect to login if not marketing_staff).
  // This page is only reached if the layout allowed the request through.
  let articles = await fetchAllArticles({ limit: 100 }).catch(() => []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <Link
          href="/cms/articles/new"
          className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          + New Article
        </Link>
      </div>
      <ArticleList articles={articles} />
    </div>
  );
}
