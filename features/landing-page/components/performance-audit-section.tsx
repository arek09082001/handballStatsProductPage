'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { AlertCircle, Smartphone, Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AuditScore {
  key: string;
  label: string;
  score: number;
  max: number;
  color: string;
}

export default function PerformanceAuditSection() {
  const t = useTranslations('performanceAuditSection');

  const auditScores: AuditScore[] = [
    { key: 'metricPerformance', label: t('metricPerformance'), score: 42, max: 100, color: 'text-red-500' },
    { key: 'metricAccessibility', label: t('metricAccessibility'), score: 65, max: 100, color: 'text-yellow-500' },
    { key: 'metricBestPractices', label: t('metricBestPractices'), score: 58, max: 100, color: 'text-orange-500' },
    { key: 'metricSeo', label: t('metricSeo'), score: 35, max: 100, color: 'text-red-600' },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const scoresRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        scoresRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: rightRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='w-full bg-background py-20 md:py-24'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='grid gap-12 md:grid-cols-2 md:items-center md:gap-16'>
          {/* Left: Text Content */}
          <div ref={leftRef}>
            <p className='text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary md:text-left'>
              {t('eyebrow')}
            </p>
            <h2 className='mt-3 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-left'>
              {t('title')}
            </h2>
            <p className='mt-4 text-center text-base leading-7 text-muted-foreground md:text-left'>
              {t('description')}
            </p>

            {/* Audit Issues */}
            <div className='mt-8 space-y-4'>
              {/* Slow Loading Speeds */}
              <div className='card-surface rounded-xl p-4'>
                <div className='flex gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100'>
                    <AlertCircle className='h-6 w-6 text-red-600' />
                  </div>
                  <div>
                    <p className='font-semibold text-foreground'>{t('issue1Title')}</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {t('issue1Description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Poor Mobile Experience */}
              <div className='card-surface rounded-xl p-4'>
                <div className='flex gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100'>
                    <Smartphone className='h-6 w-6 text-amber-600' />
                  </div>
                  <div>
                    <p className='font-semibold text-foreground'>{t('issue2Title')}</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {t('issue2Description')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing SEO Structure */}
              <div className='card-surface rounded-xl p-4'>
                <div className='flex gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-100'>
                    <Link2 className='h-6 w-6 text-yellow-600' />
                  </div>
                  <div>
                    <p className='font-semibold text-foreground'>{t('issue3Title')}</p>
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {t('issue3Description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Score Card */}
          <div
            ref={rightRef}
            className='hidden items-center justify-center md:flex md:justify-end'>
            <div className='card-surface-dark relative w-full rounded-3xl p-8'>
              {/* Main Score Circle */}
              <div className='flex flex-col items-center text-center'>
                <p className='text-sm font-medium text-slate-400'>{t('scoreTitle')}</p>
                <div className='relative mt-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-rose-500'>
                  <span className='text-4xl font-bold text-rose-500'>38</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className='mt-10 space-y-4'>
                {auditScores.map((metric, index) => (
                  <div
                    key={metric.key}
                    ref={(el) => {
                      if (el) scoresRef.current[index] = el;
                    }}
                    className='flex items-center justify-between rounded-lg bg-slate-800/50 px-4 py-3 backdrop-blur-sm'>
                    <span className='text-sm font-medium text-slate-300'>{metric.label}</span>
                    <span className={`text-lg font-bold ${metric.color}`}>
                      {metric.score}/{metric.max}
                    </span>
                  </div>
                ))}
              </div>

              {/* Subtitle */}
              <p className='mt-6 text-center text-xs text-slate-300'>
                {t('scoreSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
