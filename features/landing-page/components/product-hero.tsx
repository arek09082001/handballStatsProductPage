'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import AppMockup from './app-mockup';
import HeroActionButton from './hero-action-button';
import HeroTrustBadge from './hero-trust-badge';
import { heroFont } from './hero-font';

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function ProductHero() {
  const t = useTranslations('productPage.hero');
  const trustItems = [t('trust1'), t('trust2'), t('trust3')];

  return (
    <section className='relative isolate w-full overflow-hidden bg-muted/40 pt-8 lg:pt-0'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_0%_0%,hsl(var(--primary)/0.16),transparent),radial-gradient(ellipse_45%_45%_at_100%_100%,hsl(var(--secondary)/0.12),transparent)]' />

      <div className='relative mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col items-center gap-12 px-6 pb-16 pt-10 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:py-20 xl:py-24'>
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className={`w-full shrink-0 text-center lg:w-[44%] lg:text-left ${heroFont.className}`}>
          <div className='mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary lg:mx-0'>
            <span className='size-2 rounded-full bg-primary' />
            <span>{t('badge')}</span>
          </div>

          <h1 className='mt-6 text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.04em] text-foreground sm:text-[3.2rem] lg:text-[3.6rem] xl:text-[4rem]'>
            {t('headlineLead')}{' '}
            <span className='relative text-primary'>
              {t('headlineHighlight')}
              <span className='absolute -bottom-1 left-0 h-2 w-full rounded-full bg-primary/25 blur-[2px]' />
            </span>{' '}
            {t('headlineTail')}
          </h1>

          <p className='mx-auto mt-6 max-w-[560px] text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0'>
            {t('description')}
          </p>

          <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start'>
            <HeroActionButton variant='primary' onClick={() => scrollToId('newsletter')}>
              {t('primaryCta')}
            </HeroActionButton>
            <HeroActionButton variant='secondary' onClick={() => scrollToId('features')}>
              {t('secondaryCta')}
            </HeroActionButton>
          </div>

          <div className='mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start'>
            {trustItems.map((item) => (
              <HeroTrustBadge key={item} label={item} />
            ))}
          </div>
        </motion.div>

        {/* Right: app mockup */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.1 }}
          className='relative w-full lg:min-w-0 lg:flex-1'>
          <AppMockup />
        </motion.div>
      </div>
    </section>
  );
}
