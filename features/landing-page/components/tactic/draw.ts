import { gsap } from '@/lib/gsap-config';

interface DrawOptions {
  /** Element that triggers the draw on scroll; omit to draw immediately. */
  trigger?: Element | null;
  start?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Give every `[data-marker-line]` inside `scope` the board's "drawn on" motion:
 * hide the stroke, then swipe it in. Call inside a `gsap.context`. Under reduced
 * motion the strokes are simply shown, never animated.
 */
export function drawMarkers(scope: Element, opts: DrawOptions = {}) {
  const els = Array.from(scope.querySelectorAll<SVGPathElement>('[data-marker-line]'));
  if (!els.length) return;

  els.forEach((el) => {
    const len = typeof el.getTotalLength === 'function' ? el.getTotalLength() : 300;
    gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
  });

  if (prefersReducedMotion()) {
    gsap.set(els, { strokeDashoffset: 0 });
    return;
  }

  gsap.to(els, {
    strokeDashoffset: 0,
    duration: opts.duration ?? 0.85,
    stagger: opts.stagger ?? 0.1,
    delay: opts.delay ?? 0,
    ease: 'power2.out',
    scrollTrigger: opts.trigger
      ? { trigger: opts.trigger, start: opts.start ?? 'top 80%', once: true }
      : undefined,
  });
}
