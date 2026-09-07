'use client';

import { useTranslations } from 'next-intl';
import { inlineLink } from '@/components/custom-ui/rich-text';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import type { ComparisonRow } from '../data/pricing-content';

/**
 * The comparison that actually matters: not Statix against another app, but
 * against the Zettel and the Excel file every coach already uses — including
 * the cost nobody puts in the budget, the data that never gets analysed.
 * @returns A JSX element rendering the paper/Excel/Statix comparison on the paper ground.
 */
export default function PricingAlternative() {
  const t = useTranslations('pricingPage.alternative');
  const rows = t.raw('rows') as ComparisonRow[];

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[640px] border-collapse text-left text-[15px]'>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colAspect')}
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colPaper')}
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colExcel')}
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-primary'>
                  {t('colStatix')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.aspect}
                  className={index % 2 === 1 ? 'bg-paper-2/60' : undefined}>
                  <th
                    scope='row'
                    className='py-3 pr-4 align-top font-semibold text-ink'>
                    {row.aspect}
                  </th>
                  <td className='py-3 pr-4 align-top text-ink/70'>{row.paper}</td>
                  <td className='py-3 pr-4 align-top text-ink/70'>{row.excel}</td>
                  <td className='py-3 align-top font-medium text-ink'>{row.statix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BoardCard pin='magnet' className='mt-10 p-6 sm:p-7'>
          <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
            {t('hiddenCostTitle')}
          </h3>
          <p className='mt-3 max-w-[68ch] text-[15px] leading-7 text-ink/75'>
            {t('hiddenCostParagraph')}
          </p>
          <p className='mt-4 max-w-[68ch] text-[15px] leading-7 text-ink/75'>
            {t.rich('template', {
              template: inlineLink('/handball-statistik-excel-vorlage'),
              guide: inlineLink('/ratgeber/handball-statistik-fuehren'),
            })}
          </p>
        </BoardCard>
      </div>
    </section>
  );
}
