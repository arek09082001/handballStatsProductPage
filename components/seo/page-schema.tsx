import JsonLdScript from './json-ld-script';
import { absoluteUrl, SITE_URL } from '@/lib/seo';

type BreadcrumbItem = {
    name: string;
    path: string;
};

interface PageSchemaProps {
    id: string;
    name: string;
    description: string;
    path: string;
    type?: 'WebPage' | 'CollectionPage' | 'AboutPage';
    imagePath?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function PageSchema({
    id,
    name,
    description,
    path,
    type = 'WebPage',
    imagePath = '/heroImage.png',
    breadcrumbs = [],
}: PageSchemaProps) {
    const pageUrl = absoluteUrl(path);

    const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': type,
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name,
        description,
        inLanguage: 'de-DE',
        isPartOf: {
            '@id': `${SITE_URL}/#website`,
        },
        about: {
            '@id': `${SITE_URL}/#organization`,
        },
        primaryImageOfPage: {
            '@type': 'ImageObject',
            url: absoluteUrl(imagePath),
        },
    };

    const breadcrumbSchema =
        breadcrumbs.length > 0
            ? {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                '@id': `${pageUrl}#breadcrumb`,
                itemListElement: breadcrumbs.map((item, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: absoluteUrl(item.path),
                })),
            }
            : null;

    return (
        <>
            <JsonLdScript id={`${id}-webpage-schema`} data={webPageSchema} />
            {breadcrumbSchema ? (
                <JsonLdScript id={`${id}-breadcrumb-schema`} data={breadcrumbSchema} />
            ) : null}
        </>
    );
}