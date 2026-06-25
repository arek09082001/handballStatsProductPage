#!/usr/bin/env node

/**
 * Image optimization script to convert existing images to modern formats
 * This script converts JPG/PNG images to WebP and AVIF formats
 * Run with: node scripts/optimize-images.js
 */

import { readdir, stat, mkdir, writeFile } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const OPTIMIZED_DIR = join(PUBLIC_DIR, 'optimized');

// Image optimization settings
const OPTIMIZATION_CONFIG = {
  webp: {
    quality: 85,
    effort: 4,
  },
  avif: {
    quality: 80,
    effort: 4,
  },
  jpeg: {
    quality: 85,
    progressive: true,
  },
  png: {
    compressionLevel: 8,
    quality: 85,
  },
};

// Responsive image sizes
const RESPONSIVE_SIZES = [320, 640, 750, 828, 1080, 1200, 1920];

async function ensureDirectoryExists(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function findImages(dir) {
  const images = [];

  async function traverse(currentDir) {
    const items = await readdir(currentDir);

    for (const item of items) {
      const fullPath = join(currentDir, item);
      const stats = await stat(fullPath);

      if (
        stats.isDirectory() &&
        item !== 'optimized' &&
        !item.startsWith('.')
      ) {
        await traverse(fullPath);
      } else if (stats.isFile()) {
        const ext = extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          images.push(fullPath);
        }
      }
    }
  }

  await traverse(dir);
  return images;
}

async function optimizeImage(inputPath, outputDir) {
  const filename = basename(inputPath, extname(inputPath));
  const relativePath = inputPath.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
  const subDir = join(outputDir, dirname(relativePath));

  await ensureDirectoryExists(subDir);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Generate WebP versions
    const webpPath = join(subDir, `${filename}.webp`);
    await image.webp(OPTIMIZATION_CONFIG.webp).toFile(webpPath);

    // Generate AVIF versions
    try {
      const avifPath = join(subDir, `${filename}.avif`);
      await image.avif(OPTIMIZATION_CONFIG.avif).toFile(avifPath);
    } catch (avifError) {
      console.log(`   ⚠️  AVIF generation failed: ${avifError.message}`);
    }

    // Generate responsive versions for large images
    if (metadata.width > 1200) {
      for (const size of RESPONSIVE_SIZES) {
        if (size < metadata.width) {
          if (filename.includes('..')) throw new Error('Invalid filename');
          const responsiveWebpPath = join(subDir, `${filename}-${size}w.webp`);
          await image
            .resize(size, null, { withoutEnlargement: true })
            .webp(OPTIMIZATION_CONFIG.webp)
            .toFile(responsiveWebpPath);

          try {
            if (filename.includes('..')) throw new Error('Invalid filename');
            const responsiveAvifPath = join(
              subDir,
              `${filename}-${size}w.avif`
            );
            await image
              .resize(size, null, { withoutEnlargement: true })
              .avif(OPTIMIZATION_CONFIG.avif)
              .toFile(responsiveAvifPath);
          } catch {
            // AVIF might not be supported in all environments
          }
        }
      }
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Error optimizing ${relativePath}:`, error.message);
    return false;
  }
}

async function generateImageManifest(images, outputDir) {
  const manifest = {
    generated: new Date().toISOString(),
    optimizedImages: [],
  };

  for (const imagePath of images) {
    const filename = basename(imagePath, extname(imagePath));
    const relativePath = imagePath.replace(PUBLIC_DIR, '').replace(/\\/g, '/');

    const imageInfo = {
      original: relativePath,
      webp: `/optimized${dirname(relativePath)}/${filename}.webp`,
      avif: `/optimized${dirname(relativePath)}/${filename}.avif`,
      responsive: [],
    };

    const image = sharp(imagePath);
    const metadata = await image.metadata();

    if (metadata.width > 1200) {
      for (const size of RESPONSIVE_SIZES) {
        if (size < metadata.width) {
          imageInfo.responsive.push({
            width: size,
            webp: `/optimized${dirname(
              relativePath
            )}/${filename}-${size}w.webp`,
            avif: `/optimized${dirname(
              relativePath
            )}/${filename}-${size}w.avif`,
          });
        }
      }
    }

    manifest.optimizedImages.push(imageInfo);
  }

  await writeFile(
    join(outputDir, 'image-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
}

async function main() {
  try {
    await ensureDirectoryExists(OPTIMIZED_DIR);

    const images = await findImages(PUBLIC_DIR);

    if (images.length === 0) {
      return;
    }

    for (const imagePath of images) {
      const success = await optimizeImage(imagePath, OPTIMIZED_DIR);
      if (success) {
      } else {
      }
    }

    await generateImageManifest(images, OPTIMIZED_DIR);
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

// Only run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as optimizeImages };
