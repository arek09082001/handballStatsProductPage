import { Lock, Target, TrendingUp, Users } from 'lucide-react';

interface DemoPreviewProps {
  url: string;
  liveLabel: string;
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='rounded-xl bg-white/5 p-3 ring-1 ring-white/10'>
      <span className='flex size-7 items-center justify-center rounded-lg bg-[#f97316]/20 text-[#fdba74]'>
        {icon}
      </span>
      <div className='mt-2 text-lg font-black leading-none text-white'>{value}</div>
      <div className='mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50'>
        {label}
      </div>
    </div>
  );
}

/**
 * Stylised browser window that previews the live demo. Purely decorative — the
 * surrounding CTA links to the actual demo. The URL bar mirrors the real demo
 * domain so the destination is obvious before the user clicks.
 */
export default function DemoPreview({ url, liveLabel }: DemoPreviewProps) {
  const bars = ['h-[46%]', 'h-[68%]', 'h-[54%]', 'h-[82%]', 'h-[60%]', 'h-[74%]'];

  return (
    <div className='relative mx-auto w-full max-w-[520px]'>
      {/* Glow */}
      <div className='absolute -inset-4 rounded-[32px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent_60%)] blur-2xl' />

      <div className='relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b1220] shadow-[0_40px_90px_-45px_rgba(15,23,42,0.8)] ring-1 ring-black/5'>
        {/* Browser chrome */}
        <div className='flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3'>
          <div className='flex items-center gap-1.5'>
            <span className='size-2.5 rounded-full bg-[#ff5f57]' />
            <span className='size-2.5 rounded-full bg-[#febc2e]' />
            <span className='size-2.5 rounded-full bg-[#28c840]' />
          </div>
          <div className='flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-white/70'>
            <Lock className='size-3 shrink-0 text-emerald-400' />
            <span className='truncate text-xs font-medium'>{url}</span>
          </div>
        </div>

        {/* Viewport */}
        <div className='bg-gradient-to-b from-[#0b1220] via-[#0e1730] to-[#101a36] p-4 sm:p-5'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-lg bg-[#f97316] text-xs font-black text-white'>
                MP
              </span>
              <span className='text-sm font-semibold text-white'>Dashboard</span>
            </div>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300'>
              <span className='size-1.5 animate-pulse rounded-full bg-rose-400' />
              {liveLabel}
            </span>
          </div>

          <div className='mt-4 grid grid-cols-3 gap-2.5'>
            <MiniStat icon={<Target className='size-4' />} label='Wurfquote' value='68%' />
            <MiniStat icon={<TrendingUp className='size-4' />} label='Tore' value='27' />
            <MiniStat icon={<Users className='size-4' />} label='Kader' value='14' />
          </div>

          <div className='mt-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10'>
            <div className='flex items-center justify-between'>
              <span className='text-[11px] font-semibold text-white/70'>Torverlauf</span>
              <span className='rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300'>
                +12%
              </span>
            </div>
            <div className='mt-4 flex h-20 items-end justify-between gap-2'>
              {bars.map((height, index) => (
                <div key={index} className='flex h-full flex-1 items-end rounded-md bg-white/5'>
                  <div
                    className={`w-full rounded-md bg-gradient-to-t from-[#f97316] to-[#fdba74] ${height}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
