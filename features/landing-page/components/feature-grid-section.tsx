'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

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
 * The complete feature index, set like an editorial spec sheet: a sticky
 * rail with a ghost numeral and group tagline on the left, hairline list
 * rows on the right. Typography does the work – no icons, no card chrome.
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
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 82%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='all-features'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-background py-24 md:py-32'>
      <div className='mx-auto w-full max-w-6xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-5 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-20 space-y-24 md:mt-24 md:space-y-28'>
          {groups.map((group, groupIndex) => (
            <div
              key={group.title}
              data-feature-group
              className='grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20'>
              <div className='lg:sticky lg:top-28 lg:self-start'>
                <span
                  aria-hidden
                  className='block text-6xl font-extrabold leading-none tracking-tighter text-primary/15'>
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
                <h3 className='mt-4 text-2xl font-bold tracking-tight text-foreground'>
                  {group.title}
                </h3>
                <p className='mt-3 max-w-[36ch] text-sm leading-6 text-muted-foreground'>
                  {group.tagline}
                </p>
                <p className='mt-5 text-xs font-medium tabular-nums text-muted-foreground/60'>
                  {t('countLabel', { count: group.items.length })}
                </p>
              </div>

              <div className='grid sm:grid-cols-2 sm:gap-x-14'>
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    data-feature-row
                    className='border-t border-foreground/10 py-5'>
                    <p className='text-[15px] font-semibold text-foreground'>
                      {item.name}
                      {item.isNew && (
                        <span className='ml-2 text-xs font-semibold text-primary'>
                          {t('newBadge')}
                        </span>
                      )}
                    </p>
                    <p className='mt-1.5 text-sm leading-6 text-muted-foreground'>
                      {item.description}
                    </p>
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
