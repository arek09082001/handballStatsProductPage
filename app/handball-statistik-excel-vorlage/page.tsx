import type { Metadata } from 'next';
import ExcelVorlagePage from '@/features/excel-vorlage/pages/excel-vorlage-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata, SITE_URL } from '@/lib/seo';
import {
  TEMPLATE_FAQS,
  TEMPLATE_FILE,
  TEMPLATE_HOW_TO,
  TEMPLATE_PAGE_PATH,
} from '@/features/excel-vorlage/data/template-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Statistik Excel-Vorlage kostenlos',
  description:
    'Kostenlose Excel-Vorlage für Handball-Statistiken: Kader, Spielprotokoll, Auswertung und Saison mit Formeln für Wurfquote und Paradenquote – ohne Anmeldung.',
  path: TEMPLATE_PAGE_PATH,
  keywords: [
    'handball statistik excel vorlage',
    'handball spielbericht vorlage',
    'handball statistik vorlage kostenlos',
    'handball statistik excel',
    'handball spielprotokoll vorlage',
    'handball statistik vorlage download',
    'handball wurfquote excel',
  ],
  imagePath: '/statsTableInGame.png',
});

/**
 * Route shell for `/handball-statistik-excel-vorlage`.
 *
 * Emits HowTo (the visible filling steps), FAQPage and a DigitalDocument node
 * for the file itself, so answer engines can point at the download directly.
 */
export default function Page() {
  const pageUrl = absoluteUrl(TEMPLATE_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='handball-statistik-excel-vorlage'
        name='Handball-Statistik Excel-Vorlage kostenlos herunterladen'
        description='Kostenlose Excel-Vorlage für Handball-Statistiken mit Kader, Spielprotokoll, Auswertung und Saisonblatt – inklusive fertiger Formeln für Wurfquote, Siebenmeter-Quote und Paradenquote.'
        path={TEMPLATE_PAGE_PATH}
        imagePath='/statsTableInGame.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Handball-Statistik Excel-Vorlage', path: TEMPLATE_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='excel-vorlage-document-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          '@id': `${pageUrl}#vorlage`,
          name: 'Handball-Statistik Excel-Vorlage',
          description: `Excel-Vorlage für Handball-Statistiken mit den Blättern ${TEMPLATE_FILE.sheets.join(', ')} – Wurfquote, Siebenmeter-Quote und Paradenquote rechnen sich per Formel.`,
          url: pageUrl,
          encodingFormat:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          contentUrl: absoluteUrl(TEMPLATE_FILE.path),
          inLanguage: 'de-DE',
          isAccessibleForFree: true,
          license: absoluteUrl('/agb'),
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
        }}
      />
      <JsonLdScript
        id='excel-vorlage-howto-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          '@id': `${pageUrl}#howto`,
          name: 'Handball-Statistik mit der Excel-Vorlage im Spiel erfassen',
          description:
            'In fünf Schritten von der leeren Vorlage zur fertigen Spielauswertung: Kader eintragen, Spiel benennen, Aktionen erfassen und auswerten.',
          inLanguage: 'de-DE',
          totalTime: 'PT10M',
          tool: [
            {
              '@type': 'HowToTool',
              name: 'Tabellenprogramm (Excel, LibreOffice Calc oder Google Tabellen)',
            },
            {
              '@type': 'HowToTool',
              name: 'Handball-Statistik Excel-Vorlage von Statix',
            },
          ],
          step: TEMPLATE_HOW_TO.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
            url: `${pageUrl}#schritt-${index + 1}`,
          })),
        }}
      />
      <JsonLdScript
        id='excel-vorlage-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: TEMPLATE_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <ExcelVorlagePage />
    </>
  );
}
