'use client';

import { useEffect, useRef } from 'react';
import {
  Activity,
  BarChart3,
  BookUser,
  ClipboardList,
  Crosshair,
  FileDown,
  FileText,
  Gauge,
  Hand,
  Inbox,
  Languages,
  LayoutDashboard,
  MonitorSmartphone,
  MousePointerClick,
  Medal,
  PenLine,
  PieChart,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  UserPlus,
  UserSearch,
  Users,
  Wand2,
  WifiOff,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { gsap } from '@/lib/gsap-config';
import { useTranslations } from 'next-intl';

interface FeatureItem {
  name: string;
  description: string;
  isNew: boolean;
}

interface FeatureGroup {
  title: string;
  items: FeatureItem[];
}

/** Icons per group headline, in the order of `allFeatures.groups`. */
const GROUP_ICONS: LucideIcon[] = [Zap, BarChart3, Sparkles, Users];

/** Icons per feature card, matched by index to the translated group items. */
const ITEM_ICONS: LucideIcon[][] = [
  // Track live
  [MousePointerClick, Zap, Crosshair, Timer, Wand2, PenLine, WifiOff, MonitorSmartphone],
  // Analyse & understand
  [BarChart3, Target, Hand, Wind, Gauge, Swords, TrendingUp, LayoutDashboard],
  // AI analysis
  [FileText, Users, UserSearch, Trophy, PieChart, Activity, RefreshCw, ShieldCheck],
  // Team & organisation
  [Radio, Inbox, UserPlus, ClipboardList, BookUser, Medal, FileDown, Languages],
];

export default function FeatureGridSection() {
  const t = useTranslations('productPage.allFeatures');
  const groups = t.raw('groups') as FeatureGroup[];

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-feature-group]').forEach((group) => {
        gsap.fromTo(
          group.querySelectorAll('[data-feature-card]'),
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id='all-features'
      ref={sectionRef}
      className='w-full scroll-mt-24 bg-background py-24 md:py-32'>
      <div className='mx-auto w-full max-w-7xl px-6 sm:px-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mt-5 text-base leading-7 text-muted-foreground'>
            {t('description')}
          </p>
        </div>

        <div className='mt-20 space-y-20'>
          {groups.map((group, groupIndex) => {
            const GroupIcon = GROUP_ICONS[groupIndex % GROUP_ICONS.length];
            const itemIcons = ITEM_ICONS[groupIndex % ITEM_ICONS.length];

            return (
              <div key={group.title} data-feature-group>
                <div className='flex items-center gap-3'>
                  <GroupIcon className='size-5 text-primary' />
                  <h3 className='text-xl font-bold tracking-tight text-foreground'>
                    {group.title}
                  </h3>
                </div>

                <div className='mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4'>
                  {group.items.map((item, itemIndex) => {
                    const ItemIcon = itemIcons[itemIndex % itemIcons.length];

                    return (
                      <div
                        key={item.name}
                        data-feature-card
                        className='flex items-start gap-3.5'>
                        <ItemIcon className='mt-0.5 size-[18px] shrink-0 text-primary' />
                        <div className='min-w-0'>
                          <p className='text-sm font-bold leading-snug text-foreground'>
                            {item.name}
                            {item.isNew && (
                              <span className='ml-2 inline-block align-middle rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary'>
                                {t('newBadge')}
                              </span>
                            )}
                          </p>
                          <p className='mt-1.5 text-sm leading-6 text-muted-foreground'>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
