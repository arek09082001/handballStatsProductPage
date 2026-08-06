import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerArrow,
} from '@/features/landing-page/components/tactic';

interface BoardCtaProps {
  kicker: string;
  title: string;
  description: string;
  /** Label of the solid orange action; always points at the app registration. */
  primaryLabel?: string;
  /** Quiet third step under the buttons — a page-specific internal link. */
  linkHref?: string;
  linkLabel?: string;
}

/**
 * The closing CTA band shared by the commercial pages — the same language as
 * the landing page and the brand page since launch: one solid orange action
 * into the app registration, a chalk-ghost link to the no-account live demo,
 * and a quiet internal link as a third step. Static server component (plain
 * anchors), so these pages stay zero-JS.
 * @returns A JSX element rendering the closing CTA on the court ground.
 */
export default function BoardCta({
  kicker,
  title,
  description,
  primaryLabel = 'Jetzt kostenlos registrieren',
  linkHref,
  linkLabel,
}: BoardCtaProps) {
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
          {kicker}
        </BoardKicker>

        <h2 className='mx-auto mt-4 max-w-2xl font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-chalk sm:text-[2.4rem]'>
          {title}
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-chalk/75'>
          {description}
        </p>

        {/* The row shrinks to the buttons, so the marker arrow can be placed
            relative to the primary action instead of the text column. */}
        <div className='mt-9 flex justify-center'>
          <div className='relative flex flex-col items-center gap-3 sm:flex-row'>
            <MarkerArrow
              variant='curve'
              color='marker'
              aria-hidden
              className='absolute -top-10 left-6 hidden h-14 w-28 sm:block'
            />
            <a
              href={CLUB_CONFIG.website.appUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-display text-[15px] font-bold tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-[0_18px_30px_-14px_hsl(22_90%_45%/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:translate-y-0 sm:h-14'>
              <UserPlus className='size-4' />
              {primaryLabel}
            </a>
            <a
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-chalk/30 bg-chalk/5 px-7 font-display text-[15px] font-bold tracking-tight text-chalk transition-colors duration-200 hover:border-chalk/50 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk/40 focus-visible:ring-offset-2 focus-visible:ring-offset-court sm:h-14'>
              Live-Demo ansehen
            </a>
          </div>
        </div>

        {linkHref && linkLabel ? (
          <Link
            href={linkHref}
            className='mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-chalk/70 underline-offset-4 transition-colors duration-200 hover:text-chalk hover:underline'>
            {linkLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
