// next.config.ts  (or .mjs; whatever your project uses)

import { readFile } from 'fs/promises';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const pkg = JSON.parse(
  await readFile(new URL('./package.json', import.meta.url), 'utf8'),
);

const baseConfig = {
  // ⚠️ these *must* live here, before the plugin wraps it:
  typedRoutes: false, // moved from experimental in Next.js 16

  // Enable use cache directive for Next.js 16
  experimental: {
    useCache: true,
  },
  typescript: {
    ignoreBuildErrors: true, // skip *all* TS errors at build time
  },
  images: {
    // Use only WebP format to reduce transformations by 50%
    // AVIF is slower and provides minimal benefit for most images
    formats: ['image/webp'],
    // Reduced device sizes - only common breakpoints
    // Fewer sizes = fewer transformations and cache entries
    deviceSizes: [640, 768, 1024, 1280, 1920],
    // Reduced image sizes for smaller elements
    imageSizes: [16, 32, 48, 64, 96, 128],
    // Extended cache to 31 days (max recommended)
    // Reduces cache writes and transformations
    minimumCacheTTL: 60 * 60 * 24 * 31, // 31 days
    // Quality settings to reduce file sizes
    // Lower quality = smaller files = less bandwidth
    // Default is 75, which is good for most images
    // Can be overridden per-image with quality prop
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },

  // — your existing settings —
  allowedDevOrigins: ['http://192.168.56.1:3000'],
  env: {
    APP_VERSION: pkg.version,
  },
  output: 'standalone',

  // 301 Redirects for route germanization
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'webdesign-weiss.de' }],
        destination: 'https://www.webdesign-weiss.de/:path*',
        permanent: true,
      },
      {
        source: '/teams/:path*',
        destination: '/mannschaften/:path*',
        permanent: true,
      },
      {
        source: '/news/:path*',
        destination: '/neuigkeiten/:path*',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/kontakt',
        permanent: true,
      },
      {
        source: '/sponsoring',
        destination: '/sponsoren',
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(baseConfig);
