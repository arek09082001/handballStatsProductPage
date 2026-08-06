import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Grain } from '@/features/landing-page/components/tactic';
import { ARTICLE_AUTHOR, authorInitials } from '../data/author';

/**
 * Who wrote this. Sits at the foot of every article, above the product CTA, as
 * a paper note pinned to the board with a single magnet — the same language as
 * `ArticleCard`, one step quieter.
 *
 * Falls back to an initials monogram while `photoPath` is null, so the box
 * never renders a broken image or a logo standing in for a person.
 */
export default function ArticleAuthorBox() {
  const { name, role, bio, photoPath, profilePath } = ARTICLE_AUTHOR;

  return (
    <section
      aria-labelledby='artikel-autor'
      className='relative w-full overflow-hidden border-t border-ink/10 bg-paper py-12 md:py-16'>
      <Grain tone='paper' />

      <div className='relative mx-auto max-w-3xl px-6 sm:px-8'>
        <div className='relative flex flex-col gap-5 rounded-2xl border border-ink/10 bg-paper-2 p-6 board-shadow sm:flex-row sm:gap-6 sm:p-7'>
          <span
            aria-hidden='true'
            className='absolute -top-2 left-7 size-4 rounded-full ring-1 ring-black/10'
            style={{
              background:
                'radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.7), hsl(22 92% 52%) 60%, hsl(22 90% 36%))',
              boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
            }}
          />

          {photoPath ? (
            <Image
              src={photoPath}
              alt={`${name}, ${role}`}
              width={96}
              height={96}
              className='size-20 shrink-0 rounded-full object-cover ring-1 ring-ink/10 sm:size-24'
            />
          ) : (
            <span
              aria-hidden='true'
              className='flex size-20 shrink-0 items-center justify-center rounded-full bg-court font-display text-2xl font-extrabold tracking-[-0.02em] text-chalk ring-1 ring-ink/10 sm:size-24'>
              {authorInitials(name)}
            </span>
          )}

          <div className='min-w-0'>
            <p className='font-hand text-lg leading-none text-primary'>
              Über den Autor
            </p>
            <h2
              id='artikel-autor'
              className='mt-2 font-display text-xl font-extrabold tracking-[-0.02em] text-ink'>
              {name}
            </h2>
            <p className='mt-0.5 text-sm text-ink/60'>{role}</p>
            <p className='mt-3 text-sm leading-6 text-ink/75'>{bio}</p>

            <Link
              href={profilePath}
              className='mt-4 inline-flex items-center gap-1 rounded-sm font-display text-[13px] font-bold text-primary transition-transform duration-300 hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'>
              Mehr über Statix
              <ArrowRight className='size-3.5' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
