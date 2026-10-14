/**
 * The founder deadline as a bare constant — the instant before which an
 * account counts as a founder (1 Jan 2027, 00:00 Berlin).
 *
 * Its own module so the landing page's countdown can read it without pulling
 * `price-sheet.ts` and with it zod into the home page's client bundle. The
 * price sheet's static fallback uses the same constant; the live sheet comes
 * from the app and must agree with it.
 */
export const FOUNDER_REGISTERED_BEFORE = '2026-12-31T23:00:00.000Z';
