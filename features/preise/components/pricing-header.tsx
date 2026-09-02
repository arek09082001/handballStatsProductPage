import { CalendarClock, UserPlus } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';
import {
  FOUNDER_DEADLINE_LABEL,
  FOUNDER_FREE_UNTIL_LABEL,
  LAUNCH_DATE_LABEL,
} from '../data/pricing-content';

/** Short, true promises under the CTAs — nothing beyond the plan documents. */
const TRUST = [
  'Basis bleibt dauerhaft 0 €',
  'Keine Kreditkarte',
  'Demo ohne Account',
];

/**
 * Court-ground hero for `/preise`. The H1 carries the commercial query, and the
 * lede answers the two questions a coach arrives with in this order: what does
 * it cost from January, and what happens to the account I already have.
 *
 * The deadline strip under the CTAs is the one thing on this page that expires,
 * so it sits above the fold rather than in the founder band further down.
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
          Ab dem {LAUNCH_DATE_LABEL} bekommt Statix bezahlte Pläne: Basis bleibt
          dauerhaft kostenlos, Trainer kostet 79 € je Saison, Pro 159 €. Die
          Live-Erfassung ist in keinem Plan beschnitten – und wer sich vorher
          registriert, behält den Trainer-Plan kostenlos bis zum{' '}
          {FOUNDER_FREE_UNTIL_LABEL}.
        </p>

        <div className='mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <HeroActionButton
            variant='primary'
            icon={<UserPlus className='size-4' />}
            href={CLUB_CONFIG.website.appUrl}
            target='_blank'
            rel='noopener noreferrer'>
            Jetzt kostenlos registrieren
          </HeroActionButton>
          <HeroActionButton
            variant='secondary'
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'>
            Live-Demo ohne Account
          </HeroActionButton>
        </div>

        <p className='mx-auto mt-7 flex max-w-fit items-center gap-2.5 rounded-full border border-primary/45 bg-primary/12 px-4 py-2 text-[15px] font-semibold text-chalk'>
          <CalendarClock className='size-4 shrink-0 text-primary' aria-hidden />
          Stichtag {FOUNDER_DEADLINE_LABEL}
          <span className='font-normal text-chalk/70'>
            · danach zahlen nur Neuregistrierungen
          </span>
        </p>

        <div className='mt-6 flex flex-wrap items-center justify-center gap-2'>
          {TRUST.map((item) => (
            <HeroTrustBadge key={item} label={item} />
          ))}
        </div>
      </div>
    </header>
  );
}
