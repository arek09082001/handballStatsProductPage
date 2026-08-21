import {
  Grain,
  MarkerUnderline,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * Training, appointments and who shows up — the half of a club's week that has
 * nothing to do with match day and is nevertheless the reason a coach keeps
 * three tools open.
 *
 * Set as two columns of prose rather than four cards: the four points are one
 * argument (the calendar and the replies live where the games live), and
 * cutting it into four boxes with the same icon in each made it look like four
 * unrelated features. The lead-in of each paragraph carries the claim, so the
 * band still scans in a glance without borrowing card chrome to do it.
 *
 * The claim is deliberately precise: every squad runs its schedule inside
 * Statix. There is no club-wide attendance rollup yet, so this band does not
 * promise one.
 * @returns A JSX element rendering the training band on the paper-2 ground.
 */
export default function VereineTraining() {
  return (
    <section
      id='training'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Training und Beteiligung'
          title='Wer kommt, steht neben dem Spielplan'
          description='Kader, Spiele, Termine und Rückmeldungen liegen an einer Stelle. Kein zweites Werkzeug für den Kalender, keine dritte Liste für die Anwesenheit.'
        />

        <div className='mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2'>
          <p className='max-w-[54ch] text-[15px] leading-7 text-ink/75'>
            <strong className='font-display font-bold text-ink'>
              Training, Spiele und alles dazwischen
            </strong>{' '}
            liegen in einem Kalender, als Einzeltermin oder als Serie über die
            ganze Saison, mit Halle, Adresse und Treffzeit. Wer eine Serie
            verschiebt, verschiebt sie einmal statt achtzehnmal.
          </p>

          <p className='max-w-[54ch] text-[15px] leading-7 text-ink/75'>
            <strong className='font-display font-bold text-ink'>
              Die Spielerinnen sagen selbst zu oder ab
            </strong>
            , über einen Beitrittslink der Mannschaft, ohne Trainer-App und ohne
            dass jemand ihre Zahlen sieht. Der Trainerstab sieht vor dem Training
            die vollständige Liste: wer kommt, wer absagt, wer vielleicht, und von
            wem noch gar nichts kam.
          </p>

          <p className='max-w-[54ch] text-[15px] leading-7 text-ink/75'>
            <strong className='font-display font-bold text-ink'>
              Zwei Wochen Urlaub sind eine Eintragung
            </strong>
            , nicht vierzehn Absagen. Abwesenheiten gelten für einen Zeitraum und
            ziehen sich durch alle Termine darin; in der Teilnahmeliste steht dann
            der Grund statt „keine Rückmeldung“. Warum jemand fehlt, bleibt
            zwischen ihr und dem Trainerteam.
          </p>

          <p className='max-w-[54ch] text-[15px] leading-7 text-ink/75'>
            <strong className='font-display font-bold text-ink'>
              Fällt ein Training aus
            </strong>
            , bekommt die Mannschaft eine Benachrichtigung aufs Handy, ohne dass
            jemand eine Telefonliste durchgeht. Statix lässt sich dafür als App
            auf dem Homescreen installieren, ohne App Store.
          </p>
        </div>

        <p className='mt-12 max-w-[60ch] text-base leading-7 text-ink/70'>
          Den Terminplan führt jede Mannschaft selbst, so wie sie auch ihre Spiele
          erfasst. Der Verein sieht in seiner Übersicht die{' '}
          <span className='relative inline-block font-semibold text-ink'>
            Spiele
            <MarkerUnderline color='marker' />
          </span>{' '}
          aller Mannschaften; die Trainingsbeteiligung bleibt beim Trainerteam der
          jeweiligen Mannschaft.
        </p>
      </div>
    </section>
  );
}
