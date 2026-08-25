'use client';

// Cover picker for the article editor. Uploading from inside the form spares staff
// the trip to /cms/media to upload, copy a URL and paste it back — the URL is filled
// in for them. Pasting a URL by hand still works for images hosted elsewhere.

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useI18n } from '@/lib/i18n/context';
import type { MediaAsset } from '@/lib/cms/types';

interface CoverImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

// Mirrors ALLOWED_MIME_TYPES and MAX_SIZE_BYTES in app/api/v1/cms/media/route.ts.
// Checking here too turns a bare server rejection into a message staff can act on.
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

export default function CoverImageField({ label, value, onChange }: CoverImageFieldProps) {
  const { t } = useI18n();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(t.cms.coverErrType);
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(t.cms.coverErrSize);
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.set('file', file);
        formData.set('usage_tag', 'article_cover');

        const res = await fetch('/api/v1/cms/media', { method: 'POST', body: formData });
        const json = (await res.json()) as { data?: MediaAsset; message?: string };
        if (!res.ok || !json.data) {
          setError(json.message ?? `${t.cms.coverErrUpload} (HTTP ${res.status})`);
          return;
        }
        onChange(`${supabaseUrl}/storage/v1/object/public/cms-assets/${json.data.storage_path}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : t.cms.coverErrUpload);
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = '';
      }
    },
    [onChange, supabaseUrl, t],
  );

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </label>

      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/90 disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? t.cms.coverUploading : t.cms.coverUpload}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 text-sm hover:border-red-300 hover:text-red-600"
            title={t.cms.coverRemove}
          >
            ✕
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      <p className="mt-1 text-xs text-gray-400">
        {t.cms.coverHint}
      </p>

      {error && (
        <p className="mt-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {value && (
        <div className="relative mt-3 w-full max-w-sm aspect-[16/9] rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <Image src={value} alt="" fill sizes="384px" className="object-cover" />
        </div>
      )}
    </div>
  );
}
