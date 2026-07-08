import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: AI_CRAWLERS,
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    host: SITE_URL,
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
