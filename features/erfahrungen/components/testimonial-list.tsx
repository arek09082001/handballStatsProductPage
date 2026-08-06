import Link from 'next/link';
import { Star } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { BEST_RATING, TESTIMONIALS } from '../data/testimonials';

/**
 * Trainer-Stimmen band. Renders the real quotes when there are any and an
 * honest note when there are none — it never fills the gap with invented or
 * anonymised praise. The route's `Review` markup follows the same data, so
 * markup and page always agree.
 * @returns A JSX element rendering the testimonial list or the honest empty state.
 */
export default function TestimonialList() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-5xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Trainer sagen'
          title='Stimmen aus der Halle'
          description={
            TESTIMONIALS.length > 0
              ? 'Trainer, die Statix im Spielbetrieb einsetzen – mit Namen und Verein.'
              : 'Hier stehen nur Zitate, die es wirklich gibt. Aktuell sind das keine.'
          }
        />

        {TESTIMONIALS.length > 0 ? (
          <div className='mt-12 grid gap-6 md:grid-cols-2'>
            {TESTIMONIALS.map((testimonial) => (
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
              Statix ist jung. Es gibt Trainer, die damit arbeiten, aber noch
              keine Zitate, die jemand mit Namen und Verein freigegeben hat – und
              genau deshalb steht hier auch keins. Erfundene Stimmen, ausgedachte
              Sternebewertungen oder „ein Trainer aus Bayern“ wirst du auf dieser
              Seite nicht finden, weder im Text noch in den Auszeichnungen für
              Suchmaschinen.
            </p>
            <p className='mt-4 max-w-[68ch] text-[15px] leading-7 text-ink/80'>
              Wenn du wissen willst, ob Statix zu deiner Mannschaft passt, hilft
              dir die Live-Demo mehr als jede fremde Meinung: echte Spieldaten,
              direkt im Browser, ohne Account. Und wenn du selbst damit
              arbeitest, schreib mir gern an{' '}
              <a
                href={`mailto:${CLUB_CONFIG.email.main}`}
                className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                {CLUB_CONFIG.email.main}
              </a>{' '}
              – dein Bericht steht dann hier.
            </p>
            <p className='mt-4 max-w-[68ch] text-[15px] leading-7 text-ink/70'>
              Was die App kann, steht auf{' '}
              <Link
                href='/was-ist-statix'
                className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                Was ist Statix?
              </Link>
              , was sie kostet unter{' '}
              <Link
                href='/preise'
                className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'>
                Preise
              </Link>
              .
            </p>
          </BoardCard>
        )}
      </div>
    </section>
  );
}
