'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, type Transition } from 'framer-motion';

// Kickoff choreography (seconds are fractions of BOUNCE_DURATION): the ball
// falls, squashes on three impacts with decaying rebounds, then rests.
const BOUNCE_DURATION = 1.2;
const BOUNCE_TIMES = [0, 0.28, 0.33, 0.5, 0.64, 0.68, 0.8, 0.9, 1];
const BOUNCE_EASE = [
  'easeIn',
  'linear',
  'easeOut',
  'easeIn',
  'linear',
  'easeOut',
  'easeIn',
  'easeOut',
] as const;
// Moments (in seconds after mount) the ball hits the floor — impact ripples
// fire here, during the drop.
const IMPACTS = [0.34, 0.77, 1.08];

// While the page behind is still loading, the ball keeps bouncing in place —
// one gentle seamless hop per cycle (starts and ends at rest, so the loop
// never pops) with the ground shadow breathing in sync.
const IDLE_HOP: Transition = {
  duration: 0.75,
  times: [0, 0.45, 1],
  ease: ['easeOut', 'easeIn'],
  repeat: Infinity,
};

// Beat sheet for the wordmark act, in seconds from the start of the 'act'
// phase (= the moment the bounce has finished AND the page is ready): the wipe
// covers the screen at ~0.7s, the wordmark grows out of the ball's rest point,
// lands with an impact ring + shine — then the handover (curtain lift,
// white→orange fade, dock/zoom exit) is driven by the `dock` state in one
// commit rather than by a clock, so those three layers can never drift apart
// on a slow frame.
const WIPE_DELAY = 0.15;
const LOGO_IN_DELAY = 0.5;
const RING_DELAY = 1.08;
const SHINE_DELAY = 1.15;
const SHINE_DURATION = 0.4;
const CURTAIN_DURATION = 0.35;
// The white logo layer must finish fading strictly before the curtain does, so
// there is never a white ghost over the page background.
const WHITE_FADE_DURATION = 0.25;
// Failsafes on the wall clock, armed when the act starts (the act nominally
// wraps up ~2.1s in, but framer's rAF clock lags wall time under jank): first
// wrap up gracefully if the shine never reported completion, then hard-unmount
// as the absolute backstop. Before the act — i.e. while the page is still
// loading — no timer runs: the bouncing ball IS the loading state, and a tap
// can always skip.
const GRACEFUL_FAILSAFE_MS = 3000;
const HARD_FAILSAFE_MS = 4600;

// drop: the entrance bounce. idle: looping hop while the page loads. act: the
// wipe + wordmark title card + handover.
type Phase = 'drop' | 'idle' | 'act';

/** Where the logo travels once its shine completes: into the measured dock
 * slot, or a zoom-through exit (grow slightly + fade) when there is no dock
 * target — e.g. on viewports where the header wordmark is hidden and so the
 * slot is unmeasurable. */
type DockTarget =
  | { kind: 'dock'; x: number; y: number; scale: number }
  | { kind: 'fade' };

// mask-image support gate for the shine sweep, probed once per session on the
// client (the overlay is only ever mounted client-side).
let maskSupport: boolean | null = null;
function supportsLogoMask(): boolean {
  if (maskSupport === null) {
    maskSupport =
      typeof CSS !== 'undefined' &&
      (CSS.supports('mask-image', 'url("")') ||
        CSS.supports('-webkit-mask-image', 'url("")'));
  }
  return maskSupport;
}

/**
 * One-shot branded entrance that doubles as the loading screen, staged as a
 * single transfer of energy: a handball drops in with squash-and-stretch
 * bounces and impact ripples — and keeps bouncing in place for as long as
 * `proceed` is false, so the show starts instantly while the page loads
 * behind it. Once the bounce is done and `proceed` is true, the ball inflates
 * into a full-screen circular wipe, the Statix wordmark grows out of that same
 * spot like a title card, lands with an impact ring and a shine sweeping its
 * letterforms, and finally hands the screen over. With a `dockTargetRef` the
 * logo glides into that slot (the site navbar's wordmark); without one it
 * zooms through the viewer while fading. `onReveal` fires as the curtain starts
 * lifting, `onDone` once the overlay can be unmounted.
 *
 * The overlay swallows pointer input while it plays, and any tap skips
 * straight to whatever is behind it — a splash must never stand between an
 * impatient user and their content. Consumers are expected not to mount it at
 * all under reduced motion.
 */
