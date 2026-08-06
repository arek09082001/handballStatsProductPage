import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Grain } from '@/features/landing-page/components/tactic';

const markdownComponents: Components = {
  /**
   * Wrap markdown tables so they scroll horizontally on narrow screens instead
   * of pushing the page wider than the viewport.
   */
  table: ({ children }) => (
    <div className='overflow-x-auto'>
      <table className='w-full'>{children}</table>
    </div>
  ),
  /**
   * In-body links: site-internal targets route through `next/link` so the
   * crawlable `<a href>` also gets client-side navigation, external ones open in
   * a new tab. Anything else (mailto:, #anchors) renders untouched.
   */
  a: ({ href, children, ...rest }) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }

    if (href?.startsWith('http')) {
      return (
        <a href={href} target='_blank' rel='noopener noreferrer' {...rest}>
          {children}
        </a>
      );
    }

    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
};

/**
 * Renders the German markdown article body. Server component (no 'use client'):
 * markdown is parsed at build time, so the body ships zero client JavaScript.
 * `remark-breaks` turns single newlines into <br>, so article bodies are
 * authored with each paragraph on a single line.
 */
export default function ArticleBody({ body }: { body: string }) {
  return (
    <div className='relative overflow-hidden bg-paper'>
      <Grain tone='paper' />
      <div className='article-prose prose relative mx-auto max-w-3xl px-6 py-14 sm:px-8 md:py-20'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={markdownComponents}>
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
