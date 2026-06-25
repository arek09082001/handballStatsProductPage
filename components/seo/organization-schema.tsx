import JsonLdScript from './json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  absoluteUrl,
  APP_FEATURES,
  DEFAULT_OG_IMAGE,
  SITE_URL,
} from '@/lib/seo';

export default function OrganizationSchema() {
  const sameAs = [CLUB_CONFIG.social.instagram.url].filter(Boolean);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: CLUB_CONFIG.fullName,
    legalName: CLUB_CONFIG.fullName,
    alternateName: CLUB_CONFIG.display.pageTitle,
    description: CLUB_CONFIG.seo.description,
    slogan: 'Die Statistik-App für dein Handball-Team',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(CLUB_CONFIG.branding.logo.filename),
      width: CLUB_CONFIG.branding.logo.width,
      height: CLUB_CONFIG.branding.logo.height,
    },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: CLUB_CONFIG.email.info,
      availableLanguage: 'German',
    },
    founder: {
      '@type': 'Person',
      name: CLUB_CONFIG.legal.responsiblePerson,
    },
    foundingDate: String(CLUB_CONFIG.foundingYear),
    knowsAbout: APP_FEATURES.map((feature) => feature.name),
    sameAs,
  };

  return <JsonLdScript id="organization-schema" data={schema} />;
}
