import type { ArticleModule } from '../../types';

type Exercise = Extract<ArticleModule, { kind: 'exercise' }>;

/**
 * One drill as the card a coach carries into the hall: a paper note with a
 * magnet dot, the setup and organisation in plain sentences, the coaching
 * points as a numbered magnet list, and — the part most drill collections skip
 * — the error you will actually see, plus one variation.
 */
export default function ExerciseCard({
  name,
  meta,
  setup,
  organisation,
  coachingPoints,
  commonError,
  variation,
}: Omit<Exercise, 'kind' | 'after'>) {
  return (
    <article className='relative my-9 rounded-2xl border border-ink/10 bg-paper px-6 pb-6 pt-7 board-shadow sm:px-7'>
      <span
        aria-hidden='true'
        className='absolute -top-2 left-7 size-4 rounded-full ring-1 ring-black/10'
        style={{
          background:
            'radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.7), hsl(22 92% 52%) 60%, hsl(22 90% 36%))',
          boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
        }}
      />

      <h3 className='font-display text-xl font-extrabold leading-snug tracking-[-0.02em] text-ink'>
        {name}
      </h3>
      {meta ? (
        <p className='mt-1 font-hand text-lg leading-none text-primary'>{meta}</p>
      ) : null}

      <dl className='mt-5 space-y-4 text-[15px] leading-7 text-ink/80'>
        <div>
          <dt className='font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/55'>
            Aufbau
          </dt>
          <dd className='mt-1'>{setup}</dd>
        </div>
        <div>
          <dt className='font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/55'>
            Organisation
          </dt>
          <dd className='mt-1'>{organisation}</dd>
        </div>
        <div>
          <dt className='font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/55'>
            Coaching-Punkte
          </dt>
          <dd className='mt-2'>
            <ul className='space-y-2'>
              {coachingPoints.map((point, index) => (
                <li key={point} className='flex gap-3'>
                  <span
                    aria-hidden='true'
                    className='mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12 font-display text-[13px] font-bold tabular-nums text-primary'>
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className='mt-5 border-t border-ink/10 pt-4 text-[15px] leading-7'>
        <p className='text-ink/80'>
          <span className='font-display text-[13px] font-bold uppercase tracking-[0.06em] text-secondary'>
            Fehlerbild ·{' '}
          </span>
          {commonError}
        </p>
        {variation ? (
          <p className='mt-2.5 text-ink/80'>
            <span className='font-display text-[13px] font-bold uppercase tracking-[0.06em] text-ink/55'>
              Variation ·{' '}
            </span>
            {variation}
          </p>
        ) : null}
      </div>
    </article>
  );
}
