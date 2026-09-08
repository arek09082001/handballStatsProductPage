'use client';

import { useTranslations } from 'next-intl';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';

/** One blind spot of a single percentage, as the band lists them. */
interface BlindSpot {
  title: string;
  text: string;
}

/**
 * The honest counterweight to a calculator: what a single percentage cannot
 * tell you. Links to the Ratgeber article for the long version and into the app
 * for the shot maps that fill the gap.
 * @returns A JSX element rendering the blind spots on the court ground.
 */
export default function CalculatorLimits() {
  const t = useTranslations('calculatorPage.limits');
  const blindSpots = t.raw('items') as BlindSpot[];

  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-12 grid gap-5 md:grid-cols-2'>
          {blindSpots.map((item) => (
            <BoardCard key={item.title} tone='court' pin='none' className='p-6'>
              <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                {item.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-chalk/75'>
                {item.text}
              </p>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-chalk/75'>
          {t.rich('closing', {
            stats: inlineLink('/handball-statistiken'),
            rate: inlineLink('/ratgeber/wurfquote-berechnen'),
            keeper: inlineLink('/ratgeber/handball-torwart-statistik'),
            free: inlineLink('/handball-statistik-app-kostenlos'),
          })}
        </p>
      </div>
    </section>
  );
}
