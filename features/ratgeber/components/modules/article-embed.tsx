import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ArticleModule } from '../../types';

type Embed = Extract<ArticleModule, { kind: 'embed' }>;

/**
 * One of the site's own noindex tool routes, running inside the article — so a
 * coach can do the calculation in the paragraph that explains it instead of
 * leaving the page.
 *
 * The heights are the measured ones from the tools' own embed snippets, not
 * guesses (760 px for the calculator; the board stacks to ~1960 px and falls to
 * ~1450 px once it has 1024 px of width). They are fixed in CSS, so the frame
 * reserves its space before load and nothing shifts.
 */
const EMBEDS: Record<
  Embed['target'],
  { src: string; page: string; title: string; pageLabel: string; frame: string; column: string }
> = {
  'wurfquote-rechner': {
    src: '/wurfquote-rechner/embed',
    page: '/wurfquote-rechner',
    title: 'Wurfquoten-Rechner',
    pageLabel: 'Rechner auf eigener Seite öffnen',
    frame: 'h-[760px]',
    column: 'max-w-3xl',
  },
  'handball-taktikboard': {
    src: '/handball-taktikboard/embed',
    page: '/handball-taktikboard',
    title: 'Handball-Taktikboard',
    pageLabel: 'Taktikboard auf eigener Seite öffnen',
    frame: 'h-[1960px] lg:h-[1450px]',
    column: 'max-w-5xl',
  },
};

export default function ArticleEmbed({ target, caption }: Omit<Embed, 'kind' | 'after'>) {
  const embed = EMBEDS[target];

  return (
    <figure className={`mx-auto my-10 w-full ${embed.column}`}>
      <figcaption className='font-hand text-xl leading-none text-primary'>{caption}</figcaption>
      <div className='mt-3 overflow-hidden rounded-2xl border border-ink/10 bg-paper board-shadow'>
        <iframe
          src={embed.src}
          title={embed.title}
          loading='lazy'
          className={`block w-full border-0 ${embed.frame}`}
        />
      </div>
      <Link
        href={embed.page}
        className='mt-3 inline-flex items-center gap-1.5 font-display text-[13px] font-bold text-primary hover:underline'>
        {embed.pageLabel}
        <ArrowUpRight className='size-3.5' />
      </Link>
    </figure>
  );
}
