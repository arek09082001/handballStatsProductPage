'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function TransformationSection() {
  const t = useTranslations('transformationSection');
  const [activeView, setActiveView] = useState<'before' | 'after'>('after');
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const comparisonCards = {
    before: {
      label: t('beforeLabel'),
      imageSrc: '/oldWebsite.png',
      imageAlt: t('beforeImageAlt'),
      points: [t('beforePoint1'), t('beforePoint2'), t('beforePoint3')],
      icon: XCircle,
      iconClassName: 'text-destructive',
      frameClassName: 'border-border/70',
      glowClassName: 'bg-gradient-to-br from-rose-200/60 via-transparent to-orange-100/40',
    },
    after: {
      label: t('afterLabel'),
      imageSrc: '/newWebsite.png',
      imageAlt: t('afterImageAlt'),
      points: [t('afterPoint1'), t('afterPoint2'), t('afterPoint3')],
      icon: CheckCircle2,
      iconClassName: 'text-success',
      frameClassName: 'border-primary/20',
      glowClassName: 'bg-gradient-to-br from-primary/20 via-sky-100/40 to-emerald-100/30',
    },
  } as const;

  const scrollToSlide = (view: 'before' | 'after') => {
    const container = mobileCarouselRef.current;

    if (!container) return;

    const slideIndex = view === 'before' ? 0 : 1;
    const slide = container.children[slideIndex] as HTMLElement | undefined;

    if (!slide) return;

    container.scrollTo({
      left: slide.offsetLeft,
      behavior: 'smooth',
    });
    setActiveView(view);
  };

  const handleCarouselScroll = () => {
    const container = mobileCarouselRef.current;

    if (!container) return;

    const midpoint = container.scrollLeft + container.clientWidth / 2;
    const beforeSlide = container.children[0] as HTMLElement | undefined;
    const afterSlide = container.children[1] as HTMLElement | undefined;

    if (!beforeSlide || !afterSlide) return;

    const beforeCenter = beforeSlide.offsetLeft + beforeSlide.clientWidth / 2;
    const afterCenter = afterSlide.offsetLeft + afterSlide.clientWidth / 2;

    setActiveView(
      Math.abs(midpoint - beforeCenter) <= Math.abs(midpoint - afterCenter) ? 'before' : 'after'
    );
  };

  return (
    <section className='w-full bg-muted/70 py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-primary'>
            {t('eyebrow')}
          </p>
          <h2 className='mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-10 md:hidden'>
          <div
            ref={mobileCarouselRef}
            onScroll={handleCarouselScroll}
            className='-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'>
            {(['before', 'after'] as const).map((view) => {
              const card = comparisonCards[view];
              const Icon = card.icon;

              return (
                <article
                  key={view}
                  className='card-surface relative w-[calc(100vw-3rem)] shrink-0 snap-center rounded-3xl p-4 transition-all duration-300'>

                  <div className={`relative overflow-hidden rounded-2xl border bg-white ${card.frameClassName}`}>
                    <div className={`pointer-events-none absolute inset-0 opacity-90 ${card.glowClassName}`} />
                    <div className='relative aspect-[16/10]'>
                      <Image
                        src={card.imageSrc}
                        alt={card.imageAlt}
                        title={card.imageAlt}
                        fill
                        sizes='100vw'
                        className='object-cover'
                      />
                      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/12 via-transparent to-white/12' />
                    </div>
                  </div>

                  <ul className='mt-5 space-y-3 text-sm text-foreground'>
                    {card.points.map((point) => (
                      <li
                        key={point}
                        className='flex items-start gap-2.5 rounded-2xl bg-background/72 px-3 py-3 shadow-[0_12px_28px_-26px_hsl(var(--foreground)/0.45)]'>
                        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${card.iconClassName}`} />
                        <span className='leading-6'>{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className='mt-4 flex items-center justify-center gap-2'>
            {(['before', 'after'] as const).map((view) => {
              const isActive = activeView === view;

              return (
                <button
                  key={view}
                  type='button'
                  onClick={() => scrollToSlide(view)}
                  aria-label={comparisonCards[view].label}
                  className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? 'w-8 bg-primary' : 'w-2.5 bg-primary/25'
                    }`}
                />
              );
            })}
          </div>
        </div>

        <div className='relative mt-12 hidden md:block'>
          <div className='hidden absolute left-1/2 top-1/2 z-20 md:flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-background shadow-[0_12px_30px_hsl(var(--foreground)/0.10)] transition-transform duration-300 motion-safe:animate-[pulse_3.2s_ease-in-out_infinite]'>
            <ArrowRight className='h-6 w-6 text-primary' />
          </div>

          <div className='grid gap-8 md:grid-cols-2'>
            <article className='card-surface group relative rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-42px_hsl(var(--foreground)/0.28)] sm:p-5'>
              <span className='absolute -top-3 left-5 z-10 rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md'>
                {t('beforeLabel')}
              </span>

              <div className='relative aspect-[16/10] overflow-hidden rounded-2xl border border-primary/15 bg-muted transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-[0_18px_40px_-32px_hsl(var(--foreground)/0.32)]'>
                <Image
                  src='/oldWebsite.png'
                  alt={t('beforeImageAlt')}
                  title={t('beforeImageAlt')}
                  fill
                  sizes='(max-width: 768px) 100vw, 50vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-white/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100' />
              </div>

              <ul className='mt-5 space-y-3 text-sm text-foreground sm:text-base'>
                <li className='flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1'>
                  <XCircle className='mt-0.5 h-5 w-5 shrink-0 text-destructive transition-transform duration-200 hover:scale-110' />
                  <span>{t('beforePoint1')}</span>
                </li>
                <li className='flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1'>
                  <XCircle className='mt-0.5 h-5 w-5 shrink-0 text-destructive transition-transform duration-200 hover:scale-110' />
                  <span>{t('beforePoint2')}</span>
                </li>
                <li className='flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1'>
                  <XCircle className='mt-0.5 h-5 w-5 shrink-0 text-destructive transition-transform duration-200 hover:scale-110' />
                  <span>{t('beforePoint3')}</span>
                </li>
              </ul>
            </article>

            <div className='flex justify-center md:hidden'>
              <div className='flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-background shadow-[0_12px_30px_hsl(var(--foreground)/0.10)] transition-transform duration-300 motion-safe:animate-[pulse_3.2s_ease-in-out_infinite]'>
                <ArrowRight className='h-6 w-6 rotate-90 text-primary' />
              </div>
            </div>

            <article className='card-surface group relative rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-42px_hsl(var(--foreground)/0.28)] sm:p-5'>
              <span className='absolute -top-3 left-5 z-10 rounded-full border border-primary/20 bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md'>
                {t('afterLabel')}
              </span>

              <div className='relative aspect-[16/10] overflow-hidden rounded-2xl border border-primary/15 bg-muted transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-[0_18px_40px_-32px_hsl(var(--foreground)/0.32)]'>
                <Image
                  src='/newWebsite.png'
                  alt={t('afterImageAlt')}
                  title={t('afterImageAlt')}
                  fill
                  sizes='(max-width: 768px) 100vw, 50vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                />
                <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/8 via-transparent to-white/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100' />
              </div>

              <ul className='mt-5 space-y-3 text-sm text-foreground sm:text-base'>
                <li className='flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1'>
                  <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-success transition-transform duration-200 hover:scale-110' />
                  <span>{t('afterPoint1')}</span>
                </li>
                <li className='flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1'>
                  <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-success transition-transform duration-200 hover:scale-110' />
                  <span>{t('afterPoint2')}</span>
                </li>
                <li className='flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1'>
                  <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-success transition-transform duration-200 hover:scale-110' />
                  <span>{t('afterPoint3')}</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}