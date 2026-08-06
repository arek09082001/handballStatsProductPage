import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { POSITION_BENCHMARKS } from '../data/calculator-content';

/**
 * "Richtwerte nach Position" — the same ranges the calculator uses for its
 * reading, and the same ones the Ratgeber article states. Ranges, not targets:
 * league, age group and opponent shift them.
 * @returns A JSX element rendering the benchmark table on the paper ground.
 */
export default function CalculatorBenchmarks() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Einordnen statt raten'
          title='Richtwerte nach Position'
          description='Eine gute Wurfquote hängt davon ab, aus welcher Situation geworfen wird. Diese Spannen gelten vom Amateur- bis in den ambitionierten Ligabereich.'
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[560px] border-collapse text-left text-[15px]'>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Position / Situation
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-primary'>
                  Typische Wurfquote
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-ink'>
                  Warum
                </th>
              </tr>
            </thead>
            <tbody>
              {POSITION_BENCHMARKS.map((entry, index) => (
                <tr key={entry.id} className={index % 2 === 1 ? 'bg-paper-2/60' : undefined}>
                  <th scope='row' className='py-3 pr-4 align-top font-medium text-ink'>
                    {entry.label}
                  </th>
                  <td className='py-3 pr-4 align-top font-semibold tabular-nums text-ink'>
                    {entry.max === undefined
                      ? `über ${entry.min} %`
                      : `${entry.min}–${entry.max} %`}
                  </td>
                  <td className='py-3 align-top text-ink/70'>{entry.hint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          Die Zahlen sind bewusst Spannen. Alter, Spielklasse und Gegner
          verschieben sie deutlich – nutze sie als Orientierung, nicht als
          starres Soll.
        </p>
      </div>
    </section>
  );
}
