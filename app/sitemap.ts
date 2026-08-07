import { MetadataRoute } from 'next';
import { SITE_URL, absoluteUrl } from '@/lib/seo';
import {
  articlePath,
  getAllArticles,
  RATGEBER_BASE_PATH,
} from '@/features/ratgeber/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/preise`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/wurfquote-rechner`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/handball-taktikboard`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/handball-statistik-app-kostenlos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/handball-statistik-excel-vorlage`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/erfahrungen`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/fuer-vereine`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/fuer-jugendtrainer`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/was-ist-statix`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kontakt`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/impressum`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/agb`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Ratgeber hub + every article, generated from the article data module so new
  // articles appear in the sitemap automatically.
  const ratgeberHub: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(RATGEBER_BASE_PATH),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((article) => ({
    url: absoluteUrl(articlePath(article.slug)),
    lastModified: new Date(article.dateModified),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...ratgeberHub, ...articlePages];
}

// Revalidate sitemap every hour
export const revalidate = 3600;
