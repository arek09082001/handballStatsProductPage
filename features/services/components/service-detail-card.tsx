'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { heroFont } from '@/features/landing-page/components/hero-font';

type ServiceDetailCardProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
  outcome: string;
  outcomeLabel: string;
  accent: string;
  imageSrc: string;
  reverse?: boolean;
};

export default function ServiceDetailCard({
  id,
  eyebrow,
  title,
  description,
  points,
  outcome,
  outcomeLabel,
  accent,
  imageSrc,
  reverse = false,
}: ServiceDetailCardProps) {
  return (
    <div
      id={id}
      className='card-surface grid gap-8 rounded-[2rem] p-5 md:p-8 lg:grid-cols-2 lg:items-center'>
      <div className={`${reverse ? 'lg:order-2' : ''} text-center lg:text-left`}>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
          {eyebrow}
        </p>
        <h3 className={`mt-3 text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl ${heroFont.className}`}>
          {title}
        </h3>
        <p className='mt-5 text-base leading-8 text-muted-foreground'>
          {description}
        </p>
        <ul className='mt-6 space-y-3 text-left'>
          {points.map((point) => (
            <li key={point} className='flex items-start gap-3'>
              <CheckCircle2 className='mt-1 h-5 w-5 shrink-0 text-success' />
              <span className='text-sm leading-7 text-foreground'>{point}</span>
            </li>
          ))}
        </ul>
        <div className='mt-6 rounded-2xl bg-muted/55 p-4'>
          <p className='text-sm font-semibold text-foreground'>{outcomeLabel}</p>
          <p className='mt-2 text-sm leading-7 text-muted-foreground'>{outcome}</p>
        </div>
      </div>

      <div className={reverse ? 'lg:order-1' : ''}>
        <div className={`relative overflow-hidden rounded-[1.7rem] bg-gradient-to-br ${accent} p-0 sm:p-6 sm:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]`}>
          <div className='absolute right-5 top-5 hidden h-20 w-20 rounded-full bg-background/50 blur-2xl sm:block' />
          <Image
            src={imageSrc}
            alt={title}
            title={title}
            width={1200}
            height={800}
            className='relative h-[270px] w-full rounded-[1.7rem] object-cover sm:h-[320px] sm:rounded-[1.4rem] sm:border sm:border-background/70 sm:bg-background/80 sm:shadow-sm sm:backdrop-blur'
            sizes='(min-width: 1024px) 35vw, (min-width: 640px) 70vw, 100vw'
            priority={id === 'webdesign'}
          />
          <div className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent' />
        </div>
      </div>
    </div>
  );
}