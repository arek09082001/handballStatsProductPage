'use client';

import { useTranslations } from 'next-intl';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import type { ExcelLimit } from '../data/template-content';

/**
 * The honest part: what breaks about a spreadsheet once the season is running.
 * Written from real sideline practice, not as a strawman — the template above
 * is genuinely useful, and this band says exactly where it stops.
 * @returns A JSX element rendering the limits of a spreadsheet on the court ground.
 */
export default function TemplateLimits() {
  const t = useTranslations('templatePage.limits');
  const limits = t.raw('items') as ExcelLimit[];

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
          {limits.map((limit) => (
            <BoardCard
              key={limit.title}
              tone='court'
              pin='none'
              className='p-6'>
              <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                {limit.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-chalk/75'>
                {limit.text}
              </p>
            </BoardCard>
          ))}
        </div>
      </div>
    </section>
  );
}
