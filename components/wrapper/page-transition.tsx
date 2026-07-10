'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

// Navigation order based on the menu structure
const navigationOrder: { [key: string]: number } = {
  '/': 0,
  '/impressum': 1,
  '/agb': 2,
};

// Get the base path from a pathname (e.g., /neuigkeiten/some-article -> /neuigkeiten)
const getBasePath = (path: string): string => {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return '/';
  return `/${segments[0]}`;
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    const currentBasePath = getBasePath(pathname);
    const previousBasePath = getBasePath(previousPath);

    const currentIndex = navigationOrder[currentBasePath] ?? -1;
    const previousIndex = navigationOrder[previousBasePath] ?? -1;

    if (currentIndex !== -1 && previousIndex !== -1) {
      // Positive = moving right, Negative = moving left
      setDirection(currentIndex > previousIndex ? 1 : -1);
    } else {
      setDirection(0); // No direction for unknown routes
    }

    setPreviousPath(pathname);
  }, [pathname, previousPath]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : direction < 0 ? -20 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : direction < 0 ? 20 : 0,
      opacity: 0,
    }),
  };

  return (
    <motion.div
      key={pathname}
      custom={direction}
      variants={variants}
      initial='enter'
      animate='center'
      exit='exit'
      transition={{
        x: {
          type: 'spring',
          stiffness: 200,
          damping: 25,
          mass: 0.8,
        },
        opacity: { duration: 0.2 },
      }}
      className='min-h-screen will-change-[transform,opacity]'>
      {children}
    </motion.div>
  );
}
