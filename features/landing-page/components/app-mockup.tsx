import { Activity, Hand, Target, Timer } from 'lucide-react';

function StatPill({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='flex items-center gap-2.5 rounded-2xl bg-white/8 px-3 py-2.5 backdrop-blur-sm'>
      <span className='flex size-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#fdba74]'>
        {icon}
      </span>
      <span className='min-w-0'>
        <span className='block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55'>
          {label}
        </span>
        <span className='block text-sm font-bold text-white'>{value}</span>
      </span>
    </div>
  );
}

/**
 * Stylised in-app preview for the hero — a live handball match screen with a
 * scoreboard, live shooting stats and a shot map. Purely decorative.
 */
export default function AppMockup() {
  const shotBars = [
    { label: 'RR', made: 'h-[72%]' },
    { label: 'RM', made: 'h-[58%]' },
    { label: 'KM', made: 'h-[84%]' },
    { label: 'LM', made: 'h-[46%]' },
    { label: 'LL', made: 'h-[66%]' },
  ];

  return (
    <div className='relative mx-auto w-full max-w-[420px]'>
      {/* Glow */}
      <div className='absolute -inset-6 rounded-[48px] bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.35),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(37,99,235,0.3),transparent_55%)] blur-2xl' />

      {/* Phone frame */}
      <div className='relative overflow-hidden rounded-[44px] border-[10px] border-slate-900 bg-slate-900 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.65)]'>
        {/* Notch */}
        <div className='absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900' />

        <div className='relative bg-gradient-to-b from-[#0b1220] via-[#0e1730] to-[#101a36] px-4 pb-5 pt-9'>
          {/* Top bar */}
          <div className='flex items-center justify-between text-white/70'>
            <div className='flex items-center gap-2'>
              <span className='flex size-7 items-center justify-center rounded-lg bg-[#f97316] text-xs font-black text-white'>
                HS
              </span>
              <span className='text-xs font-semibold text-white'>Live-Erfassung</span>
            </div>
            <span className='inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300'>
              <span className='size-1.5 animate-pulse rounded-full bg-rose-400' />
              Live · 42:18
            </span>
          </div>

          {/* Scoreboard */}
          <div className='mt-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
            <div className='flex items-center justify-between'>
              <div className='text-center'>
                <div className='text-[11px] font-semibold text-white/60'>Heim</div>
                <div className='mt-1 text-4xl font-black tracking-tight text-white'>27</div>
              </div>
              <div className='text-xs font-bold uppercase tracking-[0.2em] text-white/40'>
                vs
              </div>
              <div className='text-center'>
                <div className='text-[11px] font-semibold text-white/60'>Gast</div>
                <div className='mt-1 text-4xl font-black tracking-tight text-[#fdba74]'>24</div>
              </div>
            </div>
          </div>

          {/* Live stats */}
          <div className='mt-3 grid grid-cols-2 gap-2.5'>
            <StatPill icon={<Target className='size-4' />} label='Wurfquote' value='68 %' />
            <StatPill icon={<Hand className='size-4' />} label='Paraden' value='11' />
            <StatPill icon={<Activity className='size-4' />} label='Tempo-Tore' value='6' />
            <StatPill icon={<Timer className='size-4' />} label='Zeitstrafen' value='2' />
          </div>

          {/* Shot map */}
          <div className='mt-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10'>
            <div className='flex items-center justify-between'>
              <span className='text-[11px] font-semibold text-white/70'>Wurfquote nach Position</span>
              <span className='rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300'>
                +12 %
              </span>
            </div>
            <div className='mt-4 flex h-24 items-end justify-between gap-2'>
              {shotBars.map((bar) => (
                <div key={bar.label} className='flex flex-1 flex-col items-center gap-1.5'>
                  <div className='flex h-20 w-full items-end rounded-md bg-white/5'>
                    <div
                      className={`w-full rounded-md bg-gradient-to-t from-[#f97316] to-[#fdba74] ${bar.made}`}
                    />
                  </div>
                  <span className='text-[9px] font-semibold text-white/45'>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick action buttons */}
          <div className='mt-3 grid grid-cols-3 gap-2'>
            <div className='rounded-xl bg-[#f97316] py-2.5 text-center text-xs font-bold text-white'>
              Tor
            </div>
            <div className='rounded-xl bg-white/10 py-2.5 text-center text-xs font-bold text-white'>
              Parade
            </div>
            <div className='rounded-xl bg-white/10 py-2.5 text-center text-xs font-bold text-white'>
              Fehlwurf
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
