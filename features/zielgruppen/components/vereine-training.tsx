import { BellRing, CalendarCheck2, PlaneTakeoff, UserCheck } from 'lucide-react';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * Training, appointments and who shows up — the half of a club's week that has
 * nothing to do with match day and is nevertheless the reason a coach keeps
 * three tools open.
 *
 * The claim is deliberately precise: every squad runs its schedule inside
 * Statix, next to its games. There is no club-wide attendance rollup yet, so
 * this band does not promise one — it promises what the app does today.
 * @returns A JSX element rendering the training band on the paper-2 ground.
 */
export default function VereineTraining() {
  const points = [
    {
      icon: CalendarCheck2,
      title: 'Terminplan statt Gruppenchat',
      text: 'Training, Spiele und alles dazwischen liegen in einem Kalender — als Einzeltermin oder als Serie über die ganze Saison, mit Halle, Adresse und Treffzeit. Wer den Termin öffnet, sieht die Route dorthin; wer eine Serie verschiebt, verschiebt sie einmal statt achtzehnmal.',
    },
    {
      icon: UserCheck,
      title: 'Zu- und Absagen von den Spielern selbst',
      text: 'Die Spielerinnen antworten über einen Beitrittslink der Mannschaft — ohne Trainer-App und ohne dass jemand ihre Zahlen sieht. Der Trainerstab hat vor dem Training die vollständige Liste: wer kommt, wer absagt, wer vielleicht — und, genauso wichtig, von wem noch gar nichts kam. Eine Absage kann einen Grund tragen, und der bleibt zwischen Spielerin und Trainerteam.',
    },
    {
      icon: PlaneTakeoff,
      title: 'Urlaub, Krankheit, Verletzung als Zeitraum',
      text: 'Zwei Wochen Urlaub sind eine Eintragung, nicht vierzehn Absagen. Abwesenheiten gelten für einen Zeitraum und ziehen sich durch alle Termine darin; in der Teilnahmeliste steht dann nicht „keine Rückmeldung“, sondern der Grund. Für die Trainingsplanung ist das der Unterschied zwischen Raten und Wissen.',
    },
    {
      icon: BellRing,
      title: 'Änderungen erreichen die Mannschaft',
      text: 'Fällt das Training aus oder wird die Halle getauscht, bekommt die Mannschaft eine Benachrichtigung — auf dem Handy, ohne dass jemand eine Telefonliste durchgeht. Statix lässt sich dafür als App auf dem Homescreen installieren, ohne App Store.',
    },
  ];

  return (
    <section
      id='training'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Training und Beteiligung'
          title='Trainingsbeteiligung im selben Werkzeug'
          description='Kader, Spiele, Termine und Rückmeldungen liegen an einer Stelle. Kein zweites Tool für den Kalender, keine dritte Liste für die Anwesenheit.'
        />

        <div className='mt-12 grid gap-5 md:grid-cols-2'>
          {points.map((point) => (
            <BoardCard key={point.title} pin='none' className='p-6'>
              <span className='flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary'>
                <point.icon className='size-5' />
              </span>
              <h3 className='mt-4 font-display text-lg font-bold tracking-tight text-ink'>
                {point.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-ink/75'>{point.text}</p>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-ink/70'>
          Den Terminplan führt jede Mannschaft selbst — so, wie sie auch ihre
          Spiele erfasst. Der Verein sieht in seiner Übersicht die Spiele aller
          Mannschaften; die Trainingsbeteiligung bleibt dort, wo sie hingehört:
          beim Trainerteam der jeweiligen Mannschaft.
        </p>
      </div>
    </section>
  );
}
