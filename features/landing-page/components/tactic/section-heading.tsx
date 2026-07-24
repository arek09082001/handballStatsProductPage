import { cn } from '@/lib/utils';
import BoardKicker from './board-kicker';

/**
 * The shared band header — a marker kicker, a display headline, and a short
 * standfirst — tone‑aware for the paper and court grounds. One kicker per band.
 */
interface SectionHeadingProps {
  kicker: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: 'paper' | 'court';
  align?: 'center' | 'left';
  kickerColor?: 'marker' | 'opponent' | 'chalk' | 'ink';
  className?: string;
  titleClassName?: string;
}

export default function SectionHeading({
  kicker,
  title,
  description,
  tone = 'paper',
  align = 'center',
  kickerColor,
  className,
  titleClassName,
}: SectionHeadingProps) {
  const onPaper = tone === 'paper';
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-2xl items-center text-center' : 'items-start text-left',
        className,
      )}>
      <BoardKicker color={kickerColor ?? (onPaper ? 'marker' : 'chalk')}>{kicker}</BoardKicker>
      <h2
        className={cn(
          'text-balance font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[2.5rem]',
          onPaper ? 'text-ink' : 'text-chalk',
          titleClassName,
        )}>
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'max-w-[52ch] text-base leading-7',
            onPaper ? 'text-ink/70' : 'text-chalk/70',
          )}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
