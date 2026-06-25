export const APP_LOCALES = ['de', 'en'] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const APP_LOCALE_LANGUAGE_TAGS: Record<AppLocale, string> = {
  de: 'de-DE',
  en: 'en-GB',
};

export const DEFAULT_LOCALE: AppLocale = 'de';

export const DEFAULT_HTML_LANG = APP_LOCALE_LANGUAGE_TAGS[DEFAULT_LOCALE];

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return APP_LOCALES.includes(value as AppLocale);
}

export function getHtmlLang(locale: AppLocale): string {
  return APP_LOCALE_LANGUAGE_TAGS[locale];
}