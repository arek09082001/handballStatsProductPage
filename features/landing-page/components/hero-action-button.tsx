import { ArrowRight } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeroActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: ReactNode;
}

export default function HeroActionButton({
  children,
  className,
  variant = 'primary',
  icon,
  type = 'button',
  ...props
}: HeroActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-14 w-full max-w-[300px] items-center justify-center gap-2 rounded-full px-7 text-sm font-bold tracking-[-0.02em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 sm:w-auto sm:min-w-[260px] lg:min-w-[272px] xl:min-w-[300px]',
        variant === 'primary'
          ? 'bg-linear-to-r from-[#22c55e] to-[#22c55e] text-white shadow-[0_18px_30px_-18px_rgba(34,197,94,0.9)] hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-18px_rgba(34,197,94,0.8)]'
          : 'border border-slate-200 bg-white text-slate-950 shadow-[0_14px_26px_-22px_rgba(15,23,42,0.45)] hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50',
        className,
      )}
      {...props}>
      <span>{children}</span>
      {icon ??
        (variant === 'secondary' ? <ArrowRight className='size-4' /> : null)}
    </button>
  );
}
