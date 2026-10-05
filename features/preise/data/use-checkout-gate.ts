'use client';

import { useEffect, useState } from 'react';
import type { PriceSheet } from './price-sheet';

/** `/preise?kasse=vorschau` makes the buy button clickable before the launch. */
export const CHECKOUT_PREVIEW_PARAM = 'kasse';
export const CHECKOUT_PREVIEW_VALUE = 'vorschau';

export interface CheckoutGate {
  /** The buy button leads to the checkout. */
  open: boolean;
  /** Open only because of the preview flag, before the launch. */
  preview: boolean;
}

/**
 * Whether the buy button is live.
 *
 * It opens by itself at the launch — the instant the app names as `launchAt`,
 * 1 January 2027 00:00 German time. The page is cached for an hour, so the
 * flag the app sent (`launched`) can be up to an hour behind; the browser
 * therefore also compares the clock against `launchAt`, and a visitor at
 * 00:05 on New Year's Day is not told to wait.
 *
 * Before the launch, `?kasse=vorschau` opens it anyway. That flag is purely
 * cosmetic: the app refuses a purchase from anybody who is not on its internal
 * preview list, so the worst a curious visitor reaches is a polite "not yet".
 *
 * Both checks read browser state (the clock, the address bar) and therefore
 * run after hydration: the server and the first client render agree on the
 * cached `launched` flag and nothing else.
 */
export function useCheckoutGate(sheet: PriceSheet): CheckoutGate {
  const [launchedNow, setLaunchedNow] = useState(sheet.launched);
  const [previewFlag, setPreviewFlag] = useState(false);

  useEffect(() => {
    const launchAt = Date.parse(sheet.launchAt);
    const params = new URLSearchParams(window.location.search);
    setPreviewFlag(params.get(CHECKOUT_PREVIEW_PARAM) === CHECKOUT_PREVIEW_VALUE);

    if (sheet.launched || Number.isNaN(launchAt)) {
      setLaunchedNow(sheet.launched);
      return;
    }
    const wait = launchAt - Date.now();
    if (wait <= 0) {
      setLaunchedNow(true);
      return;
    }
    // A visitor who leaves the page open over midnight on New Year's Eve gets
    // the button without a reload. setTimeout cannot wait longer than ~24.8
    // days, so anything further out is left to the next visit.
    if (wait < 2_000_000_000) {
      const timer = window.setTimeout(() => setLaunchedNow(true), wait);
      return () => window.clearTimeout(timer);
    }
  }, [sheet.launched, sheet.launchAt]);

  return {
    open: launchedNow || previewFlag,
    preview: previewFlag && !launchedNow,
  };
}
