import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import { featurePath } from '@/features/funktionen/data/features';

/**
 * The bridge from a guide to the app, placed where the article itself turns
 * to measuring ("Kennzahlen zur Kontrolle"). The foot CTA reaches only the
 * readers who scroll to the end; this one sits at the moment the reader asks
 * "and how do I count that?" — which is the moment the app answers.
 *
 * It names the one feature that does the counting (its page, for the reader
 * who wants to know more first) and the registration beside it. Server
 * component like every module: plain links, no client JavaScript in the body.
 */
export default function AppBridge({
  title,
  text,
  feature,
  featureLabel,
}: {
  title: string;
  text: string;
  feature: string;
  featureLabel: string;
}) {
  return (
    <aside className='my-9 rounded-2xl border border-primary/25 bg-primary/[0.06] px-6 py-5'>
      <p className='font-hand text-xl leading-none text-primary'>Mit Statix gemessen</p>
      <p className='mt-3 font-display text-lg font-bold leading-7 tracking-tight text-ink'>
        {title}
      </p>
      <p className='mt-2 text-[16px] leading-7 text-ink/75'>{text}</p>
      <div className='mt-4 flex flex-wrap items-center gap-x-5 gap-y-3'>
        <a
          href={CLUB_CONFIG.website.appUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex h-11 items-center gap-1.5 rounded-xl bg-primary px-5 font-display text-[15px] font-bold tracking-tight text-white no-underline transition-colors hover:bg-[#ea580c]'>
          Kostenlos starten
          <ArrowRight className='size-4' />
        </a>
        <Link
          href={featurePath(feature)}
          className='inline-flex items-center gap-1.5 font-display text-[15px] font-bold tracking-tight text-primary no-underline hover:text-[#ea580c]'>
          {featureLabel}
          <ArrowRight className='size-4' />
        </Link>
      </div>
    </aside>
  );
}
