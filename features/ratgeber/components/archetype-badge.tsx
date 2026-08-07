import { BookOpen, ClipboardList, Network, Percent, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ARCHETYPE_LABELS, type ArticleArchetype } from '../types';

/**
 * Names an article's build shape at a glance — is this a drill session, a
 * system, a number or a rule? The badge is deliberately monochrome: colour in
 * this world means "us" (orange) or "them" (blue), so a five-colour archetype
 * palette would break the two-marker logic (DESIGN.md). The icon carries the
 * distinction, the marker only lights the icon.
 */
const ICONS: Record<ArticleArchetype, typeof Percent> = {
  kennzahl: Percent,
  system: Network,
  rezept: ClipboardList,
  referenz: BookOpen,
  entscheidung: Scale,
};

export default function ArchetypeBadge({
  archetype,
  onDark = false,
  className,
}: {
  archetype: ArticleArchetype;
  onDark?: boolean;
  className?: string;
}) {
  const Icon = ICONS[archetype];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-display text-[13px] font-bold tracking-tight',
        onDark ? 'border-chalk/25 bg-chalk/8 text-chalk/85' : 'border-ink/15 bg-paper-2 text-ink/75',
        className,
      )}>
      <Icon className='size-3.5 text-primary' aria-hidden='true' />
      {ARCHETYPE_LABELS[archetype]}
    </span>
  );
}
