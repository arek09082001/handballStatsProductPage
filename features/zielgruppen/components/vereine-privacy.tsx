import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardCard,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';

/**
 * Data protection for a club board — the question that decides whether a club
 * rolls something out. Every statement here mirrors what already stands in the
 * AGB (§ 7, Auftragsverarbeitung nach Art. 28 DSGVO) and the privacy policy;
 * nothing is promised beyond that.
 * @returns A JSX element rendering the data-protection band on the court ground.
 */
export default function VereinePrivacy() {
  const points = [
    {
      title: 'Auftragsverarbeitung nach Art. 28 DSGVO',
      text: 'Die Spielerdaten, die eure Trainer eingeben, verarbeitet Statix im Auftrag des Vereins. Einen Vertrag zur Auftragsverarbeitung (AVV) stellen wir auf Anforderung bereit – das ist genau das Dokument, nach dem ein Datenschutzbeauftragter fragt.',
    },
    {
      title: 'Pseudonymisiert, bevor eine KI etwas sieht',
      text: 'Spielernamen werden pseudonymisiert, bevor Daten eine KI erreichen. Die Analyse arbeitet mit neutralen Kürzeln statt mit echten Namen, und erstellte Berichte lassen sich jederzeit wieder löschen.',
    },
    {
      title: 'Geteilte Links bleiben widerrufbar',
      text: 'Ein Spiel wird nur öffentlich, wenn ein Trainer es veröffentlicht – und die Freigabe lässt sich wieder zurücknehmen. Auswertungen könnt ihr als PDF exportieren, ohne dass jemand Zugriff auf euer Konto braucht.',
    },
    {
      title: 'Offengelegte Dienstleister',
      text: 'Welche Auftragsverarbeiter beteiligt sind – Hosting, Datenbank, E-Mail-Versand und die KI-Anbieter – steht namentlich in den AGB und der Datenschutzerklärung, inklusive der Hinweise zu Drittlandübermittlungen.',
    },
  ];

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
          kicker='Für den Datenschutzbeauftragten'
          title='Spielerdaten sauber verarbeiten'
          description='Im Verein hängt die Einführung selten am Können der Trainer, sondern an dieser Frage. Deshalb hier die Antwort in vier Punkten.'
        />

        <div className='mt-12 grid gap-5 md:grid-cols-2'>
          {points.map((point) => (
            <BoardCard key={point.title} tone='court' pin='none' className='p-6'>
              <span className='flex size-10 items-center justify-center rounded-xl bg-success/15 text-success'>
                <ShieldCheck className='size-5' />
              </span>
              <h3 className='mt-4 font-display text-lg font-bold tracking-tight text-chalk'>
                {point.title}
              </h3>
              <p className='mt-2 text-[15px] leading-7 text-chalk/75'>{point.text}</p>
            </BoardCard>
          ))}
        </div>

        <p className='mt-10 max-w-[70ch] text-base leading-7 text-chalk/75'>
          Die vollständigen Regelungen stehen in den{' '}
          <Link
            href='/agb'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            AGB (§ 7 Datenschutz und Auftragsverarbeitung)
          </Link>{' '}
          und in der{' '}
          <Link
            href='/impressum'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            Datenschutzerklärung
          </Link>
          . Für einen AVV genügt eine Mail an{' '}
          <a
            href={`mailto:${CLUB_CONFIG.email.main}`}
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            {CLUB_CONFIG.email.main}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
