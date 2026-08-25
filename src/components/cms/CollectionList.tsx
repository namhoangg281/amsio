'use client';

import { useState } from 'react';
import type { CollectionItem, CollectionKey } from '@/lib/cms/types';

interface CollectionListProps {
  collectionKey: CollectionKey;
  initialItems: CollectionItem[];
}

const LOCALE_LABELS = ['en', 'vi', 'zh', 'fr', 'ar'] as const;

function getDisplayName(item: CollectionItem): string {
  const en = item.translations.en;
  if (en?.name) return en.name;
  if (en?.title) return en.title;
  return `(item ${item.sort_order})`;
}

export default function CollectionList({ collectionKey, initialItems }: CollectionListProps) {
  const [items, setItems] = useState<CollectionItem[]>(initialItems);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleStatus(item: CollectionItem) {
    const newStatus = item.status === 'active' ? 'hidden' : 'active';
    setLoadingId(item.id);
    setError(null);
    try {
      const res = await fetch(`/api/v1/cms/collections/${item.id}/publish-hide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Request failed');
      const json = (await res.json()) as { data: CollectionItem };
      setItems((prev) => prev.map((i) => (i.id === item.id ? json.data : i)));
    } catch {
      setError('Failed to update status. Please try again.');
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteItem(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setLoadingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/v1/cms/collections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Request failed');
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError('Failed to delete item. Please try again.');
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="font-medium">No items in this collection.</p>
        <p className="text-sm mt-1">Use the form below to add the first item.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {items.map((item) => {
        const name = getDisplayName(item);
        const locales = LOCALE_LABELS.filter((l) => item.translations[l]);
        const isLoading = loadingId === item.id;

        return (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-gray-300 transition-colors"
          >
            {/* Sort order badge */}
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">
              {item.sort_order}
            </span>

            {/* Name + locales */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{name}</p>
              <div className="flex gap-1 mt-1">
                {locales.map((l) => (
                  <span key={l} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-mono">
                    {l}
                  </span>
                ))}
                {item.metadata.role && (
                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                    {item.metadata.role}
                  </span>
                )}
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                item.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {item.status}
            </span>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={`/cms/collections/${item.id}`}
                className="px-3 py-1.5 rounded-lg bg-navy text-white text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Edit
              </a>
              <button
                type="button"
                onClick={() => toggleStatus(item)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {item.status === 'active' ? 'Hide' : 'Show'}
              </button>
              <button
                type="button"
                onClick={() => deleteItem(item.id, name)}
                disabled={isLoading}
                className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
