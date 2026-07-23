import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * Closing CTA. Server component with plain anchors – links to the no-account
 * live demo plus the two strongest internal targets (home, Ratgeber).
 */
export default function BrandCta() {
  return (
    <section className='mx-auto w-full max-w-3xl px-6 pb-16 pt-4 sm:px-8'>
      <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] px-6 py-8 text-white shadow-lg sm:px-10 sm:py-10'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgba(255,255,255,0.18),transparent)]' />
        <div className='relative'>
          <h2 className='text-xl font-bold tracking-tight sm:text-2xl'>
            Statix selbst ausprobieren
          </h2>
          <p className='mt-2 max-w-xl text-sm leading-6 text-white/90 sm:text-base'>
            Die Live-Demo ist eine voll ausgestattete Version von Statix mit
            echten Spieldaten – direkt im Browser, ohne Account und ohne
            Installation.
          </p>
          <div className='mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center'>
            <a
              href={CLUB_CONFIG.website.demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-transform duration-300 hover:scale-105'>
              Live-Demo starten
              <ArrowUpRight className='size-4' />
            </a>
            <Link
              href='/ratgeber'
              className='inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/20'>
              Zum Handball-Ratgeber
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
