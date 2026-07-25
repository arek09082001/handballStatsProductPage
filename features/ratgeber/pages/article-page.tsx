import ArticleHeader from '../components/article-header';
import ArticleBody from '../components/article-body';
import ArticleFaqSection from '../components/article-faq';
import ArticleCta from '../components/article-cta';
import RelatedArticles from '../components/related-articles';
import type { Breadcrumb } from '../components/article-breadcrumbs';
import { getRelatedArticles } from '../data/articles';
import type { Article } from '../types';

/**
 * Full article page in the Trainertafel world, alternating the two grounds like
 * the landing page: court header → paper prose body → paper FAQ → court product
 * CTA → paper related articles. The H1 lives in the header only.
 */
export default function ArticlePage({
  article,
  breadcrumbs,
}: {
  article: Article;
  breadcrumbs: Breadcrumb[];
}) {
  const related = getRelatedArticles(article, 3);

  return (
    <article className='w-full bg-paper'>
      <ArticleHeader article={article} breadcrumbs={breadcrumbs} />
      <ArticleBody body={article.body} />
      {article.faqs && article.faqs.length > 0 ? (
        <ArticleFaqSection faqs={article.faqs} />
      ) : null}
      <ArticleCta />
      <RelatedArticles articles={related} />
    </article>
  );
}
