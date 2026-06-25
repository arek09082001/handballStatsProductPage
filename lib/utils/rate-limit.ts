import { NextRequest } from 'next/server';
import { checkCombinedRateLimit } from '@/lib/rate-limiter';

interface RateLimitInput {
  ipAddress: string;
  email?: string;
  phone?: string;
}

interface RateLimitCheckResult {
  allowed: boolean;
  reason?: string;
  resetTime?: string;
  remainingSubmissions: number;
}

const FALLBACK_IDENTIFIER = 'anonymous';

export function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return FALLBACK_IDENTIFIER;
}

export const ContactFormRateLimit = {
  async checkRateLimit({ ipAddress, email }: RateLimitInput): Promise<RateLimitCheckResult> {
    const ip = ipAddress || FALLBACK_IDENTIFIER;
    const emailIdentifier = email || `${ip}@no-email.local`;
    const result = checkCombinedRateLimit(ip, emailIdentifier);

    return {
      allowed: result.success,
      reason: result.error,
      resetTime: result.resetAt.toISOString(),
      remainingSubmissions: result.remaining,
    };
  },

  async recordSubmission(_: RateLimitInput): Promise<void> {
    // Submission counting happens during checkRateLimit via checkCombinedRateLimit.
  },

  async cleanupOldSubmissions(): Promise<void> {
    // In-memory limiter performs cleanup internally.
  },
};
