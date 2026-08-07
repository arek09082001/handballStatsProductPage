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

  // SEO/security: don't advertise the framework via the X-Powered-By header
  poweredByHeader: false,

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

  /**
   * Ratgeber-Zusammenlegung 2026: 24 Artikel sind in umfassendere Ziele
   * aufgegangen oder wurden ersatzlos entfernt. Ihre Inhalte stehen jeweils im
   * Ziel, deshalb sind alle Weiterleitungen dauerhaft (301).
   *
   * Interne Links im Ratgeber zeigen bereits direkt auf die Ziele – diese
   * Regeln fangen nur externe Links und den Index ab.
   *
   * `/ratgeber/handball-spielfeld-masse` bleibt unverändert bestehen und ist
   * hier bewusst nicht enthalten.
   */
  async redirects() {
    const merged = {
      // Wurftraining planen
      'handball-wurfarten': 'handball-wurftraining-sprungwurf',
      'handball-schlagwurf-technik': 'handball-wurftraining-sprungwurf',
      'handball-stemmschritt-dreierrhythmus': 'handball-wurftraining-sprungwurf',
      // Athletik & Kondition planen
      'handball-krafttraining': 'handball-athletiktraining',
      'handball-sprungkraft-verbessern': 'handball-athletiktraining',
      'handball-schnelligkeit-verbessern': 'handball-athletiktraining',
      'handball-beweglichkeit-dehnen': 'handball-athletiktraining',
      'handball-kondition-verbessern': 'handball-athletiktraining',
      // Belastungssteuerung rund um den Spieltag
      'handball-regeneration': 'handball-belastungssteuerung',
      'handball-verletzungen-vorbeugen': 'handball-belastungssteuerung',
      'handball-ernaehrung': 'handball-belastungssteuerung',
      // Torwarttraining
      'handball-torwart-tipps': 'handball-torwarttraining',
      'handball-siebenmeter-halten': 'handball-torwarttraining',
      // Zweikampf trainieren
      'handball-finte-lernen': 'handball-1-gegen-1-verbessern',
      'handball-abwehr-1-gegen-1': 'handball-1-gegen-1-verbessern',
      // Positionen & Anforderungsprofile
      'handball-aussenspieler-tipps': 'handball-positionen-erklaert',
      'handball-spielmacher-werden': 'handball-positionen-erklaert',
      'handball-welche-position-passt-zu-mir': 'handball-positionen-erklaert',
      // ersatzlos entfernt, Inhalte im jeweiligen Ziel
      'handball-quereinsteiger-erwachsene': 'handball-regeln-einfach-erklaert',
      'handball-alleine-trainieren': 'handball-training-planen',
      'handball-kempa-trick': 'handball-angriffssysteme-einsteiger',
      'handball-freilaufen-ohne-ball': 'handball-angriffssysteme-einsteiger',
      'handball-nervositaet-vor-spielen': 'handball-mentaltraining',
      'handball-harz-tipps': 'handball-ausruestung-einsteiger',
    };

    return Object.entries(merged).map(([from, to]) => ({
      source: `/ratgeber/${from}`,
      destination: `/ratgeber/${to}`,
      permanent: true,
    }));
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
