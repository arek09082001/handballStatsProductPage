import { BookOpen } from 'lucide-react';
import ArticleCard from '../components/article-card';
import { getArticlesByCategory } from '../data/articles';

function categoryId(category: string): string {
  return `kategorie-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
}

/**
 * Ratgeber hub: dark hero + a server-rendered, category-grouped grid of article
 * cards. Fully static and zero-JS, so every article is crawlable from here.
 */
export default function BlogIndexPage() {
  const groups = getArticlesByCategory();

  return (
    <div className='w-full bg-background'>
      <header className='relative isolate w-full overflow-hidden border-b border-border/50 bg-slate-950 text-white'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_0%,rgba(249,115,22,0.22),transparent),radial-gradient(ellipse_40%_35%_at_92%_100%,rgba(59,130,246,0.16),transparent)]' />

        <div className='relative mx-auto max-w-5xl px-6 py-14 text-center sm:px-8 md:py-20'>
          <div className='mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85'>
            <BookOpen className='h-3.5 w-3.5' />
            Handball-Ratgeber
          </div>

          <h1 className='mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl'>
            Wissen für Handballtrainer
          </h1>

          <p className='mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg'>
            Praxisnahe Artikel zu Statistik, Training, Taktik und Spielanalyse –
            damit du dein Team datenbasiert und mit einem klaren Plan
            weiterentwickelst.
          </p>
        </div>
      </header>

      <div className='mx-auto max-w-6xl px-6 py-14 sm:px-8 md:py-20'>
        <div className='space-y-16'>
          {groups.map((group) => (
            <section key={group.category} aria-labelledby={categoryId(group.category)}>
              <h2
                id={categoryId(group.category)}
                className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                {group.category}
              </h2>
              <div className='mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {group.articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
