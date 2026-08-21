'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BoardKicker, Grain } from '@/features/landing-page/components/tactic';

export interface BoardFaqItem {
  question: string;
  answer: string;
}

interface BoardFaqProps {
  kicker: string;
  title: string;
  description?: string;
  items: BoardFaqItem[];
  /** Anchor id, so pages can link to their own FAQ block. */
  id?: string;
  className?: string;
}

/**
 * The shared FAQ band of the Trainertafel world — the same open/close grammar
 * as the landing page, the brand page and the Ratgeber (ink hairline rule,
 * marker-plus toggle). Every answer stays in the DOM whichever item is
 * expanded, so the visible text always matches the FAQPage JSON-LD the route
 * emits (Google requires that parity).
 * @returns A JSX element rendering an FAQ accordion on the paper ground.
 */
export default function BoardFaq({
  kicker,
  title,
  description,
  items,
  id,
  className,
}: BoardFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={id}
      className={cn(
        'relative w-full scroll-mt-24 overflow-hidden bg-paper-2 py-20 md:py-28',
        className,
      )}>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-3xl px-6 sm:px-8'>
        <BoardKicker>{kicker}</BoardKicker>
        <h2 className='mt-3 font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.25rem]'>
          {title}
        </h2>
        {description ? (
          <p className='mt-3 max-w-[62ch] text-base leading-7 text-ink/70'>
            {description}
          </p>
        ) : null}

        <div className='mt-10 border-t border-ink/12'>
          {items.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className='border-b border-ink/12'>
                <h3 className='m-0'>
                  <button
                    type='button'
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className='flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold text-ink transition-colors hover:text-primary'>
                    <span>{faq.question}</span>
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
                    <p className='max-w-[56ch] pb-5 pr-10 text-[15px] leading-7 text-ink/70'>
                      {faq.answer}
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
