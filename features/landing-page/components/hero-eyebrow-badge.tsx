interface HeroEyebrowBadgeProps {
  label: string;
}

export default function HeroEyebrowBadge({ label }: HeroEyebrowBadgeProps) {
  return (
    <div className='mx-auto inline-flex items-center gap-2 rounded-full bg-[#e8f0ff] px-3 py-1.5 text-xs font-semibold text-[#3468f5] shadow-[0_10px_25px_-18px_rgba(52,104,245,0.9)] lg:mx-0'>
      <span className='size-2 rounded-full bg-[#3468f5]' />
      <span>{label}</span>
    </div>
  );
}
