import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import {
  BEST_RATING,
  TESTIMONIALS,
} from '@/features/erfahrungen/data/testimonials';
import { BoardCard, Grain, SectionHeading } from './tactic';

/**
 * "Trainer sagen" band on the home page. Reads the same data module as
 * `/erfahrungen` and renders **nothing at all** while it is empty — an empty
 * testimonial band with placeholder praise would be exactly the lie the data
 * module exists to prevent.
 * @returns A JSX element with the testimonial band, or null while there are none.
 */
export default async function TestimonialsSection() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  const t = await getTranslations('productPage.testimonials');

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          kicker={t('kicker')}
          title={t('title')}
          description={t('description')}
        />

        <div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {TESTIMONIALS.slice(0, 3).map((testimonial) => (
            <BoardCard key={`${testimonial.name}-${testimonial.date}`} pin='magnet' className='p-6'>
              {typeof testimonial.ratingValue === 'number' ? (
                <p
                  className='flex items-center gap-1 text-primary'
                  aria-label={`Bewertung: ${testimonial.ratingValue} von ${BEST_RATING}`}>
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
                „{testimonial.quote}"
              </blockquote>
              <p className='mt-4 font-display text-sm font-bold text-ink'>{testimonial.name}</p>
              <p className='text-sm text-ink/60'>
                {testimonial.role} · {testimonial.club}
              </p>
            </BoardCard>
          ))}
        </div>

        <div className='mt-10 flex justify-center'>
          <Link
            href='/erfahrungen'
            className='group inline-flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-primary transition-colors hover:text-primary/80'>
            {t('linkLabel')}
            <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </div>
      </div>
    </section>
  );
}
