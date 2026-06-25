import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { ContactFormRateLimit, getClientIP } from '@/lib/utils/rate-limit';

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

    const contactsApi = new brevo.ContactsApi();
    contactsApi.setApiKey(brevo.ContactsApiApiKeys.apiKey, apiKey);

    const listId = process.env.BREVO_NEWSLETTER_LIST_ID
      ? Number(process.env.BREVO_NEWSLETTER_LIST_ID)
      : undefined;
    const doiTemplateId = process.env.BREVO_DOI_TEMPLATE_ID
      ? Number(process.env.BREVO_DOI_TEMPLATE_ID)
      : undefined;
    const redirectionUrl =
      process.env.BREVO_DOI_REDIRECT_URL ||
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.handballstats.app'}/?newsletter=confirmed`;

    try {
      if (doiTemplateId && listId) {
        // Double opt-in: Brevo sends a confirmation email
        const doiContact = new brevo.CreateDoiContact();
        doiContact.email = email;
        doiContact.includeListIds = [listId];
        doiContact.templateId = doiTemplateId;
        doiContact.redirectionUrl = redirectionUrl;
        await contactsApi.createDoiContact(doiContact);
      } else {
        // Single opt-in fallback
        const createContact = new brevo.CreateContact();
        createContact.email = email;
        createContact.updateEnabled = true;
        if (listId) {
          createContact.listIds = [listId];
        }
        await contactsApi.createContact(createContact);
      }
    } catch (error) {
      // Brevo returns 400 with "Contact already exist" when re-subscribing –
      // treat that as a success so users are not confused.
      const message =
        error instanceof Error ? error.message.toLowerCase() : '';
      const responseBody =
        // @ts-expect-error - Brevo errors carry an axios-style response body
        error?.response?.body?.message?.toLowerCase?.() || '';

      const alreadyExists =
        message.includes('already') ||
        message.includes('exist') ||
        responseBody.includes('already') ||
        responseBody.includes('exist');

      if (!alreadyExists) {
        throw error;
      }
    }

    await ContactFormRateLimit.recordSubmission({
      ipAddress: clientIP,
      email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Anmeldung erfolgreich',
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
