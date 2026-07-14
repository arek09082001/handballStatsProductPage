import ArticleCard from './article-card';
import type { Article } from '../types';

/** Grid of related-article cards shown at the foot of an article. */
export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className='border-t border-border bg-muted/30 py-14 md:py-16'>
      <div className='mx-auto max-w-5xl px-6 sm:px-8'>
        <h2 className='text-2xl font-bold tracking-tight text-foreground'>
          Weitere Ratgeber
        </h2>
        <p className='mt-2 text-sm text-muted-foreground'>
          Passende Artikel, die dich als Trainer weiterbringen.
        </p>
        <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
