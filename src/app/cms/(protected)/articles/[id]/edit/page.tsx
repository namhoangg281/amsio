// /cms/articles/[id]/edit — edit existing article (Server Component)

import { notFound } from 'next/navigation';
import { fetchArticleById } from '@/lib/cms/queries';
import ArticleEditor from '@/components/cms/ArticleEditor';

export const metadata = {
  title: 'Edit Article — AMSIO CMS',
};

type PageProps = { params: Promise<{ id: string }> };

export default async function CmsEditArticlePage({ params }: PageProps) {
  const { id } = await params;
  const article = await fetchArticleById(id).catch(() => null);

  if (!article) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Article</h1>
      <ArticleEditor article={article} />
    </div>
  );
}
