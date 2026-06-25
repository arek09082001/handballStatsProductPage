'use client';

import Link from 'next/link';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { heroFont } from '@/features/landing-page/components/hero-font';

type ServiceOverviewCardProps = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  surfaceClass: string;
  accentClass: string;
  index: number;
  readMoreLabel: string;
};

export default function ServiceOverviewCard({
  id,
  title,
  description,
  icon: Icon,
  iconClass,
  surfaceClass,
  accentClass,
  index,
  readMoreLabel,
}: ServiceOverviewCardProps) {
  return (
    <Link
      href={`#${id}`}
      title={`${title} ${readMoreLabel}`}
      className={`card-surface group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${surfaceClass} p-6 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[0_30px_62px_-38px_hsl(var(--primary)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2`}>
      <div className='pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-white/70 blur-2xl transition-transform duration-300 group-hover:scale-125' />
      <div className='relative flex items-start justify-between gap-4'>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon className='h-5 w-5' />
        </div>
        <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] ${accentClass}`}>
          0{index + 1}
        </span>
      </div>
      <div className='relative mt-10 flex-1 min-w-0'>
        <h2 className={`max-w-full text-[1.75rem] font-semibold leading-[0.95] tracking-[-0.04em] text-foreground [overflow-wrap:anywhere] ${heroFont.className}`}>
          {title}
        </h2>
        <p className='mt-5 max-w-[24ch] text-base leading-8 text-muted-foreground'>
          {description}
        </p>
      </div>
      <div className='relative mt-8 flex items-center justify-between border-t border-slate-200/70 pt-5'>
        <span className='text-sm font-semibold text-foreground/85'>
          {readMoreLabel}
        </span>
        <span className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-white/80 text-primary transition-all duration-200 group-hover:translate-x-1 group-hover:border-primary/35'>
          <ArrowRight className='h-4 w-4' />
        </span>
      </div>
    </Link>
  );
}