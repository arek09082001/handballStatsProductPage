/**
 * Image optimization utilities for modern formats and responsive images
 */

// Common responsive breakpoints
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  large: 1536,
} as const;

// File size threshold for skipping optimization (200KB)
const OPTIMIZATION_THRESHOLD_BYTES = 200 * 1024;

// File extensions that should skip optimization
const SKIP_OPTIMIZATION_EXTENSIONS = ['.svg', '.gif'];

// Filename patterns that should skip optimization (logos, icons)
const SKIP_OPTIMIZATION_PATTERNS = [
  /logo/i,
  /icon/i,
  /badge/i,
  /avatar/i,
  /-sm\./i, // Small variants
  /-xs\./i, // Extra small variants
  /thumb/i, // Thumbnails
];

// Image quality settings for different use cases
export const IMAGE_QUALITY = {
  thumbnail: 70,
  card: 85,
  hero: 90,
  gallery: 95,
} as const;

// Modern image formats support detection
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const supportsAVIF = (): boolean => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    return false;
  }
};

// Generate responsive image URLs for Next.js Image
export const generateResponsiveImageProps = (src: string, sizes?: string) => {
  const defaultSizes =
    sizes ||
    `
    (max-width: ${RESPONSIVE_BREAKPOINTS.mobile}px) 100vw,
    (max-width: ${RESPONSIVE_BREAKPOINTS.tablet}px) 75vw,
    (max-width: ${RESPONSIVE_BREAKPOINTS.laptop}px) 50vw,
    33vw
  `;

  return {
    src,
    sizes: defaultSizes,
  };
};

// Common image configurations for different use cases
export const getImageConfig = (type: keyof typeof IMAGE_QUALITY) => ({
  quality: IMAGE_QUALITY[type],
  priority: type === 'hero',
  loading: type === 'hero' ? ('eager' as const) : ('lazy' as const),
});

// Generate srcset for responsive images
export const generateSrcSet = (baseSrc: string, widths: number[]): string => {
  return widths
    .map((width) => {
      const url = new URL(baseSrc, window.location.origin);
      url.searchParams.set('w', width.toString());
      return `${url.toString()} ${width}w`;
    })
    .join(', ');
};

// Image size calculator for different layouts
export const calculateImageSizes = (
  containerWidth: number,
  aspectRatio: number
) => {
  const height = containerWidth / aspectRatio;

  return {
    width: containerWidth,
    height: Math.round(height),
  };
};

// Common aspect ratios
export const ASPECT_RATIOS = {
  square: 1,
  landscape: 16 / 9,
  portrait: 9 / 16,
  card: 4 / 3,
  banner: 21 / 9,
  golden: 1.618,
} as const;

// Placeholder image generator
export const generatePlaceholder = (
  width: number,
  height: number,
  color = '#f3f4f6'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Image format detection and optimization
export const getOptimalImageFormat = (): 'avif' | 'webp' | 'jpeg' => {
  if (supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpeg';
};

// Performance monitoring for images
export const trackImagePerformance = (src: string, loadTime: number) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Log slow-loading images for optimization
    if (loadTime > 2000) {
      console.warn(`Slow image load detected: ${src} took ${loadTime}ms`);
    }
  }
};

// Image compression utility (client-side)
export const compressImage = async (
  file: File,
  maxWidth: number = 1920,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob!], file.name, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/webp',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Determines if an image should skip Next.js optimization
 * Use this to avoid unnecessary transformations for small files, SVGs, GIFs, logos, and icons
 *
 * @param src - Image source path or URL
 * @param sizeInBytes - Optional file size in bytes
 * @returns true if optimization should be skipped
 */
export const shouldSkipOptimization = (
  src: string,
  sizeInBytes?: number
): boolean => {
  // Skip if file size is below threshold (small files)
  if (sizeInBytes && sizeInBytes < OPTIMIZATION_THRESHOLD_BYTES) {
    return true;
  }

  // Skip SVG and GIF files
  const hasSkipExtension = SKIP_OPTIMIZATION_EXTENSIONS.some((ext) =>
    src.toLowerCase().endsWith(ext)
  );
  if (hasSkipExtension) return true;

  // Skip logos, icons, badges, avatars, and thumbnails
  const matchesSkipPattern = SKIP_OPTIMIZATION_PATTERNS.some((pattern) =>
    pattern.test(src)
  );
  if (matchesSkipPattern) return true;

  return false;
};

/**
 * Gets optimal quality setting based on image context
 * Helps reduce transformation variations
 *
 * @param context - Image usage context
 * @returns quality value (1-100)
 */
export const getOptimalQuality = (
  context: 'thumbnail' | 'card' | 'hero' | 'gallery' | 'default' = 'default'
): number => {
  return IMAGE_QUALITY[context as keyof typeof IMAGE_QUALITY] || 85;
};

/**
 * Generates optimized sizes attribute for responsive images
 * Reduces unnecessary transformations by matching actual display sizes
 *
 * @param layout - Layout context for the image
 * @returns sizes string for Next.js Image component
 */
export const getOptimalSizes = (
  layout: 'full-width' | 'container' | 'sidebar' | 'card' | 'thumbnail'
): string => {
  switch (layout) {
    case 'full-width':
      return '100vw';
    case 'container':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px';
    case 'sidebar':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 450px';
    case 'card':
      return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 400px';
    case 'thumbnail':
      return '(max-width: 640px) 25vw, (max-width: 1024px) 150px, 128px';
    default:
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
};
