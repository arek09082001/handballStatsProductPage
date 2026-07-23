import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CLUB_CONFIG } from '@/lib/club-config';
import AppScreenshot from '@/features/landing-page/components/app-screenshot';

/**
 * Dark, two-column hero for the brand page. The H1 carries the primary brand
 * query ("Was ist Statix?") and the intro answers it in one paragraph so
 * search and answer engines can lift it as a direct answer, while a real
 * in-app screenshot on the right immediately shows what Statix is.
 * @returns A JSX element rendering the brand-page hero with copy, CTAs and a product screenshot.
 */
export default function BrandHeader() {
  return (
    <section className='relative isolate w-full overflow-hidden border-b border-border/50 bg-slate-950 pb-16 pt-6 text-white md:py-16'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_12%_0%,rgba(59,130,246,0.25),transparent),radial-gradient(ellipse_40%_35%_at_92%_100%,rgba(16,185,129,0.16),transparent)]' />

      <div className='relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-10 sm:px-10 sm:py-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-20'>
        <div className='text-center md:text-left'>
          <div className='mx-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/85 md:mx-0'>
            <Sparkles className='h-4 w-4' />
            Statix im Überblick
          </div>

          <h1 className='mt-6 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl'>
            Was ist Statix?
          </h1>

          <p className='mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg md:mx-0'>
            Statix ist die Handball-Statistik-App für Trainer, Vereine und
            Teams: Spiele live per Tap erfassen – Tore, Würfe, Paraden, Strafen
            und Wechsel – und Wurfquoten, Wurfbilder, Spielerwerte und
            KI-Analysen automatisch auswerten. Entwickelt in Deutschland, direkt
            im Browser, offline-fähig in der Halle.
          </p>

          <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start'>
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

        <div className='relative'>
          <div className='pointer-events-none absolute -inset-8 rounded-[40px] bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.28),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(37,99,235,0.28),transparent_55%)] blur-2xl' />
          <AppScreenshot
            src='/recordStatsInGame.png'
            alt='Statix Handball-App: Spielstatistiken live per Tap erfassen'
            width={1916}
            height={879}
            label='Statix – Live-Erfassung im Spiel'
            priority
            sizes='(max-width: 1024px) 100vw, 52vw'
            className='relative'
          />
        </div>
      </div>
    </section>
  );
}
