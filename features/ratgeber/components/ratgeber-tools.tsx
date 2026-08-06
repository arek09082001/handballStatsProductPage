import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BoardKicker } from '@/features/landing-page/components/tactic';
import { RATGEBER_TOOLS } from '../data/tools';

/**
 * Short tools block above the category list on the Ratgeber hub. Same pinned
 * note language as `ArticleCard`, but with a tape strip instead of a magnet so
 * the two rows stay visually distinct. Static server component.
 */
export default function RatgeberTools() {
  return (
    <section aria-labelledby='ratgeber-werkzeuge' className='mb-16 md:mb-20'>
      <BoardKicker>Werkzeuge</BoardKicker>
      <h2
        id='ratgeber-werkzeuge'
        className='mt-3 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink sm:text-[1.75rem]'>
        Zum direkt Loslegen
      </h2>
      <p className='mt-2 max-w-2xl text-sm leading-6 text-ink/65'>
        Bevor du dich durch die Artikel liest: Zwei kostenlose Helfer, mit denen
        du sofort anfangen kannst, deine Zahlen zu erfassen.
      </p>

      <div className='mt-7 grid gap-6 sm:grid-cols-2'>
        {RATGEBER_TOOLS.map((tool) => (
          <div
            key={tool.href}
            className='group relative flex h-full flex-col rounded-2xl border border-ink/10 bg-paper-2 p-5 board-shadow transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 focus-within:-translate-y-1'>
            <span
              aria-hidden='true'
              className='absolute -top-2 left-6 h-4 w-14 -rotate-2 rounded-[2px] bg-ink/10 ring-1 ring-ink/10'
            />

            <h3 className='font-display text-lg font-extrabold leading-snug tracking-[-0.02em] text-ink'>
              <Link
                href={tool.href}
                className='rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'>
                {tool.title}
              </Link>
            </h3>

            <p className='mt-2.5 flex-1 text-sm leading-6 text-ink/70'>
              {tool.description}
            </p>

            <span className='mt-5 inline-flex items-center gap-1 font-display text-[13px] font-bold text-primary transition-transform duration-300 group-hover:translate-x-0.5'>
              Öffnen
              <ArrowRight className='size-3.5' />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
