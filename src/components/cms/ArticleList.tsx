'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import type { Article } from '@/lib/cms/types';
import PublishToggle from './PublishToggle';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles: initialArticles }: ArticleListProps) {
  const { t } = useI18n();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm(t.cms.deleteConfirm)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/cms/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">{t.cms.noArticles}</p>
        <p className="text-sm mt-1">{t.cms.createFirst}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => {
        const title = article.translations.en.title || `(${article.slug})`;
        const updatedAt = article.updated_at
          ? new Date(article.updated_at).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—';

        return (
          <div
            key={article.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-gray-300 transition-colors"
          >
            {/* Category badge */}
            <span
              className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                article.category === 'news'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-purple-50 text-purple-700'
              }`}
            >
              {article.category === 'news' ? t.cms.news : t.cms.press}
            </span>

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {t.cms.lastUpdated}: {updatedAt}
                {article.featured && (
                  <span className="ml-2 text-amber-600 font-medium">★ {t.cms.featured}</span>
                )}
              </p>
            </div>

            {/* Publish toggle */}
            <PublishToggle
              articleId={article.id}
              currentStatus={article.status}
              onStatusChange={(newStatus) => {
                setArticles((prev) =>
                  prev.map((a) => (a.id === article.id ? { ...a, status: newStatus } : a)),
                );
              }}
            />

            {/* Edit link */}
            <Link
              href={`/cms/articles/${article.id}/edit`}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition-colors"
            >
              {t.cms.edit}
            </Link>

            {/* Delete */}
            <button
              type="button"
              disabled={deletingId === article.id}
              onClick={() => handleDelete(article.id)}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {deletingId === article.id ? t.cms.deleting : t.cms.delete}
            </button>
          </div>
        );
      })}
    </div>
  );
}
