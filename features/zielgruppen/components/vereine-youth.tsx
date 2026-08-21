import Link from 'next/link';
import {
  BoardScreenshot,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * The youth-department argument — the one that decides whether a club sees
 * itself on this page at all. A club with two senior teams has a coach problem;
 * a club with ten youth squads has an *organisation* problem, and that is what
 * the club level solves.
 *
 * Three points, no more: the shared scheme, the transition between age groups,
 * and what the numbers are actually good for. Everything else about the club
 * area is one band up.
 * @returns A JSX element rendering the youth-department band on the paper ground.
 */
export default function VereineYouth() {
  const points = [
    {
      number: 1,
      title: 'Von den Minis bis zur A-Jugend nach demselben Schema',
      text: 'Die Wurfquote der D-Jugend ist dieselbe Größe wie die der A-Jugend, und die Fehlerzahl der B-Jugend lässt sich mit der von vor zwei Jahren vergleichen. Jahrgänge nebeneinander zu legen ist damit keine Rechenaufgabe mehr, sondern eine Auswahl im Filter.',
    },
    {
      number: 2,
      title: 'Der Übergang in die nächste Mannschaft',
      text: 'Der Moment, in dem im Verein am meisten verloren geht: Ein Jahrgang rückt auf, der neue Trainer kennt niemanden, und drei Jahre Beobachtung stecken im Kopf des alten. Hier sieht er Spiele, Entwicklung und Position seiner neuen Mannschaft vom ersten Tag an, auch ohne das Übergabegespräch, das nie stattfindet.',
    },
    {
      number: 3,
      title: 'Spielerentwicklung sieht man an der Reihe, nicht am Spiel',
      text: 'Ein einzelnes Jugendspiel sagt fast nichts. Zwölf hintereinander sagen, ob die Wurfquote aus dem Rückraum steigt, ob die Fehlerzahl sinkt, ob der Torhüter mehr hält als im Herbst. Genau das zeigt die Auswertung, pro Spielerin und über Saisons hinweg. Die Abteilungsleitung sieht daran, wo Ausbildung wirkt und wo eine Mannschaft Unterstützung braucht.',
    },
  ];

  return (
    <section
      id='jugendabteilung'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Für die Jugendabteilung'
          title='Viele Mannschaften, ein Nachwuchsweg'
          description='Die Jugendabteilung, für die diese Ebene gebaut ist: acht, zehn, zwölf Mannschaften und bisher genauso viele Systeme, Statistiken zu führen.'
        />

        <div className='mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start'>
          <ul className='flex flex-col gap-8'>
            {points.map((point) => (
              <li key={point.number} className='flex items-start gap-4'>
                <PlayerMagnet number={point.number} size='md' className='mt-0.5 shrink-0' />
                <div>
                  <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                    {point.title}
                  </h3>
                  <p className='mt-1.5 max-w-[58ch] text-[15px] leading-7 text-ink/75'>
                    {point.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <BoardScreenshot
            src='/spielerprofil-verlauf.png'
            alt='Entwicklungsverlauf einer Handball-Spielerin über eine Saison in der Statix App'
            width={2560}
            height={2000}
            label='Entwicklung einer Spielerin über die Saison'
            pin='tape'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
        </div>

        <BoardScreenshot
          src='/verein-laufbahnen.png'
          alt='Liste der Spielerlaufbahnen über mehrere Mannschaften eines Handballvereins'
          width={2048}
          height={650}
          label='Wer den Sprung schon gemacht hat, steht im Vereinsdashboard'
          pin='magnet'
          className='mt-12'
          sizes='(max-width: 1024px) 100vw, 70vw'
        />

        <p className='mt-10 max-w-[58ch] text-base leading-7 text-ink/70'>
          Wie das für die einzelne Trainerin an der Bank aussieht, ein Tap pro
          Aktion und Live-Ticker für die Eltern, steht auf der Seite{' '}
          <Link
            href='/fuer-jugendtrainer'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Statistik für Jugendtrainer
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
