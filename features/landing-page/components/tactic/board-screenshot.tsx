import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BoardScreenshotProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Caption shown under the shot, like a note under a pinned photo. */
  label?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Ground this shot sits on, so the matte and hairline match. */
  tone?: 'paper' | 'court';
  /** Fastener holding the shot to the board. */
  pin?: 'tape' | 'magnet' | 'none';
  /** Show a live dot on the caption (used for the demo). */
  live?: boolean;
  pending?: boolean;
  pendingHint?: string;
}

/**
 * A real in‑app screenshot mounted on the board — a matte‑framed print pinned
 * with tape or a magnet, captioned by hand. Deliberately *not* a macOS browser
 * window: the traffic‑light chrome was part of the old generic look.
 */
export default function BoardScreenshot({
  src,
  alt,
  width,
  height,
  label,
  priority = false,
  sizes = '(max-width: 1024px) 100vw, 60vw',
  className,
  tone = 'paper',
  pin = 'tape',
  live = false,
  pending = false,
  pendingHint,
}: BoardScreenshotProps) {
  const onPaper = tone === 'paper';
  return (
    <figure
      className={cn(
        'relative rounded-2xl p-2.5 sm:p-3',
        onPaper
          ? 'board-shadow border border-ink/10 bg-paper'
          : 'board-shadow-court border border-chalk/12 bg-court-2',
        className,
      )}>
      {pin === 'tape' && (
        <span
          aria-hidden='true'
          className='absolute -top-3 left-8 z-10 h-6 w-20 -rotate-6 rounded-[2px] bg-chalk/40 ring-1 ring-black/5 backdrop-blur-[1px]'
          style={{
            maskImage:
              'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          }}
        />
      )}
      {pin === 'magnet' && (
        <span
          aria-hidden='true'
          className='absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full ring-1 ring-black/10'
          style={{
            background:
              'radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.75), hsl(22 92% 52%) 60%, hsl(22 90% 36%))',
            boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
          }}
        />
      )}

      <div
        className={cn(
          'overflow-hidden rounded-xl ring-1',
          onPaper ? 'ring-ink/12' : 'ring-chalk/12',
        )}>
        {pending ? (
          <div
            style={{ aspectRatio: `${width} / ${height}` }}
            className='grid w-full place-items-center bg-court text-chalk/70'>
            <div className='flex flex-col items-center gap-2 px-6 text-center'>
              <span className='font-hand text-2xl text-primary'>Screenshot folgt</span>
              {pendingHint ? (
                <span className='rounded bg-chalk/10 px-2 py-1 font-mono text-xs text-chalk/50'>
                  {pendingHint}
                </span>
              ) : null}
            </div>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className='h-auto w-full'
          />
        )}
      </div>

      {label ? (
        <figcaption
          className={cn(
            'flex items-center gap-2 px-1 pt-2.5 text-[13px] font-medium',
            onPaper ? 'text-ink/70' : 'text-chalk/70',
          )}>
          <span
            aria-hidden='true'
            className={cn(
              'size-2 shrink-0 rounded-[3px]',
              live ? 'bg-primary' : onPaper ? 'bg-ink/30' : 'bg-chalk/40',
            )}
          />
          <span className='min-w-0 flex-1 truncate'>{label}</span>
          {live ? (
            <span className='inline-flex items-center gap-1.5 font-hand text-base text-primary'>
              <span className='relative flex size-1.5'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70' />
                <span className='relative inline-flex size-1.5 rounded-full bg-primary' />
              </span>
              live
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
