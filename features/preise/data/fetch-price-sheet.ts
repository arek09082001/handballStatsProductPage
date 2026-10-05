import { CLUB_CONFIG } from '@/lib/club-config';
import {
  FALLBACK_PRICE_SHEET,
  parsePriceSheet,
  type PriceSheet,
} from './price-sheet';

/** The app caches the list for an hour in its CDN; this page follows suit. */
export const PRICE_SHEET_REVALIDATE_SECONDS = 3600;

/**
 * Reads the app's price list on the server, for `/preise`.
 *
 * Never throws: a timeout, a non-2xx answer or an unexpected shape all end in
 * the static fallback, so the page renders with the season and monthly prices
 * and simply without the "today" amount. Five seconds is generous for one
 * small JSON document and short enough that an unreachable app does not hold
 * a build hostage.
 */
export async function fetchPriceSheet(): Promise<PriceSheet> {
  try {
    const response = await fetch(CLUB_CONFIG.website.pricesApiUrl, {
      headers: { accept: 'application/json' },
      next: { revalidate: PRICE_SHEET_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return FALLBACK_PRICE_SHEET;
    return parsePriceSheet(await response.json()) ?? FALLBACK_PRICE_SHEET;
  } catch {
    return FALLBACK_PRICE_SHEET;
  }
}
