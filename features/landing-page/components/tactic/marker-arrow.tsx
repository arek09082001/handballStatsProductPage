import { cn } from '@/lib/utils';

/**
 * A move drawn on the board with the coach's marker — a slightly rough,
 * hand‑jittered arrow. Used to connect steps and point at the next action.
 * `variant` picks the gesture; `color` maps to the two‑marker logic.
 */
type Variant = 'straight' | 'curve' | 'hook';
type Color = 'marker' | 'opponent' | 'chalk' | 'ink';

const STROKE: Record<Color, string> = {
  marker: 'hsl(22 92% 52%)',
  opponent: 'hsl(221 83% 53%)',
  chalk: 'hsl(0 0% 100%)',
  ink: 'hsl(222 24% 13%)',
};

// Hand‑drawn paths in a 120×60 box; the double bumps give a marker wobble.
const PATHS: Record<Variant, string> = {
  straight: 'M4 32 C 34 27, 64 35, 104 30',
  curve: 'M6 50 C 30 12, 74 10, 104 34',
  hook: 'M8 14 C 44 6, 60 40, 96 40 C 108 40, 110 34, 108 28',
};

const HEADS: Record<Variant, { x: number; y: number; a: number }> = {
  straight: { x: 104, y: 30, a: -8 },
  curve: { x: 104, y: 34, a: 40 },
  hook: { x: 108, y: 28, a: -70 },
};

interface MarkerArrowProps {
  variant?: Variant;
  color?: Color;
  className?: string;
  strokeWidth?: number;
  title?: string;
}

export default function MarkerArrow({
  variant = 'curve',
  color = 'marker',
  className,
  strokeWidth = 3,
  title,
}: MarkerArrowProps) {
  const s = STROKE[color];
  const head = HEADS[variant];
  return (
    <svg
      viewBox='0 0 120 60'
      fill='none'
      className={cn('overflow-visible', className)}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path
        d={PATHS[variant]}
        stroke={s}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        data-marker-line
      />
      <g
        transform={`translate(${head.x} ${head.y}) rotate(${head.a})`}
        stroke={s}
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        fill='none'>
        <path d='M0 0 L -13 -6' />
        <path d='M0 0 L -12 7' />
      </g>
    </svg>
  );
}
