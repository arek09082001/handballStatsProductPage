import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  COACH_COUNT_LABEL,
  LAUNCH_DATE_LABEL,
} from '../data/pricing-content';

/**
 * The one band on this page that is not a table: why there is a price at all,
 * in the operator's own voice and signed with his name.
 *
 * A price rise on a free tool is a trust event, and trust is not restored by a
 * feature grid. It is restored by naming the reason (the bill grows with every
 * squad), the limit (this cannot be carried privately) and the promise that
 * follows from it (the core stays free). Deliberately short — the numbers are
 * two bands further down.
 * @returns A JSX element rendering the operator's note on the paper ground.
 */
export default function PricingWhy() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-3xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='In eigener Sache'
          title='Warum Statix ab Januar Geld kostet'
          description={`Ein Hobbyprojekt, das ${COACH_COUNT_LABEL} benutzen, ist kein Hobbyprojekt mehr – jedenfalls nicht auf der Rechnung.`}
        />

        <BoardCard pin='tape' className='mt-10 p-6 sm:p-8'>
          <p className='max-w-[66ch] text-[17px] leading-8 text-ink/85'>
            Statix ist entstanden, weil ich die Strichliste am Spielfeldrand satt
            hatte – für meine eigene Mannschaft, an Abenden nach dem Training.
            Inzwischen erfassen {COACH_COUNT_LABEL} ihre Spiele damit, und
            darüber freue ich mich jedes Mal.
          </p>
          <p className='mt-5 max-w-[66ch] text-[15px] leading-7 text-ink/75'>
            Nur wächst mit jeder Mannschaft auch die Rechnung: Server und
            Datenbank laufen rund um die Uhr, jede KI-Analyse ist ein bezahlter
            Modellaufruf, jeder geteilte Bericht rendert ein PDF und verschickt
            eine E-Mail, jedes hochgeladene Spielvideo belegt dauerhaft Speicher.
            Das kann ich auf Dauer nicht privat tragen. Deshalb gibt es ab dem{' '}
            {LAUNCH_DATE_LABEL} bezahlte Pläne.
          </p>
          <p className='mt-5 max-w-[66ch] text-[15px] leading-7 text-ink/75'>
            Was dabei nicht passiert: Statix wird nicht hinter einer Kasse
            verschwinden. Die Grundfunktionen bleiben kostenlos – begrenzt zwar,
            aber vollständig benutzbar, damit ein Jugendtrainer mit einer
            Mannschaft weiter damit arbeiten kann. Bezahlt wird das, was
            tatsächlich Rechenzeit, Speicher und Versand kostet. Und die
            Erfassung selbst ist in keinem Plan beschnitten: Eine Paywall in der
            58. Minute kostet nicht den Kunden, sondern das Spielprotokoll.
          </p>
          <p className='mt-6 font-hand text-2xl text-primary'>
            {CLUB_CONFIG.address.contactName}
          </p>
          <p className='text-[13px] text-ink/70'>
            Entwickler von Statix, Handballtrainer
          </p>
        </BoardCard>
      </div>
    </section>
  );
}
