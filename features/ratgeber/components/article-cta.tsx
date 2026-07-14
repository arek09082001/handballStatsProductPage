import { ArrowUpRight } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * Soft product CTA at the foot of every article, linking to the no-account live
 * demo. Server component with a plain anchor – no client JavaScript.
 */
export default function ArticleCta() {
  return (
    <section className='mx-auto max-w-3xl px-6 pb-12 pt-4 sm:px-8'>
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgba(255,255,255,0.18),transparent)]' />
        <div className='relative'>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Handball-Statistik ohne Zettelwirtschaft
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-6 text-white/90 sm:text-base'>
            Erfasse Tore, Würfe und Paraden live per Tap und lass Statix
            Wurfquoten, Wurfbilder und Spielertrends automatisch berechnen –
            offline in der Halle. Teste die Live-Demo ohne Account.
          </p>
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-transform duration-300 hover:scale-105'>
            Live-Demo starten
            <ArrowUpRight className='size-4' />
          </a>
        </div>
      </div>
    </section>
  );
}
