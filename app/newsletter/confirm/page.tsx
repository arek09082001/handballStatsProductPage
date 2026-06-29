import { Suspense } from 'react';
import type { Metadata } from 'next';
import NewsletterConfirm from '@/features/newsletter/components/newsletter-confirm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Newsletter-Anmeldung bestätigen',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <NewsletterConfirm />
    </Suspense>
  );
}
