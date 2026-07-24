/**
 * The handball court — the recurring motif of the Trainertafel world.
 *
 * Geometry is drawn to real proportions at 10 SVG units = 1 metre. A regulation
 * court is 40 m × 20 m; the goal is 3 m wide; the goal‑area (Torraum) line is a
 * pair of 6 m quarter‑circles centred on the posts joined by a straight segment,
 * and the free‑throw line is the same shape at 9 m, dashed. `variant="goal"`
 * draws the attacking third every handball fan recognises from a shot map;
 * `variant="full"` draws the whole floor top‑down.
 *
 * Drawable strokes carry `data-court-line` so a parent can animate them on with
 * GSAP (stroke-dashoffset) — the board's "drawn on" motion.
 */
interface CourtDiagramProps {
  variant?: 'goal' | 'full';
  className?: string;
  /** Line color; defaults to currentColor so callers set it with text-*. */
  stroke?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
  title?: string;
}

// Goal end, goal line on the left. 10 units = 1 m. Goal 3 m at y 85–115.
const GOAL_END = {
  viewBox: '-14 -8 178 216',
  boundary: 'M 0 0 H 150 M 0 200 H 150 M 0 0 V 200',
  goalArea: 'M 0 25 A 60 60 0 0 1 60 85 L 60 115 A 60 60 0 0 1 0 175',
  freeThrow: 'M 0 -5 A 90 90 0 0 1 90 85 L 90 115 A 90 90 0 0 1 0 205',
  sevenMetre: 'M 70 95 L 70 105',
  fourMetre: 'M 40 99 L 40 101',
  goal: 'M 0 85 H -8 V 115 H 0',
};

// Whole court, both goals mirrored across the centre line at x=200.
const FULL = {
  viewBox: '-14 -8 428 216',
  boundary: 'M 0 0 H 400 V 200 H 0 Z',
  centre: 'M 200 0 V 200',
  goalAreaL: 'M 0 25 A 60 60 0 0 1 60 85 L 60 115 A 60 60 0 0 1 0 175',
  freeThrowL: 'M 0 -5 A 90 90 0 0 1 90 85 L 90 115 A 90 90 0 0 1 0 205',
  goalAreaR: 'M 400 25 A 60 60 0 0 0 340 85 L 340 115 A 60 60 0 0 0 400 175',
  freeThrowR: 'M 400 -5 A 90 90 0 0 0 310 85 L 310 115 A 90 90 0 0 0 400 205',
  goalL: 'M 0 85 H -8 V 115 H 0',
  goalR: 'M 400 85 H 408 V 115 H 400',
};

export default function CourtDiagram({
  variant = 'goal',
  className,
  stroke = 'currentColor',
  strokeOpacity = 1,
  strokeWidth = 1.6,
  title,
}: CourtDiagramProps) {
  const common = {
    fill: 'none',
    stroke,
    strokeOpacity,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  };

  if (variant === 'full') {
    return (
      <svg
        viewBox={FULL.viewBox}
        className={className}
        role={title ? 'img' : 'presentation'}
        aria-hidden={title ? undefined : true}
        preserveAspectRatio='xMidYMid meet'>
        {title ? <title>{title}</title> : null}
        <path {...common} d={FULL.boundary} data-court-line />
        <path {...common} d={FULL.centre} data-court-line strokeOpacity={strokeOpacity * 0.7} />
        <path {...common} d={FULL.goalAreaL} data-court-line />
        <path {...common} d={FULL.goalAreaR} data-court-line />
        <path
          {...common}
          d={FULL.freeThrowL}
          strokeDasharray='6 7'
          strokeOpacity={strokeOpacity * 0.85}
        />
        <path
          {...common}
          d={FULL.freeThrowR}
          strokeDasharray='6 7'
          strokeOpacity={strokeOpacity * 0.85}
        />
        <path {...common} d={FULL.goalL} strokeWidth={strokeWidth * 1.4} />
        <path {...common} d={FULL.goalR} strokeWidth={strokeWidth * 1.4} />
      </svg>
    );
  }

  return (
    <svg
      viewBox={GOAL_END.viewBox}
      className={className}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio='xMidYMid meet'>
      {title ? <title>{title}</title> : null}
      <path {...common} d={GOAL_END.boundary} data-court-line strokeOpacity={strokeOpacity * 0.55} />
      <path {...common} d={GOAL_END.goalArea} data-court-line />
      <path
        {...common}
        d={GOAL_END.freeThrow}
        strokeDasharray='6 7'
        strokeOpacity={strokeOpacity * 0.85}
      />
      <path {...common} d={GOAL_END.sevenMetre} strokeWidth={strokeWidth * 1.2} />
      <path {...common} d={GOAL_END.fourMetre} strokeWidth={strokeWidth * 1.2} />
      <path {...common} d={GOAL_END.goal} strokeWidth={strokeWidth * 1.4} />
    </svg>
  );
}
