'use client';

import JsonLdScript from './json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';

interface SocialMetaProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function SocialMeta({
  title = CLUB_CONFIG.display.pageTitle,
  description = CLUB_CONFIG.seo.description,
  image = CLUB_CONFIG.branding.logo.path,
}: SocialMetaProps) {
  const baseUrl = CLUB_CONFIG.website.url;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return (
    <>
      {/* Instagram specific */}
      <meta property='instapp:owner_user_id' content='your-instagram-user-id' />

      {/* Additional social meta tags */}
      <meta name='application-name' content={CLUB_CONFIG.fullName} />
      <meta name='mobile-web-app-capable' content='yes' />

      {/* Additional structured data for company profile */}
      <JsonLdScript
        id="social-meta-structured-data"
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'ProfessionalService',
              '@id': `${baseUrl}/#organization`,
              name: CLUB_CONFIG.fullName,
              alternateName: CLUB_CONFIG.name,
              url: baseUrl,
              logo: {
                '@type': 'ImageObject',
                url: fullImageUrl,
                width: 1200,
                height: 630,
              },
              foundingDate: CLUB_CONFIG.foundingYear.toString(),
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: CLUB_CONFIG.email.main,
              },
              sameAs: [CLUB_CONFIG.social.instagram.url],
            },
            {
              '@type': 'WebSite',
              '@id': `${baseUrl}/#website`,
              url: baseUrl,
              name: title,
              description: description,
              publisher: {
                '@id': `${baseUrl}/#organization`,
              },
              inLanguage: 'de-DE',
            },
          ],
        }}
      />
    </>
  );
}
