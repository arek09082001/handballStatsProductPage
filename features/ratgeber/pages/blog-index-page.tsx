import Link from 'next/link';
import ArticleCard from '../components/article-card';
import RatgeberTools from '../components/ratgeber-tools';
import { getArticlesByCategory } from '../data/articles';
import {
  BoardKicker,
  CourtDiagram,
  Grain,
  MarkerUnderline,
} from '@/features/landing-page/components/tactic';

function categoryId(category: string): string {
  return `kategorie-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/**
 * Ratgeber hub in the Trainertafel world: a court signature header with the
 * court chalked behind, then a paper board of category‑grouped article notes.
 * Fully static and zero‑JS, so every article is crawlable from here.
 */
export default function BlogIndexPage() {
  const groups = getArticlesByCategory();
  const total = groups.reduce((sum, group) => sum + group.articles.length, 0);

  return (
    <div className='w-full bg-paper'>
      <header className='relative isolate w-full overflow-hidden bg-court text-chalk'>
        <CourtDiagram
          variant='goal'
          formation
          formationOpacity={0.22}
          aria-hidden
          className='pointer-events-none absolute -right-[12%] top-1/2 h-[128%] w-auto -translate-y-1/2 text-chalk/[0.09] sm:-right-[6%] lg:right-[1%]'
        />
        <Grain tone='court' />

        <div className='relative mx-auto max-w-5xl px-6 py-16 text-center sm:px-8 md:py-24'>
          <BoardKicker color='chalk' className='justify-center'>
            Handball-Ratgeber
          </BoardKicker>

          <h1 className='mx-auto mt-5 max-w-3xl font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-chalk sm:text-[3rem] lg:text-[3.5rem]'>
            Wissen für{' '}
            <span className='relative inline-block whitespace-nowrap'>
              Handballtrainer
              <MarkerUnderline color='marker' />
            </span>
          </h1>

          <p className='mx-auto mt-6 max-w-2xl text-base leading-8 text-chalk/75 sm:text-lg'>
            Praxisnahe Artikel zu Statistik, Training, Taktik und Spielanalyse –
            damit du dein Team datenbasiert und mit einem klaren Plan
            weiterentwickelst. Wenn du bei den Zahlen anfängst, nimm den
            Überblick{' '}
            <Link
              href='/handball-statistiken'
              className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
              Handball-Statistiken
            </Link>{' '}
            als Startpunkt.
          </p>

          <p className='mt-7 font-hand text-xl text-primary'>
            {total} Artikel aus der Halle
          </p>
        </div>
      </header>

      <div className='relative overflow-hidden'>
        <Grain tone='paper' />
        <div className='relative mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-24'>
          <RatgeberTools />

          <div className='space-y-16 md:space-y-20'>
            {groups.map((group) => (
              <section key={group.category} aria-labelledby={categoryId(group.category)}>
                <div className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
                  <h2
                    id={categoryId(group.category)}
                    className='relative inline-block font-display text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-[1.75rem]'>
                    {group.category}
                    <MarkerUnderline color='marker' strokeWidth={5} />
                  </h2>
                  <span className='font-hand text-lg text-ink/50'>
                    {group.articles.length} Artikel
                  </span>
                </div>
                <div className='mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                  {group.articles.map((article) => (
                    <ArticleCard key={article.slug} article={article} showCategory={false} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
