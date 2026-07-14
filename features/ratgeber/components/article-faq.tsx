'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArticleFaq } from '../types';

/**
 * Visible FAQ accordion. Renders the article's FAQ items verbatim so the
 * on-page text matches the FAQPage JSON-LD emitted by ArticleSchema (Google
 * requires parity between the two).
 */
export default function ArticleFaqSection({ faqs }: { faqs: ArticleFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className='mx-auto max-w-3xl px-6 pb-14 sm:px-8'>
      <h2 className='text-2xl font-bold tracking-tight text-foreground'>
        Häufige Fragen
      </h2>

      <div className='mt-6 space-y-3'>
        {faqs.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={item.question}
              className='overflow-hidden rounded-2xl border border-border bg-background'>
              <h3 className='m-0'>
                <button
                  type='button'
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className='flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-foreground'>
                  <span>{item.question}</span>
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300',
                      isOpen && 'rotate-45',
                    )}>
                    <Plus className='size-4' />
                  </span>
                </button>
              </h3>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
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
    </section>
  );
}
