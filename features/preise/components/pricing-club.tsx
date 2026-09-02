import Link from 'next/link';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';

/**
 * Answers the club-budget query head-on ("Was kostet Statix für einen
 * Verein?"). The H2 is the exact question a treasurer types into Google.
 *
 * The answer stays split even now that the coach tiers carry figures: a coach
 * pays a listed price, a club is quoted one. Naming a single number for a club
 * with two squads and a club with twelve would be wrong for at least one of
 * them, so this band gives an order of magnitude to budget against and hands
 * over to an enquiry. Everything else commercial about clubs lives on
 * `/fuer-vereine`.
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
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              Ein Trainer, mehrere Mannschaften
            </h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Dafür braucht es keinen Vereinsvertrag. Ein Trainer-Konto trägt
              drei Mannschaften – A-Jugend, Damen, Herren, wie es bei euch
              zugeschnitten ist – mit je zwei Co-Trainern, für 79 € je Saison.
              Das ist weniger als eine Vereinslizenz der üblichen
              Organisations-Apps und bringt Statistik, Wurfbilder und KI mit.
            </p>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Refinanzieren lässt sich das im Verein oft komplett: Ab der
              Trainer-Stufe darf im öffentlichen Live-Ticker ein Sponsor stehen,
              und ein Bandenpartner trägt den Betrag in aller Regel allein.
            </p>
          </BoardCard>

          <BoardCard pin='magnet' pinColor='opponent' className='p-6 sm:p-7'>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              Der ganze Verein: auf Anfrage
            </h3>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Wer alle Mannschaften unter ein Dach holen will – eine
              Vereinsübersicht, vereinsweite Auswertung, Spielerlaufbahnen über
              die Jugenden hinweg –, bekommt den Vereinsbereich. Als
              Anhaltspunkt für den Haushalt: rund 390 € je Saison für fünf
              Mannschaften, nach Größe gestaffelt.
            </p>
            <p className='mt-3 text-[15px] leading-7 text-ink/75'>
              Einen Listenpreis gibt es bewusst nicht. Was ein Verein mit zwölf
              Jugendmannschaften braucht, ist etwas anderes als bei zweien –
              schreibt kurz, wie viele Mannschaften ihr habt, dann kommt ein
              passendes Angebot zurück.
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
