'use client';

import NextImage from 'next/image';
import { useOptimizedImage } from '@/hooks/use-optimized-image';
import type { ImageProps } from 'next/image';

interface SmartImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  title?: string;
  fallbackSrc?: string;
  enableOptimization?: boolean;
  enableResponsive?: boolean;
  quality?: number;
}

/**
 * SmartImage component that automatically uses optimized image formats
 * Falls back to original image if optimized versions are not available
 */
export default function SmartImage({
  src,
  alt,
  title,
  fallbackSrc,
  enableOptimization = true,
  enableResponsive = true,
  quality = 85,
  priority = false,
  ...props
}: SmartImageProps) {
  const {
    src: optimizedSrc,
    srcSet,
    sizes,
    isLoading,
    error
  } = useOptimizedImage(src, {
    enableResponsive: enableResponsive && enableOptimization,
    priority,
  });

  // Use fallback if there's an error and fallback is provided
  const finalSrc = error && fallbackSrc ? fallbackSrc : optimizedSrc;

  return (
    <NextImage
      src={finalSrc}
      alt={alt}
      title={title ?? alt}
      quality={quality}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      placeholder={isLoading ? 'blur' : 'empty'}
      blurDataURL={isLoading ?
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
        : undefined
      }
      {...(enableResponsive && srcSet && {
        // Add responsive attributes only if we have them
        sizes: sizes || `
          (max-width: 640px) 100vw,
          (max-width: 768px) 75vw,
          (max-width: 1024px) 50vw,
          33vw
        `
      })}
      {...props}
    />
  );
}
