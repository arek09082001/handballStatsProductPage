'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook to preload images before displaying them
 * This prevents the "flash of blank content" during page transitions
 */
export function useImagePreload(imageSrc: string | string[]): boolean {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sources = Array.isArray(imageSrc) ? imageSrc : [imageSrc];
    
    let loadedCount = 0;
    const totalImages = sources.length;

    // If no images, mark as loaded immediately
    if (totalImages === 0) {
      setIsLoaded(true);
      return;
    }

    sources.forEach((src) => {
      const img = new Image();
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        // Even on error, count it as loaded to prevent infinite waiting
        loadedCount++;
        if (loadedCount === totalImages) {
          setIsLoaded(true);
        }
      };

      img.src = src;
    });

    // Timeout fallback: if images don't load in 2 seconds, show content anyway
    const timeout = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [imageSrc]);

  return isLoaded;
}
