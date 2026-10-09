import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { ContactFormRateLimit, getClientIP } from '@/lib/utils/rate-limit';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  generateVideoRequestConfirmationEmail,
  generateVideoRequestNotificationEmail,
} from '@/lib/utils/email-templates';
import {
  VIDEO_REQUEST_MAX_MESSAGE_LENGTH,
  VIDEO_REQUEST_MAX_NAME_LENGTH,
  VIDEO_REQUEST_MAX_TEAM_LENGTH,
  VIDEO_REQUEST_MIN_NAME_LENGTH,
  VIDEO_REQUEST_SOURCE_EMAIL_LABELS,
  VIDEO_REQUEST_SOURCE_IDS,
  VIDEO_REQUEST_TIER_EMAIL_LABELS,
  VIDEO_REQUEST_TIER_IDS,
} from '@/features/video-anfrage/data/video-request-content';

// Validation schema for the video access request. Name and e-mail are
// required — the allowlist in the app is keyed by the address, so a request
// without one cannot be acted on. Squad and message are optional: a coach who
// wants in should not have to write an essay first. Everything else mirrors
// the contact form.
const videoRequestSchema = z
  .object({
    name: z
      .string()
      .min(VIDEO_REQUEST_MIN_NAME_LENGTH, 'Name is too short')
      .max(VIDEO_REQUEST_MAX_NAME_LENGTH, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    team: z
      .string()
      .max(VIDEO_REQUEST_MAX_TEAM_LENGTH, 'Team is too long')
      .optional()
      .default(''),
    tier: z.enum(VIDEO_REQUEST_TIER_IDS),
    message: z
      .string()
      .max(VIDEO_REQUEST_MAX_MESSAGE_LENGTH, 'Message is too long')
      .optional()
      .default(''),
    // The page the button sat on; an unknown value is dropped, not rejected,
    // so a stale link never blocks a request.
    source: z
      .union([z.enum(VIDEO_REQUEST_SOURCE_IDS), z.literal('')])
      .optional()
      .default(''),
    // Privacy policy acceptance
    acceptPrivacy: z.boolean().refine((value) => value === true, {
      message: 'Privacy policy must be accepted',
    }),
    // Honeypot field (should be empty)
    website: z.string().optional().default(''),
  })
  .refine((data) => data.website === '', {
    message: 'Spam detected',
    path: ['website'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, team, tier, message, source, website } =
      videoRequestSchema.parse(body);

    // 1. Honeypot check
    if (website && website.trim() !== '') {
      return NextResponse.json(
        { success: false, code: 'spam', error: 'Spam erkannt' },
        { status: 400 },
      );
    }

    // 2. Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitCheck = await ContactFormRateLimit.checkRateLimit({
      ipAddress: clientIP,
      email,
    });

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          code: 'rateLimited',
          error: rateLimitCheck.reason,
          retryMinutes: rateLimitCheck.retryMinutes,
          resetTime: rateLimitCheck.resetTime,
        },
        { status: 429 },
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          code: 'unavailable',
          error: 'Die Video-Anfrage ist derzeit nicht verfügbar.',
        },
        { status: 503 },
      );
    }

    const transactionalApi = new brevo.TransactionalEmailsApi();
    transactionalApi.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );

    // All emails are sent from the noreply address.
    const sender = {
      name: CLUB_CONFIG.display.emailSender,
      email: CLUB_CONFIG.email.noreply,
    };

    const tierLabel = VIDEO_REQUEST_TIER_EMAIL_LABELS[tier];
    const sourceLabel = source ? VIDEO_REQUEST_SOURCE_EMAIL_LABELS[source] : '';

    // 3. Notification email to the team (kontakt@)
    const notification = generateVideoRequestNotificationEmail({
      name,
      email,
      team,
      tierLabel,
      sourceLabel,
      message,
    });

    const notificationEmail = new brevo.SendSmtpEmail();
    notificationEmail.sender = sender;
    notificationEmail.to = [{ email: CLUB_CONFIG.email.main }];
    notificationEmail.replyTo = { email, name };
    notificationEmail.subject = notification.subject;
    notificationEmail.htmlContent = notification.htmlContent;

    // 4. Confirmation email to the visitor
    const confirmation = generateVideoRequestConfirmationEmail({
      name,
      tierLabel,
    });

    const confirmationEmail = new brevo.SendSmtpEmail();
    confirmationEmail.sender = sender;
    confirmationEmail.to = [{ email, name }];
    confirmationEmail.replyTo = { email: CLUB_CONFIG.email.main };
    confirmationEmail.subject = confirmation.subject;
    confirmationEmail.htmlContent = confirmation.htmlContent;

    await Promise.all([
      transactionalApi.sendTransacEmail(notificationEmail),
      transactionalApi.sendTransacEmail(confirmationEmail),
    ]);

    await ContactFormRateLimit.recordSubmission({
      ipAddress: clientIP,
      email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Anfrage erfolgreich gesendet',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Video request error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          code: 'invalidInput',
          error: 'Ungültige Eingabe',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        return NextResponse.json(
          {
            success: false,
            code: 'unavailable',
            error: 'Brevo API-Schlüssel ungültig oder fehlt',
          },
          { status: 401 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          code: 'sendFailed',
          error: 'Fehler beim Senden der Anfrage',
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        code: 'unknown',
        error: 'Unbekannter Fehler beim Senden der Anfrage',
      },
      { status: 500 },
    );
  }
}
