import { CalendarDays, Clock } from 'lucide-react';
import { BoardKicker, CourtDiagram, Grain } from '@/features/landing-page/components/tactic';
import ArticleBreadcrumbs, { type Breadcrumb } from './article-breadcrumbs';
import type { Article } from '../types';

function formatGermanDate(iso: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * Court-ground header for a single article — a signature band of the
 * Trainertafel world. The handball court is chalked behind the copy; the
 * category is set as the coach's marker kicker, the H1 in Archivo. Static
 * server component (no client JS), so the article stays fully crawlable.
 */
export default function ArticleHeader({
  article,
  breadcrumbs,
}: {
  article: Article;
  breadcrumbs: Breadcrumb[];
}) {
  const eyebrow = article.heroEyebrow ?? article.category;

  return (
    <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -right-[14%] top-1/2 h-[130%] w-auto -translate-y-1/2 text-chalk/[0.09] sm:-right-[8%] lg:-right-[2%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-3xl px-6 py-12 sm:px-8 sm:py-16 md:py-20'>
        <ArticleBreadcrumbs items={breadcrumbs} onDark />

        <div className='mt-7'>
          <BoardKicker color='chalk'>{eyebrow}</BoardKicker>
        </div>

        <h1 className='mt-4 font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-chalk sm:text-[2.5rem] lg:text-[2.9rem] lg:leading-[1.05]'>
          {article.title}
        </h1>

        <p className='mt-5 max-w-2xl text-base leading-8 text-chalk/75 sm:text-lg'>
          {article.excerpt}
        </p>

        <div className='mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-chalk/60'>
          <span className='inline-flex items-center gap-2'>
            <CalendarDays className='h-4 w-4 text-primary' />
            <time dateTime={article.datePublished}>
              {formatGermanDate(article.datePublished)}
            </time>
          </span>
          <span aria-hidden className='h-1 w-1 rounded-full bg-chalk/30' />
          <span className='inline-flex items-center gap-2'>
            <Clock className='h-4 w-4 text-primary' />
            {article.readingTimeMinutes} Min. Lesezeit
          </span>
        </div>
      </div>
    </header>
  );
}
