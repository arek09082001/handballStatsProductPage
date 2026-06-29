import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { ContactFormRateLimit, getClientIP } from '@/lib/utils/rate-limit';
import { CLUB_CONFIG } from '@/lib/club-config';
import {
  generateContactConfirmationEmail,
  generateContactNotificationEmail,
} from '@/lib/utils/email-templates';

// Validation schema for the contact form
const contactSchema = z
  .object({
    name: z.string().min(2, 'Name is too short').max(100, 'Name is too long'),
    email: z.string().email('Invalid email address'),
    topic: z.string().min(2, 'Topic is too short').max(150, 'Topic is too long'),
    message: z
      .string()
      .min(10, 'Message is too short')
      .max(5000, 'Message is too long'),
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
    const { name, email, topic, message, website } = contactSchema.parse(body);

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
        { success: false, error: 'Kontaktformular ist derzeit nicht verfügbar.' },
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

    // 3. Notification email to the team (kontakt@)
    const notification = generateContactNotificationEmail({
      name,
      email,
      topic,
      message,
    });

    const notificationEmail = new brevo.SendSmtpEmail();
    notificationEmail.sender = sender;
    notificationEmail.to = [{ email: CLUB_CONFIG.email.main }];
    notificationEmail.replyTo = { email, name };
    notificationEmail.subject = notification.subject;
    notificationEmail.htmlContent = notification.htmlContent;

    // 4. Confirmation email to the visitor
    const confirmation = generateContactConfirmationEmail({ name, topic });

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
        message: 'Nachricht erfolgreich gesendet',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

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
          error: 'Fehler beim Senden der Nachricht',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Unbekannter Fehler beim Senden der Nachricht' },
      { status: 500 }
    );
  }
}
