'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FALLBACK_PRICE_SHEET } from '@/features/preise/data/price-sheet';
import { cn } from '@/lib/utils';

/**
 * The founder offer as a deadline — the one piece of urgency the landing page
 * is allowed, because it is true: every account created before the launch keeps
 * the Trainer plan free until the end of the 26/27 season and a permanent
 * founder price after it (PRODUCT.md, "Grandfathering is a promise").
 *
 * No price figure on purpose — this page carries none; the link goes to the
 * founder section of `/preise`, where the figures live.
 *
 * The day count is computed after mount: the server renders the dated line
 * ("bis 31. Dezember 2026"), the browser swaps in "noch 78 Tage". Rendering the
 * count on the server would bake the build day into a cached page and lie a
 * week later. Once the deadline has passed, the note renders nothing — an
 * expired countdown is worse than none.
 */
const DEADLINE = Date.parse(FALLBACK_PRICE_SHEET.founder.registeredBefore);
const DAY = 24 * 60 * 60 * 1000;

export default function FounderCountdown({
  tone = 'court',
  className,
}: {
  tone?: 'court' | 'paper';
  className?: string;
}) {
  const t = useTranslations('productPage.founderOffer');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const update = () => {
      const left = DEADLINE - Date.now();
      setExpired(left <= 0);
      setDaysLeft(Math.max(0, Math.ceil(left / DAY)));
    };
    update();
    const id = window.setInterval(update, 60 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  if (expired) return null;

  const onCourt = tone === 'court';

  return (
    <Link
      href='/preise#bestandsschutz'
      className={cn(
        'group relative inline-flex max-w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-colors',
        onCourt
          ? 'border-primary/40 bg-primary/10 hover:bg-primary/15'
          : 'border-primary/30 bg-primary/5 hover:bg-primary/10',
        className,
      )}>
      {/* The day count as a jersey-number magnet: the figure is the message.
          The word "Tage" lives in the title beside it — a unit squeezed into
          the magnet would fall under the page's 13px floor. */}
      <span
        className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-[17px] font-extrabold leading-none tabular-nums text-white shadow-[0_6px_12px_-6px_hsl(22_90%_40%/0.9)]'
        aria-hidden>
        {daysLeft ?? <Gift className='size-5' strokeWidth={2.5} />}
      </span>
      <span className='min-w-0'>
        <span
          className={cn(
            'block font-display text-[15px] font-bold leading-tight tracking-tight',
            onCourt ? 'text-chalk' : 'text-ink',
          )}>
          {daysLeft === null
            ? t('titleDated')
            : t('titleCountdown', { days: daysLeft })}
        </span>
        <span
          className={cn(
            'mt-0.5 block text-[13px] leading-5',
            onCourt ? 'text-chalk/70' : 'text-ink/70',
          )}>
          {t('text')}
        </span>
      </span>
      <ArrowRight
        className='size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5'
      />
    </Link>
  );
}
