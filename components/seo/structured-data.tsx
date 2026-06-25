import { CLUB_CONFIG } from '@/lib/club-config';
import JsonLdScript from './json-ld-script';
import { HOMEPAGE_FAQS, APP_FEATURES, SITE_URL, absoluteUrl } from '@/lib/seo';

export default function StructuredData() {
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
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
          description: 'Kostenlos starten – erstes Spiel ohne Verpflichtung erfassen.',
        },
        featureList: APP_FEATURES.map((feature) => feature.name),
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE_URL}#faq`,
        mainEntity: HOMEPAGE_FAQS.map((faq) => ({
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
