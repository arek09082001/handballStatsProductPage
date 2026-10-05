'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { APP_LOCALE_LANGUAGE_TAGS, isAppLocale, DEFAULT_LOCALE } from '@/i18n/config';

export interface PriceFormat {
  /** Cents → "79 €" / "9,90 €" (or "€79" / "€9.90"), no decimals when whole. */
  euro: (cents: number) => string;
  /** ISO instant → "1. Juli 2027", read in German time. */
  date: (iso: string) => string;
  /** The day BEFORE an exclusive ISO bound → "30. Juni 2027". */
  dayBefore: (iso: string) => string;
}

/**
 * Formats the app's cents and dates in the reader's language.
 *
 * Computed with `Intl` from the active locale, which is `de` on the server and
 * on the first client render alike, so the server markup and the hydrated
 * markup agree; a language switch then re-renders with the new locale.
 * Dates are read in Europe/Berlin because the season is a German one: the
 * season starts at 00:00 on 1 July German time, which is 30 June in UTC.
 */
export function usePriceFormat(): PriceFormat {
  const locale = useLocale();

  return useMemo(() => {
    const tag = APP_LOCALE_LANGUAGE_TAGS[isAppLocale(locale) ? locale : DEFAULT_LOCALE];
    const whole = new Intl.NumberFormat(tag, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const fractional = new Intl.NumberFormat(tag, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const dateFormat = new Intl.DateTimeFormat(tag, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Berlin',
    });

    return {
      euro: (cents) =>
        cents % 100 === 0 ? whole.format(cents / 100) : fractional.format(cents / 100),
      date: (iso) => dateFormat.format(new Date(iso)),
      dayBefore: (iso) => dateFormat.format(new Date(Date.parse(iso) - 1)),
    };
  }, [locale]);
}
