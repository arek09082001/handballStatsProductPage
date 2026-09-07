'use client';

import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { useBenchmarks } from '../data/use-benchmarks';

/**
 * "Richtwerte nach Position" — the same ranges the calculator uses for its
 * reading, and the same ones the Ratgeber article states. Ranges, not targets:
 * league, age group and opponent shift them.
 * @returns A JSX element rendering the benchmark table on the paper ground.
 */
export default function CalculatorBenchmarks() {
  const t = useTranslations('calculatorPage.benchmarks');
  const tCalc = useTranslations('calculatorPage.calculator');
  const benchmarks = useBenchmarks();

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[560px] border-collapse text-left text-[15px]'>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colPosition')}
                </th>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-primary'>
                  {t('colRange')}
                </th>
                <th
                  scope='col'
                  className='py-3 font-display text-sm font-bold text-ink'>
                  {t('colWhy')}
                </th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={index % 2 === 1 ? 'bg-paper-2/60' : undefined}>
                  <th
                    scope='row'
                    className='py-3 pr-4 align-top font-medium text-ink'>
                    {entry.label}
                  </th>
                  <td className='py-3 pr-4 align-top font-semibold tabular-nums text-ink'>
                    {entry.max === undefined
                      ? tCalc('rangeOver', { min: entry.min })
                      : tCalc('rangeBetween', {
                          min: entry.min,
                          max: entry.max,
                        })}
                  </td>
                  <td className='py-3 align-top text-ink/70'>{entry.hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t('closing')}
        </p>
      </div>
    </section>
  );
}
