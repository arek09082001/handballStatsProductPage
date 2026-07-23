import {
  Brain,
  PlayCircle,
  Target,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BRAND_HIGHLIGHTS } from '../data/brand-content';
import AppScreenshot from '@/features/landing-page/components/app-screenshot';
import Reveal from './reveal';

/** Icon per highlight, keyed by the `icon` field in {@link BRAND_HIGHLIGHTS}. */
const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  record: PlayCircle,
  stats: TrendingUp,
  shots: Target,
  ai: Brain,
};

/**
 * The core "show, don't tell" section of the brand page: alternating rows that
 * pair a real in-app screenshot with a short pitch, mirroring the landing-page
 * showcase so the two pages feel like one product.
 * @returns A JSX element rendering the alternating screenshot/copy highlight rows and a demo CTA.
 */
export default function BrandHighlights() {
  return (
    <section className='w-full bg-muted/30 py-20 md:py-28'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <Reveal className='mx-auto max-w-3xl text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            So sieht Statix in der Halle aus
          </h2>
          <p className='mt-4 text-base leading-7 text-muted-foreground'>
            Vom ersten Tap an der Bank bis zur fertigen Analyse – ein Blick auf
            die vier Schritte, die Statix ausmachen.
          </p>
        </Reveal>

        <div className='mt-16 flex flex-col gap-16 md:gap-24'>
          {BRAND_HIGHLIGHTS.map((item, index) => {
            const Icon = HIGHLIGHT_ICONS[item.icon] ?? PlayCircle;
            const reversed = index % 2 === 1;

            return (
              <Reveal
                key={item.title}
                className='grid items-center gap-8 lg:grid-cols-2 lg:gap-14'>
                <div className={reversed ? 'lg:order-2' : ''}>
                  <p className='flex items-center gap-3 text-sm font-semibold tabular-nums text-primary'>
                    {String(index + 1).padStart(2, '0')}
                    <span aria-hidden className='h-px w-10 bg-primary/40' />
                    <span className='inline-flex items-center gap-2 font-medium text-muted-foreground'>
                      <Icon className='size-4' />
                      {item.badge}
                    </span>
                  </p>
                  <h3 className='mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
                    {item.title}
                  </h3>
                  <p className='mt-4 text-base leading-7 text-muted-foreground'>
                    {item.description}
                  </p>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <AppScreenshot
                    src={item.src}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    label={item.badge}
                  />
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className='mt-16 text-center'>
          <a
            href={CLUB_CONFIG.website.demoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10'>
            Statix live in der Demo ausprobieren
            <ArrowUpRight className='size-4' />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
