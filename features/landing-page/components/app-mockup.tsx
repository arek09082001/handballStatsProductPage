import Image from 'next/image';

/**
 * In-app preview for the hero — a phone frame wrapping a real screenshot of the
 * live match-recording screen. The slim status bar keeps the "live" context,
 * while the screenshot itself shows the actual product.
 */
export default function AppMockup() {
  return (
    <div className='relative mx-auto w-full max-w-[420px]'>
      {/* Glow */}
      <div className='absolute -inset-6 rounded-[48px] bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.35),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(37,99,235,0.3),transparent_55%)] blur-2xl' />

      {/* Phone frame */}
      <div className='relative overflow-hidden rounded-[44px] border-[10px] border-slate-900 bg-slate-900 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.65)]'>
        {/* Notch */}
        <div className='absolute left-1/2 top-0 z-10 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-slate-900' />

        <div className='relative bg-[#0b1220] pt-9'>
          {/* Top bar */}
          <div className='flex items-center justify-between px-4 pb-3'>
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

          {/* Real app screenshot, cropped to the phone screen */}
          <div className='relative aspect-[9/16] w-full overflow-hidden bg-[#0b1220]'>
            <Image
              src='/recordStatsInGame.png'
              alt='Statix Live-Erfassung – Tore, Würfe und Paraden in Echtzeit erfassen'
              fill
              priority
              sizes='(max-width: 1024px) 100vw, 420px'
              className='object-cover object-top'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
