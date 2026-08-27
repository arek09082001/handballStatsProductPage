import { Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';
import { FEATURES, FEATURE_GROUPS } from '../data/features';

/**
 * Court hero of the feature index.
 *
 * The four group names are the whole navigation of this page and they are in
 * the hero as anchors, because the index is long: a coach who came for
 * "Termine" should not have to scroll past the recording bands to find it.
 * @returns A JSX element rendering the index hero on the court ground.
 */
export default function FeatureIndexHeader() {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      {/* See the note in `feature-header.tsx`: below `sm` the court keeps its
          chalk lines and drops the formation, whose magnets carry team colour
          rather than the group's tint and would sit on top of the headline. */}
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[26%] top-1/2 h-[100%] w-auto -translate-y-1/2 text-chalk/[0.09] sm:hidden'
      />
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.28}
        aria-hidden
        className='pointer-events-none absolute -right-[20%] top-1/2 hidden h-[100%] w-auto -translate-y-1/2 text-chalk/[0.11] sm:-right-[12%] sm:block lg:-right-[6%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-5xl px-6 pb-16 pt-28 sm:px-10 lg:pb-20 lg:pt-32'>
        <BoardKicker color='chalk'>Der volle Kader</BoardKicker>

        <h1 className='mt-5 max-w-3xl font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.035em] text-chalk sm:text-[3.4rem]'>
          Alle{' '}
          <span className='relative inline-block text-primary'>
            Funktionen
            <MarkerUnderline color='marker' />
          </span>{' '}
          von Statix
        </h1>

        <p className='mt-6 max-w-[62ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8'>
          {FEATURES.length} Funktionen, jede mit eigener Seite: was sie macht, wie
          sie sich in der Halle anfühlt, echte Aufnahmen aus der App — und was sie
          ausdrücklich nicht kann. Eine davon wird gerade gebaut und steht als
          solche gekennzeichnet dabei.
        </p>

        <nav aria-label='Funktionsgruppen' className='mt-9 flex flex-wrap gap-2.5'>
          {FEATURE_GROUPS.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className='inline-flex items-center rounded-xl border border-chalk/25 bg-chalk/5 px-4 py-2 font-display text-[15px] font-bold tracking-tight text-chalk transition-colors duration-200 hover:border-chalk/45 hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk/40'>
              {group.name}
            </a>
          ))}
        </nav>

        <div className='mt-9 flex flex-col items-start gap-3 sm:flex-row'>
          <HeroActionButton
            variant='primary'
            icon={<Play className='size-4 fill-current' />}
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'>
            Live-Demo ohne Account
          </HeroActionButton>
          <HeroActionButton variant='secondary' href='/preise'>
            Was kostet das?
          </HeroActionButton>
        </div>
      </div>
    </header>
  );
}
