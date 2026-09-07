'use client';

import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';
import { TESTIMONIALS } from '../data/testimonials';

/**
 * Court hero for `/erfahrungen`. The lede changes with the data: as long as
 * there are no published testimonials it says so in the first sentence instead
 * of implying a review section that does not exist.
 * @returns A JSX element rendering the experiences hero on the court ground.
 */
export default function ErfahrungenHeader() {
  const t = useTranslations('experiencesPage.hero');
  const tCommon = useTranslations('common');
  const hasQuotes = TESTIMONIALS.length > 0;

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

        <h1 className='mt-5 font-display text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3.1rem]'>
          {t('titleBrand')}{' '}
          <span className='relative inline-block text-primary'>
            {t('titleHighlight')}
            <MarkerUnderline color='marker' />
          </span>
          {t('titleTail')}
        </h1>

        <p className='mx-auto mt-6 max-w-[62ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
          {hasQuotes ? t('ledeWithQuotes') : t('ledeEmpty')}
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
      </div>
    </header>
  );
}
