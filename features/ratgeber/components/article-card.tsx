import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { articlePath } from '../data/articles';
import ArchetypeBadge from './archetype-badge';
import type { Article } from '../types';

/**
 * An article as a note pinned to the tactic board: a warm paper card with one
 * real board shadow and a single magnet holding it up. The title link is
 * stretched over the whole card (`after:absolute after:inset-0`) so the entire
 * note is clickable while staying a single semantic link. See DESIGN.md.
 *
 * `showCategory` is on where cards are mixed (related articles) and off on the
 * hub, where the section already names the category above the grid.
 */
export default function ArticleCard({
  article,
  showCategory = true,
}: {
  article: Article;
  showCategory?: boolean;
}) {
  const href = articlePath(article.slug);

  return (
    <article className='group relative flex h-full flex-col rounded-2xl border border-ink/10 bg-paper p-5 board-shadow transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 focus-within:-translate-y-1'>
      <span
        aria-hidden='true'
        className='absolute -top-2 left-6 size-4 rounded-full ring-1 ring-black/10'
        style={{
          background:
            'radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.7), hsl(22 92% 52%) 60%, hsl(22 90% 36%))',
          boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
        }}
      />

      {showCategory || article.archetype ? (
        <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
          {article.archetype ? <ArchetypeBadge archetype={article.archetype} /> : null}
          {showCategory ? (
            <span className='font-hand text-lg font-semibold leading-none text-primary'>
              {article.category}
            </span>
          ) : null}
        </div>
      ) : null}

      <h3
        className={cn(
          'font-display text-lg font-extrabold leading-snug tracking-[-0.02em] text-ink',
          (showCategory || article.archetype) && 'mt-3',
        )}>
        <Link
          href={href}
          className='rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'>
          {article.title}
        </Link>
      </h3>

      <p className='mt-2.5 flex-1 text-sm leading-6 text-ink/70'>{article.excerpt}</p>

      <div className='mt-5 flex items-center justify-between border-t border-ink/10 pt-3.5 text-[13px] text-ink/55'>
        <span className='inline-flex items-center gap-1.5'>
          <Clock className='size-3.5' />
          {article.readingTimeMinutes} Min.
        </span>
        <span className='inline-flex items-center gap-1 font-display text-[13px] font-bold text-primary transition-transform duration-300 group-hover:translate-x-0.5'>
          Lesen
          <ArrowRight className='size-3.5' />
        </span>
      </div>
    </article>
  );
}
