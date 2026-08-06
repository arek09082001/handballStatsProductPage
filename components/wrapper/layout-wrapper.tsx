'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/custom-ui/footer';
import { MAIN_CONTENT_ID, SiteNavbar, SkipLink } from '@/features/navigation';
import PageTransition from './page-transition';
import ScrollToTop from './scroll-to-top';
import { AnimatePresence } from 'framer-motion';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  // Embeddable widgets run inside a foreign page's iframe: no navbar, no
  // footer, no page transition — just the tool.
  const isEmbedRoute = pathname?.endsWith('/embed');

  if (isEmbedRoute) {
    return <div className='relative h-full bg-background'>{children}</div>;
  }

  return (
    <div className='relative bg-background h-full'>
      <ScrollToTop />
      <SkipLink />
      <SiteNavbar />
      {/* `tabIndex={-1}` so the skip link can move focus here; `scroll-mt-28`
       * keeps the fixed navbar from covering the first heading. */}
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className='overflow-hidden scroll-mt-28 focus:outline-none'>
        <AnimatePresence mode='wait' initial={false}>
          <PageTransition key={pathname}>{children}</PageTransition>
        </AnimatePresence>
      </main>
      {!isAdminRoute && (
        <>
          <Footer />
        </>
      )}
    </div>
  );
}
