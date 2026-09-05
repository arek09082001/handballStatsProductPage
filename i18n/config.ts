/**
 * The languages the product site speaks.
 *
 * One list, and everything derives from it: the request config, the client
 * locale provider, the language switcher. The switcher used to carry its own
 * ideas about the set — a flag code per locale and a hand-written aria-label
 * per locale — which worked for two and would have needed a new pair of
 * strings for every language after that.
 */
export const APP_LOCALES = ['de', 'en', 'es', 'fr', 'pl'] as const;

export type AppLocale = (typeof APP_LOCALES)[number];

export const APP_LOCALE_LANGUAGE_TAGS: Record<AppLocale, string> = {
  de: 'de-DE',
  en: 'en-GB',
  es: 'es-ES',
  fr: 'fr-FR',
  pl: 'pl-PL',
};

/**
 * Each language named in itself.
 *
 * Endonyms, not translations, and no flags: the person who needs the switcher
 * is the one who cannot read the language currently on screen — "Polski" helps
 * her, "Polnisch" does not. Flags would answer the wrong question anyway
 * (Spanish is not Spain, and English was flying a British flag for readers
 * anywhere but Britain).
 */
export const APP_LOCALE_ENDONYMS: Record<AppLocale, string> = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  pl: 'Polski',
};

/** German is the default: this is a German product for German clubs. */
export const DEFAULT_LOCALE: AppLocale = 'de';

export const DEFAULT_HTML_LANG = APP_LOCALE_LANGUAGE_TAGS[DEFAULT_LOCALE];

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return APP_LOCALES.includes(value as AppLocale);
}

export function getHtmlLang(locale: AppLocale): string {
  return APP_LOCALE_LANGUAGE_TAGS[locale];
}

/**
 * Every language the site is available in, as BCP-47 tags, for structured data
 * (`inLanguage` on the WebSite and SoftwareApplication nodes).
 *
 * Derived rather than written out again: the JSON-LD used to name `de-DE` and
 * `en-GB` by hand in three files, so shipping a language meant remembering all
 * three. Note that this is not the same thing as `availableLanguage` on a
 * ContactPoint — that says which languages a human answers mail in, and
 * translating the interface does not change who reads the inbox.
 */
export const SITE_CONTENT_LANGUAGES: readonly string[] = APP_LOCALES.map(
  (locale) => APP_LOCALE_LANGUAGE_TAGS[locale],
);
