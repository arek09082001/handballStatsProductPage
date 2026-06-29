import crypto from 'crypto';

/**
 * Stateless, signed confirmation tokens for the newsletter double opt-in.
 *
 * The token carries the subscriber's email and an expiry timestamp, signed
 * with an HMAC so it cannot be tampered with. This avoids having to persist
 * pending subscriptions in a database: the confirmation link itself is the
 * proof of consent.
 */

// 48 hours validity for a confirmation link.
const TOKEN_TTL_MS = 48 * 60 * 60 * 1000;

interface TokenPayload {
  // email
  e: string;
  // expiry (epoch ms)
  x: number;
}

function getSecret(): string {
  // A dedicated secret is preferred, but we fall back to the Brevo API key
  // (already a server-only secret) so the feature works out of the box.
  const secret =
    process.env.NEWSLETTER_CONFIRM_SECRET || process.env.BREVO_API_KEY;

  if (!secret) {
    throw new Error('Missing NEWSLETTER_CONFIRM_SECRET / BREVO_API_KEY');
  }

  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function sign(data: string): string {
  return base64url(
    crypto.createHmac('sha256', getSecret()).update(data).digest()
  );
}

/**
 * Create a signed confirmation token for the given email.
 */
export function createNewsletterToken(email: string): string {
  const payload: TokenPayload = {
    e: email.trim().toLowerCase(),
    x: Date.now() + TOKEN_TTL_MS,
  };

  const data = base64url(JSON.stringify(payload));
  return `${data}.${sign(data)}`;
}

/**
 * Verify a confirmation token and return the email it was issued for, or
 * `null` when the token is invalid, tampered with, or expired.
 */
export function verifyNewsletterToken(token: string): string | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const [data, signature] = token.split('.');

  if (!data || !signature) {
    return null;
  }

  const expected = sign(data);

  // Constant-time comparison to avoid timing attacks.
  const sigBuf = fromBase64url(signature);
  const expBuf = fromBase64url(expected);

  if (
    sigBuf.length !== expBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expBuf)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64url(data).toString()) as TokenPayload;

    if (!payload.e || !payload.x || Date.now() > payload.x) {
      return null;
    }

    return payload.e;
  } catch {
    return null;
  }
}
