import { getTranslations } from 'next-intl/server';
import { CLUB_CONFIG } from '@/lib/club-config';
import JsonLdScript from './json-ld-script';
import { HOMEPAGE_FAQS, APP_FEATURES, SITE_URL, absoluteUrl } from '@/lib/seo';

interface FaqItem {
  question: string;
  answer: string;
}

interface FeatureItem {
  title: string;
  description: string;
}

/**
 * Renders the JSON-LD graph for the home page (WebPage, SoftwareApplication
 * and FAQPage). FAQ and feature data are read from the same translations as
 * the visible sections, so the structured data always mirrors the on-page
 * content – a requirement for Google FAQ rich results. Falls back to the
 * constants in `lib/seo.ts` if a translation is unavailable.
 */
export default async function StructuredData() {
  let faqItems: FaqItem[] = [...HOMEPAGE_FAQS];
  let featureList: string[] = APP_FEATURES.map((feature) => feature.name);

  try {
    const tFaq = await getTranslations('productPage.faq');
    const items = tFaq.raw('items') as FaqItem[] | undefined;
    if (Array.isArray(items) && items.length > 0) {
      faqItems = items;
    }
  } catch {
    // keep fallback FAQ
  }

  try {
    const tFeatures = await getTranslations('productPage.features');
    const items = tFeatures.raw('items') as FeatureItem[] | undefined;
    if (Array.isArray(items) && items.length > 0) {
      featureList = items.map((feature) => feature.title);
    }
  } catch {
    // keep fallback feature list
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
        description: CLUB_CONFIG.seo.description,
        applicationCategory: 'SportsApplication',
        operatingSystem: 'iOS, Android, Web',
        url: SITE_URL,
        image: absoluteUrl('/heroImage.png'),
        inLanguage: 'de-DE',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          description: 'Kostenlos starten – erstes Spiel ohne Verpflichtung erfassen.',
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
