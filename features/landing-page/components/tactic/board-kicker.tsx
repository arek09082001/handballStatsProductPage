import { cn } from '@/lib/utils';

/**
 * The one section kicker grammar of the Trainertafel world — a short note in the
 * coach's marker hand (Caveat), led by a small marker tick. This replaces the
 * tracked‑uppercase eyebrow; use it once per band, not as decoration.
 */
const COLOR = {
  marker: 'text-primary',
  opponent: 'text-secondary',
  chalk: 'text-chalk/80',
  ink: 'text-ink/70',
} as const;

interface BoardKickerProps {
  children: React.ReactNode;
  color?: keyof typeof COLOR;
  className?: string;
}

export default function BoardKicker({
  children,
  color = 'marker',
  className,
}: BoardKickerProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-hand text-xl font-semibold leading-none sm:text-2xl',
        COLOR[color],
        className,
      )}>
      <svg viewBox='0 0 28 8' fill='none' aria-hidden='true' className='h-2 w-7 shrink-0'>
        <path
          d='M2 5 C 9 2, 18 7, 26 3'
          stroke='currentColor'
          strokeWidth='2.4'
          strokeLinecap='round'
        />
      </svg>
      {children}
    </span>
  );
}
