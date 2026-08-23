'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Grain, SectionHeading } from './tactic';

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const t = useTranslations('productPage.faq');
  const items = t.raw('items') as FaqItem[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id='faq'
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-24 md:py-32'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-3xl px-6 sm:px-10'>
        <SectionHeading kicker={t('kicker')} title={t('title')} description={t('description')} />

        <div className='mt-14 border-t border-ink/12'>
          {items.map((item, index) => {
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
                    <p className='max-w-[68ch] pb-5 pr-10 text-sm leading-7 text-ink/70'>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The FAQ answers the product questions; the topic page answers the
            handball ones (which metrics exist, how they are calculated). It is
            the one in-content link from the landing page into that hub. */}
        <p className='mt-10 text-sm leading-7 text-ink/70'>
          {t('linkLead')}{' '}
          <Link
            href='/handball-statistiken'
            className='group inline-flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-[#ea580c]'>
            {t('linkLabel')}
            <ArrowRight className='size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </p>
      </div>
    </section>
  );
}
