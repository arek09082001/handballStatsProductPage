'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pause,
  Play,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import {
  CourtDiagram,
  Grain,
  PlayerMagnet,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { cn } from '@/lib/utils';
import {
  HOLD_GESTURE_FRAMES,
  HOLD_GESTURE_JERSEY,
  HOLD_GESTURE_TOUR,
  type HoldGestureDirection,
  type HoldGestureFrame,
  type HoldGestureFrameId,
} from '../data/hold-gesture';

/**
 * The hold gesture, shown the way it is used: one screen, four directions.
 *
 * On the left a phone with a REAL capture of the menu; on the right a pad laid
 * out exactly like the menu itself — the held player in the middle, one target
 * per side. Picking a direction on the pad swaps the capture for the one where
 * that target is lit, so the reader sees the same screen react instead of
 * comparing six near-identical screenshots side by side.
 *
 * Until somebody touches it, the band walks through the frames on its own
 * (`HOLD_GESTURE_TOUR`) — but only while it is on screen, never under
 * `prefers-reduced-motion`, and the first click, key or the pause button stops
 * it for good. A carousel that keeps moving under a reader's hand is the
 * opposite of what this page is explaining.
 *
 * The pad's words are the app's own labels in the reader's language. The
 * captures are the German app, like every screenshot on the site.
 * @returns A JSX element rendering the interactive hold-gesture band.
 */
export default function HoldGestureShowcase() {
  const t = useTranslations('featuresPage.holdGesture');
  const [active, setActive] = useState<HoldGestureFrameId>('hold');
  const [touched, setTouched] = useState(false);
  const [paused, setPaused] = useState(false);
  const bandRef = useRef<HTMLElement>(null);
  const visible = useInView(bandRef, { amount: 0.35 });
  const reducedMotion = useReducedMotion() ?? false;

  const touring = !touched && !paused && visible && !reducedMotion;

  useEffect(() => {
    if (!touring) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = HOLD_GESTURE_TOUR.indexOf(current) + 1;
        return HOLD_GESTURE_TOUR[next % HOLD_GESTURE_TOUR.length];
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [touring]);

  const choose = (id: HoldGestureFrameId) => {
    setTouched(true);
    setActive(id);
  };

  return (
    <section
      ref={bandRef}
      className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-24'>
      <CourtDiagram
        variant='goal'
        aria-hidden
        className='pointer-events-none absolute -left-[20%] top-1/2 h-[118%] w-auto -translate-y-1/2 text-chalk/[0.06] sm:-left-[10%] lg:-left-[4%]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
          tone='court'
        />

        {/* Three blocks, two orders. On a phone the pad comes first and the
            capture right under it, so a tap and the screen that answers it
            are on one screen; the explanation follows. From `lg` the capture
            stands on the left and the pad and explanation beside it. */}
        <div className='mt-12 grid gap-8 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-16 lg:gap-y-8'>
          {/* ── The phone: every frame stacked, one shown ─────────────────── */}
          <figure className='board-shadow-court relative order-2 mx-auto w-full max-w-[19rem] rounded-2xl border border-chalk/12 bg-court-2 p-2.5 sm:p-3 lg:order-none lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:self-center'>
            <span
              aria-hidden='true'
              className='absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full ring-1 ring-black/10'
              style={{
                background:
                  'radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.75), hsl(22 92% 52%) 60%, hsl(22 90% 36%))',
                boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
              }}
            />
            <div className='relative overflow-hidden rounded-xl ring-1 ring-chalk/12'>
              {HOLD_GESTURE_FRAMES.map((entry, index) => (
                <Image
                  key={entry.id}
                  src={entry.src}
                  alt={t(`frames.${entry.id}.alt`)}
                  width={entry.width}
                  height={entry.height}
                  sizes='(max-width: 640px) 80vw, 19rem'
                  loading={index === 0 ? 'eager' : 'lazy'}
                  aria-hidden={entry.id !== active}
                  className={cn(
                    'h-auto w-full motion-safe:transition-opacity motion-safe:duration-300',
                    index === 0 ? 'relative' : 'absolute inset-0',
                    entry.id === active ? 'opacity-100' : 'opacity-0',
                  )}
                />
              ))}
            </div>
            <figcaption className='flex items-start gap-2 px-1 pt-2.5 text-[13px] font-medium text-chalk/70'>
              <span
                aria-hidden='true'
                className='mt-[0.3125rem] size-2 shrink-0 rounded-[3px] bg-primary'
              />
              <span className='min-w-0 flex-1 text-pretty'>
                {t(`frames.${active}.caption`)}
              </span>
            </figcaption>
          </figure>

          {/* ── The pad: the menu's own layout, one button per target ───── */}
          <div className='order-1 lg:order-none lg:col-start-2 lg:row-start-2'>
            <div
              role='group'
              aria-label={t('padLabel')}
              className='mx-auto grid w-full max-w-[34rem] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] grid-rows-[auto_auto_auto] items-center gap-2.5 sm:gap-4'>
              {/* Top and bottom span all three columns: in the middle one
                  alone they set its width, and the sides were left with
                  ninety pixels on a phone. */}
              <div className='col-span-3 row-start-1 flex justify-center'>
                <DirectionButton
                  frame={frameOf('up')}
                  direction='up'
                  label={t('frames.up.button')}
                  active={active === 'up'}
                  onSelect={choose}
                />
              </div>
              <div className='col-start-1 row-start-2 flex justify-end'>
                <DirectionButton
                  frame={frameOf('left')}
                  direction='left'
                  label={t('frames.left.button')}
                  active={active === 'left'}
                  onSelect={choose}
                />
              </div>
              <div className='col-start-2 row-start-2 flex justify-center'>
                <button
                  type='button'
                  onClick={() => choose('hold')}
                  aria-pressed={active === 'hold'}
                  className={cn(
                    'group flex flex-col items-center gap-1.5 rounded-2xl border-2 px-2 py-2 transition-colors sm:px-3 sm:py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-court',
                    active === 'hold' || active === 'release'
                      ? 'border-primary bg-court-2'
                      : 'border-chalk/20 bg-court-2/60 hover:border-chalk/40',
                  )}>
                  <PlayerMagnet
                    number={HOLD_GESTURE_JERSEY}
                    size='lg'
                    className='size-11 text-base sm:size-14 sm:text-xl'
                  />
                  <span className='text-[13px] font-semibold text-chalk/85'>
                    {t('frames.hold.button')}
                  </span>
                </button>
              </div>
              <div className='col-start-3 row-start-2 flex justify-start'>
                <DirectionButton
                  frame={frameOf('right')}
                  direction='right'
                  label={t('frames.right.button')}
                  active={active === 'right'}
                  onSelect={choose}
                />
              </div>
              <div className='col-span-3 row-start-3 flex justify-center'>
                <DirectionButton
                  frame={frameOf('down')}
                  direction='down'
                  label={t('frames.down.button')}
                  active={active === 'down'}
                  onSelect={choose}
                />
              </div>
            </div>
          </div>

          <div className='order-3 flex flex-col gap-6 lg:order-none lg:col-start-2 lg:row-start-3'>
            {/* What the chosen frame means. Announced only once a reader is
                driving: during the tour it would talk every 2.6 seconds. */}
            <div
              aria-live={touched ? 'polite' : 'off'}
              className='rounded-2xl border border-chalk/12 bg-court-2 p-6 sm:p-7'>
              <p className='font-hand text-xl leading-none text-primary'>
                {t(`frames.${active}.move`)}
              </p>
              <h3 className='mt-3 font-display text-2xl font-extrabold tracking-[-0.02em] text-chalk'>
                {t(`frames.${active}.title`)}
              </h3>
              <p className='mt-3 max-w-[60ch] text-base leading-7 text-chalk/75'>
                {t(`frames.${active}.body`)}
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-3'>
              <button
                type='button'
                onClick={() => choose('release')}
                aria-pressed={active === 'release'}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-court',
                  active === 'release'
                    ? 'border-chalk bg-chalk text-court'
                    : 'border-chalk/25 text-chalk/85 hover:border-chalk/50',
                )}>
                <Undo2 aria-hidden className='size-4' strokeWidth={2.5} />
                {t('frames.release.button')}
              </button>
              {/* Hidden by CSS rather than by `reducedMotion`: the server
                  cannot know the preference, and rendering the button
                  conditionally on it made the markup differ on hydration. */}
              {touched ? null : (
                <button
                  type='button'
                  onClick={() => setPaused((value) => !value)}
                  className='inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium text-chalk/65 transition-colors hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:hidden'>
                  {paused ? (
                    <Play aria-hidden className='size-4' />
                  ) : (
                    <Pause aria-hidden className='size-4' />
                  )}
                  {paused ? t('autoplayPlay') : t('autoplayPause')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function frameOf(id: HoldGestureFrameId): HoldGestureFrame {
  const frame = HOLD_GESTURE_FRAMES.find((entry) => entry.id === id);
  if (!frame) throw new Error(`hold-gesture frame "${id}" is missing`);
  return frame;
}

const DIRECTION_ICON: Record<HoldGestureDirection, LucideIcon> = {
  up: ChevronUp,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
};

/**
 * The lit colour of each target, as the app draws it — amber for the lost duel,
 * red for the caused 7m, green for the two drawn penalties. Ink numerals on
 * all three: they are light-mid tones, the same reason the home magnet's
 * number is inked rather than white.
 */
const TONE_STYLE: Record<
  HoldGestureFrame['tone'],
  { background: string; color: string; borderColor: string }
> = {
  neutral: {
    background: 'hsl(0 0% 100%)',
    color: 'hsl(199 46% 12%)',
    borderColor: 'hsl(0 0% 100%)',
  },
  warning: {
    background: 'hsl(43 96% 56%)',
    color: 'hsl(30 60% 12%)',
    borderColor: 'hsl(43 96% 56%)',
  },
  negative: {
    background: 'hsl(0 80% 64%)',
    color: 'hsl(0 60% 12%)',
    borderColor: 'hsl(0 80% 64%)',
  },
  positive: {
    background: 'hsl(150 58% 48%)',
    color: 'hsl(150 60% 10%)',
    borderColor: 'hsl(150 58% 48%)',
  },
};

/** One target of the pad, drawn like the app's chip: quiet until chosen. */
function DirectionButton({
  frame,
  direction,
  label,
  active,
  onSelect,
}: {
  frame: HoldGestureFrame;
  direction: HoldGestureDirection;
  label: string;
  active: boolean;
  onSelect: (id: HoldGestureFrameId) => void;
}) {
  const Icon = DIRECTION_ICON[direction];
  return (
    <button
      type='button'
      onClick={() => onSelect(direction)}
      aria-pressed={active}
      style={active ? TONE_STYLE[frame.tone] : undefined}
      className={cn(
        'relative inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-full border-2 px-2.5 py-2 text-left text-sm font-bold leading-tight shadow-lg transition-[transform,background-color,color,border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-court sm:px-4 sm:text-base',
        active
          ? 'motion-safe:scale-105'
          : 'border-chalk/20 bg-court-2 text-chalk/80 hover:border-chalk/45 hover:text-chalk',
      )}>
      <Icon aria-hidden className='size-4 shrink-0' strokeWidth={2.75} />
      {/* A phone leaves each side about 125px; a long single word must
          break inside its own button rather than run out of it. */}
      <span className='min-w-0 text-pretty break-words'>{label}</span>
    </button>
  );
}
