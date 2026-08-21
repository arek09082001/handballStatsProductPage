import type { Metadata } from 'next';
import PreisePage from '@/features/preise/pages/preise-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  absoluteUrl,
  createPageMetadata,
  SITE_URL,
  SUPPORTED_DEVICES,
} from '@/lib/seo';
import {
  PRICING_FAQS,
  PRICING_PAGE_PATH,
} from '@/features/preise/data/pricing-content';

export const metadata: Metadata = createPageMetadata({
  title: 'Preise: Handball-Statistik-App für Trainer',
  description:
    'Was kostet Statix? Aktuell nichts: voller Funktionsumfang kostenlos, ohne Kreditkarte und ohne Abo. Ein Abo kommt später – Live-Demo ohne Account testen.',
  path: PRICING_PAGE_PATH,
  keywords: [
    'handball statistik app preise',
    'was kostet statix',
    'statix preise',
    'handball statistik app kosten',
    'handball statistik software preis',
    'handball statistik app für vereine preise',
    'handball statistik app abo',
  ],
  imagePath: '/statsTableInGame.png',
});

/**
 * Route shell for `/preise`.
 *
 * Schema note: Statix has no checkout, no subscription tab and nothing that can
 * currently be bought, so the `SoftwareApplication` node carries an `Offer` for
 * the free tier only. The planned subscription has no price yet and therefore
 * appears nowhere as a number — not in the copy and not as an `Offer`, which it
 * must not become before it is purchasable. No `aggregateRating` is emitted
 * either, because there are no reviews yet.
 */
export default function Page() {
  const pageUrl = absoluteUrl(PRICING_PAGE_PATH);

  return (
    <>
      <PageSchema
        id='preise'
        name='Preise für die Handball-Statistik-App Statix'
        description='Was Statix kostet: aktuell kostenlos mit vollem Funktionsumfang, mit allen Grenzen im Detail – und was ein geplantes Abo für Teams und Vereine ändern würde.'
        path={PRICING_PAGE_PATH}
        imagePath='/statsTableInGame.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Preise', path: PRICING_PAGE_PATH },
        ]}
      />
      <JsonLdScript
        id='preise-offer-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          '@id': `${pageUrl}#app`,
          name: CLUB_CONFIG.name,
          alternateName: 'Statix Handball-Statistik-App',
          description:
            'Handball-Statistik-App für Trainer, Vereine und Teams: Spiele live per Tap erfassen und automatisch auswerten. Aktuell mit vollem Funktionsumfang kostenlos nutzbar.',
          applicationCategory: 'SportsApplication',
          applicationSubCategory: 'Handball-Statistik-App',
          operatingSystem: 'iOS, Android, Web',
          availableOnDevice: [...SUPPORTED_DEVICES],
          countriesSupported: 'DE, AT, CH',
          inLanguage: ['de-DE', 'en-GB'],
          url: pageUrl,
          image: absoluteUrl('/statsTableInGame.png'),
          audience: {
            '@type': 'Audience',
            audienceType: CLUB_CONFIG.business.audience,
          },
          offers: {
            '@type': 'Offer',
            '@id': `${pageUrl}#offer-free`,
            name: 'Kostenloser Zugang',
            price: '0',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            description:
              'Statix ist aktuell mit vollem Funktionsumfang kostenlos nutzbar – ohne Kreditkarte und ohne Bezahlvorgang. Live-Demo ohne Account.',
            url: pageUrl,
          },
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
        }}
      />
      <JsonLdScript
        id='preise-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: PRICING_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <PreisePage />
    </>
  );
}
