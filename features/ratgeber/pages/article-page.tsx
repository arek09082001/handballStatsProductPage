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
 * Layout per archetype. The band order is not decoration: after a training
 * recipe or a system a coach wants the next session, so the related grid comes
 * straight after the body; after a metric, a rule or a decision aid the next
 * question is an edge case, so the FAQ keeps that slot and the grid closes the
 * page.
 */
const LAYOUTS: Record<
  ArticleArchetype,
  { relatedFirst: boolean; kicker: string; title: string; lede: string }
> = {
  kennzahl: {
    relatedFirst: false,
    kicker: 'Weiterrechnen',
    title: 'Weitere Kennzahlen',
    lede: 'Zahlen, die neben dieser stehen sollten, wenn du dein Team bewertest.',
  },
  system: {
    relatedFirst: true,
    kicker: 'Am Brett bleiben',
    title: 'Passende Systeme und Übungen',
    lede: 'Womit du dieses System ergänzt – und woran es sich messen lassen muss.',
  },
  rezept: {
    relatedFirst: true,
    kicker: 'Nächste Einheit',
    title: 'Weitere Trainingsrezepte',
    lede: 'Einheiten und Übungsreihen, die auf diesem Schwerpunkt aufbauen.',
  },
  referenz: {
    relatedFirst: false,
    kicker: 'Nachschlagen',
    title: 'Verwandte Grundlagen',
    lede: 'Was du als Trainer im selben Zusammenhang parat haben solltest.',
  },
  entscheidung: {
    relatedFirst: false,
    kicker: 'Danach entscheiden',
    title: 'Grundlagen zur Entscheidung',
    lede: 'Die Artikel hinter den Optionen, die hier zur Wahl standen.',
  },
};

const DEFAULT_LAYOUT = {
  relatedFirst: false,
  kicker: 'Weiterlesen',
  title: 'Weitere Ratgeber',
  lede: 'Passende Artikel, die dich als Trainer weiterbringen.',
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
  const layout = article.archetype ? LAYOUTS[article.archetype] : DEFAULT_LAYOUT;
  const relatedLimit = Math.min(6, Math.max(2, article.relatedSlugs?.length ?? 3));
  const related = getRelatedArticles(article, relatedLimit);

  const relatedSection = (
    <RelatedArticles
      articles={related}
      kicker={layout.kicker}
      title={layout.title}
      lede={layout.lede}
    />
  );

  return (
    <article className='w-full bg-paper'>
      <ArticleHeader article={article} breadcrumbs={breadcrumbs} />
      <ArticleBody body={article.body} modules={article.modules} />
      {layout.relatedFirst ? relatedSection : null}
      {article.faqs && article.faqs.length > 0 ? (
        <ArticleFaqSection faqs={article.faqs} />
      ) : null}
      <ArticleAuthorBox />
      <ArticleCta />
      {layout.relatedFirst ? null : relatedSection}
    </article>
  );
}
