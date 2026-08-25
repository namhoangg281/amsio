// /cms/media — media asset manager (Server Component, auth from layout)
// W-096: Upload images to cms-assets Storage bucket, manage metadata, copy public URL.
//
// SEO note: per-page SEO metadata (title/description/OG) is managed via
// translation_strings (namespace='seo'). Media SEO (alt text, caption) lives here.

import { fetchMediaAssets } from '@/lib/cms/queries';
import type { MediaUsageTag } from '@/lib/cms/types';
import MediaManager from '@/components/cms/MediaManager';

export const metadata = {
  title: 'Media — AMSIO CMS',
};

interface PageProps {
  searchParams: Promise<{ usage_tag?: string }>;
}

export default async function CmsMediaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const assets = await fetchMediaAssets({
    usage_tag: params.usage_tag as MediaUsageTag | undefined,
    limit: 100,
  }).catch(() => []);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Assets</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload PNG/JPG/WebP images (max 5 MB) to the <span className="font-mono">cms-assets</span> bucket.
          Copy the URL to use in article covers, collection metadata, or OG images.
        </p>
        <p className="text-sm text-orange mt-1 font-medium">
          Note: Public URL access requires the cms-assets bucket to be set to Public in the
          Supabase Dashboard (Storage &rarr; Policies). Otherwise images load only via signed URLs.
        </p>
      </div>

      {/* Usage tag filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { value: '', label: 'All' },
          { value: 'article_cover', label: 'Article Cover' },
          { value: 'press_kit', label: 'Press Kit' },
          { value: 'team_photo', label: 'Team Photo' },
          { value: 'partner_logo', label: 'Partner Logo' },
          { value: 'og_image', label: 'OG Image' },
        ].map((tag) => (
          <a
            key={tag.value || 'all'}
            href={tag.value ? `/cms/media?usage_tag=${tag.value}` : '/cms/media'}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              (params.usage_tag ?? '') === tag.value
                ? 'border-navy bg-navy text-white'
                : 'border-gray-200 text-gray-600 hover:border-navy/40'
            }`}
          >
            {tag.label}
          </a>
        ))}
      </div>

      <MediaManager initialAssets={assets} supabaseUrl={supabaseUrl} />
    </div>
  );
}
