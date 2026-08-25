// /cms/articles/new — create new article

import ArticleEditor from '@/components/cms/ArticleEditor';

export const metadata = {
  title: 'New Article — AMSIO CMS',
};

export default function CmsNewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Article</h1>
      <ArticleEditor article={null} />
    </div>
  );
}
