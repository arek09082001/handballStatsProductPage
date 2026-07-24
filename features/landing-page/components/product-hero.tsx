'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap-config';
import { trackDemoClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import AppMockup from './app-mockup';
import HeroActionButton from './hero-action-button';
import HeroTrustBadge from './hero-trust-badge';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerArrow,
  MarkerUnderline,
  PlayerMagnet,
} from './tactic';
import { drawMarkers } from './tactic/draw';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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
      <CourtDiagram
        aria-hidden
        className='pointer-events-none absolute -left-24 bottom-[-14%] h-[135%] w-auto text-chalk/[0.16] sm:-left-10 lg:left-[-4%]'
      />
      <div className='pointer-events-none absolute right-[7%] top-[22%] hidden lg:block'>
        <PlayerMagnet number={7} team='home' size='lg' className='rotate-[-6deg]' />
      </div>
      <div className='pointer-events-none absolute bottom-[14%] left-[9%] hidden lg:block'>
        <PlayerMagnet number={4} team='away' size='md' className='rotate-[8deg]' />
      </div>
      <Grain tone='court' />

      <div className='relative mx-auto flex min-h-[calc(100svh-1rem)] max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-28 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:pb-20 lg:pt-32'>
        {/* Left: the play, written out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className='w-full shrink-0 text-center lg:w-[46%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            {t('badge')}
          </BoardKicker>

          <h1 className='mt-5 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-chalk sm:text-[3.4rem] lg:text-[3.75rem] xl:text-[4.15rem]'>
            {t('headlineLead')}{' '}
            <span className='relative inline-block text-primary'>
              {t('headlineHighlight')}
              <MarkerUnderline color='marker' />
            </span>{' '}
            <span className='text-chalk'>{t('headlineTail')}</span>
          </h1>

          <p className='mx-auto mt-6 max-w-[560px] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8 lg:mx-0'>
            {t('description')}
          </p>

          <div className='relative mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start'>
            <HeroActionButton
              variant='primary'
              icon={<Play className='size-4 fill-current' />}
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackDemoClick('hero')}>
              {t('primaryCta')}
            </HeroActionButton>
            <HeroActionButton variant='secondary' onClick={() => scrollToId('features')}>
              {t('secondaryCta')}
            </HeroActionButton>
          </div>

          <div className='mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start'>
            {trustItems.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>
        </motion.div>

        {/* Right: the app on the sideline, pinned to the board */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          className='relative w-full lg:min-w-0 lg:flex-1'>
          {/* A move drawn from the copy toward the live view */}
          <MarkerArrow
            variant='curve'
            color='marker'
            aria-hidden
            className='absolute -left-8 -top-10 hidden h-16 w-28 -rotate-12 lg:block'
          />
          <AppMockup />
        </motion.div>
      </div>
    </section>
  );
}
