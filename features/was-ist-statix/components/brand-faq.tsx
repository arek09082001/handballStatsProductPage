'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { BRAND_LINK_ARGS } from '../data/brand-content';
import { BoardKicker, Grain } from '@/features/landing-page/components/tactic';

/**
 * Visible brand FAQ on the paper ground — the same open/close grammar as the
 * landing page and Ratgeber (ink hairline rule, marker-plus toggle), so the
 * page reads as the same board. Renders every answer in the DOM so the on-page
 * text matches the FAQPage JSON-LD emitted by the route (Google requires
 * parity), whichever item is expanded.
 * @returns A JSX element rendering the brand FAQ as an accordion on paper.
 */
export default function BrandFaq() {
  const t = useTranslations('brandPage.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // The addresses are ICU arguments, so the accordion resolves them itself;
  // `t.raw` would hand the reader a literal `{appUrl}`.
  const faqs = (t.raw('items') as { question: string }[]).map((_, index) => ({
    question: t(`items.${index}.question`, BRAND_LINK_ARGS),
    answer: t(`items.${index}.answer`, BRAND_LINK_ARGS),
  }));

  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-3xl px-6 sm:px-8'>
        <BoardKicker>{t('kicker')}</BoardKicker>
        <h2 className='mt-3 font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.25rem]'>
          {t('title')}
        </h2>
        <p className='mt-3 text-base leading-7 text-ink/70'>
          {t('description')}
        </p>

        <div className='mt-10 border-t border-ink/12'>
          {faqs.map((faq, index) => {
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
                    <p className='max-w-[68ch] pb-5 pr-10 text-[15px] leading-7 text-ink/70'>
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
