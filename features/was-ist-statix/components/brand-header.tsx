import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * Dark hero for the brand page. Server component – the H1 carries the primary
 * brand query ("Was ist Statix?") and the intro answers it in one paragraph so
 * search and answer engines can lift it as a direct answer.
 */
export default function BrandHeader() {
  return (
    <section className='relative isolate w-full overflow-hidden border-b border-border/50 bg-slate-950 pb-12 pt-6 text-white md:py-12'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_0%,rgba(59,130,246,0.25),transparent),radial-gradient(ellipse_40%_35%_at_92%_100%,rgba(16,185,129,0.16),transparent)]' />

      <div className='relative mx-auto max-w-7xl px-6 py-10 text-center sm:px-10 sm:py-16 md:py-20 md:text-left'>
        <div className='mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 md:mx-0'>
          <Sparkles className='h-4 w-4' />
          Statix im Überblick
        </div>

        <h1 className='mx-auto mt-6 max-w-3xl text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:mx-0 lg:text-5xl'>
          Was ist Statix?
        </h1>

        <p className='mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg md:mx-0'>
          Statix ist die Handball-Statistik-App für Trainer, Vereine und Teams:
          Spiele live per Tap erfassen – Tore, Würfe, Paraden, Strafen und
          Wechsel – und Wurfquoten, Wurfbilder, Spielerwerte und KI-Analysen
          automatisch auswerten. Entwickelt in Deutschland, direkt im Browser,
          offline-fähig in der Halle.
        </p>

        <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:justify-start'>
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-transform duration-300 hover:scale-105'>
            Live-Demo ohne Account starten
            <ArrowUpRight className='size-4' />
          </a>
          <Link
            href='/'
            className='inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/20'>
            Alle Funktionen ansehen
          </Link>
          <div className='inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/90'>
            <MapPin className='h-4 w-4 text-emerald-300' />
            Made in Germany
          </div>
        </div>
      </div>
    </section>
  );
}
