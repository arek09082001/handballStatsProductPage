import { CLUB_CONFIG } from '@/lib/club-config';
import JsonLdScript from './json-ld-script';
import { HOMEPAGE_FAQS, SERVICE_OFFERS, SITE_URL, absoluteUrl } from '@/lib/seo';

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}#webpage`,
        url: SITE_URL,
        name: 'Webdesign für Unternehmen, Handwerker und Dienstleister',
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
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}#services-overview`,
        name: 'Leistungen im Überblick',
        itemListElement: SERVICE_OFFERS.map((service, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: service.name,
          url: absoluteUrl(`/leistungen#${service.slug}`),
          description: service.description,
        })),
      },
    ],
  };

  return <JsonLdScript id="structured-data" data={structuredData} />;
}
