'use client';

import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import type { CourtFact } from '../data/taktikboard-content';

/**
 * "Das Feld stimmt" — the measurements the board is drawn from, in the same
 * wording and with the same numbers as the Ratgeber article on the court, so a
 * coach who checks both never finds two versions of the floor.
 * @returns A JSX element rendering the court measurements on the paper panel.
 */
export default function TaktikboardCourt() {
  const t = useTranslations('boardPage.court');
  const facts = t.raw('facts') as CourtFact[];

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[640px] border-collapse text-left text-[15px]'>
            <caption className='sr-only'>{t('caption')}</caption>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colElement')}
                </th>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-primary'>
                  {t('colMeasure')}
                </th>
                <th
                  scope='col'
                  className='py-3 font-display text-sm font-bold text-ink'>
                  {t('colOnBoard')}
                </th>
              </tr>
            </thead>
            <tbody>
              {facts.map((fact, index) => (
                <tr
                  key={fact.element}
                  className={index % 2 === 1 ? 'bg-paper/70' : undefined}>
                  <th
                    scope='row'
                    className='py-3 pr-4 align-top font-medium text-ink'>
                    {fact.element}
                  </th>
                  <td className='py-3 pr-4 align-top font-semibold tabular-nums text-ink'>
                    {fact.measure}
                  </td>
                  <td className='py-3 align-top text-ink/70'>{fact.onBoard}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', {
            court: inlineLink('/ratgeber/handball-spielfeld-masse'),
          })}
        </p>
      </div>
    </section>
  );
}
