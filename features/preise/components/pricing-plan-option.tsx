'use client';

import { Check } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { RadioItemProps } from '../data/use-radio-group';

interface PricingPlanOptionProps {
  radio: RadioItemProps;
  name: string;
  audience: string;
  /** The figure, already formatted ("79 €", "9,90 €"). */
  amount: string;
  /** What the figure buys ("je Saison", "dauerhaft"). */
  unit: string;
  /** One line under the figure — the package price, storage and credits. */
  note?: ReactNode;
  highlights: readonly string[];
  recommendedLabel?: string;
}

/**
 * One option of the configurator: a whole card that is a radio button.
 *
 * Selection is told three ways at once, because on a bright sideline phone one
 * of them is always washed out: a marker-orange frame, a filled tick in the
 * corner, and `aria-checked` for assistive technology, which announces it in
 * the reader's own language. The recommended option wears a strip of tape with a Caveat
 * label — a note on the board rather than a bigger box — so the figures of all
 * options stay comparable side by side.
 * @returns A JSX element rendering one selectable plan card on the court ground.
 */
export default function PricingPlanOption({
  radio,
  name,
  audience,
  amount,
  unit,
  note,
  highlights,
  recommendedLabel,
}: PricingPlanOptionProps) {
  const checked = radio['aria-checked'];
  const id = useId();

  return (
    <button
      type='button'
      {...radio}
      // Named by the tier alone and described by its price, so a screen reader
      // announces "Trainer, radio button, checked, 79 € je Saison" instead of
      // reading the whole card — the highlights stay readable by browsing.
      aria-labelledby={`${id}-name`}
      aria-describedby={`${id}-price ${id}-note`}
      className={cn(
        'group relative flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-[border-color,background-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-court sm:p-6',
        checked
          ? 'border-primary bg-chalk/[0.08] shadow-[0_18px_34px_-22px_hsl(22_90%_45%/0.9)]'
          : 'border-chalk/14 bg-chalk/[0.03] hover:-translate-y-0.5 hover:border-chalk/35 hover:bg-chalk/[0.06]',
      )}>
      {recommendedLabel ? (
        <span className='absolute -top-3 right-4 rotate-[2deg] rounded-[3px] bg-primary px-2.5 pb-1 pt-1.5 font-hand text-lg font-semibold leading-none text-white shadow-[0_6px_12px_-8px_hsl(22_90%_30%/0.9)]'>
          {recommendedLabel}
        </span>
      ) : null}

      <span className='flex items-start justify-between gap-3'>
        <span
          id={`${id}-name`}
          className='font-display text-xl font-extrabold tracking-tight text-chalk'>
          {name}
        </span>
        <span
          aria-hidden='true'
          className={cn(
            'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200',
            checked
              ? 'border-primary bg-primary text-white'
              : 'border-chalk/35 text-transparent group-hover:border-chalk/60',
          )}>
          <Check className='size-3.5' strokeWidth={3.5} />
        </span>
      </span>
      <span className='mt-1 block text-[13px] leading-5 text-chalk/65'>
        {audience}
      </span>

      <span
        id={`${id}-price`}
        className='mt-5 flex flex-wrap items-baseline gap-x-1.5 whitespace-nowrap'>
        <span
          key={amount}
          className='price-swap font-display text-[2rem] font-extrabold leading-none tracking-[-0.035em] tabular-nums text-chalk'>
          {amount}
        </span>
        <span className='text-[15px] font-medium text-chalk/65'>{unit}</span>
      </span>
      <span
        id={`${id}-note`}
        className='mt-1.5 block min-h-5 text-[13px] leading-5 text-chalk/70'>
        {note}
      </span>

      <span className='mt-4 flex flex-col gap-2 border-t border-chalk/10 pt-4'>
        {highlights.map((item) => (
          <span
            key={item}
            className='flex items-start gap-2.5 text-[14px] leading-[1.35rem] text-chalk/80'>
            <Check
              aria-hidden='true'
              className='mt-[3px] size-3.5 shrink-0 text-primary'
              strokeWidth={3}
            />
            {item}
          </span>
        ))}
      </span>
    </button>
  );
}
