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
 * remotion-statix, `AiFilm`) mit einer Kapitelleiste im Bild. Sie läuft mit — der
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
  // Ohne laufenden Film zeigt die Leiste das erste Kapitel
  const shown = current >= 0 ? current : 0;
  const fillOf = (index: number) => {
    const [a, b] = CHAPTER_BOUNDS[index] ?? [0, 1];
    if (!live || current < 0) return 0;
    if (index < current) return 1;
    if (index > current) return 0;
    return Math.min(1, Math.max(0, (time - a) / (b - a)));
  };

  /**
   * Die Kapitel als Leiste IM Film (oben links, wo der Film nichts zeigt):
   * vier Abschnitte wie bei einer Story, darunter das laufende Kapitel. Spart
   * die Höhe einer Liste unter dem Film — die Bühne passt so auf einen
   * Laptop-Bildschirm. Jeder Abschnitt springt an den Anfang seines Kapitels.
   */
  const hud = (className: string) => (
    <div className={className}>
      <ol aria-label={chaptersLabel} className='flex gap-1.5'>
        {chapters.map((chapter, index) => (
          <li key={chapter.label} className='flex-1'>
            <button
              type='button'
              onClick={() => jump(index)}
              disabled={!live}
              aria-current={live && index === current ? 'step' : undefined}
              aria-label={chapter.label}
              className='group flex h-6 w-full items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-default'>
              <span aria-hidden='true' className='relative block h-[3px] w-full overflow-hidden rounded-full bg-chalk/20 transition-colors group-hover:bg-chalk/35'>
                <span
                  className={cn('absolute inset-y-0 left-0 rounded-full', index === current ? 'bg-primary' : 'bg-chalk/60')}
                  style={{ width: `${fillOf(index) * 100}%` }}
                />
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p aria-live='polite' className='mt-1.5'>
        <span className='font-display text-[15px] font-extrabold tracking-[-0.01em] text-primary'>
          <span className='mr-2 tabular-nums text-chalk/50'>{shown + 1}/{chapters.length}</span>
          {chapters[shown]?.label}
        </span>
        <span className='mt-0.5 block text-[13px] leading-5 text-chalk/80 sm:text-sm'>{chapters[shown]?.text}</span>
      </p>
    </div>
  );

  return (
    // Die Bühne ist höchstens so hoch, wie der Bildschirm es erlaubt (minus
    // Platz für die Navigation), und wird dafür schmaler — auf einem Laptop
    // steht der ganze Film im Bild.
    <div className='mx-auto' style={{ width: 'min(100%, calc((100svh - 8.5rem) * 16 / 9))' }}>
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
            {/* MP4 zuerst: Safari zeichnete beim VP9-WebM grüne Streifen an
                den Kachelgrenzen oben ins Bild. Chromium-Builds ohne H.264
                nehmen das WebM. */}
            <source src={`${src}.mp4`} type='video/mp4' />
            <source src={`${src}.webm`} type='video/webm' />
          </video>
        ) : null}
        {live
          ? hud(
              'absolute left-3 top-3 hidden w-[min(22rem,38%)] rounded-xl border border-chalk/12 bg-court-2/95 px-3.5 pb-3 pt-1.5 shadow-[0_10px_24px_-14px_hsl(199_50%_5%/0.9)] sm:left-4 sm:top-4 sm:block',
            )
          : null}
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

      {/* Auf dem Telefon wäre die Leiste im Film zu klein: dort steht sie
          knapp darunter. Ohne Film (Bewegung reduzieren) die ganze
          Geschichte als Text. */}
      {live ? hud('mt-3 sm:hidden') : null}
      {!live ? (
        <ol aria-label={chaptersLabel} className='mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4'>
          {chapters.map((chapter, index) => (
            <li key={chapter.label}>
              <span className='font-display text-[15px] font-extrabold tracking-[-0.01em] text-chalk'>
                <span className='mr-2 tabular-nums text-chalk/50'>{index + 1}</span>
                {chapter.label}
              </span>
              <span className='mt-1 block text-[15px] leading-6 text-chalk/65'>{chapter.text}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
