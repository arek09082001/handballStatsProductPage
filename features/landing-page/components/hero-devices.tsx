'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { MarkerArrow } from './tactic';

/**
 * The hero's proof: a tablet and a phone, each showing what the sideline tap
 * turns into — the shape of the game on the tablet, the quota rings on the
 * phone. Both are real captures of the demo game
 * (`scripts/screenshots/capture.mjs --only geraete`).
 *
 * Why devices and not a flat shot: the old hero pinned the recording screen,
 * which proves the tap but not the payoff. A coach decides on the payoff —
 * "after the whistle I know where the game turned" — and a chart reads as a
 * chart even when it is small, a court full of magnets does not.
 *
 * The motion is CSS 3D driven by framer-motion, not a rendered video: the
 * screenshots stay pixel-sharp at any width, the LCP image is a plain `<img>`,
 * and nothing loads that a coach on a hall's mobile network would wait for.
 * The same choreography exists as a Remotion composition (`HeroDevices` in the
 * remotion-statix repo) for social posts and the store.
 *
 * Entry: the tablet flies in from the right and settles at a slight angle,
 * the phone rises from below in front of it, then both float a few pixels.
 * On a fine pointer the stage leans toward the cursor by a couple of degrees.
 * Reduced motion: no flight, no float, no lean — the final pose, at once.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/** The rest pose. Shared with the Remotion composition so both read the same. */
const TABLET_POSE = { rotateY: -11, rotateX: 6, rotateZ: -1.5 };
const PHONE_POSE = { rotateY: 8, rotateX: 3, rotateZ: 3 };

export default function HeroDevices() {
  const t = useTranslations('productPage.hero');
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);

  // Pointer lean: −1…1 across the stage, sprung so it never jitters.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const leanY = useTransform(sx, [-1, 1], [-4, 4]);
  const leanX = useTransform(sy, [-1, 1], [3, -3]);

  useEffect(() => {
    if (reduce) return;
    const el = stageRef.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      px.set(((event.clientX - box.left) / box.width) * 2 - 1);
      py.set(((event.clientY - box.top) / box.height) * 2 - 1);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce, px, py]);

  return (
    <div
      ref={stageRef}
      className='relative mx-auto w-full max-w-[760px] [perspective:2200px]'>
      <motion.div
        style={reduce ? undefined : { rotateX: leanX, rotateY: leanY }}
        className='relative aspect-[16/11.5] w-full [transform-style:preserve-3d]'>
        {/* Tablet — the shape of the game */}
        <motion.div
          initial={
            reduce
              ? false
              : { opacity: 0, x: 160, y: 40, rotateY: -48, rotateX: 14, rotateZ: -6 }
          }
          animate={{ opacity: 1, x: 0, y: 0, ...TABLET_POSE }}
          transition={{ duration: 1.25, ease: EASE, delay: 0.15 }}
          className='absolute right-0 top-[2%] w-[94%] [transform-style:preserve-3d]'>
          <Float disabled={Boolean(reduce)} delay={1.4} amplitude={6} period={7}>
            <DeviceFrame kind='tablet'>
              <Image
                src='/hero-tablet-verlauf.png'
                alt={t('tabletAlt')}
                width={2560}
                height={1600}
                priority
                sizes='(max-width: 1024px) 92vw, 620px'
                className='block h-auto w-full'
              />
              <TurnMark show={!reduce} />
            </DeviceFrame>
          </Float>
        </motion.div>

        {/* Phone — the quotas, in front */}
        <motion.div
          initial={
            reduce
              ? false
              : { opacity: 0, y: 180, x: -30, rotateY: 30, rotateX: -10, rotateZ: 8 }
          }
          animate={{ opacity: 1, x: 0, y: 0, ...PHONE_POSE }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
          style={{ translateZ: 60 }}
          className='absolute bottom-0 left-[-3%] w-[25%] [transform-style:preserve-3d] sm:left-[-5%] lg:left-0 xl:left-[-5%]'>
          <Float disabled={Boolean(reduce)} delay={1.8} amplitude={8} period={6}>
            <DeviceFrame kind='phone'>
              <Image
                src='/hero-mobil-statistik.png'
                alt={t('phoneAlt')}
                width={780}
                height={1688}
                sizes='(max-width: 1024px) 30vw, 200px'
                className='block h-auto w-full'
              />
            </DeviceFrame>
          </Float>
        </motion.div>
      </motion.div>

      {/* The coach's notes on the board — what to look at. Off below `sm`,
          where they would sit on the screens. The tablet note's arrow runs
          down into the chart, onto the circle drawn round the minute the
          curve turns into a lead (see `TurnMark`) — not at the app's header,
          which is where a sideways arrow above the device ended up. */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 1.5 }}
        className='pointer-events-none absolute -top-10 left-[30%] hidden sm:block'>
        <span className='font-hand text-2xl font-semibold leading-none text-primary'>
          {t('noteTablet')}
        </span>
        <svg
          viewBox='0 0 80 110'
          fill='none'
          className='absolute left-[88%] top-[1.4rem] h-[7.5rem] w-20 overflow-visible'>
          <path
            d='M6 4 C 30 18, 58 40, 64 96'
            stroke='hsl(22 92% 52%)'
            strokeWidth={3}
            strokeLinecap='round'
          />
          <path
            d='M64 98 L 55 85 M64 98 L 72 86'
            stroke='hsl(22 92% 52%)'
            strokeWidth={3}
            strokeLinecap='round'
          />
        </svg>
      </motion.div>
      <motion.div
        aria-hidden
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 1.8 }}
        className='pointer-events-none absolute -bottom-3 left-[24%] hidden items-center gap-1 sm:flex'>
        <MarkerArrow
          variant='straight'
          color='chalk'
          className='h-8 w-14 rotate-180 opacity-80'
        />
        <span className='font-hand text-2xl font-semibold leading-none text-chalk/85'>
          {t('notePhone')}
        </span>
      </motion.div>
    </div>
  );
}

