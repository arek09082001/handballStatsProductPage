import { UserPlus } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';

const TRUST = [
  'Formeln und Richtwerte',
  'Live erfassen statt abtippen',
  'Kostenlos starten',
];

/**
 * Court hero for `/handball-statistiken`. The lede defines the term in its
 * first sentence and stays under 60 words, so a featured snippet or an answer
 * engine can lift it whole.
 * @returns A JSX element rendering the pillar hero on the court ground.
 */
export default function StatsHeader() {
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
          Kennzahlen im Handball
        </BoardKicker>

        <h1 className='mt-5 font-display text-[2.5rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3.2rem]'>
          <span className='relative inline-block text-primary'>
            Handball-Statistiken
            <MarkerUnderline color='marker' />
          </span>{' '}
          erfassen, berechnen, verstehen
        </h1>

        <p className='mx-auto mt-6 max-w-[62ch] text-base leading-7 text-chalk/80 sm:text-lg sm:leading-8'>
          Handball-Statistiken sind die gezählten Aktionen eines Spiels – Würfe,
          Tore, Paraden, technische Fehler, Zeitstrafen – und die Quoten, die
          daraus entstehen. Diese Seite zeigt, welche Kennzahlen es gibt, wie du
          sie berechnest, welche Werte im Amateurhandball realistisch sind und
          wie du sie erfasst, ohne abends etwas abzutippen.
        </p>

        <div className='mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
          <HeroActionButton
            variant='primary'
            icon={<UserPlus className='size-4' />}
            href={CLUB_CONFIG.website.appUrl}
            target='_blank'
            rel='noopener noreferrer'>
            Statistiken kostenlos erfassen
          </HeroActionButton>
          <HeroActionButton
            variant='secondary'
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'>
            Live-Demo ohne Account
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
