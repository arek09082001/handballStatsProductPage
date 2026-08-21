import Link from 'next/link';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * Answers the club-budget query head-on ("Was kostet Statix für einen
 * Verein?"). The H2 is the exact question a treasurer types into Google.
 *
 * The answer is deliberately split: the coach's own start stays free and is
 * stated as such, while the club level — which is set up by hand and sized to
 * the number of squads — carries no figure at all and hands over to an enquiry.
 * Naming one number for a club with two squads and a club with twelve would be
 * wrong for at least one of them, and a price nobody can pay yet is not a
 * price. Everything commercial about clubs therefore lives on `/fuer-vereine`.
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
              Für den ganzen Verein: auf Anfrage
            </h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Wer alle Mannschaften unter ein Dach holen will – eine
              Vereinsübersicht, vereinsweite Auswertung, Spielerlaufbahnen über
              die Jugenden hinweg –, bekommt den Vereinsbereich. Der wird für
              euch eingerichtet, und was er kostet, hängt daran, wie groß euer
              Verein ist. Deshalb steht hier keine Zahl von der Stange, sondern
              eine Einladung: schreibt kurz, wie viele Mannschaften ihr habt.
            </p>
            <Link
              href='/fuer-vereine#vereinsanfrage'
              className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Konditionen für Vereine anfragen
            </Link>
          </BoardCard>
        </div>

        <p className='mt-8 max-w-[68ch] text-base leading-7 text-ink/70'>
          Was ein Verein davon hat, wenn alle Mannschaften nach demselben Schema
          erfassen – ein Standard über alle Teams, Kader und
          Trainingsbeteiligung an einem Ort, Entwicklung über alle
          Jugendmannschaften, Datenschutz sauber geregelt – steht auf der Seite{' '}
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
