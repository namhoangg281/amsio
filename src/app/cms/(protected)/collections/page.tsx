// /cms/collections — collection item list (Server Component, auth from layout)

import { type NextRequest } from 'next/server';
import Link from 'next/link';
import { fetchAdminCollectionItems } from '@/lib/cms/queries';
import CollectionList from '@/components/cms/CollectionList';
import type { CollectionKey } from '@/lib/cms/types';

export const metadata = {
  title: 'Collections — AMSIO CMS',
};

const COLLECTION_KEYS: { key: CollectionKey; label: string; description: string }[] = [
  { key: 'team', label: 'Team', description: 'Secretariat roles (team page)' },
  { key: 'partners', label: 'Partners', description: 'Academic & strategic partners (home + team page)' },
  { key: 'mission_blocks', label: 'Mission Blocks', description: 'Four Pillars section (mission page)' },
  { key: 'olympiad_intro', label: 'Olympiad Intro', description: 'Olympiad intro blocks' },
];

interface PageProps {
  searchParams: Promise<{ collection_key?: string }>;
}

export default async function CmsCollectionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawKey = params.collection_key;
  const activeKey: CollectionKey | undefined = COLLECTION_KEYS.some((k) => k.key === rawKey)
    ? (rawKey as CollectionKey)
    : undefined;

  const items = activeKey
    ? await fetchAdminCollectionItems(activeKey, true).catch(() => [])
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        {activeKey && (
          <Link
            href={`/cms/collections/new?collection_key=${activeKey}`}
            className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            + New Item
          </Link>
        )}
      </div>

      {/* Collection key selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {COLLECTION_KEYS.map((ck) => (
          <Link
            key={ck.key}
            href={`/cms/collections?collection_key=${ck.key}`}
            className={`rounded-xl border px-4 py-3 text-center transition-colors ${
              activeKey === ck.key
                ? 'border-navy bg-navy text-white'
                : 'border-gray-200 bg-white text-gray-700 hover:border-navy/40'
            }`}
          >
            <p className="font-bold text-sm">{ck.label}</p>
            <p
              className={`text-xs mt-1 ${
                activeKey === ck.key ? 'text-white/70' : 'text-gray-400'
              }`}
            >
              {ck.description}
            </p>
          </Link>
        ))}
      </div>

      {activeKey ? (
        <CollectionList collectionKey={activeKey} initialItems={items} />
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">Select a collection above to manage its items.</p>
        </div>
      )}
    </div>
  );
}
