import { getTranslations } from 'next-intl/server';
import { CLUB_CONFIG } from '@/lib/club-config';
import JsonLdScript from './json-ld-script';
import {
  HOMEPAGE_FAQS,
  APP_FEATURES,
  APP_SCREENSHOTS,
  SEO_KEYWORDS,
  SUPPORTED_DEVICES,
  SITE_URL,
  absoluteUrl,
} from '@/lib/seo';
import { SITE_CONTENT_LANGUAGES } from '@/i18n/config';

/** The paid tiers of both dials, at their season price (see `/preise`). */
const PAID_OFFERS_VALID_FROM = '2027-01-01';
const PAID_OFFERS = [
  {
    name: 'Trainer',
    price: '79',
    description:
      'App-Stufe Trainer: 79 € je Saison oder 9,90 € im Monat, ab dem 1. Januar 2027.',
  },
  {
    name: 'Pro',
    price: '149',
    description:
      'App-Stufe Pro: 149 € je Saison oder 14,90 € im Monat, ab dem 1. Januar 2027.',
  },
  {
    name: 'Video Basis',
    price: '149',
    description:
      'Video-Stufe für eine Mannschaft mit 100 GB Speicher: 149 € je Saison oder 14,90 € im Monat, ab dem 1. Januar 2027.',
  },
  {
    name: 'Video Team',
    price: '399',
    description:
      'Video-Stufe für eine Mannschaft mit 300 GB Speicher, Panorama und Livestream: 399 € je Saison oder 39,90 € im Monat, ab dem 1. Januar 2027.',
  },
  {
    name: 'Video Analyse',
    price: '849',
    description:
      'Video-Stufe für eine Mannschaft mit 500 GB Speicher, Laufwegen und Ballerkennung: 849 € je Saison oder 84,90 € im Monat, ab dem 1. Januar 2027.',
  },
] as const;

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Renders the JSON-LD graph for the home page (WebPage, SoftwareApplication
 * and FAQPage). FAQ data is read from the same translations as the visible
 * section, so the structured data always mirrors the on-page content – a
 * requirement for Google FAQ rich results. The machine-readable feature list
 * comes from the `APP_FEATURES` constant in `lib/seo.ts`.
 */
export default async function StructuredData() {
  let faqItems: FaqItem[] = [...HOMEPAGE_FAQS];
  const featureList: string[] = APP_FEATURES.map((feature) => feature.name);

  try {
    const tFaq = await getTranslations('productPage.faq');
    const items = tFaq.raw('items') as FaqItem[] | undefined;
    if (Array.isArray(items) && items.length > 0) {
      faqItems = items;
    }
  } catch {
    // keep fallback FAQ
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}#webpage`,
        url: SITE_URL,
        name: CLUB_CONFIG.seo.pages.home.title,
        description: CLUB_CONFIG.seo.description,
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        about: {
          '@id': `${SITE_URL}/#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl('/heroImage.png'),
        },
        inLanguage: 'de-DE',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}#app`,
        name: CLUB_CONFIG.name,
        alternateName: 'Statix Handball-Statistik-App',
        description: CLUB_CONFIG.seo.description,
        applicationCategory: 'SportsApplication',
        applicationSubCategory: 'Handball-Statistik-App',
        operatingSystem: 'iOS, Android, Web',
        browserRequirements: 'Requires JavaScript. Läuft in jedem modernen Browser.',
        availableOnDevice: [...SUPPORTED_DEVICES],
        countriesSupported: 'DE, AT, CH',
        inLanguage: [...SITE_CONTENT_LANGUAGES],
        url: SITE_URL,
        installUrl: CLUB_CONFIG.website.appUrl,
        image: absoluteUrl('/heroImage.png'),
        screenshot: APP_SCREENSHOTS.map((path) => absoluteUrl(path)),
        keywords: SEO_KEYWORDS.join(', '),
        audience: {
          '@type': 'Audience',
          audienceType: CLUB_CONFIG.business.audience,
        },
        // One offer per tier of both dials, at the season price. The paid ones
        // are `PreOrder` until the payment start: nothing can be bought before
        // it. Figures as on `/preise` (`app/preise/page.tsx` carries the same
        // offers with descriptions).
        offers: [
          {
            '@type': 'Offer',
            name: 'Basis',
            price: '0',
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            description:
              'Kostenlos starten – registrieren und das erste Spiel ohne Verpflichtung erfassen; Live-Demo auch ohne Account testbar. Die Basis-Stufe bleibt dauerhaft kostenlos.',
            url: CLUB_CONFIG.website.appUrl,
          },
          ...PAID_OFFERS.map((offer) => ({
            '@type': 'Offer',
            name: offer.name,
            price: offer.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/PreOrder',
            priceValidFrom: PAID_OFFERS_VALID_FROM,
            description: offer.description,
            url: absoluteUrl('/preise'),
          })),
        ],
        featureList,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}#faq`,
        mainEntity: faqItems.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return <JsonLdScript id="structured-data" data={structuredData} />;
}
