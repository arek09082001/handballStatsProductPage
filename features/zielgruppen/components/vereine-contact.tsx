import { Mail, MessagesSquare } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import ContactFormSection from '@/features/kontakt/components/contact-form-section';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
} from '@/features/landing-page/components/tactic';
import {
  VEREINE_CONTACT_ANCHOR,
  VEREINE_CONTACT_TOPIC,
} from '../data/vereine-content';

/**
 * The club page's closing band, and the only conversion it has: an enquiry.
 *
 * The shared `BoardCta` is deliberately not used here. It points at the app
 * registration, which is the right ask for a coach and the wrong one for a
 * club — a club cannot register itself, because the club level is set up by
 * hand. So the band asks for a sentence instead of a sign-up, and the form
 * stands directly underneath rather than one click away: a visitor who has
 * scrolled this far has already decided to ask.
 *
 * The form carries the club subject line pre-filled, so an enquiry arrives
 * labelled as one and does not have to be sorted by hand.
 * @returns A JSX element rendering the enquiry band on the court ground.
 */
export default function VereineContact() {
  return (
    <section id={VEREINE_CONTACT_ANCHOR} className='w-full scroll-mt-24'>
      <div className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-24'>
        <CourtDiagram
          variant='goal'
          formation
          formationOpacity={0.24}
          aria-hidden
          className='pointer-events-none absolute -left-[16%] top-1/2 h-[116%] w-auto -translate-y-1/2 text-chalk/[0.1] sm:-left-[9%] lg:-left-[3%]'
        />
        <Grain tone='court' />

        <div className='relative mx-auto max-w-3xl px-6 text-center sm:px-8'>
          <BoardKicker color='chalk' className='justify-center'>
            Kein Preisschild, ein Gespräch
          </BoardKicker>

          <h2 className='mx-auto mt-4 max-w-2xl font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-chalk sm:text-[2.4rem]'>
            Erzählt uns von eurem Verein
          </h2>
          <p className='mx-auto mt-4 max-w-[58ch] text-base leading-7 text-chalk/75'>
            Wie viele Mannschaften habt ihr, wie viele davon in der Jugend, und
            was soll am Ende an einer Stelle stehen? Drei Sätze reichen. Ihr
            bekommt eine Einschätzung dazu, ob der Vereinsbereich zu euch passt,
            und ein Angebot in eurer Größe statt einer Zahl von der Stange.
          </p>

          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <a
              href={`mailto:${CLUB_CONFIG.email.main}?subject=${encodeURIComponent(
                VEREINE_CONTACT_TOPIC,
              )}`}
              className='inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-chalk/25 bg-chalk/5 px-6 font-display text-[15px] font-bold tracking-tight text-chalk transition-colors hover:border-chalk/45 hover:bg-chalk/10'>
              <Mail className='size-4 text-primary' />
              {CLUB_CONFIG.email.main}
            </a>
            <span className='inline-flex items-center gap-2 text-sm text-chalk/60'>
              <MessagesSquare className='size-4' />
              oder direkt hier im Formular
            </span>
          </div>
        </div>
      </div>

      <ContactFormSection anchorId='vereinsformular' defaultTopic={VEREINE_CONTACT_TOPIC} />
    </section>
  );
}
