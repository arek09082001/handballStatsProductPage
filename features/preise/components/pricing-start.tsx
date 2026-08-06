import Link from 'next/link';
import { Grain, PlayerMagnet, SectionHeading } from '@/features/landing-page/components/tactic';

/** The three steps between "gerade gelesen" and "erstes Spiel erfasst". */
const STEPS = [
  {
    number: 1,
    title: 'Demo öffnen – ohne Account',
    text: 'Die Live-Demo ist eine voll gefüllte Statix-Version mit echten Spieldaten. Kein Formular, keine E-Mail-Adresse, kein Passwort. Du siehst in zwei Minuten, wie die Erfassung an der Bank läuft.',
  },
  {
    number: 2,
    title: 'Konto anlegen – E-Mail genügt',
    text: 'Willst du dein eigenes Team führen, brauchst du ein Konto. Dafür reicht eine E-Mail-Adresse. Es gibt kein Feld für Zahlungsdaten, weil es keinen Bezahlvorgang gibt.',
  },
  {
    number: 3,
    title: 'Erstes Spiel erfassen',
    text: 'Kader anlegen, Spiel starten, tippen. Nach dem Schlusspfiff stehen Wurfquoten, Wurfbilder und Spielerwerte fertig da – ohne dass du abends noch etwas abtippst.',
  },
] as const;

/**
 * Answers "kostenlos starten – was heißt das genau?" as three concrete steps
 * instead of a promise. The numbered magnets are the board's point-list bullet
 * (see DESIGN.md).
 * @returns A JSX element rendering the three onboarding steps on the paper panel ground.
 */
export default function PricingStart() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Ohne Kleingedrucktes'
          title='Kostenlos starten – was heißt das genau?'
          description='Nicht „14 Tage gratis, danach sehen wir weiter“. Sondern: es gibt schlicht nichts zu bezahlen.'
        />

        <ol className='mt-12 flex flex-col gap-8'>
          {STEPS.map((step) => (
            <li key={step.number} className='flex items-start gap-4 sm:gap-5'>
              <PlayerMagnet number={step.number} size='lg' className='shrink-0' />
              <div>
                <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
                  {step.title}
                </h3>
                <p className='mt-2 max-w-[64ch] text-[15px] leading-7 text-ink/75'>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className='mt-10 max-w-[68ch] text-base leading-7 text-ink/70'>
          Wenn dich vor allem interessiert, was dauerhaft ohne Bezahlung geht,
          steht das ausführlich auf der Seite{' '}
          <Link
            href='/handball-statistik-app-kostenlos'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Handball-Statistik-App kostenlos nutzen
          </Link>
          . Wer erst wissen will, was die App überhaupt macht, ist bei{' '}
          <Link
            href='/was-ist-statix'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Was ist Statix?
          </Link>{' '}
          richtig.
        </p>
      </div>
    </section>
  );
}
