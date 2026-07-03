'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SITE_NAVBAR_OFFSET, scrollSpySectionIds } from '../config';
import { NavigationItem } from '../interfaces';

const ADMIN_ACCESS_CLICK_COUNT = 2;
const BRAND_CLICK_DELAY_MS = 400;
const SCROLL_OFFSET_THRESHOLD = 16;
const SCROLL_DIRECTION_THRESHOLD = 6;
const HOME_SECTION_ID = 'home';

export const useSiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [activeSection, setActiveSection] = useState<string>(HOME_SECTION_ID);
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

  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection(HOME_SECTION_ID);
      return;
    }

    const trackedIds = scrollSpySectionIds.filter((id) => id !== HOME_SECTION_ID);
    let frameId = 0;

    const resolveActiveSection = () => {
      frameId = 0;
      const probeLine = window.scrollY + SITE_NAVBAR_OFFSET + 8;

      let current = HOME_SECTION_ID;
      for (const id of trackedIds) {
        const element = document.getElementById(id);
        if (element && element.offsetTop <= probeLine) {
          current = id;
        }
      }

      // When scrolled to the very bottom, force the last section active even if
      // it is too short to reach the probe line.
      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;
      if (reachedBottom && trackedIds.length > 0) {
        current = trackedIds[trackedIds.length - 1];
      }

      setActiveSection((previous) => (previous === current ? previous : current));
    };

    const handleScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(resolveActiveSection);
    };

    resolveActiveSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [pathname]);

  const toggleMenu = () => setIsOpen((currentValue) => !currentValue);
  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  /**
   * Whether a nav item is the currently active one. On the landing page this is
   * driven by the scroll-spy section; elsewhere it falls back to route matching.
   * External links never count as active.
   */
  const isItemActive = (item: NavigationItem) => {
    if (item.external) {
      return false;
    }

    if (pathname === '/' && item.sectionId) {
      return item.sectionId === activeSection;
    }

    return isActive(item.href);
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
    activeSection,
    pathname,
    toggleMenu,
    closeMenu,
    isActive,
    isItemActive,
    handleBrandClick,
  };
};
