export type Locale = 'en' | 'zh' | 'fr' | 'ar' | 'vi';

export const LOCALES: { code: Locale; name: string; nativeName: string; flag: string; flagCode: string; rtl?: boolean }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', flagCode: 'gb' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', flagCode: 'cn' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', flagCode: 'fr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', flagCode: 'sa', rtl: true },
  // 'vi' (Tiếng Việt) intentionally hidden from the public switcher — translations kept for fallback.
];

export const DEFAULT_LOCALE: Locale = 'en';
