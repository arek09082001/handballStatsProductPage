/**
 * Rate Limiter for contact form spam prevention
 * DSGVO-compliant: Uses temporary in-memory storage, no persistent tracking
 */

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  lastRequest: number;
}

// In-memory storage (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.lastRequest > oneHour) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

interface RateLimitConfig {
  maxRequests: number; // Max requests per window
  windowMs: number; // Time window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 3, // 3 requests per hour (DSGVO-friendly)
  windowMs: 60 * 60 * 1000, // 1 hour
};

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
  error?: string;
}

/**
 * Check if request is allowed under rate limit
 * @param identifier - Email or IP address
 * @param config - Optional custom rate limit config
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // First request
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(now + config.windowMs),
    };
  }

  // Check if window has expired
  if (now - entry.firstRequest >= config.windowMs) {
    // Reset window
    rateLimitStore.set(identifier, {
      count: 1,
      firstRequest: now,
      lastRequest: now,
    });

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: new Date(now + config.windowMs),
    };
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    const resetAt = new Date(entry.firstRequest + config.windowMs);
    const minutesUntilReset = Math.ceil(
      (resetAt.getTime() - now) / (60 * 1000)
    );

    return {
      success: false,
      remaining: 0,
      resetAt,
      error: `Zu viele Anfragen. Bitte versuchen Sie es in ${minutesUntilReset} Minute${minutesUntilReset !== 1 ? 'n' : ''} erneut.`,
    };
  }

  // Increment counter
  entry.count++;
  entry.lastRequest = now;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: new Date(entry.firstRequest + config.windowMs),
  };
}

/**
 * Check rate limit for both IP and email
 * Both must be within limits for success
 */
export function checkCombinedRateLimit(
  ip: string,
  email: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  // Normalize identifiers
  const normalizedIp = ip.toLowerCase();
  const normalizedEmail = email.toLowerCase();

  // Check IP limit
  const ipResult = checkRateLimit(`ip:${normalizedIp}`, config);
  if (!ipResult.success) {
    return {
      ...ipResult,
      error: `Zu viele Anfragen von Ihrer IP-Adresse. ${ipResult.error}`,
    };
  }

  // Check email limit
  const emailResult = checkRateLimit(`email:${normalizedEmail}`, config);
  if (!emailResult.success) {
    return {
      ...emailResult,
      error: `Zu viele Anfragen mit dieser E-Mail-Adresse. ${emailResult.error}`,
    };
  }

  // Return the most restrictive limit
  return {
    success: true,
    remaining: Math.min(ipResult.remaining, emailResult.remaining),
    resetAt:
      ipResult.resetAt > emailResult.resetAt
        ? ipResult.resetAt
        : emailResult.resetAt,
  };
}

/**
 * Get rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry) {
    return {
      success: true,
      remaining: config.maxRequests,
      resetAt: new Date(now + config.windowMs),
    };
  }

  // Check if window has expired
  if (now - entry.firstRequest >= config.windowMs) {
    return {
      success: true,
      remaining: config.maxRequests,
      resetAt: new Date(now + config.windowMs),
    };
  }

  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetAt = new Date(entry.firstRequest + config.windowMs);

  return {
    success: entry.count < config.maxRequests,
    remaining,
    resetAt,
    error:
      entry.count >= config.maxRequests
        ? `Rate limit erreicht. Reset um ${resetAt.toLocaleTimeString('de-DE')}`
        : undefined,
  };
}
