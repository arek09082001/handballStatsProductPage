import { CalendarDays, Clock, Tag } from 'lucide-react';
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
 * Dark hero header for a single article. Holds the page's single H1, the
 * category eyebrow, the excerpt lede and a publish-date / reading-time meta row.
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
    <header className='relative isolate w-full overflow-hidden border-b border-border/50 bg-slate-950 text-white'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_0%,rgba(249,115,22,0.22),transparent),radial-gradient(ellipse_40%_35%_at_92%_100%,rgba(59,130,246,0.16),transparent)]' />

      <div className='relative mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-14 md:py-16'>
        <ArticleBreadcrumbs items={breadcrumbs} onDark />

        <div className='mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85'>
          <Tag className='h-3.5 w-3.5' />
          {eyebrow}
        </div>

        <h1 className='mt-5 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]'>
          {article.title}
        </h1>

        <p className='mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg'>
          {article.excerpt}
        </p>

        <div className='mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300'>
          <span className='inline-flex items-center gap-2'>
            <CalendarDays className='h-4 w-4 text-slate-400' />
            <time dateTime={article.datePublished}>
              {formatGermanDate(article.datePublished)}
            </time>
          </span>
          <span className='inline-flex items-center gap-2'>
            <Clock className='h-4 w-4 text-slate-400' />
            {article.readingTimeMinutes} Min. Lesezeit
          </span>
        </div>
      </div>
    </header>
  );
}
