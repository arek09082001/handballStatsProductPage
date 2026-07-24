'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BoardKicker, Grain } from '@/features/landing-page/components/tactic';
import type { ArticleFaq } from '../types';

/**
 * Visible FAQ accordion on the paper ground — the same open/close grammar as the
 * landing page's FAQ (ink hairline rule, marker‑plus toggle), so the Ratgeber
 * reads as the same board. Renders the FAQ items verbatim so the on‑page text
 * matches the FAQPage JSON‑LD emitted by ArticleSchema (Google requires parity).
 */
export default function ArticleFaqSection({ faqs }: { faqs: ArticleFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className='relative w-full overflow-hidden bg-paper py-16 md:py-20'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-3xl px-6 sm:px-8'>
        <BoardKicker>Nachgefragt</BoardKicker>
        <h2 className='mt-3 font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.25rem]'>
          Häufige Fragen
        </h2>

        <div className='mt-10 border-t border-ink/12'>
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={item.question} className='border-b border-ink/12'>
                <h3 className='m-0'>
                  <button
                    type='button'
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className='flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink transition-colors hover:text-primary'>
                    <span>{item.question}</span>
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300',
                        isOpen
                          ? 'rotate-45 border-primary bg-primary text-white'
                          : 'border-ink/20 text-ink/60',
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
                    <p className='max-w-[68ch] pb-5 pr-10 text-[15px] leading-7 text-ink/70'>
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
