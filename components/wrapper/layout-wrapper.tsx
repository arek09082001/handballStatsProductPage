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
