'use client';

import type { ArticleLocale } from '@/lib/cms/types';

const LOCALES: { code: ArticleLocale; label: string; required?: boolean }[] = [
  { code: 'en', label: 'EN', required: true },
  { code: 'vi', label: 'VI' },
  { code: 'zh', label: 'ZH' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
];

interface LocaleTabBarProps {
  activeLocale: ArticleLocale;
  onLocaleChange: (locale: ArticleLocale) => void;
}

export default function LocaleTabBar({ activeLocale, onLocaleChange }: LocaleTabBarProps) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-4">
      {LOCALES.map((locale) => (
        <button
          key={locale.code}
          type="button"
          onClick={() => onLocaleChange(locale.code)}
          className={`px-4 py-2 text-sm font-semibold rounded-t border-b-2 transition-colors ${
            activeLocale === locale.code
              ? 'border-navy text-navy bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {locale.label}
          {locale.required && (
            <span className="ml-1 text-red-500 text-xs" aria-label="required">
              *
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
