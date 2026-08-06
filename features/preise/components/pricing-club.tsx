import Link from 'next/link';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * Answers the club-budget query head-on ("Was kostet Statix für einen
 * Verein?"). The H2 is the exact question a treasurer types into Google; the
 * answer stays inside product truth — free today, club conditions announced
 * before launch — and hands off to the club segment page.
 * @returns A JSX element rendering the club-cost band on the paper ground.
 */
export default function PricingClub() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Für die Vereinskasse'
          title='Was kostet Statix für einen Verein?'
          description='Die Frage, die im Vorstand gestellt wird, bevor irgendjemand die App öffnet.'
        />

        <div className='mt-10 grid gap-6 md:grid-cols-2'>
          <BoardCard pin='magnet' className='p-6 sm:p-7'>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>Heute: 0 €</h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Jeder Trainer legt sein eigenes Konto an und führt damit bis zu
              drei Mannschaften – A-Jugend, Damen, Herren, wie es bei euch
              zugeschnitten ist. Pro Team holst du bis zu fünf Trainer dazu,
              offene Einladungen mitgezählt. Es gibt keinen Vertrag, keine
              Mindestlaufzeit und keine Rechnung, die im Kassenbericht auftaucht.
            </p>
          </BoardCard>

          <BoardCard pin='magnet' pinColor='opponent' className='p-6 sm:p-7'>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              Später: noch offen
            </h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Ob ein Verein später pro Trainer, pro Mannschaft oder als Ganzes
              bezahlt, ist nicht entschieden – und deshalb steht hier keine Zahl,
              die ich in drei Monaten zurücknehmen müsste. Sobald die
              Vereinskonditionen stehen, findest du sie auf dieser Seite.
            </p>
          </BoardCard>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          Was ein Verein davon hat, wenn alle Mannschaften nach demselben Schema
          erfassen – ein Standard über alle Teams, Spiele zwischen Trainern
          teilen, Datenschutz sauber geregelt – steht auf der Seite{' '}
          <Link
            href='/fuer-vereine'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Statistik-App für Vereine
          </Link>
          . Für Trainerteams im Jugendbereich lohnt eher der Blick auf{' '}
          <Link
            href='/fuer-jugendtrainer'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Statix für Jugendtrainer
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
