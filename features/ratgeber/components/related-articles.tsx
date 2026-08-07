import { BoardKicker, Grain } from '@/features/landing-page/components/tactic';
import ArticleCard from './article-card';
import type { Article } from '../types';

/**
 * Grid of related-article notes pinned to the board. Heading and lede are set
 * by the archetype (see `article-page.tsx`), because what a coach wants next
 * after a training recipe is another session, and after a metric another
 * number — not the same generic "Weitere Ratgeber" every time.
 */
export default function RelatedArticles({
  articles,
  kicker = 'Weiterlesen',
  title = 'Weitere Ratgeber',
  lede = 'Passende Artikel, die dich als Trainer weiterbringen.',
}: {
  articles: Article[];
  kicker?: string;
  title?: string;
  lede?: string;
}) {
  if (articles.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden border-t border-ink/10 bg-paper-2 py-16 md:py-20'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-8'>
        <BoardKicker>{kicker}</BoardKicker>
        <h2 className='mt-3 font-display text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.1rem]'>
          {title}
        </h2>
        <p className='mt-2 text-sm text-ink/65'>{lede}</p>
        <div className='mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
