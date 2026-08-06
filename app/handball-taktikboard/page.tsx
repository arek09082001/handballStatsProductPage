import type { Metadata } from 'next';
import HandballTaktikboardPage from '@/features/handball-taktikboard/pages/handball-taktikboard-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata, SITE_URL } from '@/lib/seo';
import {
  TAKTIKBOARD_FAQS,
  TAKTIKBOARD_PAGE_PATH,
} from '@/features/handball-taktikboard/data/taktikboard-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Taktikboard: Aufstellung erstellen',
  description:
    'Taktikboard für Handball: Aufstellung erstellen, Magnete auf ein maßstabsgetreues Feld ziehen, Laufwege zeichnen, als PNG oder Link teilen – ohne Anmeldung.',
  path: TAKTIKBOARD_PAGE_PATH,
  keywords: [
    'handball taktikboard',
    'handball aufstellung erstellen',
    'handball taktiktafel online',
    'handball spielfeld vorlage',
    'handball aufstellung grafik',
    'taktikboard handball kostenlos',
    'handball spielzug zeichnen',
  ],
  imagePath: '/shotMaps.png',
});

/**
 * Route shell for `/handball-taktikboard`. Emits WebApplication (the board is a
 * free tool in its own right) plus FAQPage. The embed route carries the same
 * board but is `noIndex`, so only this page competes for the query.
 */
export default function Page() {
  const pageUrl = absoluteUrl(TAKTIKBOARD_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='handball-taktikboard'
        name='Handball-Taktikboard: Aufstellung online erstellen'
        description='Kostenloses Taktikboard für Handball – Magnete auf ein maßstabsgetreues Feld ziehen, Laufwege und Pässe einzeichnen, als PNG exportieren oder per Link teilen.'
        path={TAKTIKBOARD_PAGE_PATH}
        imagePath='/shotMaps.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Handball-Taktikboard', path: TAKTIKBOARD_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='handball-taktikboard-app-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          '@id': `${pageUrl}#taktikboard`,
          name: 'Handball-Taktikboard',
          alternateName: 'Handball Taktiktafel online',
          description:
            'Kostenloses Handball-Taktikboard: Spielermagnete auf ein maßstabsgetreues Handballfeld ziehen, Laufwege, Pässe und Würfe einzeichnen, fertige Abwehr- und Angriffsaufstellungen laden, als PNG herunterladen oder per Link teilen – ohne Anmeldung.',
          url: pageUrl,
          applicationCategory: 'SportsApplication',
          operatingSystem: 'Web',
          browserRequirements: 'Requires JavaScript. Läuft in jedem modernen Browser.',
          inLanguage: 'de-DE',
          isAccessibleForFree: true,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          },
          featureList: [
            'Spielermagnete mit Rückennummern auf einem maßstabsgetreuen Handballfeld platzieren',
            'Halbfeld oder ganzes Feld (40 × 20 m) mit Sechs- und Neunmeterlinie',
            'Fertige Aufstellungen: 6:0, 5:1, 3:2:1, Angriff 3:3 und 4:2, Tempogegenstoß',
            'Laufwege, Pässe und Würfe als Pfeile einzeichnen und biegen',
            'PNG-Export und Teilen-Link ohne Anmeldung – der Link enthält das ganze Board',
            'Als iframe auf Vereinsseiten einbindbar',
          ],
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
        }}
      />
      <JsonLdScript
        id='handball-taktikboard-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: TAKTIKBOARD_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <HandballTaktikboardPage />
    </>
  );
}
