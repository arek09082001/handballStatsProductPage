'use client';

import { useTranslations } from 'next-intl';
import ChapterFilm from '@/features/landing-page/components/chapter-film';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { stepsFilmBounds, VIDEO_ANALYSIS_FILM } from '@/features/films/data/films';
import type { VideoAnalysisStep } from '../data/video-analysis-content';

/**
 * The five steps from the tripod in the hall to the clip on a player's phone,
 * shown as a chaptered film (Remotion, repo remotion-statix, `FilmVideoanalyse`)
 * instead of five paragraphs. The step texts stay in the document — as the
 * chapter labels, as a transcript to unfold, and as the full list when motion
 * is reduced — and are mirrored into `HowTo` schema by the route.
 * @returns A JSX element rendering the numbered workflow band on paper.
 */
export default function VideoWorkflow() {
  const t = useTranslations('videoAnalysisPage.workflow');
  const steps = t.raw('steps') as VideoAnalysisStep[];

  return (
    <section
      id='ablauf'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-10'>
          <ChapterFilm
            name={VIDEO_ANALYSIS_FILM}
            dir='films'
            bounds={stepsFilmBounds(steps.length)}
            tone='paper'
            chapters={steps.map((step) => ({ label: step.title, text: step.text }))}
            alt={t('filmAlt')}
            chaptersLabel={t('title')}
            playLabel={t('play')}
            pauseLabel={t('pause')}
            transcriptLabel={t('transcript')}
          />
        </div>
      </div>
    </section>
  );
}
