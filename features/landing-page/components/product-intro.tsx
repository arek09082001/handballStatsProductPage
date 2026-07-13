'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { KickoffOverlay } from './kickoff-overlay';

// One entrance per browser session: the tab session marks itself as greeted on
// the first visit so the splash never replays on client-side navigation back
// to the landing page. A fresh tab (or reopened PWA) gets a fresh session and
// plays again.
const SESSION_KEY = 'statix-product-intro-shown';
// Backstop for storage-less contexts (private mode with blocked storage):
// still never replay within one JS runtime.
let consumedThisRuntime = false;

/**
 * The landing page's branded splash — the same kickoff the app's public survey
 * opens with: a handball bounces in, inflates into a full-screen orange wipe,
 * and the Statix wordmark grows out, catches a shine and glides up into the
 * navbar's wordmark slot as the curtain lifts. On viewports where that slot is
 * hidden (the mobile navbar shows no wordmark) the logo zooms through and fades
 * instead. Plays once per session, is tap-to-skip, and is skipped entirely
 * under reduced motion.
 *
 * `onPlayingChange` lets the shell hide the real navbar wordmark while the
 * splash owns the screen, so the docked logo replaces it in a single commit —
 * no double wordmark during the glide.
 */
export function ProductIntro({
  dockTargetRef,
  onPlayingChange,
}: {
  dockTargetRef?: React.RefObject<HTMLElement | null>;
  onPlayingChange?: (playing: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (consumedThisRuntime) return;
    consumedThisRuntime = true;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) !== null;
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Storage unavailable — the runtime flag above still prevents replays on
      // client-side navigation; a full reload will replay, the least-bad
      // behaviour for a decorative splash.
    }
    if (seen || reduceMotion) return;
    setShow(true);
    onPlayingChange?.(true);
  }, [reduceMotion, onPlayingChange]);

  if (!show) return null;
  return (
    <KickoffOverlay
      proceed
      dockTargetRef={dockTargetRef}
      onReveal={() => {}}
      onDone={() => {
        setShow(false);
        onPlayingChange?.(false);
      }}
    />
  );
}
