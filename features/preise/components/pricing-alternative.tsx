import Link from 'next/link';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { ALTERNATIVE_COMPARISON } from '../data/pricing-content';

/**
 * The comparison that actually matters: not Statix against another app, but
 * against the Zettel and the Excel file every coach already uses — including
 * the cost nobody puts in the budget, the data that never gets analysed.
 * @returns A JSX element rendering the paper/Excel/Statix comparison on the paper ground.
 */
export default function PricingAlternative() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Die echte Alternative'
          title='Zettel, Excel oder Statix?'
          description='Kaum ein Trainer vergleicht zwei Statistik-Apps. Verglichen wird mit dem, was am Samstag auf dem Klemmbrett liegt.'
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[640px] border-collapse text-left text-[15px]'>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Worum es geht
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Zettel
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Excel
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-primary'>
                  Statix
                </th>
              </tr>
            </thead>
            <tbody>
              {ALTERNATIVE_COMPARISON.map((row, index) => (
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
            Die Kosten, die in keiner Kasse stehen
          </h3>
          <p className='mt-3 max-w-[68ch] text-[15px] leading-7 text-ink/75'>
            Der Zettel ist nicht kostenlos – er kostet nur nichts, was man
            überweisen müsste. Bezahlt wird trotzdem: mit dem Spiel, das ihr
            nach zwei Wochen nicht mehr rekonstruieren könnt. Mit der
            Trainingswoche, die auf ein Bauchgefühl statt auf ein Wurfbild
            aufbaut. Mit den Strichlisten in der Sporttasche, die nie jemand
            zusammenrechnet. Wer eine Saison lang sammelt und nie auswertet, hat
            die Arbeit gemacht und den Ertrag liegen lassen.
          </p>
          <p className='mt-4 max-w-[68ch] text-[15px] leading-7 text-ink/75'>
            Wenn du beim Papier bleiben willst: Nimm wenigstens eine ordentliche
            Vorlage. Unsere{' '}
            <Link
              href='/handball-statistik-excel-vorlage'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Handball-Statistik Excel-Vorlage
            </Link>{' '}
            ist kostenlos, rechnet Wurfquoten selbst aus – und im Ratgeber steht,{' '}
            <Link
              href='/ratgeber/handball-statistik-fuehren'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              wie du eine Handball-Statistik sauber führst
            </Link>
            , ganz gleich womit.
          </p>
        </BoardCard>
      </div>
    </section>
  );
}
