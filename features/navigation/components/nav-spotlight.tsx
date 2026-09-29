'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { navigationSpotlight } from '../config';
import HoldSwipeIcon from './hold-swipe-icon';

/**
 * The header's pointer at a new feature — see `navigationSpotlight`.
 *
 * Three shapes of one link. `bar` sits in the desktop header beside the
 * language switcher: the magnet with its badge hung underneath, no words — the
 * header is capped at 1280px, and "Maintenir et glisser" beside five entries,
 * the switcher and the register button fits at no width; the name is the
 * link's title and label instead. `button` is the magnet beside the phone's
 * menu button, the only other thing in that bar. `card` opens the mobile
 * menu, where there is room to say what it is.
 *
 * The magnet is the board's home magnet — orange, inked glyph — with the
 * gesture drawn on it, and a pulsing ring that stops under reduced motion. The
 * register button next to it is orange too, which is why the magnet is round
 * and small and the badge carries the word: the two must not read as two
 * calls to action.
 * @returns A JSX element linking to the spotlighted feature page.
 */
export default function NavSpotlight({
  variant,
  active = false,
  onNavigate,
}: {
  variant: 'bar' | 'button' | 'card';
  active?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations('navigationSection.spotlight');

  if (variant === 'card') {
    return (
      <Link
        href={navigationSpotlight.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className='group flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 transition-colors hover:bg-orange-100'>
        <Magnet size='md' />
        <span className='min-w-0 flex-1'>
          <span className='flex items-center gap-2'>
            <span className='truncate text-sm font-semibold tracking-[-0.01em] text-slate-950'>
              {t('title')}
            </span>
            <Badge label={t('badge')} />
          </span>
          <span className='mt-0.5 block text-[13px] leading-5 text-slate-600'>
            {t('description')}
          </span>
        </span>
        <ArrowRight className='size-4 shrink-0 text-[#ea580c] transition-transform group-hover:translate-x-0.5' />
      </Link>
    );
  }

  if (variant === 'button') {
    return (
      <Link
        href={navigationSpotlight.href}
        title={t('title')}
        aria-label={t('ariaLabel')}
        aria-current={active ? 'page' : undefined}
        className='relative z-10 inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2'>
        <Magnet size='lg' pulse={!active} />
        <span className='absolute -right-2 -top-1.5'>
          <Badge label={t('badge')} />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={navigationSpotlight.href}
      title={t('title')}
      aria-label={t('ariaLabel')}
      aria-current={active ? 'page' : undefined}
      className='relative inline-flex size-11 shrink-0 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2'>
      <Magnet size='lg' pulse={!active} />
      {/* Hung on the magnet's lower edge, not beside it: the slot this sits
          in is exactly one magnet wide (see `site-navbar`), and a badge to
          the side would reach into the language switcher. */}
      <span className='absolute -bottom-2.5 left-1/2 -translate-x-1/2'>
        <Badge label={t('badge')} />
      </span>
    </Link>
  );
}

/** The home magnet of the board with the gesture drawn on it. */
function Magnet({
  size,
  pulse = false,
}: {
  size: 'md' | 'lg';
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        'relative inline-grid shrink-0 place-items-center rounded-full ring-1',
        size === 'lg' ? 'size-10' : 'size-9',
      )}
      style={{
        background:
          'radial-gradient(120% 120% at 32% 26%, hsl(22 96% 64%), hsl(22 92% 54%) 62%, hsl(22 90% 48%))',
        color: 'hsl(20 65% 12%)',
        // @ts-expect-error — CSS custom prop for the Tailwind ring colour
        '--tw-ring-color': 'hsl(22 90% 34% / 0.6)',
        boxShadow:
          'inset 0 1px 1px hsl(0 0% 100% / 0.45), inset 0 -2px 3px hsl(0 0% 0% / 0.22), 0 6px 12px -6px hsl(222 30% 15% / 0.55)',
      }}>
      {/* A few rings on arrival, then still: enough to catch the eye once,
          not a header that keeps moving while somebody reads. */}
      {pulse ? (
        <span
          aria-hidden='true'
          className='absolute inset-0 rounded-full bg-[#f97316]/40 motion-safe:animate-ping'
          style={{ animationIterationCount: 5 }}
        />
      ) : null}
      <HoldSwipeIcon
        className={cn('relative', size === 'lg' ? 'size-6' : 'size-5')}
      />
    </span>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className='inline-flex items-center rounded-full bg-slate-950 px-1.5 py-0.5 font-display text-[13px] font-extrabold leading-none text-white shadow-sm'>
      {label}
    </span>
  );
}
