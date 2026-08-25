'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n/context';
import type { ArticleStatus } from '@/lib/cms/types';

interface PublishToggleProps {
  articleId: string;
  currentStatus: ArticleStatus;
  onStatusChange?: (newStatus: ArticleStatus) => void;
}

export default function PublishToggle({ articleId, currentStatus, onStatusChange }: PublishToggleProps) {
  const { t } = useI18n();
  const [status, setStatus] = useState<ArticleStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublished = status === 'published';

  async function handleToggle() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/cms/articles/${articleId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !isPublished }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { message?: string };
        throw new Error(body.message ?? 'Failed to update publish status');
      }
      const newStatus: ArticleStatus = isPublished ? 'draft' : 'published';
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {isPublished ? t.cms.published : t.cms.draft}
      </span>
      <button
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60 ${
          isPublished
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-navy text-white hover:opacity-90'
        }`}
      >
        {loading
          ? t.cms.publishing
          : isPublished
            ? t.cms.unpublish
            : t.cms.publish}
      </button>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
