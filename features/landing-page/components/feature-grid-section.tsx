'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';
import { Grain, SectionHeading } from './tactic';

interface FeatureItem {
  name: string;
  description: string;
  isNew: boolean;
}

interface FeatureGroup {
  title: string;
  tagline: string;
  items: FeatureItem[];
}

/**
 * The complete feature index, set like a coach's spec sheet: a sticky rail with
 * a ghost numeral and group tagline on the left, hairline rows on the right.
 * Typography does the work — no icons, no card chrome.
 */
export default function FeatureGridSection() {
  const t = useTranslations('productPage.allFeatures');
  const groups = t.raw('groups') as FeatureGroup[];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-feature-group]').forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll('[data-feature-row]'),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: group, start: 'top 82%', once: true },
          },
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id='all-features'
      ref={sectionRef}
      className='relative w-full scroll-mt-24 overflow-hidden bg-paper py-24 md:py-32'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <SectionHeading kicker={t('kicker')} title={t('title')} description={t('description')} />

        <div className='mt-20 space-y-24 md:mt-24 md:space-y-28'>
          {groups.map((group, groupIndex) => (
            <div
              key={group.title}
              data-feature-group
              className='grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20'>
              <div className='lg:sticky lg:top-28 lg:self-start'>
                <span
                  aria-hidden
                  className='block font-display text-6xl font-extrabold leading-none tracking-tighter text-primary/20 tabular-nums'>
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
                <h3 className='mt-4 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink'>
                  {group.title}
                </h3>
                <p className='mt-3 max-w-[36ch] text-sm leading-6 text-ink/70'>{group.tagline}</p>
                <p className='mt-5 font-hand text-lg text-ink/60'>
                  {t('countLabel', { count: group.items.length })}
                </p>
              </div>

              <div className='grid sm:grid-cols-2 sm:gap-x-14'>
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    data-feature-row
                    className='border-t border-ink/12 py-5'>
                    <p className='flex items-center gap-2 text-[15px] font-semibold text-ink'>
                      {item.name}
                      {item.isNew && (
                        <span className='inline-flex items-center rounded-full bg-primary/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary'>
                          {t('newBadge')}
                        </span>
                      )}
                    </p>
                    <p className='mt-1.5 text-sm leading-6 text-ink/70'>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
