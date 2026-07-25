import { Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import {
  BoardKicker,
  BoardScreenshot,
  CourtDiagram,
  Grain,
  MarkerArrow,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';

/** Short, true promises under the hero CTAs — no claim beyond PRODUCT.md. */
const TRUST = ['Made in Germany', 'Kostenlos starten', 'Offline in der Halle'];

/**
 * Court-ground hero for the brand page — the Trainertafel world's signature
 * band. The handball court (with the 6:0 defence chalked on) sits behind the
 * copy, the H1 carries the primary brand query ("Was ist Statix?") with the
 * name swiped in the coach's marker, and the intro answers it in one paragraph
 * so search and answer engines can lift it directly. A real in-app shot is
 * pinned to the board on the right. Static server component (no client JS).
 * @returns A JSX element rendering the court hero with copy, CTAs and a pinned product screenshot.
 */
export default function BrandHeader() {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.3}
        aria-hidden
        className='pointer-events-none absolute -left-[22%] top-1/2 h-[92%] w-auto -translate-y-1/2 text-chalk/[0.12] sm:-left-[14%] lg:-left-[8%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-28 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:pb-24 lg:pt-32'>
        <div className='w-full shrink-0 text-center lg:w-[46%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            Statix im Überblick
          </BoardKicker>

          <h1 className='mt-5 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-chalk sm:text-[3.4rem] lg:text-[3.75rem]'>
            Was ist{' '}
            <span className='relative inline-block text-primary'>
              Statix
              <MarkerUnderline color='marker' />
            </span>
            ?
          </h1>

          <p className='mx-auto mt-6 max-w-[560px] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8 lg:mx-0'>
            Statix ist die Handball-Statistik-App für Trainer, Vereine und
            Teams: Spiele live per Tap erfassen – Tore, Würfe, Paraden, Strafen
            und Wechsel – und Wurfquoten, Wurfbilder, Spielerwerte und
            KI-Analysen automatisch auswerten. Entwickelt in Deutschland, direkt
            im Browser, offline-fähig in der Halle.
          </p>

          <div className='relative mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start'>
            <HeroActionButton
              variant='primary'
              icon={<Play className='size-4 fill-current' />}
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'>
              Live-Demo ohne Account
            </HeroActionButton>
            <HeroActionButton variant='secondary' href='/'>
              Alle Funktionen ansehen
            </HeroActionButton>
          </div>

          <div className='mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start'>
            {TRUST.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>
        </div>

        <div className='relative w-full lg:min-w-0 lg:flex-1'>
          <MarkerArrow
            variant='curve'
            color='marker'
            aria-hidden
            className='absolute -left-8 -top-10 hidden h-16 w-28 -rotate-12 lg:block'
          />
          <BoardScreenshot
            src='/recordStatsInGame.png'
            alt='Statix Handball-App: Spielstatistiken live per Tap erfassen'
            width={1916}
            height={879}
            label='Statix – Live-Erfassung im Spiel'
            tone='court'
            pin='tape'
            live
            priority
            sizes='(max-width: 1024px) 100vw, 52vw'
          />
        </div>
      </div>
    </header>
  );
}
