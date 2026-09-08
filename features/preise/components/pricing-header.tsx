'use client';

import { CalendarClock, UserPlus } from 'lucide-react';
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
import { usePricingLabels } from '../data/use-pricing-labels';

/**
 * Court-ground hero for `/preise`. The H1 carries the commercial query, and the
 * lede answers the two questions a coach arrives with in this order: what does
 * it cost from January, and what happens to the account I already have.
 *
 * The deadline strip under the CTAs is the one thing on this page that expires,
 * so it sits above the fold rather than in the founder band further down.
 * @returns A JSX element rendering the pricing hero on the court ground.
 */
export default function PricingHeader() {
  const t = useTranslations('pricingPage.hero');
  const labels = usePricingLabels();
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
            {t('titleBrand')}
            <MarkerUnderline color='marker' />
          </span>
        </h1>

        <p className='mx-auto mt-6 max-w-[62ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
          {t('lede', labels)}
        </p>

        <div className='mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <HeroActionButton
            variant='primary'
            icon={<UserPlus className='size-4' />}
            href={CLUB_CONFIG.website.appUrl}
            target='_blank'
            rel='noopener noreferrer'>
            {t('ctaPrimary')}
          </HeroActionButton>
          <HeroActionButton
            variant='secondary'
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'>
            {t('ctaSecondary')}
          </HeroActionButton>
        </div>

        <p className='mx-auto mt-7 flex max-w-fit items-center gap-2.5 rounded-full border border-primary/45 bg-primary/12 px-4 py-2 text-[15px] font-semibold text-chalk'>
          <CalendarClock className='size-4 shrink-0 text-primary' aria-hidden />
          {t('deadline', labels)}
          <span className='font-normal text-chalk/70'>{t('deadlineNote')}</span>
        </p>

        <div className='mt-6 flex flex-wrap items-center justify-center gap-2'>
          {trust.map((item) => (
            <HeroTrustBadge key={item} label={item} />
          ))}
        </div>
      </div>
    </header>
  );
}
