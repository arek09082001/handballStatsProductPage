import { cn } from '@/lib/utils';

/**
 * A magnetic player token from the tactic board — a jersey number on a round
 * magnet. Two‑marker logic (see DESIGN.md): `home` = your team (orange),
 * `away` = the opponent (blue), `chalk` = neutral. The magnet look is
 * restrained: one soft radial sheen, a thin rim, one real offset shadow.
 */
const TEAM = {
  home: {
    bg: 'radial-gradient(120% 120% at 32% 26%, hsl(22 96% 64%), hsl(22 92% 54%) 62%, hsl(22 90% 48%))',
    rim: 'hsl(22 90% 34% / 0.6)',
    // Inked, not printed white. The marker orange is a light-mid tone: a white
    // numeral on it measures 2.4–3.3:1 and misses AA, while the same numeral in
    // deep ink clears it across the whole radial (4.8–7.0:1) — and a dark
    // number on a bright magnet is what a real board looks like anyway. The
    // gradient's foot was lifted from 40 % to 48 % lightness for the same
    // reason: the numeral's edge sits over it, and it was the one stop where
    // ink still missed. The opponent magnet below keeps its chalk numeral, in
    // reverse: its blue is dark enough that white is the contrasting choice
    // (5.6:1) and ink would not be.
    text: 'hsl(20 65% 12%)',
  },
  away: {
    bg: 'radial-gradient(120% 120% at 32% 26%, hsl(221 90% 64%), hsl(221 83% 50%) 62%, hsl(221 80% 40%))',
    rim: 'hsl(221 80% 32% / 0.55)',
    text: 'hsl(210 60% 98%)',
  },
  chalk: {
    bg: 'radial-gradient(120% 120% at 32% 26%, hsl(0 0% 100%), hsl(210 16% 90%) 62%, hsl(210 14% 82%))',
    rim: 'hsl(210 20% 60% / 0.5)',
    text: 'hsl(222 24% 18%)',
  },
} as const;

const SIZE = {
  sm: 'size-8 text-[13px]',
  md: 'size-11 text-base',
  lg: 'size-14 text-xl',
} as const;

interface PlayerMagnetProps {
  number: number | string;
  team?: keyof typeof TEAM;
  size?: keyof typeof SIZE;
  className?: string;
  title?: string;
}

export default function PlayerMagnet({
  number,
  team = 'home',
  size = 'md',
  className,
  title,
}: PlayerMagnetProps) {
  const t = TEAM[team];
  return (
    <span
      title={title}
      aria-hidden={title ? undefined : true}
      className={cn(
        'inline-grid place-items-center rounded-full font-display font-extrabold tabular-nums leading-none tracking-tight ring-1 select-none',
        SIZE[size],
        className,
      )}
      style={{
        background: t.bg,
        color: t.text,
        // @ts-expect-error — CSS custom prop for ring color via Tailwind ring
        '--tw-ring-color': t.rim,
        boxShadow:
          'inset 0 1px 1px hsl(0 0% 100% / 0.45), inset 0 -2px 3px hsl(0 0% 0% / 0.22), 0 6px 12px -6px hsl(222 30% 15% / 0.55)',
      }}>
      {number}
    </span>
  );
}
