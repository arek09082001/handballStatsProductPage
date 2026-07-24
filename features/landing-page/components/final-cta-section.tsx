'use client';

import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { gsap } from '@/lib/gsap-config';
import { trackDemoClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from './hero-action-button';
import DemoPreview from './demo-preview';
import { BoardKicker, CourtDiagram, Grain, MarkerArrow, PlayerMagnet } from './tactic';
import { drawMarkers } from './tactic/draw';

function scrollToNewsletter() {
  const target = document.getElementById('newsletter');
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.setTimeout(() => {
    document.getElementById('newsletter-email')?.focus();
  }, 450);
}

export default function FinalCTASection() {
  const t = useTranslations('productPage.finalCta');
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        },
      );
      drawMarkers(el, { trigger: el, start: 'top 75%' });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id='demo'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-24 text-chalk md:py-32'>
      <CourtDiagram
        aria-hidden
        className='pointer-events-none absolute -right-16 top-1/2 h-[130%] w-auto -translate-y-1/2 -scale-x-100 text-chalk/[0.08]'
      />
      <div className='pointer-events-none absolute left-[8%] top-[18%] hidden lg:block'>
        <PlayerMagnet number={9} team='home' size='md' className='rotate-[-8deg]' />
      </div>
      <Grain tone='court' />

      <div
        ref={contentRef}
        className='relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 sm:px-10 lg:grid-cols-2 lg:gap-16'>
        <div className='text-center lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            {t('badge')}
          </BoardKicker>

          <h2 className='mt-4 font-display text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-chalk sm:text-[2.75rem] md:text-[3.1rem]'>
            {t('title')}
          </h2>
          <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-chalk/75 sm:text-lg lg:mx-0'>
            {t('description')}
          </p>

          <div className='relative mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start'>
            <MarkerArrow
              variant='hook'
              color='marker'
              aria-hidden
              className='absolute -top-12 left-1/2 hidden h-14 w-24 -translate-x-1/2 rotate-6 sm:left-32 lg:block'
            />
            <HeroActionButton
              variant='primary'
              icon={<Play className='size-4 fill-current' />}
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackDemoClick('final_cta')}>
              {t('demoCta')}
            </HeroActionButton>
            <HeroActionButton variant='secondary' onClick={scrollToNewsletter}>
              {t('primaryCta')}
            </HeroActionButton>
          </div>

          <p className='mt-5 text-sm text-chalk/60'>{t('note')}</p>
        </div>

        <div className='relative'>
          <DemoPreview
            url={CLUB_CONFIG.website.demoUrlWithoutProtocol}
            liveLabel={t('previewLabel')}
          />
        </div>
      </div>
    </section>
  );
}
