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
    alternateName: ['Statix Handball', 'Statix App', 'Statix Handball-Statistik-App'],
    description: CLUB_CONFIG.seo.description,
    disambiguatingDescription:
      'Statix ist eine Handball-Statistik-App, mit der Trainer, Vereine und Teams Spiele live erfassen und auswerten.',
    slogan: 'Handball-Statistik live erfassen – mit einem Tap, direkt von der Bank',
    brand: {
      '@type': 'Brand',
      name: CLUB_CONFIG.fullName,
      logo: absoluteUrl(CLUB_CONFIG.branding.logo.filename),
    },
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
    knowsAbout: [
      'Handball',
      'Handball-Statistik',
      'Handball-Statistik-App',
      'Live-Statistik-Erfassung',
      'Spielanalyse',
      'Wurfquoten',
      'Wurfbilder',
      'Spielerstatistik',
      'Team-Management',
      ...APP_FEATURES.map((feature) => feature.name),
    ],
    sameAs,
  };

  return <JsonLdScript id="organization-schema" data={schema} />;
}
