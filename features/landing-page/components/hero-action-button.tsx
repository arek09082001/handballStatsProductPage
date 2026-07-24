import { ArrowRight } from 'lucide-react';
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroActionButtonBaseProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

type HeroActionButtonProps = HeroActionButtonBaseProps &
  (
    | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

/**
 * The board's action buttons. Primary is the coach's marker — a solid orange
 * block with a real offset shadow (no glow halo). Secondary is a chalk ghost
 * that sits on the dark court; callers on other grounds override via className.
 */
export default function HeroActionButton({
  children,
  className,
  variant = 'primary',
  icon,
  ...props
}: HeroActionButtonProps) {
  const classes = cn(
    'group inline-flex h-13 w-full max-w-[320px] items-center justify-center gap-2 rounded-xl px-7 font-display text-[15px] font-bold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-court active:translate-y-0 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 sm:h-14 sm:w-auto sm:min-w-[240px]',
    variant === 'primary'
      ? 'bg-primary text-white shadow-[0_14px_26px_-14px_hsl(22_90%_45%/0.85)] hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-[0_18px_30px_-14px_hsl(22_90%_45%/0.8)]'
      : 'border border-chalk/30 bg-chalk/5 text-chalk hover:-translate-y-0.5 hover:border-chalk/50 hover:bg-chalk/10',
    className,
  );

  const content = (
    <>
      {icon ?? null}
      <span>{children}</span>
      {variant === 'secondary' && !icon ? (
        <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, ...anchorProps } =
      props as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

    return (
      <a href={href} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonProps } =
    props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
