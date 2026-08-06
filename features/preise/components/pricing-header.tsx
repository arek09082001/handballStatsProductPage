import { Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';

/** Short, true promises under the CTAs — nothing beyond PRODUCT.md. */
const TRUST = ['Aktuell 0 €', 'Keine Kreditkarte', 'Demo ohne Account'];

/**
 * Court-ground hero for `/preise`. The H1 carries the commercial query
 * ("Preise" + "Handball-Statistik-App"), and the lede answers the cost question
 * in the first two sentences so search and answer engines can lift it directly.
 * Static server component (no client JS).
 * @returns A JSX element rendering the pricing hero on the court ground.
 */
export default function PricingHeader() {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.26}
        aria-hidden
        className='pointer-events-none absolute -left-[20%] top-1/2 h-[92%] w-auto -translate-y-1/2 text-chalk/[0.12] sm:-left-[12%] lg:-left-[6%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-4xl px-6 pb-16 pt-28 text-center sm:px-10 lg:pb-24 lg:pt-32'>
        <BoardKicker color='chalk' className='justify-center'>
          Preise & Kosten
        </BoardKicker>

        <h1 className='mt-5 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3.2rem]'>
          Preise für die Handball-Statistik-App{' '}
          <span className='relative inline-block text-primary'>
            Statix
            <MarkerUnderline color='marker' />
          </span>
        </h1>

        <p className='mx-auto mt-6 max-w-[62ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
          Kurz und ehrlich: Statix kostet dich aktuell nichts. Der volle
          Funktionsumfang ist kostenlos nutzbar, es gibt keinen Bezahlvorgang und
          kein Abo in der App – also auch keine Kreditkarte und keine Testphase,
          die irgendwann ausläuft. Geplant ist später ein Abo für 3,99 € im
          Monat.
        </p>

        <div className='mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <HeroActionButton
            variant='primary'
            icon={<Play className='size-4 fill-current' />}
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'>
            Live-Demo ohne Account
          </HeroActionButton>
          <HeroActionButton variant='secondary' href='/#newsletter'>
            Launch-Angebot sichern
          </HeroActionButton>
        </div>

        <div className='mt-7 flex flex-wrap items-center justify-center gap-2'>
          {TRUST.map((item) => (
            <HeroTrustBadge key={item} label={item} />
          ))}
        </div>
      </div>
    </header>
  );
}
