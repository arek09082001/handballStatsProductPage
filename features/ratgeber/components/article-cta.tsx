import { Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerArrow,
} from '@/features/landing-page/components/tactic';

/**
 * Product CTA at the foot of every article — the landing page's final‑CTA
 * language reused on the Read surface: a court signature band with the court
 * chalked behind, the coach's marker kicker, and one solid orange action to the
 * no‑account live demo. Static server component (no client JS).
 */
export default function ArticleCta() {
  return (
    <section className='relative w-full overflow-hidden bg-court py-16 text-chalk md:py-20'>
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.24}
        aria-hidden
        className='pointer-events-none absolute -left-[16%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.09] sm:-left-[9%] lg:-left-[3%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-3xl px-6 text-center sm:px-8'>
        <BoardKicker color='chalk' className='justify-center'>
          Live-Demo
        </BoardKicker>

        <h2 className='mx-auto mt-4 max-w-2xl font-display text-[1.85rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-chalk sm:text-[2.3rem]'>
          Handball-Statistik ohne Zettelwirtschaft
        </h2>
        <p className='mx-auto mt-4 max-w-xl text-base leading-7 text-chalk/75'>
          Erfasse Tore, Würfe und Paraden live per Tap und lass Statix
          Wurfquoten, Wurfbilder und Spielertrends automatisch berechnen –
          offline in der Halle. Teste die Live-Demo ohne Account.
        </p>

        <div className='relative mt-8 inline-flex'>
          <MarkerArrow
            variant='curve'
            color='marker'
            aria-hidden
            className='absolute -top-10 -right-14 hidden h-12 w-24 sm:block'
          />
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='group inline-flex h-13 items-center justify-center gap-2 rounded-xl bg-primary px-7 font-display text-[15px] font-bold tracking-tight text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-[0_18px_30px_-14px_hsl(22_90%_45%/0.8)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:translate-y-0 sm:h-14'>
            <Play className='size-4 fill-current' />
            Live-Demo starten
          </a>
        </div>
      </div>
    </section>
  );
}
