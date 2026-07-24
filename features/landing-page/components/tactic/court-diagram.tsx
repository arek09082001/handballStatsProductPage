/**
 * The handball court — the recurring motif of the Trainertafel world.
 *
 * Geometry is drawn to real proportions at 10 SVG units = 1 metre. A regulation
 * court is 40 m × 20 m; the goal is 3 m wide; the goal‑area (Torraum) line is a
 * pair of 6 m quarter‑circles centred on the posts joined by a straight segment,
 * and the free‑throw line is the same shape at 9 m, dashed and trimmed to the
 * sideline so it never spills outside the court. `variant="goal"` draws the
 * attacking third; `variant="full"` draws the whole floor top‑down.
 *
 * With `formation`, a real setup is chalked onto the attacking third: the
 * opponent's 6:0 defence and keeper (blue) against your attack with a pivot /
 * Kreisläufer at the line (orange) — so the board reads as a play, not scatter.
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
  /** Chalk a 6:0 defence + attack (with pivot) onto the attacking third. */
  formation?: boolean;
  /** Opacity of the formation group, so it can sit behind copy. */
  formationOpacity?: number;
  title?: string;
}

// Goal end, goal line on the left. 10 units = 1 m. Goal 3 m at y 85–115.
// The 9 m arc is trimmed to the top/bottom sideline (x = 29.6 where r=90 meets y=0/200).
const GOAL_END = {
  viewBox: '-14 -8 178 216',
  boundary: 'M 0 0 H 150 M 0 200 H 150 M 0 0 V 200',
  goalArea: 'M 0 25 A 60 60 0 0 1 60 85 L 60 115 A 60 60 0 0 1 0 175',
  freeThrow: 'M 29.6 0 A 90 90 0 0 1 90 85 L 90 115 A 90 90 0 0 1 29.6 200',
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
  freeThrowL: 'M 29.6 0 A 90 90 0 0 1 90 85 L 90 115 A 90 90 0 0 1 29.6 200',
  goalAreaR: 'M 400 25 A 60 60 0 0 0 340 85 L 340 115 A 60 60 0 0 0 400 175',
  freeThrowR: 'M 370.4 0 A 90 90 0 0 0 310 85 L 310 115 A 90 90 0 0 0 370.4 200',
  goalL: 'M 0 85 H -8 V 115 H 0',
  goalR: 'M 400 85 H 408 V 115 H 400',
};

// A 6:0 defence + keeper (opponent, blue) against an attack with a pivot at the
// line (your team, orange). Positions in goal-end court units (10 u = 1 m).
const KEEPER = { x: 6, y: 100, n: 16 };
const DEFENCE = [
  { x: 55, y: 44, n: 4 },
  { x: 65, y: 70, n: 3 },
  { x: 71, y: 92, n: 6 },
  { x: 71, y: 108, n: 5 },
  { x: 65, y: 130, n: 8 },
  { x: 55, y: 156, n: 2 },
];
const ATTACK = [
  { x: 55, y: 20, n: 11 }, // left wing
  { x: 100, y: 52, n: 7 }, // left back
  { x: 118, y: 100, n: 10 }, // centre / playmaker
  { x: 100, y: 148, n: 14 }, // right back
  { x: 55, y: 180, n: 13 }, // right wing
  { x: 60, y: 100, n: 9 }, // pivot / Kreisläufer at the line
];

const TOKEN = {
  home: { fill: 'hsl(22 92% 53%)', rim: 'hsl(22 90% 36%)' },
  away: { fill: 'hsl(221 83% 55%)', rim: 'hsl(221 80% 38%)' },
  keeper: { fill: 'hsl(168 52% 46%)', rim: 'hsl(168 52% 30%)' },
};

function Token({
  x,
  y,
  n,
  team,
}: {
  x: number;
  y: number;
  n: number;
  team: keyof typeof TOKEN;
}) {
  const c = TOKEN[team];
  return (
    <g>
      <circle cx={x} cy={y} r={5.6} fill={c.rim} />
      <circle cx={x} cy={y} r={4.7} fill={c.fill} />
      <text
        x={x}
        y={y}
        fontSize={5.2}
        fontWeight={800}
        fill='hsl(0 0% 100%)'
        textAnchor='middle'
        dominantBaseline='central'
        style={{ fontFamily: 'var(--font-display)' }}>
        {n}
      </text>
    </g>
  );
}

function Formation({ opacity = 1 }: { opacity?: number }) {
  return (
    <g opacity={opacity}>
      <Token x={KEEPER.x} y={KEEPER.y} n={KEEPER.n} team='keeper' />
      {DEFENCE.map((p) => (
        <Token key={`d${p.n}`} x={p.x} y={p.y} n={p.n} team='away' />
      ))}
      {ATTACK.map((p) => (
        <Token key={`a${p.n}`} x={p.x} y={p.y} n={p.n} team='home' />
      ))}
    </g>
  );
}

export default function CourtDiagram({
  variant = 'goal',
  className,
  stroke = 'currentColor',
  strokeOpacity = 1,
  strokeWidth = 1.6,
  formation = false,
  formationOpacity = 1,
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
        {formation ? <Formation opacity={formationOpacity} /> : null}
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
      {formation ? <Formation opacity={formationOpacity} /> : null}
    </svg>
  );
}
