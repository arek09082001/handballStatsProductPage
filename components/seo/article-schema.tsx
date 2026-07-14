import JsonLdScript from './json-ld-script';
import { absoluteUrl, SITE_URL } from '@/lib/seo';
import { CLUB_CONFIG } from '@/lib/club-config';
import type { Article } from '@/features/ratgeber/types';

type BreadcrumbItem = {
  name: string;
  path: string;
};

interface ArticleSchemaProps {
  article: Article;
  /** The article path, e.g. '/ratgeber/wurfquote-berechnen'. */
  path: string;
  breadcrumbs: BreadcrumbItem[];
}

/**
 * Emits the per-article structured data as a single JSON-LD `@graph`:
 * BlogPosting + BreadcrumbList (+ FAQPage when the article has FAQs).
 *
 * `publisher` and `isPartOf` reference the Organization / WebSite nodes that
 * `OrganizationSchema` and `WebsiteSchema` already emit site-wide from the root
 * layout, so the graph resolves without duplicating those nodes.
 */
export default function ArticleSchema({
  article,
  path,
  breadcrumbs,
}: ArticleSchemaProps) {
  const url = absoluteUrl(path);

  const blogPosting = {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.metaDescription,
    inLanguage: 'de-DE',
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    articleSection: article.category,
    keywords: article.keywords.join(', '),
    image: absoluteUrl(article.imagePath),
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    author: {
      '@type': 'Person',
      name: CLUB_CONFIG.legal.responsiblePerson,
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
  };

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };

  const graph: Record<string, unknown>[] = [blogPosting, breadcrumbList];

  if (article.faqs && article.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: article.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <JsonLdScript
      id={`article-schema-${article.slug}`}
      data={{ '@context': 'https://schema.org', '@graph': graph }}
    />
  );
}
