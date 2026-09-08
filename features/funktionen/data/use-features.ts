'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  FEATURE_RECORDS,
  copyBySlug,
  withCopy,
  type Feature,
  type FeatureCopy,
  type FeatureGroup,
  type FeatureGroupId,
  type FeatureStatus,
} from './features';

/** The whole catalogue in the reader's language, in catalogue order. */
export function useFeatures(): Feature[] {
  const t = useTranslations('featureCatalog');

  return useMemo(() => {
    const copy = copyBySlug(t.raw('items') as FeatureCopy[]);

    return FEATURE_RECORDS.flatMap((record) => {
      const entry = copy.get(record.slug);

      // A bundle that is missing an entry drops the card rather than printing
      // the slug at a reader; `scripts/merge-messages.js` keeps that from
      // happening in the first place.
      return entry ? [withCopy(record, entry)] : [];
    });
  }, [t]);
}

/** One feature in the reader's language, or `undefined` for an unknown slug. */
export function useFeature(slug: string): Feature | undefined {
  const features = useFeatures();

  return useMemo(
    () => features.find((feature) => feature.slug === slug),
    [features, slug],
  );
}

/** The features of one group, in catalogue order, in the reader's language. */
export function useFeaturesOfGroup(group: FeatureGroupId): Feature[] {
  const features = useFeatures();

  return useMemo(
    () => features.filter((feature) => feature.group === group),
    [features, group],
  );
}

/** The four group headings and their intros, in the reader's language. */
export function useFeatureGroups(): FeatureGroup[] {
  const t = useTranslations('featureCatalog');

  return useMemo(() => t.raw('groups') as FeatureGroup[], [t]);
}

/** Badge label and explanation per state, in the reader's language. */
export function useFeatureStatusCopy(): {
  label: Record<FeatureStatus, string>;
  hint: Record<FeatureStatus, string>;
} {
  const t = useTranslations('featureCatalog');

  return useMemo(
    () => ({
      label: t.raw('statusLabel') as Record<FeatureStatus, string>,
      hint: t.raw('statusHint') as Record<FeatureStatus, string>,
    }),
    [t],
  );
}

/** Related features of one entry, resolved and in the reader's language. */
export function useRelatedFeatures(feature: Feature): Feature[] {
  const features = useFeatures();

  return useMemo(
    () =>
      feature.related.flatMap((slug) => {
        const entry = features.find((candidate) => candidate.slug === slug);

        return entry ? [entry] : [];
      }),
    [features, feature.related],
  );
}
