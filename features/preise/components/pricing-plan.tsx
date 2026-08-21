import Link from 'next/link';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/** What the planned subscription is meant to carry — stated as a plan, not a sale. */
const PLAN_POINTS = [
  {
    number: 1,
    title: 'Der Funktionsumfang von heute bleibt der Maßstab',
    text: 'Live-Erfassung, Auswertung, Wurfbilder, Turniere und Live-Ticker sind gebaut und laufen. Ein Abo soll den Betrieb tragen, nicht das Produkt beschneiden.',
  },
  {
    number: 2,
    title: 'Einzelne Funktionen wandern später ins Abo',
    text: 'Rechenintensives wie KI-Analysen und Versand-Themen wie geteilte Berichte sind die Kandidaten. Welche Funktionen es am Ende sind, steht noch nicht fest – und ich schreibe es hier hin, sobald es feststeht.',
  },
  {
    number: 3,
    title: 'Ein kostenloser Zugang bleibt bestehen',
    text: 'Ein Jugendtrainer, der zweimal im Monat ein Spiel erfasst, soll Statix weiter kostenlos nutzen können. Deshalb bleibt die Erfassung eines Spiels und die Auswertung daraus der Kern des kostenlosen Zugangs.',
  },
] as const;

/**
 * Court signature band explaining the planned subscription. Statix has no
 * checkout today, so this band states the planned monthly price as a plan and
 * says plainly that nothing can currently be bought — the reason the route
 * emits an `Offer` for the free tier only.
 * @returns A JSX element rendering the planned-subscription band on the court ground.
 */
export default function PricingPlan() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker='Später geplant'
          title='Was ein Abo für Team und Verein ändert'
          description='Statix soll sich irgendwann selbst tragen. Damit du planen kannst, hier der Stand – ohne Marketing-Nebel.'
        />

        <div className='mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-12'>
          <BoardCard tone='court' pin='tape' className='p-7 sm:p-8'>
            <p className='font-hand text-2xl text-primary'>Heute</p>
            <p className='mt-2 font-display text-[3.2rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-chalk'>
              0 €
            </p>
            <p className='mt-1 text-sm text-chalk/70'>voller Funktionsumfang</p>
            <p className='mt-5 text-[15px] leading-7 text-chalk/75'>
              In der App gibt es weder einen Bezahlvorgang noch einen
              Abo-Bereich. Du kannst Statix heute schlicht nicht bezahlen – und
              musst es auch nicht.
            </p>
            <p className='mt-4 text-[15px] leading-7 text-chalk/75'>
              Später wird es ein Abo geben. Was es kostet, steht noch nicht
              fest; hier steht erst eine Zahl, wenn sie gilt.
            </p>
            <p className='mt-4 text-[15px] leading-7 text-chalk/75'>
              Die endgültigen Konditionen – auch für Vereine mit mehreren
              Mannschaften – gebe ich vor dem Start bekannt.{' '}
              <Link
                href='/#newsletter'
                className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                Über den Newsletter
              </Link>{' '}
              erfährst du es zuerst.
            </p>
          </BoardCard>

          <ul className='flex flex-col gap-7'>
            {PLAN_POINTS.map((point) => (
              <li key={point.number} className='flex items-start gap-4'>
                <PlayerMagnet number={point.number} size='md' className='mt-0.5 shrink-0' />
                <div>
                  <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                    {point.title}
                  </h3>
                  <p className='mt-1.5 max-w-[58ch] text-[15px] leading-7 text-chalk/75'>
                    {point.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
