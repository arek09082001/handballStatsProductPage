'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TabletLoopProps {
  /**
   * Basisname unter `/videos/showcase/`: dort liegen `<name>.webm`/`.mp4`
   * (volle Grösse), `<name>-sm.webm`/`-sm.mp4` (Telefone) und `<name>.jpg`
   * (erstes Bild).
   */
  name: string;
  /** Was das Video zeigt — Alternativtext des Standbilds. */
  alt: string;
  label?: string;
  priority?: boolean;
  pin?: 'tape' | 'magnet' | 'none';
}

/**
 * Pixelmasse der gerenderten Loops (Repo remotion-statix,
 * `src/compositions/showcase/`). Das Video IST das Tablet, Kante an Kante;
 * die Rundung des Geräts schneidet erst diese Komponente aus — mit demselben
 * Radius (40 CSS-px × 1,25 = 50 px), in Prozent, damit er bei jeder Breite passt.
 */
const VIDEO_W = 1530;
const VIDEO_H = 980;
const RADIUS = `${((50 / VIDEO_W) * 100).toFixed(2)}% / ${((50 / VIDEO_H) * 100).toFixed(2)}%`;

/**
 * Ein in Remotion gerenderter Loop der App auf einem Tablet, angeheftet an die
 * Tafel wie ein Screenshot. Gebaut, damit er die Seite nicht schwerer macht:
 *
 * - Sofort steht das erste Bild als `next/image` da — mit Alternativtext,
 *   und als grösstes Bild der Section genauso schnell wie vorher der Screenshot.
 * - Das Video wird erst kurz vor dem Hineinscrollen geladen (`preload='none'`,
 *   Quelle erst dann gesetzt), auf Telefonen in der schmalen Fassung, als
 *   VP9 und — für Safari — als H.264.
 * - Es läuft nur, solange es zu sehen ist, und hält ausserhalb an.
 * - Bei „Bewegung reduzieren“ bleibt es beim Standbild.
 */
export default function TabletLoop({ name, alt, label, priority = false, pin = 'tape' }: TabletLoopProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const small = window.matchMedia?.('(max-width: 767px)').matches;
    const file = `/videos/showcase/${name}${small ? '-sm' : ''}`;

    // Laden, sobald es sich nähert …
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSrc(file);
          near.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    // … abspielen nur, solange genug davon zu sehen ist.
    const seen = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry?.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    near.observe(frame);
    seen.observe(frame);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, [name]);

  // Mit gesetzter Quelle sofort starten, falls es schon im Bild ist.
  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!src || !video || !frame) return;
    const r = frame.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) void video.play().catch(() => {});
  }, [src]);

  return (
    <figure className='relative'>
      {pin === 'tape' && (
        <span
          aria-hidden='true'
          className='absolute -top-3 left-10 z-10 h-6 w-20 -rotate-6 rounded-[2px] bg-chalk/40 ring-1 ring-black/5 backdrop-blur-[1px]'
          style={{ maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)' }}
        />
      )}
      {pin === 'magnet' && (
        <span
          aria-hidden='true'
          className='absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rounded-full ring-1 ring-black/10'
          style={{
            background: 'radial-gradient(120% 120% at 32% 28%, hsl(0 0% 100% / 0.75), hsl(22 92% 52%) 60%, hsl(22 90% 36%))',
            boxShadow: '0 3px 6px -2px hsl(222 30% 15% / 0.5)',
          }}
        />
      )}

      <div
        ref={frameRef}
        className='board-shadow relative w-full overflow-hidden bg-court'
        style={{ aspectRatio: `${VIDEO_W} / ${VIDEO_H}`, borderRadius: RADIUS }}>
        <Image
          src={`/videos/showcase/${name}.jpg`}
          alt={alt}
          width={VIDEO_W}
          height={VIDEO_H}
          sizes='(max-width: 1024px) 100vw, 50vw'
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          className='absolute inset-0 h-full w-full'
        />
        {src ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload='none'
            aria-hidden='true'
            onPlaying={() => setPlaying(true)}
            className={cn(
              'absolute inset-0 h-full w-full transition-opacity duration-300',
              playing ? 'opacity-100' : 'opacity-0',
            )}>
            {/* VP9 zuerst: kleiner, und auch in Chromium-Builds ohne H.264
                abspielbar; Safari nimmt das MP4. */}
            <source src={`${src}.webm`} type='video/webm' />
            <source src={`${src}.mp4`} type='video/mp4' />
          </video>
        ) : null}
      </div>

      {label ? (
        <figcaption className='flex items-start gap-2 px-1 pt-3 text-[13px] font-medium text-ink/70'>
          <span aria-hidden='true' className='mt-[0.3125rem] size-2 shrink-0 rounded-[3px] bg-primary' />
          <span className='min-w-0 flex-1 text-pretty'>{label}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}
