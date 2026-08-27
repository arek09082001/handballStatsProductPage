import type { Metadata } from 'next';
import JsonLdScript from '@/components/seo/json-ld-script';
import PageSchema from '@/components/seo/page-schema';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import FeaturesIndexPage from '@/features/funktionen/pages/features-index-page';
import {
  FEATURES,
  FEATURES_PAGE_PATH,
  featurePath,
  featureStateNote,
} from '@/features/funktionen/data/features';
import { FEATURES_INDEX_FAQS } from '@/features/funktionen/data/index-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Alle Funktionen der Handball-Statistik-App Statix',
  description:
    'Der vollständige Funktionsumfang von Statix: Live-Erfassung, Wurfbilder, KI-Analyse, Terminverwaltung mit Trainingsbeteiligung, Turniere, Live-Ticker, Vereinsbereich und das Video-Tagging im Aufbau — jede Funktion mit eigener Seite und echten Screenshots.',
  path: FEATURES_PAGE_PATH,
  imagePath: '/heroImage.png',
  keywords: [
    'handball statistik app funktionen',
    'handball app funktionen',
    'statix funktionen',
    'handball trainer software funktionen',
    'handball statistik software',
  ],
});

export default function Page() {
  const pageUrl = absoluteUrl(FEATURES_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='funktionen'
        type='CollectionPage'
        name='Alle Funktionen der Handball-Statistik-App Statix'
        description='Jede Funktion von Statix mit eigener Seite: Live-Erfassung, Auswertung, Terminverwaltung, Turniere, Video-Tagging und Vereinsbereich.'
        path={FEATURES_PAGE_PATH}
        imagePath='/heroImage.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Funktionen', path: FEATURES_PAGE_PATH },
        ]}
      />

      {/* The index as an ItemList, so an answer engine asked "what can Statix
          do" gets the list with its links rather than having to infer it from
          the cards. Generated from the same catalogue as the page. */}
      <JsonLdScript
        id='funktionen-itemlist-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${pageUrl}#features`,
          name: 'Funktionen von Statix',
          numberOfItems: FEATURES.length,
          itemListElement: FEATURES.map((feature, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: feature.name,
            description: feature.summary + featureStateNote(feature.status),
            url: absoluteUrl(featurePath(feature.slug)),
          })),
        }}
      />

      <JsonLdScript
        id='funktionen-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: FEATURES_INDEX_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />

      <FeaturesIndexPage />
    </>
  );
}
