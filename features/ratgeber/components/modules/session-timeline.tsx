import type { ArticleModule } from '../../types';

type Timeline = Extract<ArticleModule, { kind: 'sessionTimeline' }>;

/**
 * A session drawn as the strip a coach tapes to the ball cart: minute blocks
 * down the left, what happens in them on the right, the total added up so the
 * plan is honest about whether it fits into the hall time.
 */
export default function SessionTimeline({
  caption,
  blocks,
}: Omit<Timeline, 'kind' | 'after'>) {
  const total = blocks.reduce((sum, block) => sum + block.minutes, 0);

  return (
    <figure className='my-9 rounded-2xl border border-ink/10 bg-paper-2 px-6 py-6 board-shadow sm:px-7'>
      <figcaption className='flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1'>
        <span className='font-hand text-xl leading-none text-primary'>
          {caption ?? 'Die Einheit im Ablauf'}
        </span>
        <span className='font-display text-[13px] font-bold uppercase tracking-[0.06em] tabular-nums text-ink/55'>
          {total} Minuten
        </span>
      </figcaption>

      <ol className='mt-5 space-y-0'>
        {blocks.map((block, index) => (
          <li
            key={`${block.label}-${index}`}
            className='flex gap-4 border-t border-ink/10 py-3.5 first:border-t-0 first:pt-0'>
            <span className='mt-0.5 w-14 shrink-0 font-display text-[15px] font-extrabold tabular-nums text-primary'>
              {block.minutes} min
            </span>
            <span className='min-w-0'>
              <span className='block text-[15px] font-semibold leading-7 text-ink'>
                {block.label}
              </span>
              {block.note ? (
                <span className='mt-0.5 block text-[15px] leading-7 text-ink/70'>
                  {block.note}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
