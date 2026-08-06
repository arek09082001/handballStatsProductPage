import type { Metadata } from 'next';
import JugendtrainerPage from '@/features/zielgruppen/pages/jugendtrainer-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata, SITE_URL } from '@/lib/seo';
import {
  JUGENDTRAINER_FAQS,
  JUGENDTRAINER_PAGE_PATH,
} from '@/features/zielgruppen/data/jugendtrainer-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Statistik für Jugendtrainer',
  description:
    'Statistik im Jugendhandball ohne Aufwand: ein Tap pro Aktion von der Bank, Entwicklung über die Saison zeigen, Spielerkarten und Live-Ticker für die Eltern.',
  path: JUGENDTRAINER_PAGE_PATH,
  keywords: [
    'handball statistik jugendtrainer',
    'jugendhandball statistik app',
    'handball statistik app einfach',
    'handball jugend statistik',
    'handball statistik d-jugend',
    'jugendhandball trainer app',
  ],
  imagePath: '/recordStatsInGame.png',
});

/**
 * Route shell for `/fuer-jugendtrainer`. Same schema shape as the club page but
 * a different `Audience`, so the two segment pages stay distinguishable for
 * answer engines instead of reading as duplicates. As on the club page, only
 * the visible FAQ accordion is marked up as `Question`; the objections band
 * quotes sentences, not questions.
 */
export default function Page() {
  const pageUrl = absoluteUrl(JUGENDTRAINER_PAGE_PATH);

  const faqEntities = JUGENDTRAINER_FAQS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  }));

  return (
    <>
      <PageSchema
        id='fuer-jugendtrainer'
        name='Handball-Statistik für Jugendtrainer'
        description='Wie Jugendtrainer im Handball mit einem Tap pro Aktion erfassen, Entwicklung über die Saison zeigen und Eltern per Live-Ticker einbinden – kostenlos und ohne Schulung.'
        path={JUGENDTRAINER_PAGE_PATH}
        imagePath='/recordStatsInGame.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Für Jugendtrainer', path: JUGENDTRAINER_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='fuer-jugendtrainer-audience-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${pageUrl}#audience-page`,
          url: pageUrl,
          name: 'Handball-Statistik für Jugendtrainer',
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          audience: {
            '@type': 'Audience',
            audienceType:
              'Jugendtrainer und Co-Trainer im Handball, von der Minihandball- bis zur A-Jugend',
            name: 'Handball-Jugendtrainer',
            geographicArea: {
              '@type': 'Country',
              name: 'Deutschland',
            },
          },
          mainEntity: {
            '@id': `${SITE_URL}#app`,
          },
        }}
      />
      <JsonLdScript
        id='fuer-jugendtrainer-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faqEntities,
        }}
      />
      <JugendtrainerPage />
    </>
  );
}
