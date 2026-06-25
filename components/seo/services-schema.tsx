import JsonLdScript from './json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
    absoluteUrl,
    SERVICE_AREAS,
    SERVICE_OFFERS,
    SITE_URL,
} from '@/lib/seo';

export default function ServicesSchema() {
    const pageUrl = absoluteUrl('/leistungen');

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'OfferCatalog',
                '@id': `${pageUrl}#offer-catalog`,
                name: 'Leistungen von Arkadiusz Weiss Webentwicklung',
                itemListElement: SERVICE_OFFERS.map((service, index) => ({
                    '@type': 'Offer',
                    position: index + 1,
                    itemOffered: {
                        '@type': 'Service',
                        '@id': `${pageUrl}#${service.slug}`,
                        name: service.name,
                        serviceType: service.name,
                        description: service.description,
                        provider: {
                            '@id': `${SITE_URL}/#organization`,
                        },
                        areaServed: SERVICE_AREAS.map((area) => ({
                            '@type': 'AdministrativeArea',
                            name: area,
                        })),
                    },
                })),
            },
            ...SERVICE_OFFERS.map((service) => ({
                '@type': 'Service',
                '@id': `${pageUrl}#${service.slug}`,
                name: service.name,
                serviceType: service.name,
                description: service.description,
                url: `${pageUrl}#${service.slug}`,
                provider: {
                    '@id': `${SITE_URL}/#organization`,
                },
                areaServed: SERVICE_AREAS.map((area) => ({
                    '@type': 'AdministrativeArea',
                    name: area,
                })),
                availableChannel: {
                    '@type': 'ServiceChannel',
                    serviceUrl: pageUrl,
                    servicePhone: CLUB_CONFIG.phone.main,
                },
            })),
        ],
    };

    return <JsonLdScript id='services-schema' data={schema} />;
}