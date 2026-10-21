'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick, trackRegisterClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import FounderCountdown from './founder-countdown';
import HeroDevices from './hero-devices';
import HeroActionButton from './hero-action-button';
import HeroTrustBadge from './hero-trust-badge';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from './tactic';

export default function ProductHero() {
  const t = useTranslations('productPage.hero');
  const trustItems = [t('trust1'), t('trust2'), t('trust3')];

  return (
    <section
      className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      {/* The board: chalk court markings + grain, the copy set in the attacking zone */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_0%,hsl(200_42%_20%),transparent_60%)]'
      />
      {/* A real setup chalked on the board: opponent 6:0 + keeper vs. your
          attack with a pivot at the line — a play, not scattered magnets. */}
      <CourtDiagram
        variant='goal'
        formation
        // The magnets carry team colour, not the chalk tint, so they read far
        // stronger than the lines they sit on. Kept to roughly the weight of
        // the chalk, and off entirely below `lg`, where the copy is centred
        // across the full width and the tokens landed on top of the headline.
        formationOpacity={0.14}
        formationClassName='hidden lg:block'
        aria-hidden
        className='pointer-events-none absolute -left-[22%] top-12 h-[640px] w-auto text-chalk/[0.13] sm:-left-[14%] lg:-left-[8%] lg:top-1/2 lg:h-[86%] lg:-translate-y-1/2'
      />
      <Grain tone='court' />

      <div className='relative mx-auto flex lg:min-h-[min(850px,100svh)] max-w-7xl flex-col items-center gap-7 px-6 pb-12 pt-24 sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:pb-14 lg:pt-28'>
        {/* Left: the play, written out */}
        <div
          className='w-full shrink-0 text-center lg:w-[44%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            {t('badge')}
          </BoardKicker>

          {/* The marker follows the payoff; the product stays named in real text. */}
          <h1 className='mt-3 font-display text-[1.95rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3rem] lg:text-[2.75rem] xl:text-[3.25rem]'>
            {t('headlineLead')}{' '}
            <span className='relative inline-block text-primary'>
              {t('headlineHighlight')}
              <MarkerUnderline color='marker' />
            </span>{' '}
            <span className='text-chalk'>{t('headlineTail')}</span>
          </h1>

          <p className='mx-auto mt-4 max-w-[46ch] text-[15px] leading-6 text-chalk/75 sm:text-lg sm:leading-7 lg:mx-0'>
            {t('description')}
          </p>

          <div className='relative mt-5 flex flex-col items-center gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start'>
            <HeroActionButton
              variant='primary'
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              trailing={
                <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              }
              onClick={() => trackRegisterClick('hero')}>
              {t('primaryCta')}
            </HeroActionButton>
            <HeroActionButton
              variant='secondary'
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackDemoClick('hero')}>
              {t('secondaryCta')}
            </HeroActionButton>
          </div>

          <div className='mt-5 hidden flex-wrap lg:flex items-center justify-center gap-2 lg:justify-start'>
            {trustItems.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>

          {/* The one honest deadline on the page: the founder terms. On a
              phone it moves under the devices (below), so the product shows
              on the first screen instead of a fourth block of copy. */}
          <div className='mt-7 hidden justify-start lg:flex'>
            <FounderCountdown tone='court' />
          </div>
        </div>

        {/* Real product proof follows the CTA pair immediately on phones. */}
        <div className='relative w-full max-w-[680px] lg:min-w-0 lg:flex-1'>
          <HeroDevices />
          <div className='mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 lg:hidden'>
            {trustItems.map((item) => <HeroTrustBadge key={item} label={item} />)}
          </div>
          <div className='mt-5 flex justify-center lg:hidden'>
            <FounderCountdown tone='court' />
          </div>
        </div>
      </div>
    </section>
  );
}
