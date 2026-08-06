import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/** Same example as the Ratgeber article, so both places tell one story. */
const EXAMPLE_ROWS = [
  { player: 'Kreis', goals: 5, shots: 6, quota: '83,3 %' },
  { player: 'Außen', goals: 6, shots: 9, quota: '66,7 %' },
  { player: 'Rückraum', goals: 7, shots: 12, quota: '58,3 %' },
];

/**
 * "Rechenbeispiel" — one player and one team, calculated step by step, so the
 * page answers the query even for someone who never touches the tool.
 * @returns A JSX element rendering the worked example on the paper panel ground.
 */
export default function CalculatorExample() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Einmal durchgerechnet'
          title='Rechenbeispiel'
          description='Eine Rückraumspielerin hat 12 Torabschlüsse und trifft siebenmal.'
        />

        <p className='mt-8 font-display text-xl font-bold tracking-tight text-ink sm:text-2xl'>
          7 ÷ 12 × 100 = 58,3 %
        </p>
        <p className='mt-3 max-w-[68ch] text-base leading-7 text-ink/75'>
          Für die ganze Mannschaft rechnest du genauso, nur mit den Summen aller
          Spieler. 28 Tore aus 45 Würfen ergeben eine Team-Wurfquote von 62,2
          Prozent.
        </p>

        <div className='mt-8 overflow-x-auto'>
          <table className='w-full min-w-[420px] border-collapse text-left text-[15px]'>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Position
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Tore
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Würfe
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-primary'>
                  Wurfquote
                </th>
              </tr>
            </thead>
            <tbody>
              {EXAMPLE_ROWS.map((row, index) => (
                <tr key={row.player} className={index % 2 === 1 ? 'bg-paper/70' : undefined}>
                  <th scope='row' className='py-3 pr-4 font-medium text-ink'>
                    {row.player}
                  </th>
                  <td className='py-3 pr-4 tabular-nums text-ink/70'>{row.goals}</td>
                  <td className='py-3 pr-4 tabular-nums text-ink/70'>{row.shots}</td>
                  <td className='py-3 font-semibold tabular-nums text-ink'>{row.quota}</td>
                </tr>
              ))}
              <tr className='border-t-2 border-ink/25 bg-primary/5'>
                <th scope='row' className='py-3 pr-4 font-display font-bold text-ink'>
                  Team
                </th>
                <td className='py-3 pr-4 font-bold tabular-nums text-ink'>28</td>
                <td className='py-3 pr-4 font-bold tabular-nums text-ink'>45</td>
                <td className='py-3 font-bold tabular-nums text-ink'>62,2 %</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
