/**
 * Image Optimization Script
 * Converts images to modern formats (WebP, AVIF) and generates responsive variants
 */

const sharp = require('sharp');
const path = require('path');
const { readdir, stat, mkdir, writeFile } = require('fs/promises');
const { existsSync } = require('fs');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'public'),
  outputDir: path.join(__dirname, '..', 'public', 'optimized'),
  formats: ['webp', 'avif'],
  responsiveSizes: [640, 768, 1024, 1280, 1920],
  quality: {
    webp: 80,
    avif: 60,
    jpeg: 85,
  },
  // Skip already optimized images
  skipPatterns: [/\/optimized\//, /\.webp$/, /\.avif$/],
};

// Statistics tracking
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0,
};

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  const supportedFormats = /\.(jpg|jpeg|png|gif|bmp|tiff)$/i;

  // Check if it's a supported image format
  if (!supportedFormats.test(filePath)) {
    return false;
  }

  // Check skip patterns
  return !CONFIG.skipPatterns.some((pattern) => pattern.test(filePath));
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

/**
 * Get relative path for consistent naming
 */
function getRelativePath(fullPath, basePath) {
  return path.relative(basePath, fullPath);
}

/**
 * Process single image with multiple formats and sizes
 */
async function processImage(inputPath, outputDir) {
  try {
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const relativePath = getRelativePath(
      path.dirname(inputPath),
      CONFIG.inputDir
    );
    const outputPath = path.join(outputDir, relativePath);

    await ensureDir(outputPath);

    // Get original file stats
    const inputStats = await stat(inputPath);
    stats.originalSize += inputStats.size;

    const processedImages = [];

    // Load original image
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Generate formats and sizes
    for (const format of CONFIG.formats) {
      for (const width of CONFIG.responsiveSizes) {
        // Skip if width is larger than original
        if (width > metadata.width) continue;

        const outputFileName = `${fileName}-${width}w.${format}`;
        const outputFilePath = path.join(outputPath, outputFileName);

        let processor = image.clone().resize(width, null, {
          withoutEnlargement: true,
          fastShrinkOnLoad: true,
        });

        // Apply format-specific options
        if (format === 'webp') {
          processor = processor.webp({
            quality: CONFIG.quality.webp,
            effort: 6,
          });
        } else if (format === 'avif') {
          processor = processor.avif({
            quality: CONFIG.quality.avif,
            effort: 4,
          });
        }

        await processor.toFile(outputFilePath);

        // Track output size
        const outputStats = await stat(outputFilePath);
        stats.optimizedSize += outputStats.size;

        processedImages.push({
          width,
          format,
          path: outputFilePath,
          size: outputStats.size,
        });
      }
    }

    // Generate original format optimized version
    const optimizedOriginalPath = path.join(
      validatePath(outputPath),
      `${fileName}-optimized${path.extname(inputPath)}`
    );
  
  function validatePath(pathInput) {
    if (pathInput.includes('..')) {
      throw new Error('Invalid path');
    }
    return pathInput;
  }
    let originalProcessor = image.clone();

    if (
      path.extname(inputPath).toLowerCase() === '.jpg' ||
      path.extname(inputPath).toLowerCase() === '.jpeg'
    ) {
      originalProcessor = originalProcessor.jpeg({
        quality: CONFIG.quality.jpeg,
      });
    }

    await originalProcessor.toFile(optimizedOriginalPath);

    const optimizedStats = await stat(optimizedOriginalPath);
    stats.optimizedSize += optimizedStats.size;

    processedImages.push({
      width: metadata.width,
      format: 'original',
      path: optimizedOriginalPath,
      size: optimizedStats.size,
    });

    stats.processed++;

    return {
      original: inputPath,
      optimized: processedImages,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
      },
    };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    stats.errors++;
    return null;
  }
}

/**
 * Recursively find all images in directory
 */
async function findImages(dir) {
  const images = [];

  const items = await readdir(dir);

  for (const item of items) {
    if (item.includes('..')) throw new Error('Invalid file name');
    const fullPath = path.join(dir, item);
    const itemStat = await stat(fullPath);

    if (itemStat.isDirectory()) {
      // Skip node_modules and other system directories
      if (!item.startsWith('.') && item !== 'node_modules') {
        const subImages = await findImages(fullPath);
        images.push(...subImages);
      }
    } else if (shouldProcessFile(fullPath)) {
      images.push(fullPath);
    }
  }

  return images;
}

/**
 * Generate manifest file with optimization results
 */
async function generateManifest(results, outputDir) {
  const manifest = {
    generated: new Date().toISOString(),
    stats: {
      ...stats,
      compressionRatio:
        stats.originalSize > 0
          ? 1 - stats.optimizedSize / stats.originalSize
          : 0,
    },
    images: results.filter(Boolean).map((result) => ({
      original: getRelativePath(result.original, CONFIG.inputDir),
      optimized: result.optimized.map((opt) => ({
        width: opt.width,
        format: opt.format,
        path: getRelativePath(opt.path, CONFIG.outputDir),
        size: opt.size,
      })),
      metadata: result.metadata,
    })),
  };

  const manifestPath = path.join(outputDir, 'optimization-manifest.json');
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  return manifest;
}

/**
 * Main optimization function
 */
async function optimizeImages() {
  try {
    // Ensure output directory exists
    await ensureDir(CONFIG.outputDir);

    // Find all images
    const images = await findImages(CONFIG.inputDir);

    if (images.length === 0) {
      return;
    }

    // Process images
    const results = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];

      const result = await processImage(image, CONFIG.outputDir);
      if (result) {
        results.push(result);
      }
    }

    // Generate manifest

    // Print summary
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages();
}

module.exports = { optimizeImages, CONFIG };
