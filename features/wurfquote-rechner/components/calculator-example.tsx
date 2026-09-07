'use client';

import { useTranslations } from 'next-intl';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/** One row of the worked example — the same one the Ratgeber article uses. */
interface ExampleRow {
  player: string;
  goals: string;
  shots: string;
  quota: string;
}

/**
 * "Rechenbeispiel" — one player and one team, calculated step by step, so the
 * page answers the query even for someone who never touches the tool.
 * @returns A JSX element rendering the worked example on the paper panel ground.
 */
export default function CalculatorExample() {
  const t = useTranslations('calculatorPage.example');
  const rows = t.raw('rows') as ExampleRow[];

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

        <p className='mt-8 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>
          {t('expression')}
        </p>
        <p className='mt-3 max-w-[68ch] text-base leading-7 text-ink/75'>
          {t('teamText')}
        </p>

        <div className='mt-8 overflow-x-auto'>
          <table className='w-full min-w-[420px] border-collapse text-left text-[15px]'>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colPosition')}
                </th>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colGoals')}
                </th>
                <th
                  scope='col'
                  className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  {t('colShots')}
                </th>
                <th
                  scope='col'
                  className='py-3 font-display text-sm font-bold text-primary'>
                  {t('colQuota')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.player}
                  className={index % 2 === 1 ? 'bg-paper/70' : undefined}>
                  <th scope='row' className='py-3 pr-4 font-medium text-ink'>
                    {row.player}
                  </th>
                  <td className='py-3 pr-4 tabular-nums text-ink/70'>
                    {row.goals}
                  </td>
                  <td className='py-3 pr-4 tabular-nums text-ink/70'>
                    {row.shots}
                  </td>
                  <td className='py-3 font-semibold tabular-nums text-ink'>
                    {row.quota}
                  </td>
                </tr>
              ))}
              <tr className='border-t-2 border-ink/25 bg-primary/5'>
                <th
                  scope='row'
                  className='py-3 pr-4 font-display font-bold text-ink'>
                  {t('teamRow')}
                </th>
                <td className='py-3 pr-4 font-bold tabular-nums text-ink'>
                  {t('teamGoals')}
                </td>
                <td className='py-3 pr-4 font-bold tabular-nums text-ink'>
                  {t('teamShots')}
                </td>
                <td className='py-3 font-bold tabular-nums text-ink'>
                  {t('teamQuota')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
