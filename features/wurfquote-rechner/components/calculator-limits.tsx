import Link from 'next/link';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

const BLIND_SPOTS = [
  {
    title: 'Die Wurfanzahl',
    text: '100 Prozent aus einem Wurf sind weniger wert als 55 Prozent aus zwanzig. Wer die Verantwortung übernimmt, hat oft die undankbarere Quote.',
  },
  {
    title: 'Die Chancenqualität',
    text: 'Wer nur freie Konter abschließt, hat es leichter als ein Rückraumspieler gegen den geschlossenen Block. Ohne Wurfposition ist die Quote nur die halbe Wahrheit.',
  },
  {
    title: 'Der Spielkontext',
    text: 'In der Schlussphase, in Unterzahl oder gegen den Spitzenreiter sinken Quoten. Das ist normal und kein Zeichen für nachlassende Leistung.',
  },
  {
    title: 'Die Entwicklung',
    text: 'Ein Wert aus einem Spiel ist eine Momentaufnahme. Erst der Verlauf über mehrere Spiele zeigt, ob sich etwas verändert – nach oben wie nach unten.',
  },
];

/**
 * The honest counterweight to a calculator: what a single percentage cannot
 * tell you. Links to the Ratgeber article for the long version and into the app
 * for the shot maps that fill the gap.
 * @returns A JSX element rendering the blind spots on the court ground.
 */
export default function CalculatorLimits() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker='Zahlen lesen können'
          title='Was die Wurfquote nicht zeigt'
          description='Eine hohe Quote ist nicht automatisch gut, eine niedrige nicht automatisch schlecht. Vier Dinge musst du mitdenken.'
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
          Die ausführliche Version steht im Ratgeber:{' '}
          <Link
            href='/ratgeber/wurfquote-berechnen'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Wurfquote im Handball berechnen – Formel, Beispiele und Richtwerte
          </Link>
          . Wie du Torwartleistung fair bewertest, steht in{' '}
          <Link
            href='/ratgeber/handball-torwart-statistik'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Torwartleistung mit Statistik bewerten
          </Link>
          . Und wenn du Quote und Wurfbild nicht mehr von Hand zusammensuchen
          willst: Statix erfasst beides live per Tap –{' '}
          <Link
            href='/handball-statistik-app-kostenlos'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            kostenlos, mit Live-Demo ohne Account
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
