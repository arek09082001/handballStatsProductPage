import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLdScript from '@/components/seo/json-ld-script';
import PageSchema from '@/components/seo/page-schema';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import FeaturePage from '@/features/funktionen/pages/feature-page';
import {
  FEATURES,
  FEATURES_PAGE_PATH,
  featureLabel,
  featurePath,
  getFeature,
} from '@/features/funktionen/data/features';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

/**
 * Every feature page is known at build time — the catalogue is a static module,
 * so there is nothing to fetch and no reason for any of these routes to be
 * rendered on demand.
 */
export function generateStaticParams() {
  return FEATURES.map((feature) => ({ slug: feature.slug }));
}

/** A slug outside the catalogue is a 404, not an empty feature page. */
export const dynamicParams = false;

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};

  return createPageMetadata({
    title: feature.meta.title,
    description: feature.meta.description,
    path: featurePath(feature.slug),
    imagePath: feature.ogImage ?? '/heroImage.png',
    keywords: feature.meta.keywords,
  });
}

export default async function Page({ params }: RouteParams) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const path = featurePath(feature.slug);
  const pageUrl = absoluteUrl(path);

  return (
    <>
      <PageSchema
        id={`funktion-${feature.slug}`}
        name={feature.meta.title}
        description={feature.meta.description}
        path={path}
        imagePath={feature.ogImage ?? '/heroImage.png'}
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Funktionen', path: FEATURES_PAGE_PATH },
          { name: featureLabel(feature), path },
        ]}
      />

      <JsonLdScript
        id={`funktion-${feature.slug}-faq-schema`}
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: feature.faq.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />

      <FeaturePage feature={feature} />
    </>
  );
}
