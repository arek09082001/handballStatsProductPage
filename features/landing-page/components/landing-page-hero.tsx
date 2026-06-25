'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAppLocale } from '@/app/locale-provider';
import ContactDialog from '@/components/custom-ui/contact-dialog';
import HeroActionButton from './hero-action-button';
import HeroEyebrowBadge from './hero-eyebrow-badge';
import { heroFont } from './hero-font';
import HeroTrustBadge from './hero-trust-badge';

export default function LandingPageHero() {
  const t = useTranslations('heroSection');
  const { locale } = useAppLocale();
  const trustItems = [t('trustItem1'), t('trustItem2'), t('trustItem3')];
  const line1Full = t('headlineLine1');

  const handleAnalysisClick = () => {
    window.dispatchEvent(
      new CustomEvent('landing-page:request-type', {
        detail: { requestType: 'analysis' },
      })
    );

    document.getElementById('final-cta-form')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.setTimeout(() => {
      document.getElementById('cta-name')?.focus();
    }, 450);
  };

  const loopVariants = useMemo(
    () => [
      { line2: t('loop0line2'), line3: t('loop0line3') },
      { line2: t('loop1line2'), line3: t('loop1line3') },
      { line2: t('loop2line2'), line3: t('loop2line3') },
      { line2: t('loop3line2'), line3: t('loop3line3') },
    ],
    [locale, t],
  );

  // Widest variant per row → invisible ghost spans prevent layout shift
  const ghostLine2 = loopVariants.reduce(
    (a, b) => (b.line2.length > a.line2.length ? b : a),
  ).line2;
  const ghostLine3 = loopVariants.reduce(
    (a, b) => (b.line3.length > a.line3.length ? b : a),
  ).line3;
  const initialVariant = loopVariants[0];

  const [line1, setLine1] = useState(line1Full);
  const [line2, setLine2] = useState(initialVariant.line2);
  const [line3, setLine3] = useState(initialVariant.line3);
  // cursorLine: 0 = Zeile 1, 1 = Zeile 2, 2 = Zeile 3, null = kein Cursor (Pause)
  const [cursorLine, setCursorLine] = useState<0 | 1 | 2 | null>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setLine1('');
    setLine2('');
    setLine3('');
    setCursorLine(0);

    let l1 = '';
    let l2 = '';
    let l3 = '';
    let vIdx = 0;

    const schedule = (fn: () => void, ms: number) => {
      timerRef.current = window.setTimeout(fn, ms);
    };
    const jitter = (base: number, spread = 26) =>
      base + Math.floor(Math.random() * spread);

    function typeL1() {
      setCursorLine(0);
      if (l1.length < line1Full.length) {
        l1 = line1Full.slice(0, l1.length + 1);
        setLine1(l1);
        schedule(typeL1, jitter(28));
      } else {
        schedule(typeL2, 320);
      }
    }

    function typeL2() {
      setCursorLine(1);
      const target = loopVariants[vIdx].line2;
      if (l2.length < target.length) {
        l2 = target.slice(0, l2.length + 1);
        setLine2(l2);
        schedule(typeL2, jitter(28));
      } else {
        schedule(typeL3, 200);
      }
    }

    function typeL3() {
      setCursorLine(2);
      const target = loopVariants[vIdx].line3;
      if (l3.length < target.length) {
        l3 = target.slice(0, l3.length + 1);
        setLine3(l3);
        schedule(typeL3, jitter(28));
      } else {
        setCursorLine(null);
        schedule(deleteL3, 2800);
      }
    }

    function deleteL3() {
      setCursorLine(2);
      if (l3.length > 0) {
        l3 = l3.slice(0, -1);
        setLine3(l3);
        schedule(deleteL3, jitter(18, 20));
      } else {
        schedule(deleteL2, 80);
      }
    }

    function deleteL2() {
      setCursorLine(1);
      if (l2.length > 0) {
        l2 = l2.slice(0, -1);
        setLine2(l2);
        schedule(deleteL2, jitter(16, 18));
      } else {
        vIdx = (vIdx + 1) % loopVariants.length;
        schedule(typeL2, 420);
      }
    }

    schedule(typeL1, 220);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [locale, line1Full, loopVariants]);

  return (
    <section className='relative isolate w-full overflow-hidden bg-muted/40 pt-8 lg:pt-0'>
      {/* Subtle gradient blobs */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,hsl(var(--primary)/0.14),transparent),radial-gradient(ellipse_40%_40%_at_100%_100%,hsl(var(--success)/0.10),transparent)]' />

      <div className='relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-8 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:py-20 xl:py-24'>
        {/* ── Left: text content ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className={`w-full shrink-0 text-center lg:w-[50%] lg:text-left xl:w-[48%] ${heroFont.className}`}>
          <HeroEyebrowBadge label={t('eyebrow')} />

          <h1 className='mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-foreground sm:text-[3.4rem] lg:text-[3.8rem] xl:text-[4.4rem]'>
            {/* Line 1 — ghost span reserves final wrap width/height to prevent reflow */}
            <span className='relative block'>
              <span aria-hidden className='invisible pointer-events-none select-none'>
                {line1Full}
              </span>
              <span className='absolute inset-0'>
                {line1}
                {cursorLine === 0 && (
                  <span className='ml-1 inline-block h-[0.9em] w-[0.08em] animate-pulse rounded-full bg-foreground align-[-0.08em]' />
                )}
              </span>
            </span>

            {/* Line 2 — ghost span sets stable height, animated text overlays it */}
            <span className='relative block'>
              <span aria-hidden className='invisible pointer-events-none select-none'>
                {ghostLine2}
              </span>
              <span className='absolute inset-0 text-primary'>
                {line2}
                {cursorLine === 1 && (
                  <span className='ml-1 inline-block h-[0.9em] w-[0.08em] animate-pulse rounded-full bg-primary align-[-0.08em]' />
                )}
              </span>
            </span>

            {/* Line 3 — ghost span sets stable height, animated text overlays it */}
            <span className='relative block'>
              <span aria-hidden className='invisible pointer-events-none select-none'>
                {ghostLine3}
              </span>
              <span className='absolute inset-0 text-primary'>
                {line3}
                {cursorLine === 2 && (
                  <span className='ml-1 inline-block h-[0.9em] w-[0.08em] animate-pulse rounded-full bg-primary align-[-0.08em]' />
                )}
              </span>
              <span className='absolute -bottom-2 left-1/2 h-2.5 w-44 -translate-x-1/2 rounded-full bg-primary/25 blur-[2px]' />
            </span>
          </h1>

          <p className='mx-auto mt-6 max-w-[560px] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0'>
            {t('description')}
          </p>

          <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:items-center lg:justify-start'>
            <ContactDialog
              defaultSubject={t('primarySubject')}
              title={t('primaryCta')}>
              <HeroActionButton variant='primary'>
                {t('primaryCta')}
              </HeroActionButton>
            </ContactDialog>

            <HeroActionButton variant='secondary' onClick={handleAnalysisClick}>
              {t('secondaryCta')}
            </HeroActionButton>
          </div>

          <div className='mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start'>
            {trustItems.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>
        </motion.div>

        {/* ── Right: mock image ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
          className='relative w-full lg:min-w-0 lg:flex-1'>
          <Image
            src='/heroImage.png'
            alt={t('imageAlt')}
            title={t('imageAlt')}
            width={780}
            height={520}
            className='h-auto w-full rounded-2xl object-contain drop-shadow-[0_24px_48px_hsl(var(--foreground)/0.16)]'
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
