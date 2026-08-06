import Link from 'next/link';
import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { COURT_FACTS } from '../data/taktikboard-content';

/**
 * "Das Feld stimmt" — the measurements the board is drawn from, in the same
 * wording and with the same numbers as the Ratgeber article on the court, so a
 * coach who checks both never finds two versions of the floor.
 * @returns A JSX element rendering the court measurements on the paper panel.
 */
export default function TaktikboardCourt() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Maßstabsgetreu'
          title='Das Feld unter den Magneten'
          description='Die meisten Zeichenwerkzeuge im Netz nehmen ein Rechteck und malen einen Halbkreis davor. Ein Handballfeld sieht anders aus – und dieses hier ist aus echten Metern gebaut.'
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[640px] border-collapse text-left text-[15px]'>
            <caption className='sr-only'>
              Maße des Handballfelds und wie sie auf dem Taktikboard gezeichnet sind
            </caption>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Element
                </th>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-primary'>
                  Maß
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-ink'>
                  Auf dem Board
                </th>
              </tr>
            </thead>
            <tbody>
              {COURT_FACTS.map((fact, index) => (
                <tr key={fact.element} className={index % 2 === 1 ? 'bg-paper/70' : undefined}>
                  <th scope='row' className='py-3 pr-4 align-top font-medium text-ink'>
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
          Wichtig ist vor allem die Torraumlinie: Sie ist kein Halbkreis,
          sondern besteht aus zwei Viertelkreisen an den Torpfosten und einem
          geraden Stück dazwischen. Genau deshalb steht ein Kreisläufer in der
          Mitte weiter vom Tor weg als in der Halbposition – und genau deshalb
          taugt ein aufgemalter Halbkreis nicht, um Sperren zu besprechen. Warum
          jede Linie so liegt, wie sie liegt, steht im Ratgeber:{' '}
          <Link
            href='/ratgeber/handball-spielfeld-masse'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handballfeld: Maße, Linien und Markierungen
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
