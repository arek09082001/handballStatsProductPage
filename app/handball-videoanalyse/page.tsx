import type { Metadata } from 'next';
import HandballVideoanalysePage from '@/features/handball-videoanalyse/pages/handball-videoanalyse-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import {
  VIDEO_ANALYSIS_CRITERIA,
  VIDEO_ANALYSIS_FAQS,
  VIDEO_ANALYSIS_PAGE_PATH,
  VIDEO_ANALYSIS_STEPS,
} from '@/features/handball-videoanalyse/data/video-analysis-content';

export const metadata: Metadata = createPageMetadata({
  // Google autocomplete (Nov 2026) for the head term offers exactly four
  // continuations: "app", "software", "kostenlos" and "tool". The title
  // carries the head term and "Software"; the description the other three,
  // in the words a coach types.
  title: 'Handball-Videoanalyse: Software, Ablauf, Tipps',
  description:
    'Handball-Videoanalyse für Trainer: Spiel filmen, Szenen taggen, mit dem Team besprechen und Clips an Spielerinnen schicken – kostenlos, per App oder Software.',
  path: VIDEO_ANALYSIS_PAGE_PATH,
  keywords: [
    'handball videoanalyse',
    'videoanalyse handball',
    'handball videoanalyse software',
    'handball videoanalyse app',
    'videoanalyse handball kostenlos',
    'videoanalyse tool handball',
    'handball video analyse',
    'handball videobesprechung',
    'handball video schneiden',
    'handball szenen taggen',
    'handball spielanalyse video',
    'handball video tagging',
  ],
  imagePath: '/video-tagging-spuren.png',
});

/**
 * Route shell for `/handball-videoanalyse` – the topic hub for the video
 * cluster. It carries the informational and comparison intent (what it is,
 * how it runs, what a tool must do, free or paid), while the feature pages
 * `/funktionen/video-tagging` and `/funktionen/video-besprechung` keep the
 * product detail, so the three do not compete for the same query.
 *
 * Schema is WebPage + Breadcrumb + HowTo + ItemList + FAQPage, all built from
 * the same German bundle the page renders, so the markup can never claim a
 * step, criterion or answer the visible page does not show. Deliberately no
 * `SoftwareApplication` and no `offers` here: the video area is a closed beta,
 * and the site-wide application node already describes the product.
 */
export default function Page() {
  const pageUrl = absoluteUrl(VIDEO_ANALYSIS_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='handball-videoanalyse'
        name='Handball-Videoanalyse: filmen, taggen, besprechen'
        description='Wie Handball-Trainer ein Spiel filmen, Szenen taggen, mit der Mannschaft besprechen und Clips an einzelne Spielerinnen schicken – und was eine Videoanalyse-Software für Handball dafür können muss.'
        path={VIDEO_ANALYSIS_PAGE_PATH}
        imagePath='/video-tagging-spuren.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Handball-Videoanalyse', path: VIDEO_ANALYSIS_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='handball-videoanalyse-howto-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          '@id': `${pageUrl}#ablauf`,
          name: 'Handball-Videoanalyse in fünf Schritten',
          description:
            'Vom Stativ in der Halle bis zur Szene auf dem Handy der Spielerin: filmen, abgleichen, taggen, besprechen, verschicken.',
          inLanguage: 'de-DE',
          tool: [
            { '@type': 'HowToTool', name: 'Smartphone' },
            { '@type': 'HowToTool', name: 'Stativ' },
          ],
          step: VIDEO_ANALYSIS_STEPS.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.title,
            text: step.text,
            url: `${pageUrl}#ablauf`,
          })),
        }}
      />
      <JsonLdScript
        id='handball-videoanalyse-criteria-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${pageUrl}#software`,
          name: 'Was eine Videoanalyse-Software für Handball können muss',
          numberOfItems: VIDEO_ANALYSIS_CRITERIA.length,
          itemListElement: VIDEO_ANALYSIS_CRITERIA.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            description: item.text,
          })),
        }}
      />
      <JsonLdScript
        id='handball-videoanalyse-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: VIDEO_ANALYSIS_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <HandballVideoanalysePage />
    </>
  );
}
