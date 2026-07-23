import JsonLdScript from './json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';
import { absoluteUrl, SITE_LINKS, SITE_URL } from '@/lib/seo';

export default function WebsiteSchema() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: CLUB_CONFIG.fullName,
    alternateName: [
      'Statix App',
      'Statix Handball',
      'Statix Handball-Statistik-App',
      'statix-app.de',
    ],
    url: SITE_URL,
    description: CLUB_CONFIG.seo.description,
    inLanguage: ['de-DE', 'en-GB'],
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    hasPart: SITE_LINKS.map((link) => ({
      '@type': 'WebPage',
      '@id': `${absoluteUrl(link.path)}#webpage`,
      url: absoluteUrl(link.path),
      name: link.name,
      description: link.description,
    })),
  };

  const navigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#site-navigation`,
    name: `${CLUB_CONFIG.name} Hauptnavigation`,
    description: `Wichtigste Seiten von ${CLUB_CONFIG.name}`,
    numberOfItems: SITE_LINKS.length,
    itemListElement: SITE_LINKS.map((link, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: link.name,
      url: absoluteUrl(link.path),
      description: link.description,
    })),
  };

  return (
    <>
      <JsonLdScript id="website-schema" data={websiteSchema} />
      <JsonLdScript id="site-navigation-itemlist" data={navigationSchema} />
    </>
  );
}
