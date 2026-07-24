import { Check } from 'lucide-react';

interface HeroTrustBadgeProps {
  label: string;
}

/** A small chalk chip on the court — a checked promise under the hero CTAs. */
export default function HeroTrustBadge({ label }: HeroTrustBadgeProps) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-chalk/12 bg-chalk/5 px-3 py-1.5 text-[13px] font-medium text-chalk/85'>
      <Check className='size-3.5 text-primary' strokeWidth={3} />
      <span>{label}</span>
    </div>
  );
}
