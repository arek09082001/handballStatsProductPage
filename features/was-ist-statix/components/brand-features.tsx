import {
  Activity,
  BarChart3,
  Brain,
  CalendarClock,
  ClipboardList,
  Layers,
  Radio,
  Swords,
  Target,
  Trophy,
  Users,
  WifiOff,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { APP_FEATURES } from '@/lib/seo';
import Reveal from './reveal';

/**
 * Icon per feature slug from {@link APP_FEATURES}. Falls back to a neutral icon
 * so a newly added feature never renders without one.
 */
const FEATURE_ICONS: Record<string, LucideIcon> = {
  'live-tracking': Zap,
  'player-stats': BarChart3,
  'shot-maps': Target,
  'team-management': Users,
  'ai-analysis': Brain,
  'live-ticker': Radio,
  tournaments: Trophy,
  'coach-collaboration': Swords,
  'player-surveys': ClipboardList,
  'opponent-records': Activity,
  'card-album': Layers,
  'offline-pwa': WifiOff,
};

/**
 * Feature index generated from the same `APP_FEATURES` list that feeds the
 * SoftwareApplication schema and llms.txt, so this page never drifts from the
 * actual feature set. Each feature carries an icon so the grid scans visually
 * instead of reading like a plain text list.
 * @returns A JSX element rendering the full Statix feature grid with per-feature icons.
 */
export default function BrandFeatures() {
  return (
    <section className='w-full bg-background'>
      <div className='mx-auto max-w-6xl px-6 py-16 sm:px-8 md:py-24'>
        <Reveal className='mx-auto max-w-3xl text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-foreground sm:text-3xl'>
            Was kann Statix?
          </h2>
          <p className='mt-4 text-base leading-8 text-muted-foreground'>
            Alle Funktionen der Statix App auf einen Blick – von der
            Live-Erfassung bis zur KI-Analyse.
          </p>
        </Reveal>

        <div className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {APP_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[feature.slug] ?? CalendarClock;

            return (
              <Reveal
                key={feature.slug}
                delay={(index % 3) * 0.05}
                className='group h-full rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40'>
                <span className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15'>
                  <Icon className='size-5' />
                </span>
                <h3 className='mt-4 text-sm font-semibold text-foreground'>
                  {feature.name}
                </h3>
                <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                  {feature.description}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
