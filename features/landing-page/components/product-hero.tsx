'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap-config';
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
  MarkerArrow,
  MarkerUnderline,
} from './tactic';
import { drawMarkers } from './tactic/draw';

export default function ProductHero() {
  const t = useTranslations('productPage.hero');
  const trustItems = [t('trust1'), t('trust2'), t('trust3')];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const ctx = gsap.context(() => drawMarkers(el, { delay: 0.35 }), el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
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
        className='pointer-events-none absolute -left-[22%] top-1/2 h-[86%] w-auto -translate-y-1/2 text-chalk/[0.13] sm:-left-[14%] lg:-left-[8%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto flex min-h-[calc(100svh-1rem)] max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-28 sm:px-10 lg:flex-row lg:items-center lg:gap-10 lg:pb-20 lg:pt-28'>
        {/* Left: the play, written out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className='w-full shrink-0 text-center lg:w-[44%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            {t('badge')}
          </BoardKicker>

          {/* Sized so the highlighted keyword holds one line from `sm` up —
              broken at its hyphen, the marker stroke underlined half a word. */}
          <h1 className='mt-5 font-display text-[2.35rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3rem] lg:text-[2.75rem] xl:text-[3.25rem]'>
            {t('headlineLead')}{' '}
            <span className='relative inline-block text-primary sm:whitespace-nowrap'>
              {t('headlineHighlight')}
              <MarkerUnderline color='marker' />
            </span>{' '}
            <span className='text-chalk'>{t('headlineTail')}</span>
          </h1>

          <p className='mx-auto mt-5 max-w-[560px] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8 lg:mx-0'>
            {t('description')}
          </p>

          <div className='relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start'>
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

          <div className='mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start'>
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
        </motion.div>

        {/* Right: what the tap turns into — a tablet with the shape of the
            game and a phone with the quotas, flying onto the board. */}
        <div className='relative w-full lg:min-w-0 lg:flex-1'>
          <HeroDevices />
          <div className='mt-10 flex justify-center lg:hidden'>
            <FounderCountdown tone='court' />
          </div>
        </div>
      </div>
    </section>
  );
}
