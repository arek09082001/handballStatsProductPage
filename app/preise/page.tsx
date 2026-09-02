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
    'Was kostet Statix? Basis 0 €, Trainer 79 € und Pro 159 € je Saison – ab 1.1.2027. Wer sich vorher registriert, behält den Trainer-Plan kostenlos bis 30.6.2028.',
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
 * Schema note: the tiers and their prices are decided and dated, so the
 * `SoftwareApplication` node now carries one `Offer` per tier instead of the
 * single free one it emitted while no figure existed. The two paid offers are
 * `PreOrder` with `priceValidFrom` on the payment start — nothing can be bought
 * before that date, and marking them `InStock` today would promise a checkout
 * that does not exist. The free tier stays `InStock`, because it is real now.
 * Still no `aggregateRating`: there are no reviews.
 */
export default function Page() {
  const pageUrl = absoluteUrl(PRICING_PAGE_PATH);
  const priceValidFrom = '2027-01-01';

  return (
    <>
      <PageSchema
        id='preise'
        name='Preise für die Handball-Statistik-App Statix'
        description='Was Statix kostet: Basis dauerhaft kostenlos, Trainer 79 € und Pro 159 € je Saison ab dem 1. Januar 2027 – mit allen Funktionen und Grenzen je Plan im Vergleich.'
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
            'Handball-Statistik-App für Trainer, Vereine und Teams: Spiele live per Tap erfassen und automatisch auswerten. Mit dauerhaft kostenloser Basis-Stufe und bezahlten Plänen ab dem 1. Januar 2027.',
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
          offers: [
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-basis`,
              name: 'Basis',
              price: '0',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              description:
                'Dauerhaft kostenlos: vollständige Live-Erfassung, kompletter Terminplan und Kaderkarten für eine Mannschaft, ohne Kreditkarte und ohne Ablaufdatum.',
              url: pageUrl,
            },
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-trainer`,
              name: 'Trainer',
              price: '79',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/PreOrder',
              priceValidFrom,
              description:
                'Drei Mannschaften mit je zwei Co-Trainern, die volle Saisonhistorie, Wurfbilder und Heatmaps, Sponsorenslots im Live-Ticker. 79 € je Saison oder 9,90 € im Monat, ab dem 1. Januar 2027.',
              url: pageUrl,
            },
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-pro`,
              name: 'Pro',
              price: '159',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/PreOrder',
              priceValidFrom,
              description:
                'Alles aus Trainer plus 100 GB Videoanalyse mit Tagging, Playlists und automatischer Synchronisation zur Spieluhr. 159 € je Saison oder 19,90 € im Monat, ab dem 1. Januar 2027.',
              url: pageUrl,
            },
          ],
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
