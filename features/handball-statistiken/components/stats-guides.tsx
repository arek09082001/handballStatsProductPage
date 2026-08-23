import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ArticleCard from '@/features/ratgeber/components/article-card';
import { getArticleBySlug } from '@/features/ratgeber/data/articles';
import {
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { STAT_GUIDE_SLUGS } from '../data/stats-content';

/**
 * The hand-off band: every metric on this page has a Ratgeber article that
 * works it out in full. Cards are resolved from the article data, so a renamed
 * article renames itself here instead of drifting into a dead link.
 * @returns A JSX element rendering the linked in-depth guides on paper.
 */
export default function StatsGuides() {
  const guides = STAT_GUIDE_SLUGS.map((slug) => getArticleBySlug(slug)).filter(
    (article) => article !== undefined,
  );

  return (
    <section
      id='vertiefung'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Eine Ebene tiefer'
          title='Jede Kennzahl im Detail'
          description='Formel, Zählregeln, Richtwerte und die Fehldeutungen – für jede Zahl von dieser Seite gibt es einen Artikel, der sie zu Ende rechnet.'
        />

        <div className='mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {guides.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <Link
          href='/ratgeber'
          className='group mt-10 inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#ea580c]'>
          Alle Artikel im Handball-Ratgeber
          <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
        </Link>
      </div>
    </section>
  );
}
