'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/**
 * The "Neu" chip of a feature marked `isNew` — solid marker orange with an
 * inked word, the one loud chip in a list of quiet status badges, because
 * being new is the news. Same ink-on-orange as the home magnet, for the same
 * contrast reason (see `PlayerMagnet`).
 * @returns A JSX element rendering the chip.
 */
export default function FeatureNewBadge({ className }: { className?: string }) {
  const t = useTranslations('featureCatalog');

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-primary px-2.5 py-1 font-display text-[13px] font-extrabold leading-none text-[hsl(20_65%_12%)] shadow-sm',
        className,
      )}>
      {t('newLabel')}
    </span>
  );
}
