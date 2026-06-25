'use client';

import { useTranslations } from 'next-intl';

interface StatItem {
  value: string;
  label: string;
}

export default function StatsBarSection() {
  const t = useTranslations('productPage.stats');
  const items = t.raw('items') as StatItem[];

  return (
    <section className='w-full bg-background'>
      <div className='mx-auto -mt-8 w-full max-w-6xl px-6 sm:px-10'>
        <div className='grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-border shadow-[0_24px_60px_-40px_rgba(15,23,42,0.4)] sm:grid-cols-4'>
          {items.map((item) => (
            <div
              key={item.label}
              className='bg-background px-5 py-7 text-center'>
              <div className='text-3xl font-extrabold tracking-tight text-primary sm:text-4xl'>
                {item.value}
              </div>
              <div className='mt-2 text-xs font-medium leading-5 text-muted-foreground sm:text-sm'>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
