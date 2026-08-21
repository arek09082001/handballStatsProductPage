import Link from 'next/link';
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
 *
 * One pinned note, not four cards. The four points are the answer to a single
 * question, and giving each its own box with the same shield icon in the corner
 * made a checklist look like a feature grid — four identical icons carry no
 * information the headings do not. As one note with four hanging entries it
 * reads the way the document it stands for reads.
 * @returns A JSX element rendering the data-protection band on the court ground.
 */
export default function VereinePrivacy() {
  const points = [
    {
      title: 'Auftragsverarbeitung nach Art. 28 DSGVO',
      text: 'Die Spielerdaten, die eure Trainer eingeben, verarbeitet Statix im Auftrag des Vereins. Einen Vertrag zur Auftragsverarbeitung stellen wir auf Anforderung bereit; das ist genau das Dokument, nach dem ein Datenschutzbeauftragter fragt.',
    },
    {
      title: 'Pseudonymisiert, bevor eine KI etwas sieht',
      text: 'Spielernamen werden pseudonymisiert, bevor Daten eine KI erreichen. Die Analyse arbeitet mit neutralen Kürzeln, und erstellte Berichte lassen sich jederzeit wieder löschen.',
    },
    {
      title: 'Geteilte Links bleiben widerrufbar',
      text: 'Ein Spiel wird nur öffentlich, wenn ein Trainer es veröffentlicht, und die Freigabe lässt sich zurücknehmen. Auf dem Live-Ticker stehen Spielernamen standardmäßig abgekürzt.',
    },
    {
      title: 'Offengelegte Dienstleister',
      text: 'Welche Auftragsverarbeiter beteiligt sind – Hosting, Datenbank, E-Mail-Versand und die KI-Anbieter – steht namentlich in den AGB und der Datenschutzerklärung, samt Hinweisen zu Drittlandübermittlungen.',
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

      <div className='relative mx-auto max-w-4xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          align='left'
          kicker='Für den Datenschutzbeauftragten'
          title='Spielerdaten sauber verarbeiten'
          description='Im Verein hängt die Einführung selten am Können der Trainer, sondern an dieser Frage. Deshalb hier die Antwort in vier Punkten.'
        />

        <BoardCard tone='court' pin='tape' className='mt-12 p-7 sm:p-9'>
          <ul className='flex flex-col gap-7'>
            {points.map((point) => (
              <li key={point.title}>
                <h3 className='font-display text-lg font-bold tracking-tight text-chalk'>
                  {point.title}
                </h3>
                <p className='mt-1.5 max-w-[58ch] text-[15px] leading-7 text-chalk/70'>
                  {point.text}
                </p>
              </li>
            ))}
          </ul>
        </BoardCard>

        <p className='mt-10 max-w-[60ch] text-base leading-7 text-chalk/75'>
          Die vollständigen Regelungen stehen in den{' '}
          <Link
            href='/agb'
            className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
            AGB (§ 7 Datenschutz und Auftragsverarbeitung)
          </Link>{' '}
          und in der{' '}
          <Link
            href='/datenschutz'
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
