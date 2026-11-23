import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { filmPath } from '@/features/films/data/films';
import { featurePath } from '@/features/funktionen/data/features';
import type { ArticleModule } from '../../types';

type Film = Extract<ArticleModule, { kind: 'film' }>;

/**
 * Ein Schritt-Film der Produktseite mitten im Artikel: wo der Text an der
 * Stelle ankommt, an der ein Trainer fragt „und wie sieht das aus?“, zeigt
 * ihn der Film in einer halben Minute (Remotion, Repo remotion-statix,
 * `StepsFilm`).
 *
 * Server-Komponente wie jedes Modul: der eingebaute Videospieler des
 * Browsers, kein eigenes JavaScript. Geladen wird erst beim Abspielen
 * (`preload='none'`), bis dahin steht das Standbild; Telefone bekommen über
 * `media` die kleine Fassung, MP4 vor WebM (Safari zeichnete beim VP9-WebM
 * Streifen ins Bild).
 */
export default function ArticleFilm({ film, caption, feature, featureLabel }: Omit<Film, 'kind' | 'after'>) {
  const base = filmPath(film);
  return (
    <figure className='mx-auto my-10 w-full max-w-4xl'>
      <figcaption className='font-hand text-xl leading-none text-primary'>{caption}</figcaption>
      <div className='mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-court board-shadow'>
        <video
          controls
          muted
          playsInline
          preload='none'
          poster={`${base}.jpg`}
          width={1600}
          height={900}
          aria-label={caption}
          className='block aspect-video h-auto w-full'>
          <source src={`${base}-sm.mp4`} type='video/mp4' media='(max-width: 767px)' />
          <source src={`${base}.mp4`} type='video/mp4' />
          <source src={`${base}.webm`} type='video/webm' />
        </video>
      </div>
      {feature && featureLabel ? (
        <Link
          href={featurePath(feature)}
          className='mt-3 inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-primary no-underline hover:underline'>
          {featureLabel}
          <ArrowRight className='size-3.5' />
        </Link>
      ) : null}
    </figure>
  );
}
