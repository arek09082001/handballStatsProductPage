import { Suspense } from 'react';
import type { Metadata } from 'next';
import NewsletterUnsubscribe from '@/features/newsletter/components/newsletter-unsubscribe';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Newsletter abmelden',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense>
      <NewsletterUnsubscribe />
    </Suspense>
  );
}
