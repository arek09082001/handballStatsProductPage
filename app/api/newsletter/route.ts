import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { ContactFormRateLimit, getClientIP } from '@/lib/utils/rate-limit';
import { CLUB_CONFIG } from '@/lib/club-config';
import { generateNewsletterConfirmationEmail } from '@/lib/utils/email-templates';
import { createNewsletterToken } from '@/lib/utils/newsletter-token';

// Validation schema for the newsletter signup
const newsletterSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    // Honeypot field (should be empty)
    website: z.string().optional().default(''),
    // Privacy policy acceptance
    acceptPrivacy: z.boolean().refine((value) => value === true, {
      message: 'Privacy policy must be accepted',
    }),
  })
  .refine((data) => data.website === '', {
    message: 'Spam detected',
    path: ['website'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, website } = newsletterSchema.parse(body);

    // 1. Honeypot check
    if (website && website.trim() !== '') {
      return NextResponse.json(
        { success: false, error: 'Spam erkannt' },
        { status: 400 }
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
        { success: false, error: rateLimitCheck.reason, resetTime: rateLimitCheck.resetTime },
        { status: 429 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Newsletter ist derzeit nicht verfügbar.' },
        { status: 503 }
      );
    }

    // 3. Double opt-in: send a confirmation email with a signed link.
    // The contact is only added to Brevo once the link is confirmed
    // (see app/api/newsletter/confirm/route.ts).
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || CLUB_CONFIG.website.url;
    const token = createNewsletterToken(email);
    const confirmUrl = `${baseUrl.replace(/\/$/, '')}/newsletter/confirm?token=${encodeURIComponent(token)}`;

    const transactionalApi = new brevo.TransactionalEmailsApi();
    transactionalApi.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey
    );

    const { subject, htmlContent } = generateNewsletterConfirmationEmail({
      confirmUrl,
    });

    const confirmationEmail = new brevo.SendSmtpEmail();
    confirmationEmail.sender = {
      name: CLUB_CONFIG.display.emailSender,
      email: CLUB_CONFIG.email.noreply,
    };
    confirmationEmail.to = [{ email }];
    confirmationEmail.replyTo = { email: CLUB_CONFIG.email.main };
    confirmationEmail.subject = subject;
    confirmationEmail.htmlContent = htmlContent;

    await transactionalApi.sendTransacEmail(confirmationEmail);

    await ContactFormRateLimit.recordSubmission({
      ipAddress: clientIP,
      email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Bestätigungs-E-Mail gesendet',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter signup error:', error);

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
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { success: false, error: 'Brevo API-Schlüssel ungültig oder fehlt' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Fehler bei der Anmeldung', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unbekannter Fehler bei der Anmeldung' },
      { status: 500 }
    );
  }
}
