import { DE_MESSAGES } from '@/lib/messages';
import { featurePath } from '@/features/funktionen/data/features';
import { videoRequestHref } from '@/features/video-anfrage/data/video-request-content';

/** Route of the Handball-Videoanalyse pillar page. */
export const VIDEO_ANALYSIS_PAGE_PATH = '/handball-videoanalyse';

/**
 * Where the pillar's "ask for the beta" actions point: the one request form,
 * tagged with this page as the source so the notification mail says where
 * the visitor came from.
 */
export const VIDEO_ANALYSIS_REQUEST_PATH = videoRequestHref({
  source: 'videoanalyse',
});

export interface VideoAnalysisStep {
  title: string;
  text: string;
}

export interface VideoAnalysisCriterion {
  title: string;
  text: string;
}

/** One way of doing video analysis, as the comparison band shows it. */
export interface VideoAnalysisWayCopy {
  name: string;
  effort: string;
  good: string;
  bad: string;
  /** Empty when the site has no page for this way. */
  linkLabel: string;
}

/** Copy of one screenshot in the showcase band. */
export interface VideoAnalysisShotCopy {
  label: string;
  alt: string;
  linkLabel: string;
}

/**
 * Where each way links, in the order the bundle lists them. The general
 * sports-software way has no page here on purpose: the site does not review
 * other vendors' products.
 */
export const VIDEO_ANALYSIS_WAY_LINKS: readonly (string | null)[] = [
  '/ratgeber/handballspiel-filmen',
  null,
  featurePath('video-tagging'),
];

/**
 * The three captures the showcase pins, in reading order: the tagging bench,
 * the briefing mode, the clip that reached a player. All three are real app
 * captures already used on the feature pages — the briefing shot runs over the
 * drawn hall of the screenshot pipeline, and its caption says so.
 */
export const VIDEO_ANALYSIS_SHOTS = [
  {
    src: '/video-tagging-spuren.png',
    width: 2500,
    height: 1152,
    href: featurePath('video-tagging'),
  },
  {
    src: '/besprechung-zeichnen.png',
    width: 2880,
    height: 1800,
    href: featurePath('video-besprechung'),
  },
  {
    src: '/video-versendet.png',
    width: 2560,
    height: 1546,
    href: featurePath('video-tagging'),
  },
] as const;

/**
 * The Ratgeber articles this page hands off to, in reading order: filming
 * first, then the briefing, then the analysis and the statistics behind it.
 * Resolved against the article data at render time so titles never drift.
 */
export const VIDEO_ANALYSIS_GUIDE_SLUGS = [
  'handballspiel-filmen',
  'handball-videobesprechung',
  'handball-spielanalyse',
  'handballspiele-livestreamen',
  'handball-statistik-fuehren',
  'handball-expected-goals-xg',
];

/** The five steps in German, for the route's `HowTo` node. */
export const VIDEO_ANALYSIS_STEPS: VideoAnalysisStep[] =
  DE_MESSAGES.videoAnalysisPage.workflow.steps;

/** The checklist in German, for the route's `ItemList` node. */
export const VIDEO_ANALYSIS_CRITERIA: VideoAnalysisCriterion[] =
  DE_MESSAGES.videoAnalysisPage.checklist.items;

/** The FAQ in German, word for word what the accordion shows. */
export const VIDEO_ANALYSIS_FAQS: { question: string; answer: string }[] =
  DE_MESSAGES.videoAnalysisPage.faq.items;
