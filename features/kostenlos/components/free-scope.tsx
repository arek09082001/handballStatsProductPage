import Link from 'next/link';
import { Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { FREE_SCOPE } from '../data/free-content';

/**
 * The scope table — every feature of the free access with its real cap next to
 * it. Deliberately includes the limits: a table that only lists what's included
 * is a sales sheet, not an answer.
 * @returns A JSX element rendering the free-scope table on the paper ground.
 */
export default function FreeScope() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Schwarz auf weiß'
          title='Was ist im kostenlosen Zugang enthalten'
          description='Links steht, was du bekommst. Rechts steht, wo es aufhört – beides gehört zu einer ehrlichen Antwort.'
        />

        <div className='mt-10 overflow-x-auto'>
          <table className='w-full min-w-[560px] border-collapse text-left text-[15px]'>
            <caption className='sr-only'>
              Funktionen im kostenlosen Zugang von Statix und ihre Grenzen
            </caption>
            <thead>
              <tr className='border-b-2 border-ink/25'>
                <th scope='col' className='py-3 pr-4 font-display text-sm font-bold text-ink'>
                  Funktion
                </th>
                <th scope='col' className='py-3 font-display text-sm font-bold text-ink'>
                  Grenze im kostenlosen Zugang
                </th>
              </tr>
            </thead>
            <tbody>
              {FREE_SCOPE.map((row, index) => (
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
          Die Kontingente für KI-Analysen und geteilte Berichte laufen in
          rollierenden Zeitfenstern: Eine Analyse zählt genau 24 Stunden
          beziehungsweise 30 Tage nach ihrem Start nicht mehr mit – es gibt
          keinen festen Reset um Mitternacht. Gelöschte Berichte geben das
          Kontingent nicht zurück; gelöschte Spieler, Spiele oder Turniere geben
          ihren Platz dagegen wieder frei. Was ein Abo daran später ändern
          würde, steht auf der Seite{' '}
          <Link
            href='/preise'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Preise für die Handball-Statistik-App
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
