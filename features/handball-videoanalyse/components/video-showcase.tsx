'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  BoardScreenshot,
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import {
  VIDEO_ANALYSIS_SHOTS,
  type VideoAnalysisShotCopy,
} from '../data/video-analysis-content';

/**
 * Three stations of the video area on the court ground: the tagging bench, the
 * briefing mode, the clip that reached a player. Landscape captures get the
 * full board width, one under the other, like on the feature pages — halved,
 * a screen full of six-point labels turns into texture.
 * @returns A JSX element rendering the captioned app captures on the court.
 */
export default function VideoShowcase() {
  const t = useTranslations('videoAnalysisPage.showcase');
  const copy = t.raw('items') as VideoAnalysisShotCopy[];

  return (
    <section
      id='statix'
      className='relative w-full scroll-mt-24 overflow-hidden bg-court py-20 text-chalk md:py-24'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[18%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.07] sm:-right-[10%] lg:-right-[4%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
          tone='court'
        />

        <div className='mt-12 space-y-12'>
          {VIDEO_ANALYSIS_SHOTS.map((shot, index) => {
            const item = copy[index];
            if (!item) return null;

            return (
              <figure key={shot.src}>
                <BoardScreenshot
                  src={shot.src}
                  alt={item.alt}
                  width={shot.width}
                  height={shot.height}
                  label={item.label}
                  tone='court'
                  pin={index % 2 === 0 ? 'tape' : 'magnet'}
                  sizes='(max-width: 1152px) 100vw, 1104px'
                />
                <Link
                  href={shot.href}
                  className='group mt-4 inline-flex items-center gap-1.5 font-display text-[14px] font-bold text-primary transition-colors hover:text-[#ea580c]'>
                  {item.linkLabel}
                  <ArrowRight className='size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Link>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
