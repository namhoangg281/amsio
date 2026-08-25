'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Locale } from './types';
import { DEFAULT_LOCALE } from './types';
import en from './locales/en';
import zh from './locales/zh';
import fr from './locales/fr';
import ar from './locales/ar';
import vi from './locales/vi';
import { applyDbOverrides } from './db-override';

const tsTranslations = { en, zh, fr, ar, vi } as const;

type TranslationKeys = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: en,
  isRTL: false,
});

interface I18nProviderProps {
  children: React.ReactNode;
  /**
   * W-097: DB translation overrides pre-fetched server-side at layout render.
   * Format: { [locale]: { "namespace.dotkey": "value" } }
   * When empty or undefined, falls back to TypeScript locale files (zero regression).
   * All 5 locales are hydrated once at layout time — locale switch does NOT re-fetch.
   */
  dbStrings?: Partial<Record<Locale, Record<string, string>>>;
}

export function I18nProvider({ children, dbStrings }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Only restore an explicitly saved preference — never auto-detect browser language.
    // Default is always English so pages are consistent until the user actively switches.
    const saved = localStorage.getItem('amsio_locale') as Locale;
    if (saved && tsTranslations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('amsio_locale', newLocale);
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const isRTL = locale === 'ar';

  // Merge DB overrides onto the TS fallback for the current locale.
  // DB values win; any missing key retains its TS value.
  // applyDbOverrides() is try-catch internally — never throws.
  const t = useMemo<TranslationKeys>(() => {
    const base = tsTranslations[locale] ?? en;
    const flat = dbStrings?.[locale];
    if (!flat || Object.keys(flat).length === 0) return base;
    return applyDbOverrides(base, flat);
  }, [locale, dbStrings]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
