// /cms/collections/[id] — collection item editor (Server Component, auth from layout)

import { notFound } from 'next/navigation';
import { fetchCollectionItemById } from '@/lib/cms/queries';
import CollectionEditor from '@/components/cms/CollectionEditor';

export const metadata = {
  title: 'Edit Collection Item — AMSIO CMS',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CmsCollectionItemEditPage({ params }: PageProps) {
  const { id } = await params;
  const item = await fetchCollectionItemById(id).catch(() => null);

  if (!item) notFound();

  const returnUrl = `/cms/collections?collection_key=${item.collection_key}`;

  return (
    <div>
      <div className="mb-6">
        <a
          href={returnUrl}
          className="text-sm text-gray-500 hover:text-navy transition-colors"
        >
          ← Back to {item.collection_key}
        </a>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">
          Edit Collection Item
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-mono text-orange">{item.collection_key}</span>
          {' · '}
          <span className="font-mono text-gray-400">{item.id}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CollectionEditor item={item} returnUrl={returnUrl} />
      </div>
    </div>
  );
}
