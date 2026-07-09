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

export default function HeroActionButton({
  children,
  className,
  variant = 'primary',
  icon,
  ...props
}: HeroActionButtonProps) {
  const classes = cn(
    'inline-flex h-14 w-full max-w-[300px] items-center justify-center gap-2 rounded-full px-7 text-sm font-bold tracking-[-0.02em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[260px] lg:min-w-[272px] xl:min-w-[300px]',
    variant === 'primary'
      ? 'bg-linear-to-r from-[#f97316] to-[#ea580c] text-white shadow-[0_18px_30px_-18px_rgba(249,115,22,0.9)] hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-18px_rgba(249,115,22,0.85)]'
      : 'border border-slate-200 bg-white text-slate-950 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50',
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {icon ??
        (variant === 'secondary' ? <ArrowRight className='size-4' /> : null)}
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
