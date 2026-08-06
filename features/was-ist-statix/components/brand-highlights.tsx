import { ArrowUpRight } from 'lucide-react';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BRAND_HIGHLIGHTS } from '../data/brand-content';
import {
  BoardScreenshot,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import Reveal from './reveal';

/**
 * The core "show, don't tell" section of the brand page: alternating rows that
 * pair a real in-app screenshot pinned to the board with a short pitch,
 * mirroring the landing-page showcase so the two pages read as one product.
 * @returns A JSX element rendering the alternating screenshot/copy highlight rows and a demo CTA.
 */
export default function BrandHighlights() {
  return (
    <section className='relative w-full overflow-hidden bg-paper-2 py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <Reveal>
          <SectionHeading
            kicker='Show, don’t tell'
            title='So sieht Statix in der Halle aus'
            description='Vom ersten Tap an der Bank bis zur fertigen Analyse – die vier Schritte, die Statix ausmachen.'
            tone='paper'
          />
        </Reveal>

        <div className='mt-16 flex flex-col gap-16 md:mt-20 md:gap-24'>
          {BRAND_HIGHLIGHTS.map((item, index) => {
            const reversed = index % 2 === 1;

            return (
              <Reveal
                key={item.title}
                className='grid items-center gap-8 lg:grid-cols-2 lg:gap-14'>
                <div className={reversed ? 'lg:order-2' : ''}>
                  <div className='flex items-baseline gap-3'>
                    <span className='font-display text-5xl font-extrabold leading-none tracking-tighter text-primary/25 tabular-nums'>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[13px] font-semibold text-primary'>
                      <span aria-hidden className='size-1.5 rounded-[3px] bg-primary' />
                      {item.badge}
                    </span>
                  </div>
                  <h3 className='mt-4 font-display text-2xl font-extrabold tracking-[-0.02em] text-ink sm:text-[1.75rem]'>
                    {item.title}
                  </h3>
                  <p className='mt-3.5 max-w-[52ch] text-base leading-7 text-ink/70'>
                    {item.description}
                  </p>
                </div>

                <div className={reversed ? 'lg:order-1' : ''}>
                  <BoardScreenshot
                    src={item.src}
                    alt={item.title}
                    width={item.width}
                    height={item.height}
                    label={item.badge}
                    tone='paper'
                    pin={reversed ? 'magnet' : 'tape'}
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
            className='inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-paper px-6 py-3.5 font-display text-sm font-bold text-ink transition-colors hover:border-primary hover:text-primary'>
            Statix live in der Demo ausprobieren
            <ArrowUpRight className='size-4' />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
