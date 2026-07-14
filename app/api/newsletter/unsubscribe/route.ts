import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { verifyNewsletterToken } from '@/lib/utils/newsletter-token';

const unsubscribeSchema = z
  .object({
    // One-click unsubscribe: signed token from an email link.
    token: z.string().optional(),
    // Manual unsubscribe: the visitor types their address on the page.
    email: z.string().email('Invalid email address').optional(),
  })
  .refine((data) => Boolean(data.token) || Boolean(data.email), {
    message: 'Missing token or email',
  });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, email: rawEmail } = unsubscribeSchema.parse(body);

    // A signed token takes precedence; otherwise fall back to the address the
    // visitor entered manually.
    const email = token
      ? verifyNewsletterToken(token)
      : (rawEmail?.trim().toLowerCase() ?? null);

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: token
            ? 'Dieser Abmeldelink ist ungültig oder abgelaufen. Bitte gib deine E-Mail-Adresse ein, um dich abzumelden.'
            : 'Bitte gib eine gültige E-Mail-Adresse ein.',
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Newsletter ist derzeit nicht verfügbar.' },
        { status: 503 }
      );
    }

    const listId = process.env.BREVO_NEWSLETTER_LIST_ID
      ? Number(process.env.BREVO_NEWSLETTER_LIST_ID)
      : 4;

    const contactsApi = new brevo.ContactsApi();
    contactsApi.setApiKey(brevo.ContactsApiApiKeys.apiKey, apiKey);

    try {
      // Remove the subscriber from the newsletter list – the exact inverse of
      // the confirmation step (see app/api/newsletter/confirm/route.ts).
      const removeFromList = new brevo.RemoveContactFromList();
      removeFromList.emails = [email];
      await contactsApi.removeContactFromList(listId, removeFromList);
    } catch (error) {
      // Brevo returns an error when the contact is unknown or already off the
      // list. Both mean "not subscribed" → treat as success so the request is
      // idempotent and we don't reveal whether the address was on the list.
      const message =
        error instanceof Error ? error.message.toLowerCase() : '';
      const responseBody =
        // @ts-expect-error - Brevo errors carry an axios-style response body
        error?.response?.body?.message?.toLowerCase?.() || '';
      const combined = `${message} ${responseBody}`;

      const notSubscribed =
        combined.includes('not exist') ||
        combined.includes('does not exist') ||
        combined.includes('already removed') ||
        combined.includes('not found') ||
        combined.includes('no contact');

      if (!notSubscribed) {
        throw error;
      }
    }

    return NextResponse.json(
      { success: true, message: 'Abmeldung erfolgreich' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Ungültige Eingabe' },
        { status: 400 }
      );
    }

    if (
      error instanceof Error &&
      (error.message.includes('401') || error.message.includes('Unauthorized'))
    ) {
      return NextResponse.json(
        { success: false, error: 'Brevo API-Schlüssel ungültig oder fehlt' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Abmeldung fehlgeschlagen. Bitte versuche es später erneut.',
      },
      { status: 500 }
    );
  }
}
