'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export type Breadcrumb = {
  /** German label — what the BreadcrumbList node carries. */
  name: string;
  path: string;
  /**
   * Key under `guidePage.breadcrumb` for the visible label. Set on the two
   * fixed crumbs ahead of the article; the article's own crumb is its German
   * title and has none, because the article is German.
   */
  labelKey?: 'home' | 'guide';
};

/**
 * Visible breadcrumb navigation. Mirrors the BreadcrumbList JSON-LD emitted by
 * ArticleSchema / PageSchema, which stays German because the server renders it
 * — the visible trail speaks the reader's language wherever a crumb is chrome
 * rather than an article title. `onDark` styles it for the dark header.
 */
export default function ArticleBreadcrumbs({
  items,
  onDark = false,
}: {
  items: Breadcrumb[];
  onDark?: boolean;
}) {
  const t = useTranslations('guidePage.breadcrumb');
  const label = (item: Breadcrumb) =>
    item.labelKey ? t(item.labelKey) : item.name;

  return (
    <nav aria-label={t('label')}>
      <ol className='flex flex-wrap items-center gap-x-1.5 gap-y-1'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className='flex items-center gap-1.5'>
              {isLast ? (
                <span
                  aria-current='page'
                  className={cn(
                    'max-w-[16rem] truncate text-sm font-medium sm:max-w-none',
                    onDark ? 'text-chalk/85' : 'text-ink',
                  )}>
                  {label(item)}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className={cn(
                      'rounded-sm text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                      onDark
                        ? 'text-chalk/65 hover:text-chalk'
                        : 'text-ink/60 hover:text-primary',
                    )}>
                    {label(item)}
                  </Link>
                  <ChevronRight
                    className={cn(
                      'size-3.5 shrink-0',
                      onDark ? 'text-chalk/40' : 'text-ink/40',
                    )}
                  />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
