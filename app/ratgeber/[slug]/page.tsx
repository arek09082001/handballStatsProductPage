import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePage from '@/features/ratgeber/pages/article-page';
import type { Breadcrumb } from '@/features/ratgeber/components/article-breadcrumbs';
import ArticleSchema from '@/components/seo/article-schema';
import { createPageMetadata } from '@/lib/seo';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  articlePath,
  getAllArticleSlugs,
  getArticleBySlug,
  RATGEBER_BASE_PATH,
} from '@/features/ratgeber/data/articles';

// Only the known article slugs exist; unknown slugs 404 (required because the
// root layout is `dynamic = 'force-static'`).
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return createPageMetadata({
      title: 'Artikel nicht gefunden',
      description: 'Der gesuchte Ratgeber-Artikel existiert nicht.',
      path: articlePath(slug),
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: articlePath(article.slug),
    keywords: article.keywords,
    imagePath: article.imagePath,
    ogType: 'article',
    article: {
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [CLUB_CONFIG.legal.responsiblePerson],
      section: article.category,
      tags: article.keywords,
    },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbs: Breadcrumb[] = [
    { name: 'Startseite', path: '/' },
    { name: 'Ratgeber', path: RATGEBER_BASE_PATH },
    { name: article.title, path: articlePath(article.slug) },
  ];

  return (
    <>
      <ArticleSchema
        article={article}
        path={articlePath(article.slug)}
        breadcrumbs={breadcrumbs}
      />
      <ArticlePage article={article} breadcrumbs={breadcrumbs} />
    </>
  );
}
