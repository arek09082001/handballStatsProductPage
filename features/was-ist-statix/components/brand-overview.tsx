import { Check } from 'lucide-react';
import { BRAND_FACTS } from '../data/brand-content';
import AppScreenshot from '@/features/landing-page/components/app-screenshot';
import Reveal from './reveal';

/** Points condensed from the intro copy, shown as a scannable checklist. */
const OVERVIEW_POINTS = [
  'Jede Aktion ist im Spiel nur einen Tap entfernt',
  'Auswertung läuft automatisch im Hintergrund',
  'Statistiken, Wurfbilder & Verläufe direkt nach dem Schlusspfiff',
  'Teilen per Link oder PDF mit dem ganzen Team',
] as const;

/**
 * "Statix in 30 Sekunden" – a compact definition paired with a real app
 * screenshot, plus a machine-readable quick-facts list. The definition list is
 * kept as label/value pairs so answer engines can extract the brand facts
 * directly.
 * @returns A JSX element rendering the brand definition, a product screenshot and a quick-facts grid.
 */
export default function BrandOverview() {
  return (
    <section className='w-full bg-background'>
      <div className='mx-auto w-full max-w-6xl px-6 py-16 sm:px-8 md:py-24'>
        <div className='grid items-center gap-10 lg:grid-cols-2 lg:gap-16'>
          <Reveal>
            <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
              Statix in 30 Sekunden
            </h2>

            <div className='mt-5 space-y-4 text-base leading-8 text-muted-foreground'>
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

            <ul className='mt-6 space-y-3'>
              {OVERVIEW_POINTS.map((point) => (
                <li key={point} className='flex items-start gap-3'>
                  <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Check className='size-3.5' />
                  </span>
                  <span className='text-sm leading-6 text-foreground'>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <AppScreenshot
              src='/gameListOverview.png'
              alt='Statix Spielübersicht: alle Spiele und Auswertungen auf einen Blick'
              width={1899}
              height={874}
              label='Statix – Spielübersicht'
            />
          </Reveal>
        </div>

        <Reveal>
          <dl className='mt-14 grid gap-x-8 gap-y-6 rounded-2xl border border-border/60 bg-card p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3'>
            {BRAND_FACTS.map((fact) => (
              <div
                key={fact.label}
                className='border-l-2 border-primary/30 pl-4'>
                <dt className='text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
                  {fact.label}
                </dt>
                <dd className='mt-1 text-sm leading-6 text-foreground'>
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
