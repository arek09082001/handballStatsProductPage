/**
 * Path Security Utility
 * Provides functions to sanitize file paths and prevent path traversal attacks
 */

/**
 * Sanitizes a file path to prevent path traversal attacks
 * Removes any '../' or '..\' sequences from the path and checks for encoded bypasses
 * @param path - The file path to sanitize
 * @returns The sanitized path, or null if the path is invalid
 */
export function sanitizeFilePath(path: string | null | undefined): string | null {
  if (!path || typeof path !== 'string') {
    return null;
  }

  // Iteratively decode URL-encoded characters to detect multi-encoded path traversal attempts
  let decodedPath = path;
  let previousPath = '';
  let iterations = 0;
  const maxIterations = 5; // Prevent infinite loops

  // Keep decoding until no changes occur or max iterations reached
  while (decodedPath !== previousPath && iterations < maxIterations) {
    previousPath = decodedPath;
    try {
      decodedPath = decodeURIComponent(decodedPath);
    } catch {
      // If decoding fails, stop iterating
      break;
    }
    iterations++;
  }

  // Check for path traversal patterns in both encoded and decoded forms
  // This includes .., %2e%2e, %252e%252e (double encoded), and other variations
  // Patterns in both lowercase and uppercase to catch all variants
  const traversalPatterns = [
    '..',
    '%2e%2e',
    '%2E%2E',
    '%252e%252e',
    '%252E%252E',
    '.%2e',
    '.%2E',
    '%2e.',
    '%2E.',
    '..%2f',
    '..%2F',
    '..%5c',
    '..%5C',
    '%2e%2e%2f',
    '%2E%2E%2F',
    '%2e%2e%5c',
    '%2E%2E%5C',
  ];

  const lowerPath = path.toLowerCase();
  const lowerDecoded = decodedPath.toLowerCase();

  for (const pattern of traversalPatterns) {
    const lowerPattern = pattern.toLowerCase();
    if (lowerPath.includes(lowerPattern) || lowerDecoded.includes(lowerPattern)) {
      console.warn('Path traversal attempt detected:', path);
      return null;
    }
  }

  // Also check for sequences like ....// or ....\\
  if (/\.{2,}[\/\\]/.test(decodedPath)) {
    console.warn('Path traversal attempt detected:', path);
    return null;
  }

  // Remove any leading slashes to ensure relative paths
  const sanitized = decodedPath.replace(/^[\/\\]+/, '');

  return sanitized || null;
}

/**
 * Extracts and sanitizes a filename from a URL or path
 * @param urlOrPath - The URL or path to extract the filename from
 * @returns The sanitized filename, or null if invalid
 */
export function extractAndSanitizeFilename(
  urlOrPath: string | null | undefined
): string | null {
  if (!urlOrPath || typeof urlOrPath !== 'string') {
    return null;
  }

  // If it's a URL, parse it properly to remove query parameters and fragments
  let pathToProcess = urlOrPath;
  if (urlOrPath.startsWith('http')) {
    try {
      const url = new URL(urlOrPath);
      pathToProcess = url.pathname;
    } catch {
      // If URL parsing fails, treat as a path
    }
  }

  // Extract the last part of the path/URL
  const parts = pathToProcess.split('/');
  const filename = parts[parts.length - 1];

  // Sanitize the extracted filename
  return sanitizeFilePath(filename);
}

/**
 * Validates that a path is safe for storage operations
 * @param path - The path to validate
 * @returns true if the path is safe, false otherwise
 */
export function isPathSafe(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }

  // Use the sanitizeFilePath function for consistent validation
  // If sanitization returns null, the path is not safe
  const sanitized = sanitizeFilePath(path);
  
  return sanitized !== null;
}
