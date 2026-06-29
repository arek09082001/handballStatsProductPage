import { NextRequest, NextResponse } from 'next/server';
import * as brevo from '@getbrevo/brevo';
import { z } from 'zod';
import { verifyNewsletterToken } from '@/lib/utils/newsletter-token';

const confirmSchema = z.object({
  token: z.string().min(1, 'Missing token'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = confirmSchema.parse(body);

    const email = verifyNewsletterToken(token);

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte melde dich erneut an.',
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
      // Email is now confirmed → add (or update) the contact in the list.
      const createContact = new brevo.CreateContact();
      createContact.email = email;
      createContact.updateEnabled = true;
      if (listId) {
        createContact.listIds = [listId];
      }
      await contactsApi.createContact(createContact);
    } catch (error) {
      // Brevo returns 400 "Contact already exist" when re-confirming – treat
      // that as success so the user is not confused.
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

    return NextResponse.json(
      { success: true, message: 'Anmeldung bestätigt' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter confirmation error:', error);

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
      { success: false, error: 'Bestätigung fehlgeschlagen. Bitte versuche es später erneut.' },
      { status: 500 }
    );
  }
}
