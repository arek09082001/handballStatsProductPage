'use client';

import { useTranslations } from 'next-intl';
import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { inlineLink } from '@/components/custom-ui/rich-text';
import type { FreeScopeRow } from '../data/free-content';

/**
 * The scope table — every feature of the free access with its real cap next to
 * it. Deliberately includes the limits: a table that only lists what's included
 * is a sales sheet, not an answer.
 * @returns A JSX element rendering the free-scope table on the paper ground.
 */
export default function FreeScope() {
  const t = useTranslations('freePage.scope');
  const rows = t.raw('rows') as FreeScopeRow[];

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
            <caption className='sr-only'>{t('caption')}</caption>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colFeature')}
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-ink'>
                  {t('colLimit')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.feature} className={index % 2 === 1 ? 'bg-paper-2/60' : undefined}>
                  <th scope='row' className='py-3 pr-4 align-top font-medium text-ink'>
                    {row.feature}
                  </th>
                  <td className='py-3 align-top tabular-nums text-ink/70'>{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          {t.rich('closing', { pricing: inlineLink('/preise') })}
        </p>
      </div>
    </section>
  );
}
