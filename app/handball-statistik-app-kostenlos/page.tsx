import type { Metadata } from 'next';
import KostenlosPage from '@/features/kostenlos/pages/kostenlos-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import {
  FREE_FAQS,
  FREE_PAGE_PATH,
} from '@/features/kostenlos/data/free-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Handball-Statistik-App kostenlos nutzen',
  description:
    'Ja, es gibt eine kostenlose Handball-Statistik-App: Spiele live erfassen, Wurfquoten und Wurfbilder auswerten – ohne Kreditkarte. Live-Demo sogar ohne Account.',
  path: FREE_PAGE_PATH,
  keywords: [
    'handball statistik app kostenlos',
    'kostenlose handball statistik app',
    'handball statistik kostenlos erfassen',
    'gratis handball app',
    'handball app kostenlos',
    'handball statistik software kostenlos',
    'handball statistik app ohne kosten',
  ],
  imagePath: '/recordStatsInGame.png',
});

/**
 * Route shell for `/handball-statistik-app-kostenlos`. Deliberately narrower
 * than `/preise`: this page answers "gibt es eine kostenlose Version", the
 * pricing page answers "was kostet es". Schema is WebPage + FAQPage; the
 * `Offer` for the free tier lives on `/preise` so the two don't compete.
 */
export default function Page() {
  const pageUrl = absoluteUrl(FREE_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='handball-statistik-app-kostenlos'
        name='Handball-Statistik-App kostenlos nutzen'
        description='Was bei Statix kostenlos ist und wo die Grenzen liegen: Spiele live erfassen, Wurfquoten und Wurfbilder auswerten, Berichte teilen – ohne Kreditkarte, mit Live-Demo ohne Account.'
        path={FREE_PAGE_PATH}
        imagePath='/recordStatsInGame.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Handball-Statistik-App kostenlos', path: FREE_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='kostenlos-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: FREE_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <KostenlosPage />
    </>
  );
}
