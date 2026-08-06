import { Play } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import HeroActionButton from '@/features/landing-page/components/hero-action-button';
import HeroTrustBadge from '@/features/landing-page/components/hero-trust-badge';
import {
  BoardKicker,
  BoardScreenshot,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';

interface SegmentHeaderProps {
  kicker: string;
  /** H1 split so one word can carry the marker swipe. */
  titleLead: string;
  titleHighlight: string;
  titleTail?: string;
  lede: string;
  trust: string[];
  screenshot: { src: string; alt: string; label: string };
}

/**
 * Shared court hero for the audience pages (`/fuer-vereine`,
 * `/fuer-jugendtrainer`). Same band grammar as the other commercial pages, with
 * per-audience copy passed in — the two pages differ in argument, not in world.
 * @returns A JSX element rendering the audience hero on the court ground.
 */
export default function SegmentHeader({
  kicker,
  titleLead,
  titleHighlight,
  titleTail,
  lede,
  trust,
  screenshot,
}: SegmentHeaderProps) {
  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        formation
        formationOpacity={0.28}
        aria-hidden
        className='pointer-events-none absolute -left-[22%] top-1/2 h-[92%] w-auto -translate-y-1/2 text-chalk/[0.12] sm:-left-[14%] lg:-left-[8%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-28 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:pb-24 lg:pt-32'>
        <div className='w-full shrink-0 text-center lg:w-[48%] lg:text-left'>
          <BoardKicker color='chalk' className='justify-center lg:justify-start'>
            {kicker}
          </BoardKicker>

          <h1 className='mt-5 font-display text-[2.3rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-chalk sm:text-[3rem]'>
            {titleLead}{' '}
            <span className='relative inline-block text-primary'>
              {titleHighlight}
              <MarkerUnderline color='marker' />
            </span>
            {titleTail ? ` ${titleTail}` : null}
          </h1>

          <p className='mx-auto mt-6 max-w-[58ch] text-base leading-7 text-chalk/75 sm:text-lg sm:leading-8 lg:mx-0'>
            {lede}
          </p>

          <div className='mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start'>
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

          <div className='mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start'>
            {trust.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>
        </div>

        <div className='w-full lg:min-w-0 lg:flex-1'>
          <BoardScreenshot
            src={screenshot.src}
            alt={screenshot.alt}
            width={1916}
            height={879}
            label={screenshot.label}
            tone='court'
            pin='tape'
            priority
            sizes='(max-width: 1024px) 100vw, 50vw'
          />
        </div>
      </div>
    </header>
  );
}
