import { CLUB_CONFIG } from '@/lib/club-config';

/**
 * Email Templates Utility
 * 
 * This module provides reusable email templates for confirmation emails
 * sent to users after form submissions.
 */

interface ContactConfirmationData {
  name: string;
  topic: string;
}

interface RentalConfirmationData {
  name: string;
  eventType: string;
  eventDate: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate confirmation email for contact form submission
 */
export function generateContactConfirmationEmail(
  data: ContactConfirmationData
): { subject: string; htmlContent: string } {
  const safeName = escapeHtml(data.name);
  const safeTopic = escapeHtml(data.topic);

  const subject = `Ihre Anfrage ist eingegangen - ${CLUB_CONFIG.name}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #0f172a; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%); padding: 26px 24px; border-radius: 14px 14px 0 0;">
        <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px; color: #bfdbfe;">Kontaktanfrage</p>
        <h1 style="margin: 8px 0 0 0; color: #ffffff; font-size: 26px; line-height: 1.25;">Vielen Dank, ${safeName}!</h1>
      </div>

      <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 14px 14px;">
        <p style="margin: 0 0 14px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Ihre Nachricht zum Thema <strong>${safeTopic}</strong> ist erfolgreich bei uns eingegangen.
        </p>
        <p style="margin: 0 0 18px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          Wir melden uns zeitnah persönlich bei Ihnen zurück.
        </p>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 0 0 16px 0;">
          <h2 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px;">Ihre Anfrage im Überblick</h2>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Thema:</strong> ${safeTopic}</p>
          <p style="margin: 4px 0; font-size: 14px;"><strong>Status:</strong> Eingegangen</p>
        </div>

        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 14px; margin: 0 0 18px 0;">
          <p style="margin: 0; font-size: 14px; color: #1e3a8a; line-height: 1.5;">
            <strong>Hinweis:</strong> Diese E-Mail wurde automatisch erstellt. Bitte antworten Sie nicht direkt auf diese Nachricht.
            Bei Rückfragen erreichen Sie uns unter
            <a href="mailto:${CLUB_CONFIG.email.info}" style="color: #1d4ed8; text-decoration: none;">${CLUB_CONFIG.email.info}</a>.
          </p>
        </div>

        <div style="padding-top: 18px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>${CLUB_CONFIG.fullName}</strong></p>
          <p style="margin: 0 0 6px 0; font-size: 14px;">${CLUB_CONFIG.address.street}, ${CLUB_CONFIG.address.cityWithPostal}</p>
          <p style="margin: 0 0 6px 0; font-size: 14px;">
            Telefon: <a href="tel:${CLUB_CONFIG.phone.main}" style="color: #1d4ed8; text-decoration: none;">${CLUB_CONFIG.phone.main}</a>
          </p>
          <p style="margin: 0; font-size: 14px;">
            Web: <a href="${CLUB_CONFIG.website.url}" style="color: #1d4ed8; text-decoration: none;">${CLUB_CONFIG.website.urlWithoutProtocol}</a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #64748b; margin: 0;">${CLUB_CONFIG.display.copyright}</p>
        </div>
      </div>
    </div>
  `;

  return { subject, htmlContent };
}

/**
 * Generate confirmation email for consultation requests.
 *
 * Kept compatible with the existing function signature.
 */
export function generateRentalConfirmationEmail(
  data: RentalConfirmationData
): { subject: string; htmlContent: string } {
  const { name, eventType, eventDate } = data;

  const subject = `Bestätigung Ihrer Anfrage - ${CLUB_CONFIG.name}`;

  // Format the date for better display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formattedDate = formatDate(eventDate);

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: ${CLUB_CONFIG.branding.themeColor}; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">${CLUB_CONFIG.name}</h1>
        <p style="color: white; margin: 5px 0 0 0; font-size: 16px;">Projekt- und Beratungskontakt</p>
      </div>

      <div style="padding: 30px 20px;">
        <h2 style="color: ${CLUB_CONFIG.branding.themeColor};">Vielen Dank für Ihre Anfrage!</h2>
        
        <p>Hallo ${name},</p>
        
        <p>wir haben Ihre Anfrage erfolgreich erhalten.</p>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h3 style="color: ${CLUB_CONFIG.branding.themeColor}; margin-top: 0;">Ihre Anfrage:</h3>
          <p style="margin: 5px 0;"><strong>Thema:</strong> ${eventType}</p>
          <p style="margin: 5px 0;"><strong>Gewünschter Zeitpunkt:</strong> ${formattedDate}</p>
        </div>

        <p>Wir melden uns schnellstmöglich bei Ihnen, um die Details zu besprechen und den nächsten sinnvollen Schritt gemeinsam festzulegen.</p>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px; color: #78350f;">
            <strong>Wichtig:</strong> Dies ist eine automatische Eingangsbestätigung. 
            Wir melden uns persönlich bei Ihnen zurück.
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
          <h4 style="margin-top: 0; color: ${CLUB_CONFIG.branding.themeColor};">Ihr Ansprechpartner:</h4>
          <p style="margin: 5px 0;"><strong>${CLUB_CONFIG.contacts.primary.name}</strong></p>
          <p style="margin: 5px 0;">${CLUB_CONFIG.contacts.primary.position}</p>
          <p style="margin: 5px 0;">
            Tel: <a href="tel:${CLUB_CONFIG.contacts.primary.phone}" style="color: ${CLUB_CONFIG.branding.themeColor}; text-decoration: none;">${CLUB_CONFIG.contacts.primary.phone}</a>
          </p>
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            <strong>Hinweis:</strong> Dies ist eine automatisch generierte Bestätigungsmail. 
            Bitte antworten Sie nicht direkt auf diese E-Mail. 
            Bei Rückfragen kontaktieren Sie uns bitte unter: 
            <a href="mailto:${CLUB_CONFIG.email.info}" style="color: ${CLUB_CONFIG.branding.themeColor};">${CLUB_CONFIG.email.info}</a>
          </p>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 5px 0; font-size: 14px;"><strong>${CLUB_CONFIG.fullName}</strong></p>
          <p style="margin: 5px 0; font-size: 14px;">${CLUB_CONFIG.address.street}</p>
          <p style="margin: 5px 0; font-size: 14px;">${CLUB_CONFIG.address.cityWithPostal}</p>
          <p style="margin: 5px 0; font-size: 14px;">
            Tel: <a href="tel:${CLUB_CONFIG.phone.main}" style="color: ${CLUB_CONFIG.branding.themeColor}; text-decoration: none;">${CLUB_CONFIG.phone.main}</a>
          </p>
          <p style="margin: 5px 0; font-size: 14px;">
            E-Mail: <a href="mailto:${CLUB_CONFIG.email.info}" style="color: ${CLUB_CONFIG.branding.themeColor}; text-decoration: none;">${CLUB_CONFIG.email.info}</a>
          </p>
          <p style="margin: 5px 0; font-size: 14px;">
            Web: <a href="${CLUB_CONFIG.website.url}" style="color: ${CLUB_CONFIG.branding.themeColor}; text-decoration: none;">${CLUB_CONFIG.website.urlWithoutProtocol}</a>
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #999; margin: 0;">${CLUB_CONFIG.display.copyright}</p>
        </div>
      </div>
    </div>
  `;

  return { subject, htmlContent };
}
