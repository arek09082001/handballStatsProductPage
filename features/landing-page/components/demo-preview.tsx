import { Lock } from 'lucide-react';
import BoardScreenshot from './tactic/board-screenshot';

interface DemoPreviewProps {
  url: string;
  liveLabel: string;
}

/**
 * Preview of the live demo — a real in‑app screenshot pinned to the board. The
 * caption mirrors the real demo domain (with a lock) so the destination is
 * obvious before the click; the surrounding CTA links to the demo itself.
 */
export default function DemoPreview({ url, liveLabel }: DemoPreviewProps) {
  return (
    <div className='mx-auto w-full max-w-[520px]'>
      <BoardScreenshot
        src='/statsTableInGame.png'
        alt='Statix Live-Demo – Spielstatistiken und Auswertungen im Browser'
        width={1896}
        height={874}
        tone='court'
        pin='tape'
        sizes='(max-width: 1024px) 100vw, 520px'
      />
      <div className='mt-3 flex items-center justify-center gap-2 text-xs font-medium text-chalk/60'>
        <Lock className='size-3 shrink-0 text-success' />
        <span className='truncate'>{url}</span>
        <span className='inline-flex items-center gap-1.5 font-hand text-base text-primary'>
          <span className='relative flex size-1.5'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70' />
            <span className='relative inline-flex size-1.5 rounded-full bg-primary' />
          </span>
          {liveLabel}
        </span>
      </div>
    </div>
  );
}
