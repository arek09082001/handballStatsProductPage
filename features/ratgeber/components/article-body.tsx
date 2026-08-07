import Link from 'next/link';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Grain } from '@/features/landing-page/components/tactic';
import ArticleModuleBlock from './modules';
import type { ArticleModule } from '../types';

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

/** A markdown chunk plus the H2 heading it belongs to (null for the lede). */
interface BodySection {
  heading: string | null;
  markdown: string;
}

/**
 * Splits the body at its `##` headings so modules can be placed between the
 * sections. The heading line stays with its own chunk, so markdown still
 * renders the H2 and `.article-prose` still draws its marker swipe under it.
 */
function splitByH2(body: string): BodySection[] {
  const sections: BodySection[] = [];
  let heading: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const markdown = buffer.join('\n').trim();
    if (markdown) sections.push({ heading, markdown });
    buffer = [];
  };

  for (const line of body.split('\n')) {
    if (line.startsWith('## ')) {
      flush();
      heading = line.slice(3).trim();
    }
    buffer.push(line);
  }
  flush();

  return sections;
}

/**
 * Renders the German markdown article body together with its structured
 * modules. Server component (no 'use client'): markdown is parsed at build
 * time and every module is a server component too, so the body ships zero
 * client JavaScript.
 *
 * `remark-breaks` turns single newlines into <br>, so article bodies are
 * authored with each paragraph on a single line. Modules are anchored to an H2
 * via `after` and render below that section; a module without `after` renders
 * above the lede, which is where an answer box belongs.
 */
export default function ArticleBody({
  body,
  modules = [],
}: {
  body: string;
  modules?: ArticleModule[];
}) {
  const sections = splitByH2(body);
  const leading = modules.filter((module) => !module.after);
  const modulesFor = (heading: string | null) =>
    heading === null ? [] : modules.filter((module) => module.after === heading);

  return (
    <div className='relative overflow-hidden bg-paper'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-3xl px-6 py-14 sm:px-8 md:py-20'>
        {leading.map((module, index) => (
          <ArticleModuleBlock key={`lead-${index}`} module={module} />
        ))}

        {sections.map((section, index) => (
          <div key={section.heading ?? `lede-${index}`}>
            {/* `max-w-none` keeps the reading measure at the column width the
                outer container sets, exactly as before the split — otherwise
                `prose` would clamp each chunk to its own 65ch. */}
            <div className='article-prose prose max-w-none'>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={markdownComponents}>
                {section.markdown}
              </ReactMarkdown>
            </div>
            {modulesFor(section.heading).map((module, moduleIndex) => (
              <ArticleModuleBlock key={`${section.heading}-${moduleIndex}`} module={module} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
