'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop component automatically scrolls to the top of the page
 * when navigating to a new route. This ensures a smooth user experience
 * during page transitions.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const hashRetryTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToHashTarget = () => {
    const { hash } = window.location;
    if (!hash) return false;

    const element = document.getElementById(hash.slice(1));
    if (!element) return false;

    const navbarOffset = 96;
    const top =
      element.getBoundingClientRect().top + window.scrollY - navbarOffset;

    window.scrollTo({
      top: Math.max(0, top),
      left: 0,
      behavior: 'smooth',
    });

    return true;
  };

  useEffect(() => {
    if (hashRetryTimer.current) {
      clearInterval(hashRetryTimer.current);
      hashRetryTimer.current = null;
    }

    // Skip scroll on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // If a hash is present, navigate to that section after route transition.
    // Retry briefly because page transitions can delay element availability.
    if (window.location.hash) {
      if (scrollToHashTarget()) {
        return;
      }

      let retries = 0;
      const maxRetries = 12;
      hashRetryTimer.current = setInterval(() => {
        retries += 1;

        if (scrollToHashTarget() || retries >= maxRetries) {
          if (hashRetryTimer.current) {
            clearInterval(hashRetryTimer.current);
            hashRetryTimer.current = null;
          }
        }
      }, 60);

      return;
    }

    // Default route navigation behavior: jump to top.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    return () => {
      if (hashRetryTimer.current) {
        clearInterval(hashRetryTimer.current);
        hashRetryTimer.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    const handleHashChange = () => {
      scrollToHashTarget();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null;
}
