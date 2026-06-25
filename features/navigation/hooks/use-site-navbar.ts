'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ADMIN_ACCESS_CLICK_COUNT = 2;
const BRAND_CLICK_DELAY_MS = 400;
const SCROLL_OFFSET_THRESHOLD = 16;
const SCROLL_DIRECTION_THRESHOLD = 6;

export const useSiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    let lastScrollY = window.scrollY;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      setIsScrolled(currentScrollY > SCROLL_OFFSET_THRESHOLD);

      if (Math.abs(scrollDelta) >= SCROLL_DIRECTION_THRESHOLD) {
        setIsScrollingUp(scrollDelta < 0 || currentScrollY <= SCROLL_OFFSET_THRESHOLD);
        lastScrollY = currentScrollY;
      } else if (currentScrollY <= SCROLL_OFFSET_THRESHOLD) {
        setIsScrollingUp(true);
        lastScrollY = currentScrollY;
      }

      frameId = 0;
    };

    const handleScroll = () => {
      if (frameId !== 0) {
        return;
      }

      frameId = window.requestAnimationFrame(updateScrollState);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const toggleMenu = () => setIsOpen((currentValue) => !currentValue);
  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleBrandClick = () => {
    clickCountRef.current += 1;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }

    if (clickCountRef.current === ADMIN_ACCESS_CLICK_COUNT) {
      clickCountRef.current = 0;
      closeMenu();
      router.push('/admin');
      return;
    }

    clickTimeoutRef.current = setTimeout(() => {
      if (clickCountRef.current === 1) {
        closeMenu();
        router.push('/');
      }

      clickCountRef.current = 0;
      clickTimeoutRef.current = null;
    }, BRAND_CLICK_DELAY_MS);
  };

  return {
    isOpen,
    isScrolled,
    isScrollingUp,
    pathname,
    toggleMenu,
    closeMenu,
    isActive,
    handleBrandClick,
  };
};
