import type { Metadata } from 'next';
import WurfquoteRechnerPage from '@/features/wurfquote-rechner/pages/wurfquote-rechner-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata, SITE_URL } from '@/lib/seo';
import {
  CALCULATOR_FAQS,
  CALCULATOR_PAGE_PATH,
} from '@/features/wurfquote-rechner/data/calculator-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Wurfquoten-Rechner: Wurfquote berechnen',
  description:
    'Wurfquote im Handball berechnen: Tore und Würfe eintragen, Quote sofort ablesen und nach Position einordnen. Mit Formel, Richtwerten und Rechner zum Einbinden.',
  path: CALCULATOR_PAGE_PATH,
  keywords: [
    'wurfquote berechnen',
    'wurfquote handball rechner',
    'wurfquote rechner',
    'paradenquote berechnen',
    'wurfquote formel',
    'handball trefferquote berechnen',
    'torquote handball berechnen',
  ],
  imagePath: '/statsTableInGame.png',
});

/**
 * Route shell for `/wurfquote-rechner`. Emits WebApplication (the calculator is
 * a free tool in its own right) plus FAQPage. The embed route carries the same
 * calculator but is `noIndex`, so only this page competes for the query.
 */
export default function Page() {
  const pageUrl = absoluteUrl(CALCULATOR_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='wurfquote-rechner'
        name='Wurfquoten-Rechner: Wurfquote im Handball berechnen'
        description='Kostenloser Rechner für die Wurfquote im Handball – mit Formel, Rechenbeispiel, Richtwerten nach Position und Zielquoten-Rechnung.'
        path={CALCULATOR_PAGE_PATH}
        imagePath='/statsTableInGame.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Wurfquoten-Rechner', path: CALCULATOR_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='wurfquote-rechner-app-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          '@id': `${pageUrl}#rechner`,
          name: 'Wurfquoten-Rechner',
          alternateName: 'Handball Wurfquote Rechner',
          description:
            'Kostenloser Wurfquoten-Rechner für Handball: Tore und Würfe eintragen, Wurfquote in Prozent ablesen, nach Position einordnen und die Zielquote rückwärts rechnen.',
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
            'Wurfquote aus Toren und Würfen berechnen',
            'Einordnung nach Position (Kreis, Außen, Rückraum, Siebenmeter, Tempogegenstoß)',
            'Zielquote rückwärts rechnen: nötige Tore und Trefferserie',
            'Als iframe auf Vereinsseiten einbindbar',
          ],
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
        }}
      />
      <JsonLdScript
        id='wurfquote-rechner-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: CALCULATOR_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <WurfquoteRechnerPage />
    </>
  );
}
