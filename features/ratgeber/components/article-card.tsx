import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { articlePath } from '../data/articles';
import type { Article } from '../types';

/**
 * Article preview card. The title link is stretched over the whole card (via
 * `after:absolute after:inset-0` on a `relative` Card) so the entire card is
 * clickable while staying a single semantic link.
 */
export default function ArticleCard({ article }: { article: Article }) {
  const href = articlePath(article.slug);

  return (
    <Card className='group relative h-full transition-shadow duration-300 hover:shadow-lg'>
      <CardHeader>
        <Badge
          variant='outline'
          className='w-fit border-primary/20 bg-primary/5 text-primary'>
          {article.category}
        </Badge>
        <CardTitle className='mt-3 text-lg leading-snug tracking-[-0.01em] text-foreground'>
          <Link
            href={href}
            className='rounded-sm after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'>
            {article.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-1 flex-col'>
        <p className='text-sm leading-6 text-muted-foreground'>{article.excerpt}</p>
        <div className='mt-4 flex items-center justify-between pt-2 text-xs text-muted-foreground'>
          <span className='inline-flex items-center gap-1.5'>
            <Clock className='size-3.5' />
            {article.readingTimeMinutes} Min.
          </span>
          <span className='inline-flex items-center gap-1 font-medium text-primary transition-transform duration-300 group-hover:translate-x-0.5'>
            Lesen
            <ArrowRight className='size-3.5' />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
