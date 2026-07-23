'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap-config';

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before the reveal starts – used to stagger siblings. */
  delay?: number;
  className?: string;
}

/**
 * Lightweight scroll-reveal wrapper matching the landing-page motion language
 * (fade up on scroll-in, once). Kept in the brand feature so the marketing
 * `/was-ist-statix` page animates consistently without duplicating GSAP setup
 * in every section.
 * @param props - RevealProps containing the children to animate, an optional delay and className.
 * @param props.children - The content revealed on scroll.
 * @param props.delay - Optional delay in seconds to stagger the reveal against siblings.
 * @param props.className - Optional class names forwarded to the wrapper element.
 * @returns A JSX element that fades and slides its children in when scrolled into view.
 */
export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            once: true,
          },
        },
      );
    }, ref);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