/**
 * A marker circle drawn round the turn in the game-flow chart — the minute the
 * goal difference leaves zero for good (the 40th minute in the demo game). It lives
 * INSIDE the tablet's screen, in the screenshot's own proportions, so it stays
 * on the curve through the tilt, the float and the pointer lean. Re-measure
 * `left`/`top` when `hero-tablet-verlauf.png` is shot again.
 */
function TurnMark({ show }: { show: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox='0 0 120 60'
      fill='none'
      className='pointer-events-none absolute left-[58.5%] top-[23.5%] h-[16%] w-[13%] overflow-visible'>
      <motion.path
        d='M14 34 C 10 14, 52 4, 86 8 C 116 12, 118 44, 88 52 C 60 58, 20 56, 12 38 C 9 30, 18 22, 30 18'
        stroke='hsl(22 92% 52%)'
        strokeWidth={4}
        strokeLinecap='round'
        vectorEffect='non-scaling-stroke'
        initial={show ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.7, ease: EASE, delay: 1.9 }}
      />
    </svg>
  );
}

/** A slow vertical drift once the device has landed. */
function Float({
  children,
  disabled,
  delay,
  amplitude,
  period,
}: {
  children: React.ReactNode;
  disabled: boolean;
  delay: number;
  amplitude: number;
  period: number;
}) {
  if (disabled) return <>{children}</>;
  return (
    <motion.div
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration: period,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}>
      {children}
    </motion.div>
  );
}

/**
 * A plain dark device: bezel, rounded screen, a hairline rim and one real
 * offset shadow on the court — no notch, no glare blob, no coloured halo.
 * The screenshot keeps its own aspect ratio, so the frame follows the picture.
 */
function DeviceFrame({
  kind,
  children,
}: {
  kind: 'tablet' | 'phone';
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'relative bg-[#0a0d12] ring-1 ring-chalk/15',
        'shadow-[0_40px_60px_-30px_rgba(0,0,0,0.75),0_18px_28px_-18px_rgba(0,0,0,0.6)]',
        kind === 'tablet'
          ? 'rounded-[22px] p-[1.6%] sm:rounded-[28px]'
          : 'rounded-[26px] p-[4.5%] sm:rounded-[32px]',
      )}>
      <div
        className={cn(
          'relative overflow-hidden bg-court',
          kind === 'tablet' ? 'rounded-[12px] sm:rounded-[16px]' : 'rounded-[18px] sm:rounded-[24px]',
        )}>
        {children}
        {/* A faint sheen across the glass, so the screen reads as a device. */}
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0)_38%)]'
        />
      </div>
    </div>
  );
}
