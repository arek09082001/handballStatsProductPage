import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { ContactFormRateLimit, getClientIP } from '@/lib/utils/rate-limit';
import { CLUB_CONFIG } from '@/lib/club-config';
import { generateContactConfirmationEmail } from '@/lib/utils/email-templates';

const CONTACT_FIXED_EMAIL = 'kontakt@webdesign-weiss.de';
const CONTACT_NOREPLY_EMAIL = CLUB_CONFIG.email.noreply;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeMultilineText(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />');
}

// Validation schema for contact form
const contactSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .optional()
      .or(z.literal('')),
    phone: z.string().optional(),
    topic: z.string().min(2, 'Topic must be at least 2 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    websiteUrl: z.string().optional(),
    // Honeypot field (should be empty)
    website: z.string().optional().default(''),
    // Privacy policy acceptance
    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: 'Privacy policy must be accepted',
    }),
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone must be provided',
    path: ['email'],
  })
  .refine((data) => data.website === '', {
    message: 'Spam detected',
    path: ['website'],
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the form data
    const validatedData = contactSchema.parse(body);

    const { name, email, phone, topic, message, website, websiteUrl } = validatedData;

    // 1. Honeypot check - if website field is filled, it's spam
    if (website && website.trim() !== '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Spam erkannt',
        },
        { status: 400 }
      );
    }

    // 3. Rate limiting checks
    const clientIP = getClientIP(request);
    const rateLimitCheck = await ContactFormRateLimit.checkRateLimit({
      ipAddress: clientIP,
      email: email || undefined,
      phone: phone || undefined,
    });

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateLimitCheck.reason,
          resetTime: rateLimitCheck.resetTime,
        },
        { status: 429 } // Too Many Requests
      );
    }

    // Initialize Brevo API client
    const apiInstance = new brevo.TransactionalEmailsApi();
    const apiKey = brevo.TransactionalEmailsApiApiKeys.apiKey;
    apiInstance.setApiKey(apiKey, process.env.BREVO_API_KEY || '');

    const safeName = escapeHtml(name);
    const safeEmail = email ? escapeHtml(email) : '';
    const safePhone = phone ? escapeHtml(phone) : '';
    const safeTopic = escapeHtml(topic);
    const safeWebsiteUrl = websiteUrl ? escapeHtml(websiteUrl) : '';
    const safeMessage = normalizeMultilineText(message);

    const submittedAt = new Date().toLocaleString('de-DE', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Europe/Berlin',
    });

    // Create internal notification email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; color: #0f172a; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%); padding: 24px; border-radius: 14px 14px 0 0;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: #bfdbfe;">Neue Anfrage</p>
          <h2 style="margin: 10px 0 0 0; color: #ffffff; font-size: 24px; line-height: 1.25;">Kontaktformular: ${safeTopic}</h2>
        </div>

        <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 14px 14px; padding: 24px;">
          <p style="margin: 0 0 20px 0; color: #334155; font-size: 15px;">
            Eine neue Nachricht wurde über das Kontaktformular auf <strong>${CLUB_CONFIG.website.urlWithoutProtocol}</strong> gesendet.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #1e293b;">Kontaktdaten</h3>
            <p style="margin: 4px 0;"><strong>Name:</strong> ${safeName}</p>
            ${email ? `<p style="margin: 4px 0;"><strong>E-Mail:</strong> ${safeEmail}</p>` : ''}
            ${phone ? `<p style="margin: 4px 0;"><strong>Telefon:</strong> ${safePhone}</p>` : ''}
            <p style="margin: 4px 0;"><strong>Eingang:</strong> ${submittedAt}</p>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #1e293b;">Projektkontext</h3>
            <p style="margin: 4px 0;"><strong>Thema:</strong> ${safeTopic}</p>
            ${websiteUrl ? `<p style="margin: 4px 0;"><strong>Website:</strong> ${safeWebsiteUrl}</p>` : ''}
          </div>

          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px;">
            <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #1e293b;">Nachricht</h3>
            <p style="margin: 0; line-height: 1.6; color: #1e293b;">${safeMessage}</p>
          </div>

          <div style="margin-top: 16px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 14px; font-size: 14px; color: #1e3a8a;">
            <strong>Antwort-Hinweis:</strong>
            ${email
        ? `Bitte direkt auf diese E-Mail antworten, um ${safeName} zu erreichen.`
        : `Die anfragende Person hat keine E-Mail angegeben. Kontakt per Telefon: ${safePhone || 'nicht vorhanden'
        }.`
      }
          </div>
        </div>
      </div>
    `;

    // Send email using Brevo
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Neue Kontaktanfrage: ${topic}`;
    sendSmtpEmail.htmlContent = emailContent;
    sendSmtpEmail.sender = {
      name: CLUB_CONFIG.display.emailSender,
      email: CONTACT_FIXED_EMAIL,
    };
    sendSmtpEmail.to = [
      {
        email: CONTACT_FIXED_EMAIL,
        name: CLUB_CONFIG.name,
      },
    ];

    if (email) {
      sendSmtpEmail.replyTo = {
        email: email,
        name: name,
      };
    }

    // Send internal notification email
    const emailData = await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Send confirmation email to the sender if email is provided
    if (email) {
      try {
        const confirmationEmailData = generateContactConfirmationEmail({
          name,
          topic,
        });

        const confirmationEmail = new brevo.SendSmtpEmail();
        confirmationEmail.subject = confirmationEmailData.subject;
        confirmationEmail.htmlContent = confirmationEmailData.htmlContent;
        confirmationEmail.sender = {
          name: CLUB_CONFIG.display.emailSender,
          email: CONTACT_FIXED_EMAIL,
        };
        confirmationEmail.to = [
          {
            email: email,
            name: name,
          },
        ];

        await apiInstance.sendTransacEmail(confirmationEmail);
      } catch (error) {
        // Log error but don't fail the request if confirmation email fails
        console.error('Failed to send confirmation email:', error);
      }
    }

    // Record the submission for rate limiting
    await ContactFormRateLimit.recordSubmission({
      ipAddress: clientIP,
      email: email || undefined,
      phone: phone || undefined,
    });

    // Clean up old submissions (run occasionally)
    if (Math.random() < 0.1) {
      // 10% chance to run cleanup
      ContactFormRateLimit.cleanupOldSubmissions().catch(console.error);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Nachricht erfolgreich gesendet',
        emailId: emailData.body?.messageId,
        remainingSubmissions: rateLimitCheck.remainingSubmissions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ungültige Formulardaten',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle Brevo API errors
    if (error instanceof Error) {
      // Check for specific Brevo API errors
      if (
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Brevo API-Schlüssel ungültig oder fehlt',
            details:
              'Bitte überprüfen Sie Ihren BREVO_API_KEY in der .env Datei',
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Fehler beim Senden der E-Mail',
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Unbekannter Fehler beim Senden der Nachricht',
      },
      { status: 500 }
    );
  }
}
