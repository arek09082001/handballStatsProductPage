'use client';

import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  CourtDiagram,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import {
  BILLING_OPTIONS,
  LAUNCH_DATE_LABEL,
  TIERS,
  type BillingPeriod,
} from '../data/pricing-content';

/**
 * The billing switch. A real radiogroup rather than two buttons that merely look
 * like one: roving focus with the arrow keys, `aria-checked` on the options, and
 * the group labelled so a screen reader announces what is being switched.
 */
function BillingSwitch({
  value,
  onChange,
}: {
  value: BillingPeriod;
  onChange: (next: BillingPeriod) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (index: number, delta: number) => {
    const next = (index + delta + BILLING_OPTIONS.length) % BILLING_OPTIONS.length;
    onChange(BILLING_OPTIONS[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div
      role='radiogroup'
      aria-label='Abrechnungszeitraum'
      className='inline-flex items-center gap-1 rounded-full border border-chalk/15 bg-chalk/[0.06] p-1'>
      {BILLING_OPTIONS.map((option, index) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type='button'
            role='radio'
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                move(index, 1);
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                move(index, -1);
              }
            }}
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[15px] font-bold tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-court',
              active
                ? 'bg-primary text-white shadow-[0_8px_18px_-10px_hsl(22_90%_45%/0.9)]'
                : 'text-chalk/70 hover:text-chalk',
            )}>
            {option.label}
            {option.badge ? (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[13px] font-semibold tabular-nums',
                  active ? 'bg-white/20 text-white' : 'bg-success/20 text-success',
                )}>
                {option.badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The price board — the scoreboard moment of this page.
 *
 * Not three floating cards: one dark panel divided by chalk hairlines into
 * three columns, the way the tiers actually relate (same product, three
 * settings). The recommended column is lifted by a marker rule and a strip of
 * tape rather than by a bigger box, so the figures stay comparable across the
 * hairlines.
 *
 * Prices are pre-formatted strings in `pricing-content.ts`, so the server
 * render and the first client render are byte-identical and the switch cannot
 * cause a hydration mismatch.
 * @returns A JSX element rendering the tier board on the court ground.
 */
export default function PricingTiers() {
  const [period, setPeriod] = useState<BillingPeriod>('jahr');

  return (
    <section
      id='plaene'
      className='relative w-full overflow-hidden bg-court py-20 text-chalk md:py-28'>
      <CourtDiagram
        variant='full'
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-auto w-[94%] max-w-5xl text-chalk/[0.06]'
      />
      <Grain tone='court' />

      <div className='relative mx-auto max-w-6xl px-6 sm:px-10'>
        <SectionHeading
          tone='court'
          kicker='Die Preistafel'
          title={`Drei Pläne ab dem ${LAUNCH_DATE_LABEL}`}
          description='Bezahlt wird, was echtes Geld kostet: Rechenzeit, Speicher und Versand. Alles, was eine Gewohnheit trägt, bleibt in jedem Plan drin.'
        />

        <div className='mt-10 flex flex-col items-center gap-3'>
          <BillingSwitch value={period} onChange={setPeriod} />
          <p className='text-[13px] text-chalk/60'>
            Ein Jahr ist bei uns eine Saison: 1. Juli bis 30. Juni.
          </p>
        </div>

        <div className='mt-12 overflow-hidden rounded-2xl border border-chalk/12 bg-court-2 board-shadow-court lg:grid lg:grid-cols-3 lg:grid-rows-[auto_auto_auto_auto_auto_auto_1fr]'>
          {TIERS.map((tier) => {
            const price = tier.price[period];
            const featured = tier.recommended === true;

            return (
              <article
                key={tier.id}
                className={cn(
                  // Subgrid so the name, the figure, the button and the list
                  // start on the same line in all three columns — a price table
                  // whose rows drift is a price table nobody can compare.
                  'relative flex flex-col p-7 sm:p-8 lg:grid lg:grid-rows-subgrid lg:row-span-7',
                  featured ? 'bg-chalk/[0.05]' : undefined,
                  // Hairlines between the columns: horizontal while stacked,
                  // vertical once the three sit side by side. The three only
                  // fit from `lg`: at 768 px a column is ~200 px of content and
                  // "159 €" breaks across two lines.
                  'border-t border-chalk/10 first:border-t-0 lg:border-l lg:border-t-0 lg:first:border-l-0',
                )}>
                {featured ? (
                  <>
                    <span
                      aria-hidden='true'
                      className='absolute inset-x-0 top-0 h-[3px] bg-primary'
                    />
                    <span className='absolute right-5 top-0 rounded-b-lg bg-primary px-3.5 pb-2 pt-2 font-hand text-xl font-semibold leading-none text-white'>
                      Empfohlen
                    </span>
                  </>
                ) : null}

                <h3 className='font-display text-2xl font-extrabold tracking-tight text-chalk'>
                  {tier.name}
                </h3>
                <p className='mt-1 text-[13px] leading-6 text-chalk/60'>
                  {tier.audience}
                </p>

                <p className='mt-6 flex flex-wrap items-baseline gap-x-2 whitespace-nowrap'>
                  <span
                    // Keyed on the period so the figure re-animates on switch.
                    key={price.amount}
                    className='price-swap font-display text-[2.75rem] font-extrabold leading-none tracking-[-0.04em] tabular-nums text-chalk'>
                    {price.amount}
                  </span>
                  <span className='text-[15px] font-medium text-chalk/65'>
                    {price.unit}
                  </span>
                </p>
                <p className='mt-2 min-h-10 text-[13px] leading-6 text-chalk/60'>
                  {price.note}
                </p>

                <p className='mt-5 text-[15px] leading-7 text-chalk/75'>
                  {tier.summary}
                </p>

                <a
                  href={CLUB_CONFIG.website.appUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cn(
                    'mt-7 inline-flex h-12 items-center justify-center rounded-xl px-5 font-display text-[15px] font-bold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:scale-[0.99]',
                    featured
                      ? 'bg-primary text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] hover:-translate-y-0.5 hover:bg-[#ea580c]'
                      : 'border border-chalk/30 bg-chalk/5 text-chalk hover:-translate-y-0.5 hover:border-chalk/50 hover:bg-chalk/10',
                  )}>
                  {tier.ctaLabel}
                </a>

                <ul className='mt-7 flex flex-col gap-3 border-t border-chalk/10 pt-6'>
                  {tier.highlights.map((item) => (
                    <li
                      key={item}
                      className='flex items-start gap-3 text-[15px] leading-6 text-chalk/80'>
                      <span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary'>
                        <Check className='size-3' strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        <div className='mt-8 flex flex-col gap-2 text-[13px] leading-6 text-chalk/60'>
          <p>
            Alle Preise sind Endpreise. Als Kleinunternehmer nach § 19 UStG weise
            ich keine Umsatzsteuer aus.
          </p>
          <p>
            Die Preise gelten ab dem {LAUNCH_DATE_LABEL}. Wer im Januar
            einsteigt, zahlt nur die Rumpfsaison bis zum 30. Juni:{' '}
            <span className='font-semibold text-chalk/80'>
              39 € statt 79 €
            </span>{' '}
            bei Trainer,{' '}
            <span className='font-semibold text-chalk/80'>
              79 € statt 159 €
            </span>{' '}
            bei Pro.
          </p>
        </div>
      </div>
    </section>
  );
}
