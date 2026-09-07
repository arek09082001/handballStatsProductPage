'use client';

import { useTranslations } from 'next-intl';
import type { BoardFaqItem } from '@/components/custom-ui/board-faq';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import FeatureIndexHeader from '../components/index-header';
import FeatureIndexGroups from '../components/index-groups';
import FeatureIndexInProgress from '../components/index-in-progress';

/**
 * The feature index, `/funktionen`.
 *
 * DIRECTION — "Die Trainertafel" (see DESIGN.md). Court hero → four alternating
 * paper bands, one per group → a court band for what is still being built →
 * paper FAQ → court CTA. The two dark bands bracket the list and carry the two
 * things that are not a feature card: the promise at the top and the state of
 * the workbench at the bottom.
 *
 * WHY THIS PAGE EXISTS. `/was-ist-statix` already lists every feature as a
 * ruled index — one line each, no pictures, no detail, and nowhere to go. That
 * is the right shape for a brand page and the wrong shape for the question a
 * coach actually arrives with, which is "kann das Trainingsbeteiligung, und wie
 * sieht das aus". This page is that answer: a card per feature, a page behind
 * each card, and its state on the card so nothing has to be discovered.
 *
 * Both lists are generated from the same catalogue module, so the brand page's
 * index and this one cannot drift apart.
 * @returns A JSX element composing the ordered sections of the feature index.
 */
export default function FeaturesIndexPage() {
  const t = useTranslations('featuresPage.index');

  return (
    <div className='flex w-full flex-col items-center bg-paper'>
      <FeatureIndexHeader />
      <FeatureIndexGroups />
      <FeatureIndexInProgress />
      <BoardFaq
        id='faq'
        kicker={t('faqKicker')}
        title={t('faqTitle')}
        items={t.raw('faq') as BoardFaqItem[]}
      />
      <BoardCta
        kicker={t('ctaKicker')}
        title={t('ctaTitle')}
        description={t('ctaDescription')}
        linkHref='/was-ist-statix'
        linkLabel={t('ctaLinkLabel')}
      />
    </div>
  );
}
