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
import { SITE_CONTENT_LANGUAGES } from '@/i18n/config';
import { fetchPriceSheet } from '@/features/preise/data/fetch-price-sheet';

/**
 * Re-read the app's price list at most once an hour, as the app's own CDN
 * does. The rest of the running season only changes on the first of a month,
 * and the binding amount is the one in the checkout anyway.
 */
export const revalidate = 3600;

export const metadata: Metadata = createPageMetadata({
  title: 'Preise: Handball-Statistik-App für Trainer',
  description:
    'Was kostet Statix? Basis 0 €, Trainer 79 €, Pro 149 € je Saison; Video ab 149 € für alle deine Mannschaften. Plan zusammenstellen, buchbar ab 1.1.2027. Wer vorher registriert, behält Trainer kostenlos bis 30.6.2027.',
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
 * Reads the app's price list on the server (`fetchPriceSheet`, which falls
 * back to a static copy) and hands it to the client configurator, so the
 * figures are in the first HTML and the page renders without the app.
 *
 * Schema note: one product with two dials, so the `SoftwareApplication` node
 * carries one `Offer` per app tier and per video tier, each at its season
 * price. The paid offers are `PreOrder` with `priceValidFrom` on the payment
 * start — nothing can be bought before that date, and marking them `InStock`
 * today would promise a checkout that does not exist yet. The free tier stays
 * `InStock`, because it is real now. The figures here are the season prices of
 * the app's catalog in words, like the copy; the package, founder and
 * mid-season prices are conditions, not offers, and live in the descriptions.
 * Still no `aggregateRating`: there are no reviews.
 */
export default async function Page() {
  const pageUrl = absoluteUrl(PRICING_PAGE_PATH);
  const priceValidFrom = '2027-01-01';
  const sheet = await fetchPriceSheet();

  return (
    <>
      <PageSchema
        id='preise'
        name='Preise für die Handball-Statistik-App Statix'
        description='Was Statix kostet: Basis dauerhaft kostenlos, Trainer 79 € und Pro 149 € je Saison, dazu Video-Stufen ab 149 € für alle Mannschaften, in denen du Cheftrainer bist – ab dem 1. Januar 2027, mit allen Funktionen und Grenzen je Stufe im Vergleich.'
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
            'Handball-Statistik-App für Trainer, Vereine und Teams: Spiele live per Tap erfassen und automatisch auswerten. Mit dauerhaft kostenloser Basis-Stufe, bezahlten App-Stufen und Video-Stufen für alle Mannschaften eines Cheftrainers ab dem 1. Januar 2027.',
          applicationCategory: 'SportsApplication',
          applicationSubCategory: 'Handball-Statistik-App',
          operatingSystem: 'iOS, Android, Web',
          availableOnDevice: [...SUPPORTED_DEVICES],
          countriesSupported: 'DE, AT, CH',
          inLanguage: [...SITE_CONTENT_LANGUAGES],
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
                'Dauerhaft kostenlos: vollständige Live-Erfassung, kompletter Terminplan, Kaderkarten und Mannschaftskasse für eine Mannschaft, ohne Kreditkarte und ohne Ablaufdatum.',
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
                'App-Stufe Trainer: drei Mannschaften mit je zwei Co-Trainern, die volle Saisonhistorie, Heatmaps, xG und Formkurve, Gegner-Scouting, Sponsoren im Live-Ticker. 79 € je Saison oder 9,90 € im Monat; mit einer Video-Stufe 39 € je Saison. Ab dem 1. Januar 2027.',
              url: pageUrl,
            },
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-pro`,
              name: 'Pro',
              price: '149',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/PreOrder',
              priceValidFrom,
              description:
                'App-Stufe Pro: alles aus Trainer für fünf Mannschaften mit je fünf Co-Trainern, 500 Spiele und 40 KI-Analysen im Monat. 149 € je Saison oder 14,90 € im Monat; mit einer Video-Stufe 75 € je Saison. Ab dem 1. Januar 2027.',
              url: pageUrl,
            },
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-video-basis`,
              name: 'Video Basis',
              price: '149',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/PreOrder',
              priceValidFrom,
              description:
                'Video-Stufe für alle Mannschaften, in denen du Cheftrainer bist – Speicher und Credits teilen sie sich –, inklusive App Basis: 100 GB Speicher, Tagging-Werkbank, Playlists, Sendungen, Mediathek und Besprechungsmodus, synchron mit dem Protokoll. 149 € je Saison oder 14,90 € im Monat, ab dem 1. Januar 2027.',
              url: pageUrl,
            },
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-video-team`,
              name: 'Video Team',
              price: '399',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/PreOrder',
              priceValidFrom,
              description:
                'Video-Stufe für alle Mannschaften, in denen du Cheftrainer bist – Speicher und Credits teilen sie sich: alles aus Video Basis, 300 GB Speicher und 40 Rechen-Credits je Saison, dazu Panorama aus zwei Kameras, Schwenk-Fassung, Spielstand-Einblendung und Livestream. 399 € je Saison oder 39,90 € im Monat, ab dem 1. Januar 2027.',
              url: pageUrl,
            },
            {
              '@type': 'Offer',
              '@id': `${pageUrl}#offer-video-analyse`,
              name: 'Video Analyse',
              price: '849',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/PreOrder',
              priceValidFrom,
              description:
                'Video-Stufe für alle Mannschaften, in denen du Cheftrainer bist – Speicher und Credits teilen sie sich: alles aus Video Team, 500 GB Speicher und 180 Rechen-Credits je Saison, dazu Feldkalibrierung, Laufwege, Heatmaps und Distanzen, Ballerkennung (Beta) und Erkennung nachtrainieren. 849 € je Saison oder 84,90 € im Monat, ab dem 1. Januar 2027.',
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
      <PreisePage sheet={sheet} />
    </>
  );
}
