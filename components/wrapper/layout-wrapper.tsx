'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/custom-ui/footer';
import { SiteNavbar } from '@/features/navigation';
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
      <SiteNavbar />
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
