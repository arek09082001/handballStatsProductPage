'use client';

import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';

/**
 * Court hero for `/handball-statistik-app-kostenlos`. The lede answers the
 * search query in its first sentence ("Ja – Statix …") and stays under 60
 * words, so it can be lifted as a featured snippet or by an answer engine.
 * @returns A JSX element rendering the hero on the court ground.
 */
export default function FreeHeader() {
  const t = useTranslations('freePage.hero');
  const tCommon = useTranslations('common');
  const trust = t.raw('trust') as string[];

  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.26}
        aria-hidden
        className='pointer-events-none absolute -left-[20%] top-1/2 h-[92%] w-auto -translate-y-1/2 text-chalk/[0.12] sm:-left-[12%] lg:-left-[6%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-4xl px-6 pb-16 pt-28 text-center sm:px-10 lg:pb-24 lg:pt-32'>
        <BoardKicker color='chalk' className='justify-center'>
          {t('kicker')}
        </BoardKicker>

        <h1 className='mt-5 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3.2rem]'>
          {t('titleLead')}{' '}
          <span className='relative inline-block text-primary'>
            {t('titleHighlight')}
            <MarkerUnderline color='marker' />
          </span>
          {t('titleTail') ? ` ${t('titleTail')}` : null}
        </h1>

        <p className='mx-auto mt-6 max-w-[62ch] text-base leading-7 text-chalk/80 sm:text-lg sm:leading-8'>
          {t('lede')}
        </p>

        <div className='mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <HeroActionButton
            variant='primary'
            icon={<UserPlus className='size-4' />}
            href={CLUB_CONFIG.website.appUrl}
            target='_blank'
            rel='noopener noreferrer'>
            {tCommon('ctaRegister')}
          </HeroActionButton>
          <HeroActionButton
            variant='secondary'
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'>
            {tCommon('ctaDemoNoAccount')}
          </HeroActionButton>
        </div>

        <div className='mt-7 flex flex-wrap items-center justify-center gap-2'>
          {trust.map((item) => (
            <HeroTrustBadge key={item} label={item} />
          ))}
        </div>
      </div>
    </header>
  );
}
