import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import {
  BoardKicker,
  BoardScreenshot,
  CourtDiagram,
  Grain,
  MarkerArrow,
} from '@/features/landing-page/components/tactic';
import {
  FEATURE_GROUPS,
  FEATURES_PAGE_PATH,
  type Feature,
} from '../data/features';
import FeatureStatusBadge from './feature-status-badge';

/**
 * Court hero of a single feature page.
 *
 * The breadcrumb is a real one, rendered as text rather than only as JSON-LD:
 * these pages are two levels deep and a visitor who arrives from a search
 * result needs a way up that is not the browser's back button.
 *
 * The first screenshot of the feature is pinned beside the copy — except for a
 * feature whose visual is a drawn mock, where the hero stays a text column and
 * the mock gets its own band with the space it needs.
 * @returns A JSX element rendering the feature hero on the court ground.
 */
export default function FeatureHeader({ feature }: { feature: Feature }) {
  const group = FEATURE_GROUPS.find((entry) => entry.id === feature.group);
  const shot = feature.mock ? null : feature.shots[0];

  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      {/* Two diagrams, one breakpoint apart. The chalked formation is the
          signature of this band, but at phone width the court no longer clears
          the text column and its magnets — which carry saturated team colour,
          not the group's chalk tint — land on top of the H1. Below `sm` the
          court keeps its lines and drops the magnets. */}
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -left-[30%] top-1/2 h-[94%] w-auto -translate-y-1/2 text-chalk/[0.09] sm:hidden'
      />
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.28}
        aria-hidden
        className='pointer-events-none absolute -left-[24%] top-1/2 hidden h-[94%] w-auto -translate-y-1/2 text-chalk/[0.11] sm:-left-[15%] sm:block lg:-left-[9%]'
      />
      <Grain tone='court' />

      <div
        className={cnHero(Boolean(shot))}>
        <div className={shot ? 'w-full shrink-0 lg:w-[46%]' : 'mx-auto w-full max-w-3xl'}>
          <nav aria-label='Brotkrumen' className='mb-6'>
            <ol className='flex flex-wrap items-center gap-1 text-[13px] text-chalk/55'>
              <li>
                <Link href='/' className='transition-colors hover:text-chalk'>
                  Startseite
                </Link>
              </li>
              <ChevronRight aria-hidden className='size-3.5 text-chalk/35' />
              <li>
                <Link
                  href={FEATURES_PAGE_PATH}
                  className='transition-colors hover:text-chalk'>
                  Funktionen
                </Link>
              </li>
              <ChevronRight aria-hidden className='size-3.5 text-chalk/35' />
              <li aria-current='page' className='text-chalk/80'>
                {feature.short ?? feature.name}
              </li>
            </ol>
          </nav>

          <BoardKicker color='chalk'>{group?.name ?? 'Funktion'}</BoardKicker>

          <h1 className='mt-4 font-display text-[2.4rem] font-extrabold leading-[1.03] tracking-[-0.035em] text-chalk sm:text-[3.1rem]'>
            {feature.name}
          </h1>

          <p className='mt-5 max-w-[58ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
            {feature.tagline}
          </p>

          <div className='mt-6'>
            <FeatureStatusBadge status={feature.status} tone='court' withHint />
          </div>

          <div className='relative mt-8 flex flex-col items-start gap-3 sm:flex-row'>
            <HeroActionButton
              variant='primary'
              icon={<Play className='size-4 fill-current' />}
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'>
              Live-Demo ohne Account
            </HeroActionButton>
            <HeroActionButton variant='secondary' href={FEATURES_PAGE_PATH}>
              Alle Funktionen
            </HeroActionButton>
          </div>
        </div>

        {shot ? (
          <div className='relative w-full lg:min-w-0 lg:flex-1'>
            <MarkerArrow
              variant='curve'
              color='marker'
              aria-hidden
              className='absolute -left-8 -top-10 hidden h-16 w-28 -rotate-12 lg:block'
            />
            <BoardScreenshot
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              label={shot.label}
              tone='court'
              pin='tape'
              priority
              sizes='(max-width: 1024px) 100vw, 52vw'
            />
          </div>
        ) : null}
      </div>
    </header>
  );
}

/**
 * The hero grid, which is a two-column board with a pinned shot and a single
 * centred column without one. Split out because the class list is long enough
 * that inlining a ternary in the JSX buried the structure.
 */
function cnHero(hasShot: boolean): string {
  return hasShot
    ? 'relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-24 sm:px-10 lg:flex-row lg:gap-14 lg:pb-24 lg:pt-28'
    : 'relative mx-auto w-full max-w-7xl px-6 pb-16 pt-24 sm:px-10 lg:pb-20 lg:pt-28';
}
