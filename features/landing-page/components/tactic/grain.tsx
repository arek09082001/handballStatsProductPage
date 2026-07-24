import { cn } from '@/lib/utils';

/**
 * A faint grain overlay so the grounds read as real paper / a real board rather
 * than flat fills. Pure decoration: absolutely positioned, non‑interactive, and
 * cheap (a single inline SVG noise tile). Multiply on paper, soft‑light on the
 * dark court.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface GrainProps {
  tone?: 'paper' | 'court';
  className?: string;
  opacity?: number;
}

export default function Grain({ tone = 'paper', className, opacity }: GrainProps) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'pointer-events-none absolute inset-0',
        tone === 'paper' ? 'mix-blend-multiply' : 'mix-blend-soft-light',
        className,
      )}
      style={{
        backgroundImage: NOISE,
        backgroundSize: '140px 140px',
        opacity: opacity ?? (tone === 'paper' ? 0.05 : 0.09),
      }}
    />
  );
}
