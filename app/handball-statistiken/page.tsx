import type { Metadata } from 'next';
import HandballStatistikenPage from '@/features/handball-statistiken/pages/handball-statistiken-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import {
  STAT_GROUPS,
  STAT_STEPS,
  STATS_FAQS,
  STATS_PAGE_PATH,
} from '@/features/handball-statistiken/data/stats-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Statistiken: erfassen, berechnen, auswerten',
  description:
    'Alle Handball-Statistiken im Überblick: Wurfquote, Angriffseffektivität, Paradenquote und Tempoanteil – mit Formeln, Richtwerten und einer Anleitung zum Live-Erfassen.',
  path: STATS_PAGE_PATH,
  keywords: [
    'handball statistiken',
    'handball statistik',
    'handball statistiken erfassen',
    'handball statistiken führen',
    'handball kennzahlen',
    'handball statistik erklärung',
    'welche statistiken gibt es im handball',
    'handball statistik auswerten',
    'handball statistik formeln',
    'handball statistik richtwerte',
  ],
  imagePath: '/statsTableInGame.png',
});

/**
 * Route shell for `/handball-statistiken` – the topic hub for the head term.
 * It carries the informational intent (which statistics exist, how they are
 * calculated), while `/` stays on the product intent ("Handball-Statistik-App")
 * so the two do not compete for the same query.
 *
 * Schema is WebPage + Breadcrumb + FAQPage + HowTo + a DefinedTermSet built
 * from the same catalogue the page renders, so the markup can never claim a
 * metric the visible page does not list.
 */
export default function Page() {
  const pageUrl = absoluteUrl(STATS_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='handball-statistiken'
        name='Handball-Statistiken: erfassen, berechnen, auswerten'
        description='Welche Handball-Statistiken es gibt, wie sie berechnet werden, welche Richtwerte im Amateurbereich gelten und wie Trainer sie live am Spielfeldrand erfassen.'
        path={STATS_PAGE_PATH}
        imagePath='/statsTableInGame.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Handball-Statistiken', path: STATS_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='handball-statistiken-terms-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          '@id': `${pageUrl}#kennzahlen`,
          name: 'Handball-Statistiken und Kennzahlen',
          description:
            'Die Kennzahlen, mit denen ein Handballspiel ausgewertet wird – von Wurfquote und Angriffseffektivität bis Paradenquote und Tempoanteil.',
          inLanguage: 'de-DE',
          url: pageUrl,
          hasDefinedTerm: STAT_GROUPS.flatMap((group) =>
            group.stats.map((stat) => ({
              '@type': 'DefinedTerm',
              name: stat.term,
              description: stat.definition,
              inDefinedTermSet: `${pageUrl}#kennzahlen`,
            })),
          ),
        }}
      />
      <JsonLdScript
        id='handball-statistiken-howto-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          '@id': `${pageUrl}#anleitung`,
          name: 'Handball-Statistik führen',
          description:
            'In fünf Schritten von der ersten Strichliste zu einer Auswertung, aus der eine Trainingsentscheidung folgt.',
          inLanguage: 'de-DE',
          step: STAT_STEPS.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.title,
            text: step.text,
            url: `${pageUrl}#anleitung`,
          })),
        }}
      />
      <JsonLdScript
        id='handball-statistiken-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: STATS_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <HandballStatistikenPage />
    </>
  );
}
