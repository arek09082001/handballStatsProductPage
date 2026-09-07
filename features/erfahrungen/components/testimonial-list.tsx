'use client';

import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { externalLink, inlineLink } from '@/components/custom-ui/rich-text';
import { BEST_RATING, TESTIMONIALS } from '../data/testimonials';
import { ERFAHRUNGEN_MAIL_ARGS } from '../data/erfahrungen-content';

/**
 * Trainer-Stimmen band. Renders the real quotes when there are any and an
 * honest note when there are none — it never fills the gap with invented or
 * anonymised praise. The route's `Review` markup follows the same data, so
 * markup and page always agree.
 * @returns A JSX element rendering the testimonial list or the honest empty state.
 */
export default function TestimonialList() {
  const t = useTranslations('experiencesPage.testimonials');
  const hasQuotes = TESTIMONIALS.length > 0;

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={
            hasQuotes ? t('descriptionWithQuotes') : t('descriptionEmpty')
          }
        />

        {hasQuotes ? (
          <div className='mt-12 grid gap-6 md:grid-cols-2'>
            {TESTIMONIALS.map((testimonial) => (
              <BoardCard key={`${testimonial.name}-${testimonial.date}`} pin='magnet' className='p-6'>
                {typeof testimonial.ratingValue === 'number' ? (
                  <p
                    className='flex items-center gap-1 text-primary'
                    aria-label={t('ratingLabel', {
                      value: testimonial.ratingValue,
                      best: BEST_RATING,
                    })}>
                    {Array.from({ length: BEST_RATING }, (_, index) => (
                      <Star
                        key={index}
                        aria-hidden
                        className={
                          index < Math.round(testimonial.ratingValue ?? 0)
                            ? 'size-4 fill-current'
                            : 'size-4 text-ink/20'
                        }
                      />
                    ))}
                  </p>
                ) : null}
                <blockquote className='mt-3 text-[15px] leading-7 text-ink/80'>
                  „{testimonial.quote}“
                </blockquote>
                <p className='mt-4 font-display text-sm font-bold text-ink'>{testimonial.name}</p>
                <p className='text-sm text-ink/60'>
                  {testimonial.role} · {testimonial.club}
                </p>
              </BoardCard>
            ))}
          </div>
        ) : (
          <BoardCard pin='tape' className='mt-12 p-6 sm:p-8'>
            <p className='max-w-[68ch] text-[15px] leading-7 text-ink/80'>
              {t('emptyParagraph1')}
            </p>
            <p className='mt-4 max-w-[68ch] text-[15px] leading-7 text-ink/80'>
              {t.rich('emptyParagraph2', {
                ...ERFAHRUNGEN_MAIL_ARGS,
                mail: externalLink(`mailto:${CLUB_CONFIG.email.main}`),
              })}
            </p>
            <p className='mt-4 max-w-[68ch] text-[15px] leading-7 text-ink/70'>
              {t.rich('emptyParagraph3', {
                brand: inlineLink('/was-ist-statix'),
                pricing: inlineLink('/preise'),
              })}
            </p>
          </BoardCard>
        )}
      </div>
    </section>
  );
}
