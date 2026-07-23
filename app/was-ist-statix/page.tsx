import type { Metadata } from 'next';
import WasIstStatixPage from '@/features/was-ist-statix/pages/was-ist-statix-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import {
  BRAND_FAQS,
  BRAND_PAGE_PATH,
} from '@/features/was-ist-statix/data/brand-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Was ist Statix? Die Handball-Statistik-App im Überblick',
  description:
    'Statix ist die Handball-Statistik-App aus Deutschland: Spiele live per Tap erfassen, Wurfquoten, Wurfbilder & KI-Analysen automatisch auswerten. Alles über Statix – Funktionen, Preise und die Live-Demo ohne Account.',
  path: BRAND_PAGE_PATH,
  // Title already contains the brand ("Was ist Statix?") – suppress the
  // "| Statix" template suffix to avoid duplicating it.
  absoluteTitle: true,
  keywords: [
    'statix',
    'was ist statix',
    'statix app',
    'statix handball',
    'statix handball app',
    'statix statistik app',
    'statix demo',
    'statix kostenlos',
    'statix erfahrungen',
  ],
  imagePath: '/heroImage.png',
});

export default function Page() {
  const pageUrl = absoluteUrl(BRAND_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='was-ist-statix'
        type='AboutPage'
        name='Was ist Statix? Die Handball-Statistik-App im Überblick'
        description='Statix im Überblick: die Handball-Statistik-App aus Deutschland – Funktionen, Zielgruppe, Preise und die Geschichte hinter der App.'
        path={BRAND_PAGE_PATH}
        imagePath='/heroImage.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Was ist Statix?', path: BRAND_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='was-ist-statix-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: BRAND_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <WasIstStatixPage />
    </>
  );
}
