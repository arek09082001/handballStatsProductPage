import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

/**
 * Wrap markdown tables so they scroll horizontally on narrow screens instead of
 * pushing the page wider than the viewport.
 */
const markdownComponents: Components = {
  table: ({ children }) => (
    <div className='overflow-x-auto'>
      <table className='w-full'>{children}</table>
    </div>
  ),
};

/**
 * Renders the German markdown article body. Server component (no 'use client'):
 * markdown is parsed at build time, so the body ships zero client JavaScript.
 * `remark-breaks` turns single newlines into <br>, so article bodies are
 * authored with each paragraph on a single line.
 */
export default function ArticleBody({ body }: { body: string }) {
  return (
    <div className='article-prose prose mx-auto max-w-3xl px-6 py-12 sm:px-8 md:py-16'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={markdownComponents}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
