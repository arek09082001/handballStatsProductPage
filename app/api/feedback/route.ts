import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { ContactFormRateLimit, getClientIP } from '@/lib/utils/rate-limit';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  generateFeedbackConfirmationEmail,
  generateFeedbackSummaryEmail,
} from '@/lib/utils/email-templates';
import {
  FEEDBACK_CATEGORY_EMAIL_LABELS,
  FEEDBACK_CATEGORY_IDS,
  FEEDBACK_MAX_MESSAGE_LENGTH,
  FEEDBACK_MAX_RATING,
  FEEDBACK_MIN_MESSAGE_LENGTH,
  FEEDBACK_MIN_RATING,
  FEEDBACK_RATING_EMAIL_LABELS,
} from '@/features/feedback/data/feedback-content';

// Validation schema for the feedback form. Name and e-mail are optional on
// purpose — feedback that costs a visitor their address is feedback we do not
// get. Everything else mirrors the contact form.
const feedbackSchema = z
  .object({
    rating: z
      .number()
      .int()
      .min(FEEDBACK_MIN_RATING, 'Rating is too low')
      .max(FEEDBACK_MAX_RATING, 'Rating is too high'),
    category: z.enum(FEEDBACK_CATEGORY_IDS),
    message: z
      .string()
      .min(FEEDBACK_MIN_MESSAGE_LENGTH, 'Message is too short')
      .max(FEEDBACK_MAX_MESSAGE_LENGTH, 'Message is too long'),
    name: z.string().max(100, 'Name is too long').optional().default(''),
    email: z
      .union([z.string().email('Invalid email address'), z.literal('')])
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
    const { rating, category, message, name, email, website } =
      feedbackSchema.parse(body);

    // 1. Honeypot check
    if (website && website.trim() !== '') {
      return NextResponse.json(
        { success: false, error: 'Spam erkannt' },
        { status: 400 }
      );
    }

    // 2. Rate limiting. Anonymous submissions are limited by IP alone — the
    // helper falls back to an IP-derived identifier when no address is given.
    const clientIP = getClientIP(request);
    const rateLimitCheck = await ContactFormRateLimit.checkRateLimit({
      ipAddress: clientIP,
      email: email || undefined,
    });

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitCheck.reason,
          resetTime: rateLimitCheck.resetTime,
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Feedback ist derzeit nicht verfügbar.' },
        { status: 503 }
      );
    }

    const transactionalApi = new brevo.TransactionalEmailsApi();
    transactionalApi.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey
    );

    // All emails are sent from the noreply address.
    const sender = {
      name: CLUB_CONFIG.display.emailSender,
      email: CLUB_CONFIG.email.noreply,
    };

    const categoryLabel = FEEDBACK_CATEGORY_EMAIL_LABELS[category];
    const ratingLabel = FEEDBACK_RATING_EMAIL_LABELS[rating] ?? '';

    // 3. Summary email to the team (kontakt@)
    const summary = generateFeedbackSummaryEmail({
      rating,
      ratingLabel,
      categoryLabel,
      message,
      name,
      email,
    });

    const summaryEmail = new brevo.SendSmtpEmail();
    summaryEmail.sender = sender;
    summaryEmail.to = [{ email: CLUB_CONFIG.email.main }];
    if (email) {
      summaryEmail.replyTo = name ? { email, name } : { email };
    }
    summaryEmail.subject = summary.subject;
    summaryEmail.htmlContent = summary.htmlContent;

    const deliveries = [transactionalApi.sendTransacEmail(summaryEmail)];

    // 4. Confirmation email — only when the visitor left an address.
    if (email) {
      const confirmation = generateFeedbackConfirmationEmail({
        name,
        categoryLabel,
      });

      const confirmationEmail = new brevo.SendSmtpEmail();
      confirmationEmail.sender = sender;
      confirmationEmail.to = [name ? { email, name } : { email }];
      confirmationEmail.replyTo = { email: CLUB_CONFIG.email.main };
      confirmationEmail.subject = confirmation.subject;
      confirmationEmail.htmlContent = confirmation.htmlContent;

      deliveries.push(transactionalApi.sendTransacEmail(confirmationEmail));
    }

    await Promise.all(deliveries);

    await ContactFormRateLimit.recordSubmission({
      ipAddress: clientIP,
      email: email || undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Feedback erfolgreich gesendet',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Feedback form error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Eingabe',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        return NextResponse.json(
          { success: false, error: 'Brevo API-Schlüssel ungültig oder fehlt' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Fehler beim Senden des Feedbacks',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unbekannter Fehler beim Senden des Feedbacks' },
      { status: 500 }
    );
  }
}
