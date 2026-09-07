'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import TaktikboardHeader from '../components/taktikboard-header';
import TaktikboardHowto from '../components/taktikboard-howto';
import TaktikboardCourt from '../components/taktikboard-court';
import TaktikboardFormations from '../components/taktikboard-formations';
import TaktikboardLimits from '../components/taktikboard-limits';
import TaktikboardEmbed from '../components/taktikboard-embed';

/**
 * Tool page `/handball-taktikboard`. The board sits above the fold; everything
 * below it — the steps, the court measurements, the formations and the limits —
 * answers the same query for a visitor who never drags a magnet.
 * @returns A JSX element composing the ordered tactic-board sections.
 */
export default function HandballTaktikboardPage() {
  const t = useTranslations('boardPage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <TaktikboardHeader />
      <TaktikboardHowto />
      <TaktikboardCourt />
      <TaktikboardFormations />
      <TaktikboardLimits />
      <TaktikboardEmbed />
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
        linkHref='/wurfquote-rechner'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
