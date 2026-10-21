'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { trackDemoClick, trackRegisterClick } from '@/lib/analytics';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from './hero-action-button';
import DemoPreview from './demo-preview';
import FounderCountdown from './founder-countdown';
import { BoardKicker, CourtDiagram, Grain, MarkerArrow } from './tactic';

export default function FinalCTASection() {
  const t = useTranslations('productPage.finalCta');

  return (
    <section
      id='demo'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-24 text-chalk md:py-32'>
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.14}
        formationClassName='hidden lg:block'
        aria-hidden
        className='pointer-events-none absolute -left-[16%] top-1/2 h-[104%] w-auto -translate-y-1/2 text-chalk/[0.1] sm:-left-[10%] lg:-left-[4%]'
      />
      <Grain tone='court' />

      <div
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
              variant='curve'
              color='marker'
              aria-hidden
              className='absolute -top-11 left-6 hidden h-14 w-28 lg:block'
            />
            <HeroActionButton
              variant='primary'
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              trailing={
                <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              }
              onClick={() => trackRegisterClick('final_cta')}>
              {t('primaryCta')}
            </HeroActionButton>
            <HeroActionButton
              variant='secondary'
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => trackDemoClick('final_cta')}>
              {t('demoCta')}
            </HeroActionButton>
          </div>

          <p className='mt-5 text-sm text-chalk/60'>{t('note')}</p>

          {/* The deadline again at the last ask — whoever scrolled this far
              is deciding now, and the founder terms are the reason to. */}
          <div className='mt-7 flex justify-center lg:justify-start'>
            <FounderCountdown tone='court' />
          </div>
        </div>

        <div className='relative'>
          <DemoPreview
            url={CLUB_CONFIG.website.appUrlWithoutProtocol}
            liveLabel={t('previewLabel')}
          />
        </div>
      </div>
    </section>
  );
}
