import ArticleHeader from '../components/article-header';
import ArticleBody from '../components/article-body';
import ArticleFaqSection from '../components/article-faq';
import ArticleAuthorBox from '../components/article-author-box';
import ArticleCta from '../components/article-cta';
import RelatedArticles from '../components/related-articles';
import type { Breadcrumb } from '../components/article-breadcrumbs';
import { getRelatedArticles } from '../data/articles';
import type { Article, ArticleArchetype } from '../types';

/**
 * Where the related grid goes, per archetype. The band order is not
 * decoration: after a training recipe or a system a coach wants the next
 * session, so the related grid comes straight after the body; after a metric, a
 * rule or a decision aid the next question is an edge case, so the FAQ keeps
 * that slot and the grid closes the page.
 *
 * Only the position lives here — the grid's own heading and lede come from the
 * bundle, keyed by the same archetype.
 */
const RELATED_FIRST: Record<ArticleArchetype, boolean> = {
  kennzahl: false,
  system: true,
  rezept: true,
  referenz: false,
  entscheidung: false,
};

/**
 * Full article page in the Trainertafel world, alternating the two grounds like
 * the landing page: court header → paper prose body → paper FAQ → paper author
 * box → court product CTA → paper related articles. The H1 lives in the header
 * only.
 *
 * How many related notes are pinned up follows the article's own `relatedSlugs`
 * (2–6) instead of a fixed three, so the foot of the page varies with the
 * article the way the body does.
 */
export default function ArticlePage({
  article,
  breadcrumbs,
}: {
  article: Article;
  breadcrumbs: Breadcrumb[];
}) {
  const relatedFirst = article.archetype
    ? RELATED_FIRST[article.archetype]
    : false;
  const relatedLimit = Math.min(
    6,
    Math.max(2, article.relatedSlugs?.length ?? 3),
  );
  const related = getRelatedArticles(article, relatedLimit);

  const relatedSection = (
    <RelatedArticles articles={related} archetype={article.archetype} />
  );

  return (
    <article className='w-full bg-paper'>
      <ArticleHeader article={article} breadcrumbs={breadcrumbs} />
      <ArticleBody body={article.body} modules={article.modules} />
      {relatedFirst ? relatedSection : null}
      {article.faqs && article.faqs.length > 0 ? (
        <ArticleFaqSection faqs={article.faqs} />
      ) : null}
      <ArticleAuthorBox />
      <ArticleCta />
      {relatedFirst ? null : relatedSection}
    </article>
  );
}
