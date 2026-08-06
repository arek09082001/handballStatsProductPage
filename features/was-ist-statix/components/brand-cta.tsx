import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerArrow,
} from '@/features/landing-page/components/tactic';

/**
 * Closing CTA — the landing page's final-CTA language: a court signature band
 * with the court (and a chalked formation) behind, the coach's marker kicker,
 * one solid orange action into the app registration and a chalk-ghost link to
 * the no-account live demo, with the Ratgeber as a quiet third step. Static
 * server component (plain anchors).
 * @returns A JSX element rendering the brand-page closing CTA on the court ground.
 */
export default function BrandCta() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
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
          Jetzt verfügbar
        </BoardKicker>

        <h2 className='mx-auto mt-4 max-w-2xl font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-chalk sm:text-[2.4rem]'>
          Statix selbst ausprobieren
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-chalk/75'>
          Statix ist live: Registriere dich kostenlos und erfasse dein erstes
          Spiel – direkt im Browser, ohne Installation. Lieber erst schauen? Die
          Live-Demo läuft mit echten Spieldaten und ganz ohne Account.
        </p>

        <div className='relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row'>
          <MarkerArrow
            variant='curve'
            color='marker'
            aria-hidden
            className='absolute -right-14 -top-10 hidden h-12 w-24 sm:block'
          />
          <a
            href={CLUB_CONFIG.website.appUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-display text-[15px] font-bold tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-[0_18px_30px_-14px_hsl(22_90%_45%/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:translate-y-0 sm:h-14'>
            <UserPlus className='size-4' />
            Jetzt kostenlos registrieren
          </a>
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-chalk/30 bg-chalk/5 px-7 font-display text-[15px] font-bold tracking-tight text-chalk transition-colors duration-200 hover:border-chalk/50 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk/40 focus-visible:ring-offset-2 focus-visible:ring-offset-court sm:h-14'>
            Live-Demo ansehen
          </a>
        </div>

        <Link
          href='/ratgeber'
          className='mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-chalk/70 underline-offset-4 transition-colors duration-200 hover:text-chalk hover:underline'>
          Zum Handball-Ratgeber
        </Link>
      </div>
    </section>
  );
}
