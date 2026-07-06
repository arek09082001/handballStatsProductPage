import Image from 'next/image';

/**
 * In-app preview for the hero — a landscape tablet frame wrapping a real
 * screenshot of the live match-recording screen, shown the way a coach would
 * actually hold it on the sideline. The screenshot keeps its native aspect
 * ratio so nothing of the live view gets cropped away.
 */
export default function AppMockup() {
  return (
    <div className='relative mx-auto w-full max-w-[640px]'>
      {/* Glow */}
      <div className='absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.35),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(37,99,235,0.3),transparent_55%)] blur-2xl' />

      {/* Tablet frame (landscape) */}
      <div className='relative overflow-hidden rounded-[30px] border-[12px] border-slate-900 bg-slate-900 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.65)]'>
        {/* Front camera */}
        <div className='absolute left-1/2 top-[7px] z-10 size-1.5 -translate-x-1/2 rounded-full bg-slate-600' />

        {/* Real app screenshot at its native landscape ratio */}
        <div className='relative aspect-[1916/879] w-full overflow-hidden bg-[#0b1220]'>
          <Image
            src='/recordStatsInGame.png'
            alt='Statix Live-Erfassung – Tore, Würfe und Paraden in Echtzeit erfassen'
            fill
            priority
            sizes='(max-width: 1024px) 100vw, 640px'
            className='object-cover object-center'
          />

          {/* Live badge keeps the "live match" context */}
          <span className='absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-200 ring-1 ring-rose-400/30 backdrop-blur-sm'>
            <span className='size-1.5 animate-pulse rounded-full bg-rose-400' />
            Live · 42:18
          </span>
        </div>
      </div>
    </div>
  );
}
