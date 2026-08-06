import { BRAND_FACTS } from '../data/brand-content';
import {
  BoardScreenshot,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import Reveal from './reveal';

/** Points condensed from the intro copy, read out like a coach's roster. */
const OVERVIEW_POINTS = [
  'Jede Aktion ist im Spiel nur einen Tap entfernt',
  'Auswertung läuft automatisch im Hintergrund',
  'Statistiken, Wurfbilder & Verläufe direkt nach dem Schlusspfiff',
  'Teilen per Link oder PDF mit dem ganzen Team',
] as const;

/**
 * "Statix in 30 Sekunden" – a compact definition paired with a real in-app
 * shot pinned to the board, plus a machine-readable quick-facts list set as a
 * coach's scoresheet (label/value rows) so answer engines can extract the brand
 * facts directly.
 * @returns A JSX element rendering the brand definition, a product screenshot and a quick-facts scoresheet.
 */
export default function BrandOverview() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-8'>
        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          <Reveal>
            <SectionHeading
              kicker='In 30 Sekunden'
              title='Statix, kurz erklärt'
              tone='paper'
              align='left'
            />

            <div className='mt-6 space-y-4 text-base leading-8 text-ink/75'>
              <p>
                Statix ersetzt Zettel, Strichlisten und Excel-Tabellen am
                Spielfeldrand. Während des Spiels ist jede Aktion nur einen Tap
                entfernt; die komplette Auswertung passiert automatisch im
                Hintergrund. Nach dem Schlusspfiff stehen Spieler- und
                Mannschaftsstatistiken, Wurfquoten, Wurfbilder und
                Entwicklungsverläufe sofort bereit und lassen sich als Link oder
                PDF mit dem ganzen Team teilen.
              </p>
              <p>
                Dazu kommen ein öffentlicher Live-Ticker für Eltern und Fans,
                ein Turniermodus mit automatischer Tabelle, Spieler-Umfragen,
                Trainer-Zusammenarbeit und KI-Analysen für Spiele, Spieler und
                ganze Turniere.
              </p>
            </div>

            <ul className='mt-7 space-y-3.5'>
              {OVERVIEW_POINTS.map((point, index) => (
                <li key={point} className='flex items-center gap-3.5'>
                  <PlayerMagnet number={index + 1} team='home' size='sm' />
                  <span className='text-[15px] leading-6 text-ink'>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <BoardScreenshot
              src='/gameListOverview.png'
              alt='Statix Spielübersicht: alle Spiele und Auswertungen auf einen Blick'
              width={1899}
              height={874}
              label='Statix – Spielübersicht'
              tone='paper'
              pin='magnet'
            />
          </Reveal>
        </div>

        <Reveal className='mt-16'>
          <p className='font-hand text-2xl text-ink/60'>Auf einen Blick</p>
          <dl className='mt-4 grid gap-x-10 border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-3'>
            {BRAND_FACTS.map((fact) => (
              <div
                key={fact.label}
                className='border-b border-ink/12 py-4 sm:[&:nth-last-child(-n+1)]:border-b-0 lg:[&:nth-last-child(-n+1)]:border-b'>
                <dt className='font-display text-[13px] font-bold uppercase tracking-[0.14em] text-primary'>
                  {fact.label}
                </dt>
                <dd className='mt-1.5 text-[15px] leading-6 text-ink/80'>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
