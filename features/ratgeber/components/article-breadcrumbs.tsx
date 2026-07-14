import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Breadcrumb = {
  name: string;
  path: string;
};

/**
 * Visible breadcrumb navigation. Mirrors the BreadcrumbList JSON-LD emitted by
 * ArticleSchema / PageSchema so the on-page trail and the structured data match.
 * `onDark` styles it for the dark article/hub header.
 */
export default function ArticleBreadcrumbs({
  items,
  onDark = false,
}: {
  items: Breadcrumb[];
  onDark?: boolean;
}) {
  return (
    <nav aria-label='Brotkrumen'>
      <ol className='flex flex-wrap items-center gap-x-1.5 gap-y-1'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className='flex items-center gap-1.5'>
              {isLast ? (
                <span
                  aria-current='page'
                  className={cn(
                    'text-sm font-medium',
                    onDark ? 'text-white/90' : 'text-foreground',
                  )}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className={cn(
                      'text-sm transition-colors',
                      onDark
                        ? 'text-white/70 hover:text-white'
                        : 'text-muted-foreground hover:text-primary',
                    )}>
                    {item.name}
                  </Link>
                  <ChevronRight
                    className={cn(
                      'size-3.5 shrink-0',
                      onDark ? 'text-white/40' : 'text-muted-foreground/50',
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
