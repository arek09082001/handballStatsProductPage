import { SITE_URL, absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-static';
export const revalidate = 86400;

// AI answer-engine and training crawlers. Explicitly allowed so Statix can be
// discovered, cited and recommended by ChatGPT, Perplexity, Gemini, Claude and
// Copilot when trainers ask them for a handball statistics app.
const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'Google-Extended',
  'GoogleOther',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'Amazonbot',
  'meta-externalagent',
  'DuckAssistBot',
  'cohere-ai',
  'YouBot',
];

const DISALLOWED_PATHS = ['/api/', '/admin/'];

/**
 * Builds one `User-agent` block with the shared allow/disallow rules.
 * @param userAgents One or more user-agent tokens the block applies to.
 * @returns The block as plain text, without a trailing blank line.
 */
function crawlerBlock(userAgents: string[]): string {
  const agents = userAgents.map((agent) => `User-agent: ${agent}`).join('\n');
  const disallow = DISALLOWED_PATHS.map((path) => `Disallow: ${path}`).join(
    '\n',
  );

  return `${agents}\nAllow: /\n${disallow}`;
}

/**
 * Serves `/robots.txt`. Hand-written instead of Next's `MetadataRoute.Robots`
 * because that helper cannot emit the `llms.txt` pointer — the file is the
 * answer-engine brief (see `app/llms.txt/route.ts`) and crawlers only find it
 * when something points at it.
 * @returns A plain-text robots.txt response.
 */
export function GET() {
  const body = [
    crawlerBlock(['*']),
    '',
    crawlerBlock(AI_CRAWLERS),
    '',
    `Host: ${SITE_URL}`,
    `Sitemap: ${absoluteUrl('/sitemap.xml')}`,
    // Not a standard robots.txt directive, so it stays a comment: parsers
    // ignore it, humans and answer engines reading the file still see it.
    `# llms.txt: ${absoluteUrl('/llms.txt')}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control':
        'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
