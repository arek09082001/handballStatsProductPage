import { cn } from '@/lib/utils';

/**
 * A marker stroke swiped under a highlighted word — the board's replacement for
 * the old blurred glow. Stretches to the width of its positioned parent, so
 * wrap the highlighted text in a `relative` span and drop this in.
 */
const STROKE = {
  marker: 'hsl(22 92% 52%)',
  opponent: 'hsl(221 83% 53%)',
  chalk: 'hsl(0 0% 100%)',
  ink: 'hsl(222 24% 13%)',
} as const;

interface MarkerUnderlineProps {
  color?: keyof typeof STROKE;
  className?: string;
  strokeWidth?: number;
}

export default function MarkerUnderline({
  color = 'marker',
  className,
  strokeWidth = 6,
}: MarkerUnderlineProps) {
  const s = STROKE[color];
  return (
    <svg
      viewBox='0 0 300 16'
      preserveAspectRatio='none'
      fill='none'
      aria-hidden='true'
      className={cn('pointer-events-none absolute inset-x-0 -bottom-1 h-[0.5em] w-full', className)}>
      <path
        d='M4 10 C 70 4, 150 13, 210 7 C 250 3, 276 9, 296 6'
        stroke={s}
        strokeOpacity='0.9'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        data-marker-line
      />
    </svg>
  );
}
