/**
 * Production-Safe Logger Utility
 *
 * Prevents console statements from appearing in production builds
 * while maintaining debugging capabilities in development.
 *
 * Usage:
 * import { logger } from '@/lib/utils/logger';
 * logger.error('Something went wrong', error);
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log error messages (only in development)
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  /**
   * Log warning messages (only in development)
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log info messages (only in development)
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log debug messages (only in development)
   */
  debug: () => {
    if (isDevelopment) {
    }
  },

  /**
   * Force log in production (use sparingly for critical errors)
   */
  forceError: (...args: unknown[]) => {
    console.error(...args);
  },
};
