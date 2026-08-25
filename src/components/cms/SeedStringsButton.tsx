'use client';

// Imports every key from the TypeScript locale files into cms.translation_strings
// so the whole marketing site becomes editable here. Idempotent — keys that already
// exist are skipped, so an edited string is never overwritten by a re-import.

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type SeedResult = { inserted: number; skipped: number; message: string };

export default function SeedStringsButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SeedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSeed = useCallback(async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/v1/cms/admin/seed-strings', { method: 'POST' });
      const body = await res.json();
      if (!res.ok) {
        setError(body?.message ?? `Import failed (HTTP ${res.status})`);
        return;
      }
      setResult(body as SeedResult);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setBusy(false);
    }
  }, [router]);

  return (
    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-900">Import site content</h2>
          <p className="text-sm text-gray-500 mt-1">
            Pulls every string from the built-in locale files into the CMS across all 5 locales.
            Existing keys are left untouched, so your edits survive a re-import.
          </p>
        </div>
        <button
          type="button"
          onClick={runSeed}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-navy text-white text-sm font-semibold hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {busy ? 'Importing…' : 'Import from source files'}
        </button>
      </div>

      {result && (
        <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {result.message}
        </p>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
