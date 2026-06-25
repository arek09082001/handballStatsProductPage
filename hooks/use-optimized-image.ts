'use client';

import { useState, useEffect } from 'react';
import {
  supportsWebP,
  supportsAVIF,
  getOptimalImageFormat,
  generateResponsiveImageProps,
  type RESPONSIVE_BREAKPOINTS,
} from '@/lib/utils/image-optimization';

interface UseOptimizedImageOptions {
  fallbackFormat?: 'webp' | 'jpeg';
  enableResponsive?: boolean;
  breakpoints?: (keyof typeof RESPONSIVE_BREAKPOINTS)[];
  priority?: boolean;
}

interface OptimizedImageData {
  src: string;
  srcSet?: string;
  sizes?: string;
  format: string;
  isLoading: boolean;
  error?: string;
}

export function useOptimizedImage(
  originalSrc: string,
  options: UseOptimizedImageOptions = {}
): OptimizedImageData {
  const { fallbackFormat = 'webp', enableResponsive = true } = options;

  const [imageData, setImageData] = useState<OptimizedImageData>({
    src: originalSrc,
    format: 'original',
    isLoading: true,
  });

  useEffect(() => {
    async function loadOptimizedImage() {
      try {
        // Determine the best format
        const optimalFormat = getOptimalImageFormat();
        let optimizedSrc = originalSrc;

        // Try to load optimized version
        const baseName = originalSrc.replace(/\.[^/.]+$/, '');
        const isPublicImage =
          originalSrc.startsWith('/') && !originalSrc.startsWith('http');

        if (isPublicImage) {
          let testSrc = '';

          if (optimalFormat === 'avif') {
            testSrc = `/optimized${baseName}.avif`;
          } else if (optimalFormat === 'webp' || fallbackFormat === 'webp') {
            testSrc = `/optimized${baseName}.webp`;
          }

          if (testSrc) {
            try {
              const response = await fetch(testSrc, { method: 'HEAD' });
              if (response.ok) {
                optimizedSrc = testSrc;
              }
            } catch {
              // Fall back to original if optimized version doesn't exist
            }
          }
        }

        // Generate responsive props if enabled
        let responsiveProps = {};
        if (enableResponsive && isPublicImage) {
          responsiveProps = generateResponsiveImageProps(optimizedSrc);
        }

        setImageData({
          src: optimizedSrc,
          format: optimizedSrc !== originalSrc ? optimalFormat : 'original',
          isLoading: false,
          ...responsiveProps,
        });
      } catch (error) {
        setImageData({
          src: originalSrc,
          format: 'original',
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    loadOptimizedImage();
  }, [originalSrc, fallbackFormat, enableResponsive]);

  return imageData;
}

// Hook for checking format support
export function useImageFormatSupport() {
  const [support, setSupport] = useState({
    webp: false,
    avif: false,
    loading: true,
  });

  useEffect(() => {
    const checkSupport = async () => {
      const webpSupport = supportsWebP();
      const avifSupport = supportsAVIF();

      setSupport({
        webp: webpSupport,
        avif: avifSupport,
        loading: false,
      });
    };

    checkSupport();
  }, []);

  return support;
}

// Hook for preloading critical images
export function useImagePreloader(images: string[], priority: boolean = false) {
  const [preloadStatus, setPreloadStatus] = useState<
    Record<string, 'loading' | 'loaded' | 'error'>
  >({});

  useEffect(() => {
    if (!priority) return;

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = src;
      });
    };

    const preloadAll = async () => {
      const status: Record<string, 'loading' | 'loaded' | 'error'> = {};

      for (const src of images) {
        status[src] = 'loading';
        setPreloadStatus((current) => ({ ...current, ...status }));

        try {
          await preloadImage(src);
          status[src] = 'loaded';
        } catch {
          status[src] = 'error';
        }

        setPreloadStatus((current) => ({ ...current, [src]: status[src] }));
      }
    };

    preloadAll();
  }, [images, priority]);

  return preloadStatus;
}
