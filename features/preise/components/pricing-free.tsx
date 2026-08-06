import { Check } from 'lucide-react';
import { BoardCard, Grain, SectionHeading } from '@/features/landing-page/components/tactic';
import { FREE_INCLUDED, FREE_LIMITS } from '../data/pricing-content';

/**
 * "Was ist kostenlos" band on the paper ground. Lists every feature a coach
 * gets today at no cost and — directly beneath it — the real quotas the app
 * enforces. Both halves come from `pricing-content.ts`, which mirrors the
 * limits the app itself reports; no rounded or invented numbers.
 * @returns A JSX element rendering the free scope and its limits.
 */
export default function PricingFree() {
  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker='Ohne Rechnung'
          title='Was Statix heute kostet: nichts'
          description='Kein Freemium-Rumpf, kein aufgesparter Profi-Tarif. Was in der App ist, kannst du benutzen – erfassen, auswerten, teilen.'
        />

        <div className='mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10'>
          <BoardCard pin='magnet' pinColor='success' className='p-6 sm:p-8'>
            <h3 className='font-display text-xl font-bold tracking-tight text-ink'>
              Im kostenlosen Zugang enthalten
            </h3>
            <ul className='mt-5 flex flex-col gap-3'>
              {FREE_INCLUDED.map((item) => (
                <li key={item} className='flex items-start gap-3 text-[15px] leading-6 text-ink/80'>
                  <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success'>
                    <Check className='size-3' strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </BoardCard>

          <div className='flex flex-col gap-5'>
            <p className='max-w-[62ch] text-base leading-7 text-ink/70'>
              Grenzen gibt es trotzdem – und zwar echte, in der App hinterlegte.
              Sie schützen Rechenzeit und E-Mail-Versand, nicht den Geldbeutel.
              Damit du weißt, woran du bist, stehen sie hier vollständig:
            </p>

            {FREE_LIMITS.map((group) => (
              <BoardCard key={group.title} pin='none' className='p-5 sm:p-6'>
                <h3 className='font-display text-base font-bold tracking-tight text-ink'>
                  {group.title}
                </h3>
                <dl className='mt-3 divide-y divide-ink/10 border-y border-ink/10'>
                  {group.rows.map((row) => (
                    <div
                      key={row.label}
                      className='flex items-baseline justify-between gap-6 py-2 text-[15px]'>
                      <dt className='text-ink/70'>{row.label}</dt>
                      <dd className='font-display font-bold tabular-nums text-ink'>{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className='mt-3 text-[13px] leading-6 text-ink/60'>{group.note}</p>
              </BoardCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