export function KickoffOverlay({
  proceed = true,
  dockTargetRef,
  onReveal,
  onDone,
}: {
  proceed?: boolean;
  dockTargetRef?: React.RefObject<HTMLElement | null>;
  onReveal: () => void;
  onDone: () => void;
}) {
  const logoBoxRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<Phase>('drop');
  const [dock, setDock] = useState<DockTarget | null>(null);
  const shine = supportsLogoMask();

  // The entrance bounce decides where to go the moment it lands; if the page
  // finishes loading later, this effect releases the idle loop. The ref keeps
  // the freshest value readable from the animation callback.
  const proceedRef = useRef(proceed);
  proceedRef.current = proceed;
  useEffect(() => {
    if (proceed && phase === 'idle') setPhase('act');
  }, [proceed, phase]);

  // Fired when the shine finishes (or the impact ring, without mask support):
  // start revealing the page and send the logo off to its exit.
  const startDock = () => {
    if (dock) return;
    onReveal();
    const slot = dockTargetRef?.current?.getBoundingClientRect();
    const box = logoBoxRef.current?.getBoundingClientRect();
    if (!slot || !box || slot.height === 0 || box.height === 0) {
      setDock({ kind: 'fade' });
      return;
    }
    // The grow spring has settled (scale 1), so `box` is the true base rect —
    // the glide is a pure px translation plus a uniform scale.
    setDock({
      kind: 'dock',
      scale: slot.height / box.height,
      x: slot.left + slot.width / 2 - (box.left + box.width / 2),
      y: slot.top + slot.height / 2 - (box.top + box.height / 2),
    });
  };

  // Wall-clock failsafes, armed only for the act (see constants above). Refs
  // keep the latest callbacks without re-arming the timers on every render.
  const startDockRef = useRef(startDock);
  startDockRef.current = startDock;
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  useEffect(() => {
    if (phase !== 'act') return;
    const graceful = window.setTimeout(
      () => startDockRef.current(),
      GRACEFUL_FAILSAFE_MS,
    );
    const hard = window.setTimeout(() => onDoneRef.current(), HARD_FAILSAFE_MS);
    return () => {
      window.clearTimeout(graceful);
      window.clearTimeout(hard);
    };
  }, [phase]);

  // Tap-to-skip: jump straight to the final state. `onDone` unmounts the
  // overlay in the same commit, so whatever is behind simply appears — exactly
  // what a skip should feel like.
  const skip = () => {
    onReveal();
    onDone();
  };

  return (
    <>
      {/* Curtain layer: ball choreography + wipe, fading out as one once the
          handover starts. The logo lives in the sibling layer below so its
          glide outlives this fade. This layer also owns input: it blocks the
          page underneath while the show plays and turns any tap into a skip. */}
      <motion.div
        className='fixed inset-0 z-[100] overflow-hidden bg-background'
        onPointerDown={skip}
        initial={{ opacity: 1 }}
        animate={{ opacity: dock ? 0 : 1 }}
        transition={{ duration: CURTAIN_DURATION, ease: 'easeOut' }}>
        <div className='absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2'>
          {/* Ground shadow — widens and darkens as the ball approaches during
              the drop, breathes with the hop while idling, then rests. */}
          <motion.div
            className='absolute left-1/2 top-[calc(100%+0.4rem)] h-2.5 w-16 -translate-x-1/2 rounded-[100%] bg-foreground/25 blur-[3px]'
            initial={{ opacity: 0.1, scaleX: 0.35 }}
            animate={
              phase === 'drop'
                ? {
                    opacity: [0.1, 0.55, 0.65, 0.3, 0.55, 0.6, 0.4, 0.55, 0.55],
                    scaleX: [0.35, 1.1, 1.25, 0.6, 1.05, 1.15, 0.8, 1, 1],
                  }
                : phase === 'idle'
                  ? {
                      opacity: [0.55, 0.35, 0.55],
                      scaleX: [1, 0.7, 1],
                    }
                  : { opacity: 0.55, scaleX: 1 }
            }
            transition={
              phase === 'drop'
                ? {
                    duration: BOUNCE_DURATION,
                    times: BOUNCE_TIMES,
                    ease: 'linear',
                  }
                : phase === 'idle'
                  ? IDLE_HOP
                  : { duration: 0.2 }
            }
          />

          {/* Impact ripples — one flattened ring per floor contact of the
              entrance drop. */}
          {IMPACTS.map((delay, i) => (
            <motion.span
              key={delay}
              className='absolute left-1/2 top-[calc(100%-0.5rem)] h-5 w-16 -translate-x-1/2 rounded-[100%] border-2 border-primary/50'
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 0.7 - i * 0.15, 0],
                scale: [0.4, 2.4 - i * 0.5, 3 - i * 0.5],
              }}
              transition={{ delay, duration: 0.5, ease: 'easeOut' }}
            />
          ))}

          {/* The ball: outer div owns position + squash/stretch (anchored at
              the floor), inner div spins so the rotation stays centred. After
              the entrance drop it either proceeds to the act or keeps hopping
              until the page behind has loaded. */}
          <motion.div
            className='relative size-16'
            style={{ transformOrigin: '50% 100%' }}
            initial={{ y: '-48vh', scaleY: 1.12, scaleX: 0.94 }}
            animate={
              phase === 'drop'
                ? {
                    y: [
                      '-48vh',
                      '0vh',
                      '0vh',
                      '-15vh',
                      '0vh',
                      '0vh',
                      '-5vh',
                      '0vh',
                      '0vh',
                    ],
                    scaleY: [1.12, 1.12, 0.55, 1.06, 1.06, 0.7, 1.02, 0.9, 1],
                    scaleX: [0.94, 0.94, 1.45, 0.96, 0.96, 1.28, 0.99, 1.08, 1],
                  }
                : phase === 'idle'
                  ? { y: ['0vh', '-8vh', '0vh'], scaleY: 1, scaleX: 1 }
                  : { y: '0vh', scaleY: 1, scaleX: 1 }
            }
            transition={
              phase === 'drop'
                ? {
                    duration: BOUNCE_DURATION,
                    times: BOUNCE_TIMES,
                    ease: [...BOUNCE_EASE],
                  }
                : phase === 'idle'
                  ? IDLE_HOP
                  : { type: 'spring', stiffness: 300, damping: 30 }
            }
            onAnimationComplete={() => {
              // Landing decision: straight into the act, or hold the idle hop
              // until the page behind reports ready.
              if (phase === 'drop') {
                setPhase(proceedRef.current ? 'act' : 'idle');
              }
            }}>
            <motion.div
              className='size-16'
              initial={{ rotate: -520 }}
              animate={{ rotate: 0 }}
              transition={{ duration: BOUNCE_DURATION, ease: 'easeOut' }}>
              <BallSvg className='size-full drop-shadow-md' />
            </motion.div>
          </motion.div>

          {/* Circular wipe — the resting ball "inflates" until it swallows the
              viewport, becoming the stage the wordmark performs on. Orange
              gradient (the accent token is a neutral grey here, so the wipe
              stays on the brand's orange). */}
          {phase === 'act' && (
            <motion.div
              className='absolute inset-0 rounded-full bg-linear-to-br from-primary to-[#c2410c]'
              initial={{ scale: 0 }}
              animate={{ scale: 80 }}
              transition={{
                delay: WIPE_DELAY,
                duration: 0.55,
                ease: [0.83, 0, 0.17, 1],
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Brand layer: the wordmark emerges from the exact spot the ball came
          to rest, as if flung out of the inflating wipe — grows with a soft
          overshoot ("lands"), then glides to its exit. Purely decorative; taps
          fall through to the curtain's skip handler. */}
      <div
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 z-[100] grid place-items-center'>
        {phase === 'act' && (
          <motion.div
            ref={logoBoxRef}
            className='relative aspect-[500/225] w-[min(72vw,20rem)]'
            initial={{ scale: 0.18, y: 10, opacity: 0 }}
            animate={
              dock === null
                ? { scale: 1, y: 0, opacity: 1 }
                : dock.kind === 'dock'
                  ? { x: dock.x, y: dock.y, scale: dock.scale, opacity: 1 }
                  : { opacity: 0, scale: 1.12 }
            }
            transition={
              dock === null
                ? {
                    delay: LOGO_IN_DELAY,
                    type: 'spring',
                    stiffness: 320,
                    damping: 21,
                    mass: 0.9,
                    opacity: { delay: LOGO_IN_DELAY, duration: 0.2 },
                  }
                : dock.kind === 'dock'
                  ? { type: 'spring', stiffness: 260, damping: 30 }
                  : { duration: 0.35, ease: 'easeOut' }
            }
            onAnimationComplete={() => {
              if (dock) onDone();
            }}>
            {/* Orange wordmark (the exact asset a dock slot renders) at the
                bottom of the stack; the white copy on top carries the moment
                on the orange gradient and fades away as the curtain lifts,
                always finishing first — never orange-on-orange, never a white
                ghost on the page background. */}
            <Image
              src='/statixLogo.png'
              alt=''
              fill
              sizes='320px'
              priority
              className='object-contain'
            />
            <motion.div
              className='absolute inset-0'
              initial={{ opacity: 1 }}
              animate={{ opacity: dock ? 0 : 1 }}
              transition={{ duration: WHITE_FADE_DURATION }}>
              <Image
                src='/statixLogo.png'
                alt=''
                fill
                sizes='320px'
                priority
                className='object-contain brightness-0 invert'
              />
            </motion.div>

            {/* Shine sweep, masked to the letterforms so only they catch the
                light. Its completion advances the sequence; without mask
                support the impact ring below takes over that job. */}
            {shine && (
              <div
                className='absolute inset-0 overflow-hidden'
                style={{
                  maskImage: 'url(/statixLogo.png)',
                  WebkitMaskImage: 'url(/statixLogo.png)',
                  maskSize: 'contain',
                  WebkitMaskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskPosition: 'center',
                }}>
                <motion.div
                  className='h-full w-1/3 bg-linear-to-r from-transparent via-white/90 to-transparent'
                  style={{ skewX: -18 }}
                  initial={{ x: '-130%' }}
                  animate={{ x: '330%' }}
                  transition={{
                    delay: SHINE_DELAY,
                    duration: SHINE_DURATION,
                    ease: [0.65, 0, 0.35, 1],
                  }}
                  onAnimationComplete={startDock}
                />
              </div>
            )}

            {/* Impact ring — the ball's floor-contact ripple replayed in white
                for the wordmark's landing. */}
            <motion.span
              className='absolute inset-0 m-auto size-24 rounded-full border-2 border-white/40'
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: [0.7, 2.1], opacity: [0.55, 0] }}
              transition={{ delay: RING_DELAY, duration: 0.5, ease: 'easeOut' }}
              onAnimationComplete={shine ? undefined : startDock}
            />
          </motion.div>
        )}
      </div>
    </>
  );
}

/** The Statix handball — shared by the kickoff overlay and (in the app) the
 * survey's progress bar. */
export function BallSvg({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 64 64' className={className} aria-hidden='true'>
      <circle cx='32' cy='32' r='30' className='fill-primary' />
      {/* Handball panel seams: centre pentagon plus spokes fanning out to the
          five rim-cut panels. */}
      <path
        d='M32 22 L41.5 28.9 L37.9 40.1 L26.1 40.1 L22.5 28.9 Z'
        className='stroke-white/60'
        strokeWidth='2.5'
        fill='none'
        strokeLinejoin='round'
      />
      <path
        d='M32 22 L32 13 M20.2 5.5 L32 13 L43.8 5.5 M41.5 28.9 L50.1 26.1 M53.6 12.6 L50.1 26.1 L60.8 35 M37.9 40.1 L43.2 47.4 M57.1 46.5 L43.2 47.4 L38 60.4 M26.1 40.1 L20.8 47.4 M26 60.4 L20.8 47.4 L6.9 46.5 M22.5 28.9 L13.9 26.1 M3.2 35 L13.9 26.1 L10.5 12.6'
        className='stroke-white/60'
        strokeWidth='2.5'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}
