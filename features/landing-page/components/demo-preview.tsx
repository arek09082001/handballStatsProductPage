import Image from 'next/image';
import { Lock } from 'lucide-react';

interface DemoPreviewProps {
  url: string;
  liveLabel: string;
}

/**
 * Browser window that previews the live demo, wrapping a real in-app screenshot.
 * The surrounding CTA links to the actual demo; the URL bar mirrors the real
 * demo domain so the destination is obvious before the user clicks.
 */
export default function DemoPreview({ url, liveLabel }: DemoPreviewProps) {
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
          <span className='hidden shrink-0 items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-300 sm:inline-flex'>
            <span className='size-1.5 animate-pulse rounded-full bg-rose-400' />
            {liveLabel}
          </span>
        </div>

        {/* Real app screenshot */}
        <Image
          src='/statsTableInGame.png'
          alt='Statix Live-Demo – Spielstatistiken und Auswertungen im Browser'
          width={1896}
          height={874}
          sizes='(max-width: 1024px) 100vw, 520px'
          className='h-auto w-full'
        />
      </div>
    </div>
  );
}
