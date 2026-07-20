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
        inLanguage: ['de-DE', 'en-GB'],
        url: SITE_URL,
        image: absoluteUrl('/heroImage.png'),
        screenshot: APP_SCREENSHOTS.map((path) => absoluteUrl(path)),
        keywords: SEO_KEYWORDS.join(', '),
        audience: {
          '@type': 'Audience',
          audienceType: CLUB_CONFIG.business.audience,
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          description:
            'Kostenlos starten – Live-Demo ohne Account testen, erstes Spiel ohne Verpflichtung erfassen.',
        },
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
