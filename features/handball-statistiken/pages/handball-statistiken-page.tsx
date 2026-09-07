'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import StatsHeader from '../components/stats-header';
import StatsCatalog from '../components/stats-catalog';
import StatsFormulas from '../components/stats-formulas';
import StatsWays from '../components/stats-ways';
import StatsHowTo from '../components/stats-howto';
import StatsGuides from '../components/stats-guides';

/**
 * Pillar page `/handball-statistiken` — the topic hub for the head term. It
 * answers the informational question first (which statistics exist, how they
 * are calculated, what a normal value is) and only then shows how Statix
 * records them; the product pages `/`, `/handball-statistik-app-kostenlos` and
 * `/preise` keep the commercial intents, so the two do not compete.
 * @returns A JSX element composing the ordered pillar-page sections.
 */
export default function HandballStatistikenPage() {
  const t = useTranslations('statsPage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <StatsHeader />
      <StatsCatalog />
      <StatsFormulas />
      <StatsWays />
      <StatsHowTo />
      <StatsGuides />
      <BoardFaq
        id='faq'
        kicker={t('faq.kicker')}
        title={t('faq.title')}
        description={t('faq.description')}
        items={t.raw('faq.items') as { question: string; answer: string }[]}
      />
      <BoardCta
        kicker={t('cta.kicker')}
        title={t('cta.title')}
        description={t('cta.description')}
        linkHref='/handball-statistik-app-kostenlos'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
