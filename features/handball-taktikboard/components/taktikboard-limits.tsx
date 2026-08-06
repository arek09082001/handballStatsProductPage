import Link from 'next/link';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

const BLIND_SPOTS = [
  {
    title: 'Ein Board ist ein Standbild',
    text: 'Ein Spielzug ist eine Abfolge: Sperre, Absetzen, Anspiel. Auf einem Bild steht davon ein Moment. Zeichne lieber zwei oder drei Boards nacheinander, als alle Pfeile in eines zu quetschen.',
  },
  {
    title: 'Der Gegner bleibt nicht stehen',
    text: 'Die blauen Magnete stehen genau da, wo du sie hingeschoben hast. Eine echte Abwehr verschiebt, hilft aus und übergibt. Was auf dem Board frei aussieht, ist in der Halle oft eine halbe Sekunde lang frei.',
  },
  {
    title: 'Aufstellung ist nicht Ausführung',
    text: 'Die Positionen sind der einfache Teil. Timing, Tempo und der Blick des Kreisläufers entscheiden, ob derselbe Zug ein Tor oder ein Stürmerfoul wird – und das steht in keiner Grafik.',
  },
  {
    title: 'Ob es funktioniert hat, sagt das Board nicht',
    text: 'Nach dem Spiel bleibt die Frage, ob aus dem Zug wirklich Abschlüsse entstanden sind und aus welchen Zonen. Das beantwortet nur eine Auswertung, keine Zeichnung.',
  },
];

/**
 * The honest counterweight to a drawing tool, and the one place on this page
 * where Statix is mentioned inside the prose — as the answer to a question a
 * coach genuinely asks after drawing a play, not as a pitch.
 * @returns A JSX element rendering the limits band on the court ground.
 */
export default function TaktikboardLimits() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[18%] top-1/2 h-[112%] w-auto -translate-y-1/2 -scale-x-100 text-chalk/[0.07] sm:-right-[10%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker='Ehrlich bleiben'
          title='Was ein Taktikboard nicht kann'
          description='Ein gezeichneter Zug sieht immer gut aus – auf dem Board wehrt sich niemand. Vier Dinge musst du mitdenken.'
        />

        <div className='mt-12 grid gap-5 md:grid-cols-2'>
          {BLIND_SPOTS.map((item) => (
            <BoardCard key={item.title} tone='court' pin='none' className='p-6'>
              <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                {item.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-chalk/75'>{item.text}</p>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-chalk/75'>
          Wie du aus einem Spiel herausliest, ob der Zug getragen hat, steht im
          Ratgeber:{' '}
          <Link
            href='/ratgeber/handball-spielanalyse'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Spielanalyse im Handball: Spiele richtig auswerten
          </Link>
          . Wer die Abschlüsse nicht mehr auf einem Zettel mitstricheln will,
          erfasst sie live per Tap – dafür gibt es{' '}
          <Link
            href='/handball-statistik-app-kostenlos'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Statix, kostenlos und mit Live-Demo ohne Account
          </Link>
          . Fürs Zeichnen brauchst du davon nichts: Dieses Board funktioniert
          vollständig ohne Anmeldung, und daran ändert sich nichts.
        </p>
      </div>
    </section>
  );
}
