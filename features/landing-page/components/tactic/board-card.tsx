import { cn } from '@/lib/utils';

/**
 * A note pinned to the tactic board. One ground (paper or court panel), one real
 * board shadow, and at most one fastener — a magnet dot or a strip of tape.
 * Restrained by rule: never nested, no stacked halos (see DESIGN.md).
 */
const MAGNET = {
  marker: 'hsl(22 92% 52%)',
  opponent: 'hsl(221 83% 53%)',
  chalk: 'hsl(0 0% 100%)',
  ink: 'hsl(222 24% 20%)',
  success: 'hsl(142 55% 42%)',
} as const;

interface BoardCardProps {
  children: React.ReactNode;
  tone?: 'paper' | 'court';
  pin?: 'magnet' | 'tape' | 'none';
  pinColor?: keyof typeof MAGNET;
  className?: string;
}

export default function BoardCard({
  children,
  tone = 'paper',
  pin = 'none',
  pinColor = 'marker',
  className,
}: BoardCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl',
        tone === 'paper'
          ? 'board-shadow border border-ink/10 bg-paper text-ink'
          : 'board-shadow-court border border-chalk/12 bg-court-2 text-chalk',
        className,
      )}>
      {pin === 'magnet' && (
        <span
          aria-hidden='true'
          className='absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full ring-1 ring-black/10'
          style={{
            background: `radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.7), ${MAGNET[pinColor]} 60%, hsl(0 0% 0% / 0.25))`,
            boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
          }}
        />
      )}
      {pin === 'tape' && (
        <span
          aria-hidden='true'
          className='absolute -top-3 left-6 h-6 w-16 -rotate-6 rounded-[2px] bg-chalk/45 ring-1 ring-black/5 backdrop-blur-[1px]'
          style={{
            maskImage:
              'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          }}
        />
      )}
      {children}
    </div>
  );
}
