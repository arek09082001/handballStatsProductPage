'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  PRICING_LABEL_KEYS,
  type PricingLabels,
} from './pricing-content';

/**
 * The four recurring labels of `/preise` in the reader's language, ready to be
 * handed to any `t(...)` call on the page as ICU arguments.
 *
 * Every band of this page names at least one of them, so without a shared
 * reader each component would look them up again and the argument object would
 * be rebuilt on every render of a page that re-renders on a billing switch.
 */
export function usePricingLabels(): PricingLabels {
  const t = useTranslations('pricingPage');

  return useMemo(
    () =>
      Object.fromEntries(
        PRICING_LABEL_KEYS.map((key) => [key, t(key)]),
      ) as PricingLabels,
    [t],
  );
}
