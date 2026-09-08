'use client';

import { CalendarDays, Clock, PenLine } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { DEFAULT_LOCALE, getHtmlLang, isAppLocale } from '@/i18n/config';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
} from '@/features/landing-page/components/tactic';
import ArticleBreadcrumbs, { type Breadcrumb } from './article-breadcrumbs';
import ArchetypeBadge from './archetype-badge';
import { ARTICLE_AUTHOR } from '../data/author';
import type { Article } from '../types';

/**
 * Court-ground header for a single article — a signature band of the
 * Trainertafel world. The handball court is chalked behind the copy; the
 * category is set as the coach's marker kicker, the H1 in Archivo.
 *
 * Title, standfirst and category come from the article and stay German; the
 * byline, the two dates and the reading time are chrome and follow the reader's
 * language — including the date format, where 7 September 2026 is "7. September
 * 2026" for one reader and "7 września 2026" for another.
 */
export default function ArticleHeader({
  article,
  breadcrumbs,
}: {
  article: Article;
  breadcrumbs: Breadcrumb[];
}) {
  const t = useTranslations('guidePage.article');
  const tAuthor = useTranslations('author');
  const locale = useLocale();
  const eyebrow = article.heroEyebrow ?? article.category;

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(
      getHtmlLang(isAppLocale(locale) ? locale : DEFAULT_LOCALE),
      { day: 'numeric', month: 'long', year: 'numeric' },
    ).format(new Date(iso));

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

        <div className='mt-7 flex flex-wrap items-center gap-x-4 gap-y-3'>
          <BoardKicker color='chalk'>{eyebrow}</BoardKicker>
          {article.archetype ? (
            <ArchetypeBadge archetype={article.archetype} onDark />
          ) : null}
        </div>

        <h1 className='mt-4 font-display text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] text-chalk sm:text-[2.5rem] lg:text-[2.9rem] lg:leading-[1.05]'>
          {article.title}
        </h1>

        <p className='mt-5 max-w-2xl text-base leading-8 text-chalk/75 sm:text-lg'>
          {article.excerpt}
        </p>

        <div className='mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-chalk/60'>
          <span className='inline-flex items-center gap-2'>
            <PenLine className='h-4 w-4 text-primary' />
            <span>
              {t.rich('byline', {
                name: ARTICLE_AUTHOR.name,
                role: tAuthor('role'),
                strong: (chunks) => (
                  <span className='font-semibold text-chalk/85'>{chunks}</span>
                ),
              })}
            </span>
          </span>
          <span aria-hidden className='h-1 w-1 rounded-full bg-chalk/30' />
          <span className='inline-flex items-center gap-2'>
            <CalendarDays className='h-4 w-4 text-primary' />
            <time dateTime={article.datePublished}>
              {formatDate(article.datePublished)}
            </time>
            {article.dateModified !== article.datePublished ? (
              <>
                {` · ${t('updatedLabel')} `}
                <time dateTime={article.dateModified}>
                  {formatDate(article.dateModified)}
                </time>
              </>
            ) : null}
          </span>
          <span aria-hidden className='h-1 w-1 rounded-full bg-chalk/30' />
          <span className='inline-flex items-center gap-2'>
            <Clock className='h-4 w-4 text-primary' />
            {t('readingTime', { minutes: article.readingTimeMinutes })}
          </span>
        </div>
      </div>
    </header>
  );
}
