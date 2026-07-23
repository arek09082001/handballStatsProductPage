import { BRAND_FACTS } from '../data/brand-content';

/**
 * "Statix in 30 Sekunden" – a compact definition plus a quick-facts list.
 * The definition list is deliberately machine-readable (label/value pairs) so
 * answer engines can extract the brand facts directly.
 */
export default function BrandOverview() {
  return (
    <section className='mx-auto w-full max-w-5xl px-6 py-14 sm:px-8 md:py-20'>
      <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
        Statix in 30 Sekunden
      </h2>

      <div className='mt-6 space-y-4 text-base leading-8 text-muted-foreground'>
        <p>
          Statix ersetzt Zettel, Strichlisten und Excel-Tabellen am
          Spielfeldrand. Während des Spiels ist jede Aktion nur einen Tap
          entfernt; die komplette Auswertung passiert automatisch im
          Hintergrund. Nach dem Schlusspfiff stehen Spieler- und
          Mannschaftsstatistiken, Wurfquoten, Wurfbilder und
          Entwicklungsverläufe sofort bereit und lassen sich als Link oder PDF
          mit dem ganzen Team teilen.
        </p>
        <p>
          Dazu kommen ein öffentlicher Live-Ticker für Eltern und Fans, ein
          Turniermodus mit automatischer Tabelle, Spieler-Umfragen,
          Trainer-Zusammenarbeit und KI-Analysen für Spiele, Spieler und ganze
          Turniere.
        </p>
      </div>

      <dl className='mt-10 grid gap-x-8 gap-y-5 rounded-2xl border border-border/60 bg-card p-6 sm:grid-cols-2 sm:p-8'>
        {BRAND_FACTS.map((fact) => (
          <div key={fact.label}>
            <dt className='text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground'>
              {fact.label}
            </dt>
            <dd className='mt-1 text-sm leading-6 text-foreground'>
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
