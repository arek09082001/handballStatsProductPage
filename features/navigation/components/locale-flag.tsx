import type { AppLocale } from '@/i18n/config';
import { cn } from '@/lib/utils';

/**
 * The five flags of the language picker, drawn inline.
 *
 * Not `react-world-flags`, which shipped every country flag on earth as data
 * URIs to draw five small rectangles, and not emoji flags either: Windows has
 * no flag glyphs at all and renders 🇵🇱 as the bare letters "PL", so the one
 * reader who most needs the picker would see two grey letters where the others
 * see a flag.
 *
 * Each flag is drawn to fill the same 22×16 box so the column lines up. That is
 * squarer than the official ratio for some of them — the Union Jack is 2:1 —
 * but a picker wants one rectangle repeated, not five different ones. The hairline
 * ring matters: Poland and France are white at the edge and would otherwise bleed
 * into the menu.
 */
const FLAGS: Record<AppLocale, React.ReactNode> = {
  de: (
    <>
      <rect width='22' height='16' fill='#FFCE00' />
      <rect width='22' height='10.67' fill='#DD0000' />
      <rect width='22' height='5.33' fill='#000000' />
    </>
  ),
  en: (
    <>
      <rect width='22' height='16' fill='#012169' />
      <path d='M0 0 L22 16 M22 0 L0 16' stroke='#FFFFFF' strokeWidth='3.2' />
      <path d='M0 0 L22 16 M22 0 L0 16' stroke='#C8102E' strokeWidth='1.8' />
      <path d='M11 0 V16 M0 8 H22' stroke='#FFFFFF' strokeWidth='5.4' />
      <path d='M11 0 V16 M0 8 H22' stroke='#C8102E' strokeWidth='3.2' />
    </>
  ),
  es: (
    <>
      <rect width='22' height='16' fill='#AA151B' />
      <rect y='4' width='22' height='8' fill='#F1BF00' />
    </>
  ),
  fr: (
    <>
      <rect width='22' height='16' fill='#ED2939' />
      <rect width='14.67' height='16' fill='#FFFFFF' />
      <rect width='7.33' height='16' fill='#002395' />
    </>
  ),
  pl: (
    <>
      <rect width='22' height='16' fill='#FFFFFF' />
      <rect y='8' width='22' height='8' fill='#DC143C' />
    </>
  ),
};

export default function LocaleFlag({
  locale,
  className,
}: {
  locale: AppLocale;
  className?: string;
}) {
  return (
    <svg
      viewBox='0 0 22 16'
      className={cn('h-4 w-[22px] shrink-0 rounded-[2px]', className)}
      role='presentation'
      aria-hidden>
      {FLAGS[locale]}
      <rect
        x='0.5'
        y='0.5'
        width='21'
        height='15'
        rx='1.5'
        fill='none'
        stroke='rgba(15,23,42,0.22)'
      />
    </svg>
  );
}
