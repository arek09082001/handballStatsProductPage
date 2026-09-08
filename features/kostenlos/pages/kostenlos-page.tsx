'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import FreeHeader from '../components/free-header';
import FreeScope from '../components/free-scope';
import FreeDemo from '../components/free-demo';
import FreeWhy from '../components/free-why';
import FreeAlternatives from '../components/free-alternatives';

/**
 * Free-tier page `/handball-statistik-app-kostenlos`. Answers "gibt es eine
 * kostenlose Handball-Statistik-App?" in the hero, then the honest scope table,
 * the no-account demo, why a free version exists at all, and the other free
 * options. `/preise` answers the sibling question ("was kostet es") — the two
 * cross-link instead of repeating each other.
 * @returns A JSX element composing the ordered free-tier sections.
 */
export default function KostenlosPage() {
  const t = useTranslations('freePage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <FreeHeader />
      <FreeScope />
      <FreeDemo />
      <FreeWhy />
      <FreeAlternatives />
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
        linkHref='/preise'
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
