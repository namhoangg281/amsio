'use client';

import { useState, useRef } from 'react';
import type { MediaAsset, MediaUsageTag } from '@/lib/cms/types';

const USAGE_TAGS: { value: MediaUsageTag; label: string }[] = [
  { value: 'article_cover', label: 'Article Cover' },
  { value: 'press_kit', label: 'Press Kit' },
  { value: 'team_photo', label: 'Team Photo' },
  { value: 'partner_logo', label: 'Partner Logo' },
  { value: 'og_image', label: 'OG Image' },
];

function formatBytes(bytes: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface MediaManagerProps {
  initialAssets: MediaAsset[];
  supabaseUrl: string;
}

export default function MediaManager({ initialAssets, supabaseUrl }: MediaManagerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>(initialAssets);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const altRef = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLSelectElement>(null);

  function buildPublicUrl(storagePath: string): string {
    return `${supabaseUrl}/storage/v1/object/public/cms-assets/${storagePath}`;
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.set('file', file);
    if (altRef.current?.value) formData.set('alt_text', altRef.current.value);
    if (tagRef.current?.value) formData.set('usage_tag', tagRef.current.value);

    try {
      const res = await fetch('/api/v1/cms/media', { method: 'POST', body: formData });
      if (!res.ok) {
        const json = (await res.json()) as { message?: string };
        throw new Error(json.message ?? 'Upload failed');
      }
      const json = (await res.json()) as { data: MediaAsset };
      setAssets((prev) => [json.data, ...prev]);
      if (fileRef.current) fileRef.current.value = '';
      if (altRef.current) altRef.current.value = '';
      if (tagRef.current) tagRef.current.value = '';
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, filename: string) {
    if (!window.confirm(`Soft-delete "${filename}"? The file stays in Storage.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/v1/cms/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // Non-fatal — no global state to update
    } finally {
      setDeletingId(null);
    }
  }

  async function copyUrl(asset: MediaAsset) {
    const url = buildPublicUrl(asset.storage_path);
    await navigator.clipboard.writeText(url).catch(() => undefined);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-base font-bold text-gray-900">Upload New File</h2>
        <p className="text-xs text-gray-500">PNG, JPEG, WebP only — max 5 MB.</p>

        {uploadError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            {uploadError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-gray-600 mb-1">File *</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="block w-full text-sm text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-navy file:text-white file:text-xs file:font-semibold file:cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Alt Text</label>
            <input
              ref={altRef}
              type="text"
              placeholder="Describe the image…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Usage Tag</label>
            <select
              ref={tagRef}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 bg-white"
            >
              <option value="">— untagged —</option>
              {USAGE_TAGS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </div>
      </div>

      {/* Asset list */}
      {assets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="font-medium">No media assets yet.</p>
          <p className="text-sm mt-1">Upload a file above to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors"
            >
              {/* Preview */}
              <div className="bg-gray-100 h-32 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buildPublicUrl(asset.storage_path)}
                  alt={asset.alt_text ?? asset.filename}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-900 truncate" title={asset.filename}>
                  {asset.filename}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {asset.usage_tag && (
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-mono">
                      {asset.usage_tag}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{formatBytes(asset.size_bytes)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset)}
                    className="flex-1 px-2 py-1 rounded border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {copiedId === asset.id ? 'Copied!' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id, asset.filename)}
                    disabled={deletingId === asset.id}
                    className="px-2 py-1 rounded border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Del
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
