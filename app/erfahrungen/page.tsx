import type { Metadata } from 'next';
import ErfahrungenPage from '@/features/erfahrungen/pages/erfahrungen-page';
import PageSchema from '@/components/seo/page-schema';
import JsonLdScript from '@/components/seo/json-ld-script';
import { CLUB_CONFIG } from '@/lib/club-config';
import { absoluteUrl, createPageMetadata, SITE_URL } from '@/lib/seo';
import {
  ERFAHRUNGEN_FAQS,
  ERFAHRUNGEN_PAGE_PATH,
} from '@/features/erfahrungen/data/erfahrungen-content';
import {
  BEST_RATING,
  getAggregateRating,
  TESTIMONIALS,
  WORST_RATING,
} from '@/features/erfahrungen/data/testimonials';

export const metadata: Metadata = createPageMetadata({
  title: 'Statix Erfahrungen: So arbeiten Trainer mit der App',
  description:
    'Erfahrungen mit Statix: wer die Handball-Statistik-App entwickelt, wie Feedback aus der Halle einfließt – und warum hier keine erfundenen Bewertungen stehen.',
  path: ERFAHRUNGEN_PAGE_PATH,
  // Title already contains the brand – suppress the "| Statix" template suffix.
  absoluteTitle: true,
  keywords: [
    'statix erfahrungen',
    'handball statistik app erfahrungen',
    'statix test',
    'statix bewertung',
    'handball statistik app test',
    'erfahrungen handball statistik app',
  ],
  imagePath: '/heroImage.png',
});

/**
 * Route shell for `/erfahrungen`.
 *
 * Review markup is derived strictly from `features/erfahrungen/data/testimonials.ts`:
 * no testimonials means no `Review` nodes at all, and `aggregateRating` only
 * appears once at least three real ratings exist — computed from that data,
 * never hardcoded. Inventing either would risk a manual action from Google and
 * would be misleading advertising in Germany.
 */
export default function Page() {
  const pageUrl = absoluteUrl(ERFAHRUNGEN_PAGE_PATH);
  const aggregate = getAggregateRating();

  const reviewNodes = TESTIMONIALS.map((testimonial, index) => ({
    '@type': 'Review',
    '@id': `${pageUrl}#review-${index + 1}`,
    itemReviewed: { '@id': `${SITE_URL}#app` },
    author: {
      '@type': 'Person',
      name: testimonial.name,
      jobTitle: testimonial.role,
      affiliation: {
        '@type': 'SportsOrganization',
        name: testimonial.club,
      },
    },
    reviewBody: testimonial.quote,
    datePublished: testimonial.date,
    inLanguage: 'de-DE',
    ...(typeof testimonial.ratingValue === 'number'
      ? {
        reviewRating: {
          '@type': 'Rating',
          ratingValue: testimonial.ratingValue,
          bestRating: BEST_RATING,
          worstRating: WORST_RATING,
        },
      }
      : {}),
    publisher: { '@id': `${SITE_URL}/#organization` },
  }));

  return (
    <>
      <PageSchema
        id='erfahrungen'
        name='Statix Erfahrungen: So arbeiten Trainer mit der App'
        description='Wie Statix entsteht und wie Trainer damit arbeiten: die Geschichte hinter der Handball-Statistik-App, der Weg von Feedback aus der Halle zur Funktion – und Trainer-Stimmen, sobald sie freigegeben sind.'
        path={ERFAHRUNGEN_PAGE_PATH}
        imagePath='/heroImage.png'
        breadcrumbs={[
          { name: 'Startseite', path: '/' },
          { name: 'Erfahrungen', path: ERFAHRUNGEN_PAGE_PATH },
        ]}
      />

      {reviewNodes.length > 0 ? (
        <JsonLdScript
          id='erfahrungen-reviews-schema'
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              ...reviewNodes,
              {
                '@type': 'SoftwareApplication',
                '@id': `${SITE_URL}#app`,
                name: CLUB_CONFIG.name,
                applicationCategory: 'SportsApplication',
                review: reviewNodes.map((review) => ({ '@id': review['@id'] })),
                ...(aggregate
                  ? {
                    aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: aggregate.ratingValue,
                      reviewCount: aggregate.reviewCount,
                      bestRating: BEST_RATING,
                      worstRating: WORST_RATING,
                    },
                  }
                  : {}),
              },
            ],
          }}
        />
      ) : null}

      <JsonLdScript
        id='erfahrungen-faq-schema'
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: ERFAHRUNGEN_FAQS.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }}
      />
      <ErfahrungenPage />
    </>
  );
}
