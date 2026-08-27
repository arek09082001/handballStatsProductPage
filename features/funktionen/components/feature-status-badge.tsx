import { cn } from '@/lib/utils';
import {
  FEATURE_STATUS_HINT,
  FEATURE_STATUS_LABEL,
  type FeatureStatus,
} from '../data/features';

/**
 * The one place the site says how far along a feature is.
 *
 * It exists because the alternative was worse in both directions: hiding
 * Video-Tagging until it is finished means the site contradicts an app a coach
 * can already see, and listing it beside the finished features means the site
 * promises something a new account does not get. So it is listed, and it wears
 * its state — on the index card, in the hero and above the FAQ.
 *
 * `live` renders as a quiet chalk/ink chip rather than a green "available"
 * badge: on a page where fourteen of fifteen entries are finished, the ones
 * that are not are the news, and a wall of green would bury them.
 *
 * Two shapes, not one. Bare, it is a pill. With the explanation it is a block
 * with a squarer radius: the hint is a full sentence, and a sentence inside a
 * `rounded-full` chip wraps into three lines whose ends curve away from the
 * text — on a phone the label itself broke across lines ("In / Arbeit").
 */
const TONE = {
  live: {
    paper: 'border-ink/15 bg-ink/[0.04] text-ink/60',
    court: 'border-chalk/20 bg-chalk/[0.06] text-chalk/65',
    dot: 'bg-success',
  },
  beta: {
    paper: 'border-primary/40 bg-primary/10 text-[#9a3d05]',
    court: 'border-primary/50 bg-primary/15 text-primary',
    dot: 'bg-primary',
  },
  onRequest: {
    paper: 'border-secondary/35 bg-secondary/10 text-[#1e3a8a]',
    court: 'border-secondary/50 bg-secondary/15 text-[#93b4fd]',
    dot: 'bg-secondary',
  },
} as const;

interface FeatureStatusBadgeProps {
  status: FeatureStatus;
  tone?: 'paper' | 'court';
  /** Adds the one-line explanation after the label. Used in the hero. */
  withHint?: boolean;
  className?: string;
}

export default function FeatureStatusBadge({
  status,
  tone = 'paper',
  withHint = false,
  className,
}: FeatureStatusBadgeProps) {
  const style = TONE[status];

  if (!withHint) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-[13px] font-semibold',
          style[tone],
          className,
        )}
        title={FEATURE_STATUS_HINT[status]}>
        <span aria-hidden='true' className={cn('size-1.5 rounded-full', style.dot)} />
        {FEATURE_STATUS_LABEL[status]}
      </span>
    );
  }

  return (
    <p
      className={cn(
        'inline-flex max-w-[46ch] flex-col gap-1 rounded-xl border px-4 py-2.5 text-[13px] sm:flex-row sm:items-baseline sm:gap-2',
        style[tone],
        className,
      )}>
      <span className='inline-flex items-center gap-2 whitespace-nowrap font-semibold'>
        <span aria-hidden='true' className={cn('size-1.5 rounded-full', style.dot)} />
        {FEATURE_STATUS_LABEL[status]}
      </span>
      <span className='leading-6 opacity-80'>{FEATURE_STATUS_HINT[status]}</span>
    </p>
  );
}
