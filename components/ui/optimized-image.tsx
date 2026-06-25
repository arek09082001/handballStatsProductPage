'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
  alt: string;
  title?: string;
  fallbackSrc?: string;
  enableBlur?: boolean;
  loadingStrategy?: 'lazy' | 'eager';
}

export default function OptimizedImage({
  src,
  alt,
  title,
  fallbackSrc,
  enableBlur = true,
  loadingStrategy = 'lazy',
  priority = false,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Generate blur placeholder for better UX
  const blurDataURL = enableBlur
    ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
    : undefined;

  const imageSrc = imageError && fallbackSrc ? fallbackSrc : src;

  return (
    <div className="relative overflow-hidden">
      {isLoading && enableBlur && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      <NextImage
        src={imageSrc}
        alt={alt}
        title={title ?? alt}
        loading={loadingStrategy}
        priority={priority}
        quality={quality}
        placeholder={enableBlur && blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 ${props.className ?? ''}`}
        {...props}
      />
    </div>
  );
}

// Export types for use in other components
export type { OptimizedImageProps };
