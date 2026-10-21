'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Wo die vier Akte des Films beginnen und enden, in Sekunden. Gespiegelt aus
 * `src/compositions/showcase/ai-film-timeline.ts` im Repo remotion-statix
 * (`ACTS`, 30 Bilder pro Sekunde) — wer dort einen Akt verschiebt, verschiebt
 * ihn hier mit, sonst springt die Kapitelleiste an die falsche Stelle.
 */
const CHAPTER_BOUNDS: readonly [number, number][] = [
  [0, 150 / 30],
  [150 / 30, 400 / 30],
  [400 / 30, 700 / 30],
  [700 / 30, 960 / 30],
];

const VIDEO_W = 1600;
const VIDEO_H = 900;

interface Chapter {
  label: string;
  text: string;
}

interface AiFilmProps {
  chapters: Chapter[];
  alt: string;
  chaptersLabel: string;
  playLabel: string;
  pauseLabel: string;
}

/**
 * Der Film der KI-Section: ein in Remotion gerendertes Video (Repo
 * remotion-statix, `AiFilm`), darunter die Kapitelleiste. Sie läuft mit — der
 * Balken des laufenden Akts füllt sich — und springt beim Antippen an den
 * Anfang des Kapitels. So wird aus einem Hintergrundvideo eine Geschichte, die
 * man auch lesen kann, wenn man nicht hinschaut.
 *
 * Geladen wird wie bei `TabletLoop`: erst das Standbild (die Antwort, nicht
 * das leere erste Bild), das Video kurz vor dem Hineinscrollen, auf Telefonen
 * die kleine Fassung; abgespielt nur, solange es zu sehen ist. Bei „Bewegung
 * reduzieren“ bleibt es beim Standbild, und die Kapitel stehen als Text da.
 * Weil der Film länger als fünf Sekunden läuft, hat er einen Pause-Knopf
 * (WCAG 2.2.2).
 */
export default function AiFilm({ chapters, alt, chaptersLabel, playLabel, pauseLabel }: AiFilmProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [time, setTime] = useState(0);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    const small = window.matchMedia?.('(max-width: 767px)').matches;
    const file = `/videos/showcase/ki-analyse${small ? '-sm' : ''}`;

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSrc(file);
          near.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    const seen = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry?.isIntersecting && !userPausedRef.current) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 },
    );
    near.observe(frame);
    seen.observe(frame);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  // Sofort starten, falls die Bühne beim Setzen der Quelle schon zu sehen ist
  useEffect(() => {
    const video = videoRef.current;
    const frame = frameRef.current;
    if (!src || !video || !frame) return;
    const r = frame.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4) void video.play().catch(() => {});
  }, [src]);

  // Die Leiste folgt dem Bild flüssig (timeupdate kommt nur ~4× pro Sekunde)
  useEffect(() => {
    if (!playing) return;
    let id = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video) setTime(video.currentTime);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      setUserPaused(false);
      void video.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      setUserPaused(true);
      video.pause();
    }
  }, []);

  const jump = useCallback((index: number) => {
    const video = videoRef.current;
    const bounds = CHAPTER_BOUNDS[index];
    if (!video || !bounds) return;
    video.currentTime = bounds[0] + 0.05;
    setTime(bounds[0]);
    userPausedRef.current = false;
    setUserPaused(false);
    void video.play().catch(() => {});
  }, []);

  const current = CHAPTER_BOUNDS.findIndex(([a, b]) => time >= a && time < b);
  const live = Boolean(src) && !reduced;

  return (
    <div>
      <div
        ref={frameRef}
        className='board-shadow-court relative w-full overflow-hidden rounded-2xl border border-chalk/12 bg-court'
        style={{ aspectRatio: `${VIDEO_W} / ${VIDEO_H}` }}>
        <Image
          src='/videos/showcase/ki-analyse.jpg'
          alt={alt}
          width={VIDEO_W}
          height={VIDEO_H}
          sizes='(max-width: 1200px) 100vw, 1150px'
          className='absolute inset-0 h-full w-full object-cover'
        />
        {live ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload='none'
            aria-hidden='true'
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
              playing || time > 0 ? 'opacity-100' : 'opacity-0',
            )}>
            <source src={`${src}.webm`} type='video/webm' />
            <source src={`${src}.mp4`} type='video/mp4' />
          </video>
        ) : null}
        {live ? (
          <button
            type='button'
            onClick={toggle}
            aria-label={userPaused || !playing ? playLabel : pauseLabel}
            className='absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full border border-chalk/20 bg-court/80 text-chalk shadow-[0_6px_14px_-6px_hsl(199_50%_7%/0.8)] transition-colors hover:bg-court focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:bottom-4 sm:right-4 sm:size-11'>
            {userPaused || !playing ? <Play className='size-4' /> : <Pause className='size-4' />}
          </button>
        ) : null}
      </div>

      <ol aria-label={chaptersLabel} className='mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4'>
        {chapters.map((chapter, index) => {
          const [a, b] = CHAPTER_BOUNDS[index] ?? [0, 1];
          const fill = !live ? 0 : time >= b ? 1 : time <= a ? 0 : (time - a) / (b - a);
          const active = live && index === current;
          const body = (
            <>
              <span aria-hidden='true' className='relative block h-[3px] w-full overflow-hidden rounded-full bg-chalk/15'>
                <span
                  className={cn('absolute inset-y-0 left-0 rounded-full', active ? 'bg-primary' : 'bg-chalk/45')}
                  style={{ width: `${(index < current ? 1 : index === current ? fill : 0) * 100}%` }}
                />
              </span>
              <span className='mt-3 flex items-baseline gap-2'>
                <span className={cn('font-display text-[15px] font-extrabold tracking-[-0.01em] transition-colors', active ? 'text-primary' : 'text-chalk')}>
                  {chapter.label}
                </span>
              </span>
              <span className={cn('mt-1 block text-[15px] leading-6 transition-colors', active ? 'text-chalk/90' : 'text-chalk/60')}>
                {chapter.text}
              </span>
            </>
          );
          return (
            <li key={chapter.label}>
              {live ? (
                <button
                  type='button'
                  onClick={() => jump(index)}
                  aria-current={active ? 'step' : undefined}
                  className='group block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-court'>
                  {body}
                </button>
              ) : (
                <div className='block'>{body}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
