'use client';

import { useTranslations } from 'next-intl';
import {
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import type { StatFormula } from '../data/stats-content';

/**
 * The formula band — every metric with its calculation and the range that
 * counts as normal in the amateur game. A scoresheet table on the court
 * ground, not a card grid: this is the part a coach screenshots.
 * @returns A JSX element rendering the formula and benchmark table.
 */
export default function StatsFormulas() {
  const t = useTranslations('statsPage.formulas');
  const rows = t.raw('rows') as StatFormula[];

  return (
    <section
      id='formeln'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-20 text-chalk md:py-28'>
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

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[640px] border-collapse text-left text-[15px]'>
            <caption className='sr-only'>{t('caption')}</caption>
            <thead>
              <tr className='border-b-2 border-chalk/25'>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-chalk'>
                  {t('colMetric')}
                </th>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-chalk'>
                  {t('colFormula')}
                </th>
                <th
                  scope='col'
                  className='py-3 font-display text-sm font-bold text-chalk'>
                  {t('colBenchmark')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.metric}
                  className={index % 2 === 1 ? 'bg-chalk/[0.04]' : undefined}>
                  <th
                    scope='row'
                    className='py-3 pr-4 align-top font-medium text-chalk'>
                    {row.metric}
                  </th>
                  <td className='py-3 pr-4 align-top font-mono text-[13.5px] text-chalk/80'>
                    {row.formula}
                  </td>
                  <td className='py-3 align-top text-chalk/70'>
                    {row.benchmark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-chalk/70'>
          {t.rich('closing', { calculator: inlineLink('/wurfquote-rechner') })}
        </p>
      </div>
    </section>
  );
}
