import { Check } from 'lucide-react';

interface HeroTrustBadgeProps {
  label: string;
}

export default function HeroTrustBadge({ label }: HeroTrustBadgeProps) {
  return (
    <div className='inline-flex items-center gap-2 text-sm font-medium text-slate-600'>
      <Check className='size-4 text-[#22c55e]' strokeWidth={2.5} />
      <span>{label}</span>
    </div>
  );
}
