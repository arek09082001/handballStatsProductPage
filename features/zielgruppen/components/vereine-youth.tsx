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
      text: 'Jede Mannschaft erfasst dieselben Aktionen — Tore, Würfe, Paraden, Siebenmeter, Tempogegenstöße, technische Fehler, Zeitstrafen. Nicht, weil jemand es kontrolliert, sondern weil die App keine zweite Zählweise anbietet. Damit ist die Wurfquote der D-Jugend dieselbe Größe wie die der A-Jugend, und ein Vergleich über Jahrgänge hinweg ist keine Rechenaufgabe mehr.',
    },
    {
      number: 2,
      title: 'Der Übergang in die nächste Mannschaft',
      text: 'Der Moment, in dem im Verein am meisten verloren geht: Ein Jahrgang rückt auf, der neue Trainer kennt niemanden, und was drei Jahre lang beobachtet wurde, steckt im Kopf des alten Trainers. In Statix bleibt die Spielerin dieselbe Person mit allen Stationen. Der neue Trainer sieht Spiele, Entwicklung und Position vom ersten Tag an — ohne ein Übergabegespräch, das nie stattfindet.',
    },
    {
      number: 3,
      title: 'Wo etwas fehlt, sieht man es an der Reihe, nicht am Spiel',
      text: 'Ein einzelnes Jugendspiel sagt fast nichts. Zwölf Spiele hintereinander sagen, ob die Wurfquote aus dem Rückraum steigt, ob die Fehlerzahl sinkt und ob der Torhüter mehr hält als im Herbst. Genau das zeigt die Auswertung — pro Spielerin, pro Mannschaft und über Saisons hinweg. Die Abteilungsleitung sieht damit, wo Ausbildung wirkt und wo eine Mannschaft Unterstützung braucht.',
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
          description='Der Verein, für den diese Ebene gebaut ist: acht, zehn, zwölf Jugendmannschaften — und bisher genauso viele Systeme, Statistiken zu führen.'
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
            label='Entwicklung einer Spielerin über die Saison — im Verein über alle Stationen'
            pin='tape'
            sizes='(max-width: 1024px) 100vw, 45vw'
          />
        </div>

        <BoardScreenshot
          src='/verein-laufbahnen.png'
          alt='Liste der Spielerlaufbahnen über mehrere Mannschaften eines Handballvereins'
          width={2048}
          height={650}
          label='Wer den Sprung schon gemacht hat — im Vereinsdashboard, ohne Zutun'
          pin='magnet'
          className='mt-12'
          sizes='(max-width: 1024px) 100vw, 70vw'
        />

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-ink/70'>
          Wie das für die einzelne Trainerin an der Bank aussieht — ein Tap pro
          Aktion, Entwicklung zeigen, Live-Ticker für die Eltern — steht auf der
          Seite{' '}
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
