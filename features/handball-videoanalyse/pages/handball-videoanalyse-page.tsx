'use client';

import { useTranslations } from 'next-intl';
import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import VideoHeader from '../components/video-header';
import VideoWorkflow from '../components/video-workflow';
import VideoChecklist from '../components/video-checklist';
import VideoWays from '../components/video-ways';
import VideoShowcase from '../components/video-showcase';
import VideoGuides from '../components/video-guides';
import { VIDEO_ANALYSIS_REQUEST_PATH } from '../data/video-analysis-content';

/**
 * Pillar page `/handball-videoanalyse` — the topic hub for "Handball-
 * Videoanalyse" and its commercial variants (software, app, kostenlos). It
 * answers the question first (what it is, how it runs, what a tool must do,
 * the three ways) and only then shows the video area of Statix, which is a
 * closed beta and says so everywhere it appears. The feature pages
 * `/funktionen/video-tagging` and `/funktionen/video-besprechung` keep the
 * product detail, so the three pages do not compete for the same query.
 * @returns A JSX element composing the ordered pillar-page sections.
 */
export default function HandballVideoanalysePage() {
  const t = useTranslations('videoAnalysisPage');

  return (
    <div className='flex w-full flex-col items-center justify-center bg-paper'>
      <VideoHeader />
      <VideoWorkflow />
      <VideoChecklist />
      <VideoWays />
      <VideoShowcase />
      <VideoGuides />
      <BoardFaq
        id='faq'
        kicker={t('faq.kicker')}
        title={t('faq.title')}
        description={t('faq.description')}
        items={t.raw('faq.items') as { question: string; answer: string }[]}
      />
      <BoardCta
        kicker={t('cta.kicker')}
        title={t('cta.title')}
        description={t('cta.description')}
        linkHref={VIDEO_ANALYSIS_REQUEST_PATH}
        linkLabel={t('cta.linkLabel')}
      />
    </div>
  );
}
