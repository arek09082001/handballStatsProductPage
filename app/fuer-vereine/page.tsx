import type { Metadata } from 'next';
import VereinePage from '@/features/zielgruppen/pages/vereine-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata, SITE_URL } from '@/lib/seo';
import {
  VEREINE_FAQS,
  VEREINE_PAGE_PATH,
} from '@/features/zielgruppen/data/vereine-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Statistik-App für Vereine',
  description:
    'Ein Standard für alle Mannschaften: Spiele live erfassen, Auswertungen im Trainerteam teilen, Entwicklung zeigen. Datenschutz geregelt, aktuell kostenlos.',
  path: VEREINE_PAGE_PATH,
  keywords: [
    'handball statistik app für vereine',
    'handball verein statistik software',
    'handball trainerteam software',
    'handball statistik software verein',
    'handball vereinssoftware statistik',
    'handball statistik mehrere mannschaften',
  ],
  imagePath: '/gameListOverview.png',
});

/**
 * Route shell for `/fuer-vereine`. Emits WebPage + FAQPage, with the audience
 * typed as an `Audience` so answer engines can match "für Vereine" queries.
 *
 * The FAQ nodes come from the visible accordion only. The objections band
 * states its items as quoted sentences ("Wir haben kein Budget.") rather than
 * questions, so it is not marked up as `Question`; the same objections are
 * covered in question form in the FAQ itself.
 */
export default function Page() {
  const pageUrl = absoluteUrl(VEREINE_PAGE_PATH);

  const faqEntities = VEREINE_FAQS.map((item) => ({
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
        id='fuer-vereine'
        name='Handball-Statistik-App für Vereine'
        description='Wie ein Handballverein mit Statix alle Mannschaften auf einen Standard bringt: gemeinsame Erfassung, geteilte Auswertungen, Entwicklung für den Vorstand und geregelter Datenschutz.'
        path={VEREINE_PAGE_PATH}
        imagePath='/gameListOverview.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Für Vereine', path: VEREINE_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='fuer-vereine-audience-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${pageUrl}#audience-page`,
          url: pageUrl,
          name: 'Handball-Statistik-App für Vereine',
          inLanguage: 'de-DE',
          isPartOf: { '@id': `${SITE_URL}/#website` },
          audience: {
            '@type': 'Audience',
            audienceType: 'Handballvereine, Abteilungsleitungen und Trainerteams',
            name: 'Handballvereine',
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
        id='fuer-vereine-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faqEntities,
        }}
      />
      <VereinePage />
    </>
  );
}
