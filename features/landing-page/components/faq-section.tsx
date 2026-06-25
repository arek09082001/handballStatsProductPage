'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const t = useTranslations('productPage.faq');
  const items = t.raw('items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id='faq' className='w-full scroll-mt-24 bg-muted/30 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-3xl px-6 sm:px-10'>
        <div className='text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-10 space-y-3'>
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.question}
                className='overflow-hidden rounded-2xl border border-border bg-background'>
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left'>
                  <span className='text-base font-semibold text-foreground'>
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300',
                      isOpen && 'rotate-45'
                    )}>
                    <Plus className='size-4' />
                  </span>
                </button>
                <div
                  className={cn(
                    'grid transition-all duration-300 ease-out',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}>
                  <div className='overflow-hidden'>
                    <p className='px-5 pb-5 text-sm leading-7 text-muted-foreground'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
