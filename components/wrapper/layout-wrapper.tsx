'use client';

import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/custom-ui/footer';
import { SiteNavbar } from '@/features/navigation';
import { ProductIntro } from '@/features/landing-page/components/product-intro';
import PageTransition from './page-transition';
import ScrollToTop from './scroll-to-top';
import { AnimatePresence } from 'framer-motion';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isHome = pathname === '/';

  // Kickoff splash: the wordmark docks into the navbar's brand slot, which the
  // navbar hides (but keeps measurable) while the splash plays.
  const brandRef = useRef<HTMLSpanElement>(null);
  const [introPlaying, setIntroPlaying] = useState(false);

  return (
    <div className='relative bg-background h-full'>
      <ScrollToTop />
      {isHome && (
        <ProductIntro
          dockTargetRef={brandRef}
          onPlayingChange={setIntroPlaying}
        />
      )}
      <SiteNavbar brandRef={brandRef} hideBrand={introPlaying} />
      <div className='overflow-hidden'>
        <AnimatePresence mode='wait' initial={false}>
          <PageTransition key={pathname}>{children}</PageTransition>
        </AnimatePresence>
      </div>
      {!isAdminRoute && (
        <>
          <Footer />
        </>
      )}
    </div>
  );
}
