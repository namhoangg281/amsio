'use client';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LOCALES } from '@/lib/i18n/types';
import { ChevronDown, Globe } from 'lucide-react';
import Flag from '@/components/ui/Flag';

interface LanguageSwitcherProps {
  /** "dark" = white text (for dark backgrounds: navbar, admin header)
   *  "light" = navy text (for light backgrounds: portal header) */
  variant?: 'dark' | 'light';
}

export default function LanguageSwitcher({ variant = 'dark' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LOCALES.find(l => l.code === locale) || LOCALES[0];

  const btnClass = variant === 'light'
    ? 'text-navy/80 hover:text-navy border-border/40 hover:border-navy/30 hover:bg-navy/5'
    : 'text-white/90 hover:text-white border-white/20 hover:border-white/40 hover:bg-white/10';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Switch language"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors rounded-lg border ${btnClass}`}
      >
        <Globe className="w-3.5 h-3.5 shrink-0" />
        <Flag code={current.flagCode} className="w-5 rounded-[2px]" />
        <span className="hidden sm:inline font-semibold tracking-wide">{current.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Language / 语言</p>
            </div>
            {LOCALES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${
                  locale === l.code
                    ? 'bg-navy/5 text-navy'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                dir={l.rtl ? 'rtl' : 'ltr'}
              >
                <Flag code={l.flagCode} className="w-6 rounded-[2px]" />
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm ${locale === l.code ? 'text-navy' : 'text-slate-800'}`}>
                    {l.nativeName}
                  </div>
                  <div className="text-[11px] text-slate-400">{l.name}</div>
                </div>
                {locale === l.code && (
                  <span className="text-orange font-bold text-base leading-none">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
