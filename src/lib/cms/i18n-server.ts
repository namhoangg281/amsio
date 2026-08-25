// W-095: Server-side DB-first i18n helper.
// Design choice (SSR-ONLY approach):
//
//   The existing useI18n() client context stays pure TS-file-driven with ZERO change.
//   This file is for SERVER COMPONENTS that want DB-managed strings with a safe
//   TS-file fallback. Client components continue using useI18n() from context.tsx.
//
// Rationale:
//   - The DB is empty at W-095 ship time. Fallback must always work.
//   - Modifying the client context to fetch DB async risks flash-of-untranslated-content
//     and adds hydration complexity for no immediate gain.
//   - Owner can revisit full client hydration once DB has real content (write a
//     task in queue.md at that time).
//
// Usage (Server Component):
//   const strings = await resolveServerStrings('en', 'ui');
//   const label = strings.get('nav.home') ?? t.nav.home;
//
// NOTE: this module imports 'server-only' to prevent accidental client bundle inclusion.

import 'server-only';

import type { ArticleLocale } from './types';
import { fetchTranslationMap } from './queries';

/**
 * Returns a DB-first translation map for a locale + namespace.
 * Keys are dot-joined: `${namespace}.${key}` → value.
 * Falls back to empty map on any DB error (caller provides TS fallback).
 *
 * @param locale  - One of 'en' | 'vi' | 'zh' | 'fr' | 'ar'
 * @param namespace - Optional namespace filter (e.g. 'seo', 'ui', 'nav')
 */
export async function resolveServerStrings(
  locale: ArticleLocale,
  namespace?: string,
): Promise<Map<string, string>> {
  try {
    const map = await fetchTranslationMap(locale, namespace);
    return new Map(Object.entries(map));
  } catch (err) {
    // Non-fatal: fallback to empty map; caller uses TS file values. Logged because
    // the fallback is silent on screen — a config error looks like missing content.
    console.error(
      `[cms/resolveServerStrings] ${locale}/${namespace ?? '*'} failed, using fallbacks:`,
      err instanceof Error ? err.message : String(err),
    );
    return new Map();
  }
}

/**
 * Resolve a single translation string from the DB, with a TS-file fallback.
 * Fetches the full namespace map once — prefer resolveServerStrings() when
 * you need multiple strings to avoid N+1 fetches.
 */
export async function resolveString(
  locale: ArticleLocale,
  namespace: string,
  key: string,
  fallback: string,
): Promise<string> {
  try {
    const map = await fetchTranslationMap(locale, namespace);
    return map[`${namespace}.${key}`] ?? fallback;
  } catch {
    return fallback;
  }
}
