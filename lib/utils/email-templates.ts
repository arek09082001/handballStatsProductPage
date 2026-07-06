import { CLUB_CONFIG } from '@/lib/club-config';
import { generateStatixEmailShell } from '@/lib/utils/statix-email-shell';

/**
 * Email Templates Utility
 *
 * Reusable transactional-email templates. Every template renders its body into
 * the shared Statix email shell (`generateStatixEmailShell`) so all outgoing
 * mail — confirmations, notifications, newsletter — shares one branded frame.
 */

const ACCENT = '#ea6a1d';

interface ContactConfirmationData {
  name: string;
  topic: string;
}

interface ContactNotificationData {
  name: string;
  email: string;
  topic: string;
  message: string;
}

interface RentalConfirmationData {
  name: string;
  eventType: string;
  eventDate: string;
}

interface NewsletterConfirmationData {
  confirmUrl: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Shared content building blocks ──────────────────────────────────────────

function eyebrow(text: string): string {
  return `<p style="margin:0 0 6px;font-size:10px;color:${ACCENT};text-transform:uppercase;letter-spacing:0.15em;font-family:monospace;font-weight:600;">${text}</p>`;
}

function heading(html: string): string {
  return `<h2 style="margin:0 0 18px;font-size:23px;color:#0f172a;font-weight:800;letter-spacing:-0.03em;line-height:1.3;">${html}</h2>`;
}

function paragraph(html: string, marginBottom = 28): string {
  return `<p style="margin:0 0 ${marginBottom}px;font-size:15px;color:#374151;line-height:1.75;">${html}</p>`;
}

function ctaButton(url: string, label: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
      <tr>
        <td style="border-radius:10px;background:${ACCENT};">
          <a href="${url}" style="display:inline-block;padding:15px 32px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:-0.01em;border-radius:10px;">${label}&nbsp;&rarr;</a>
        </td>
      </tr>
    </table>`;
}

function infoCard(innerHtml: string): string {
  return `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 20px;">${innerHtml}</div>`;
}

// ─── Newsletter double opt-in ────────────────────────────────────────────────

/**
 * Generate the newsletter double opt-in confirmation email.
 */
export function generateNewsletterConfirmationEmail(
  data: NewsletterConfirmationData
): { subject: string; htmlContent: string } {
  const confirmUrl = data.confirmUrl;
  const subject = `Bitte bestätige deine Newsletter-Anmeldung – ${CLUB_CONFIG.name}`;

  const content = `
    ${eyebrow('Newsletter Bestätigung')}
    ${heading('Nur noch ein Schritt')}
    ${paragraph('Vielen Dank für dein Interesse am <strong>Statix</strong>-Newsletter.', 12)}
    ${paragraph('Bestätige deine E-Mail-Adresse mit einem Klick, um ab sofort Produktneuheiten, Tipps und Updates rund um Handball-Statistik zu erhalten.')}
    ${ctaButton(confirmUrl, 'Anmeldung bestätigen')}
    ${infoCard(
      `<p style="margin:0 0 8px;font-size:13px;color:#64748b;line-height:1.6;">Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:</p>
       <p style="margin:0;font-size:13px;line-height:1.6;word-break:break-all;"><a href="${confirmUrl}" style="color:${ACCENT};text-decoration:underline;">${confirmUrl}</a></p>`
    )}
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Du hast dich nicht angemeldet? Dann ignoriere diese E-Mail einfach – ohne Bestätigung wird deine Adresse <strong>nicht</strong> in unseren Verteiler aufgenommen.
    </p>
  `;

  return {
    subject,
    htmlContent: generateStatixEmailShell({ content, preheader: subject }),
  };
}

// ─── Contact confirmation (to visitor) ───────────────────────────────────────

/**
 * Generate confirmation email for contact form submission.
 */
export function generateContactConfirmationEmail(
  data: ContactConfirmationData
): { subject: string; htmlContent: string } {
  const safeName = escapeHtml(data.name);
  const safeTopic = escapeHtml(data.topic);
  const subject = `Ihre Anfrage ist eingegangen – ${CLUB_CONFIG.name}`;

  const content = `
    ${eyebrow('Kontaktanfrage')}
    ${heading(`Vielen Dank, ${safeName}!`)}
    ${paragraph(`Ihre Nachricht zum Thema <strong>${safeTopic}</strong> ist erfolgreich bei uns eingegangen.`, 12)}
    ${paragraph('Wir melden uns zeitnah persönlich bei Ihnen zurück.')}
    ${infoCard(
      `<h3 style="margin:0 0 10px;font-size:15px;color:#1e293b;">Ihre Anfrage im Überblick</h3>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Thema:</strong> ${safeTopic}</p>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Status:</strong> Eingegangen</p>`
    )}
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      <strong style="color:#374151;">Hinweis:</strong> Diese E-Mail wurde automatisch erstellt. Bitte antworten Sie nicht direkt auf diese Nachricht.
      Bei Rückfragen erreichen Sie uns unter
      <a href="mailto:${CLUB_CONFIG.email.info}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${CLUB_CONFIG.email.info}</a>.
    </p>
  `;

  return {
    subject,
    htmlContent: generateStatixEmailShell({ content, preheader: subject }),
  };
}

// ─── Contact notification (to team) ──────────────────────────────────────────

/**
 * Generate the internal notification email sent to the team when a visitor
 * submits the contact form.
 */
export function generateContactNotificationEmail(
  data: ContactNotificationData
): { subject: string; htmlContent: string } {
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeTopic = escapeHtml(data.topic);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br />');
  const subject = `Neue Kontaktanfrage: ${safeTopic} – ${safeName}`;

  const content = `
    ${eyebrow('Neue Kontaktanfrage')}
    ${heading(safeTopic)}
    ${infoCard(
      `<p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Name:</strong> ${safeName}</p>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>E-Mail:</strong> <a href="mailto:${safeEmail}" style="color:${ACCENT};text-decoration:none;">${safeEmail}</a></p>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Thema:</strong> ${safeTopic}</p>`
    )}
    <div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 20px;">
      <h3 style="margin:0 0 10px;font-size:15px;color:#1e293b;">Nachricht</h3>
      <p style="margin:0;font-size:15px;color:#374151;line-height:1.65;">${safeMessage}</p>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Antworten Sie direkt an
      <a href="mailto:${safeEmail}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${safeEmail}</a>,
      um dieser Person zu antworten.
    </p>
  `;

  return {
    subject,
    htmlContent: generateStatixEmailShell({ content, preheader: subject }),
  };
}

// ─── Consultation / rental confirmation ──────────────────────────────────────

/**
 * Generate confirmation email for consultation requests.
 *
 * Kept compatible with the existing function signature.
 */
export function generateRentalConfirmationEmail(
  data: RentalConfirmationData
): { subject: string; htmlContent: string } {
  const safeName = escapeHtml(data.name);
  const safeEventType = escapeHtml(data.eventType);
  const subject = `Bestätigung Ihrer Anfrage – ${CLUB_CONFIG.name}`;

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
  const formattedDate = escapeHtml(formatDate(data.eventDate));

  const content = `
    ${eyebrow('Anfrage erhalten')}
    ${heading(`Vielen Dank, ${safeName}!`)}
    ${paragraph('Wir haben Ihre Anfrage erfolgreich erhalten und melden uns schnellstmöglich, um die Details zu besprechen.')}
    ${infoCard(
      `<h3 style="margin:0 0 10px;font-size:15px;color:#1e293b;">Ihre Anfrage</h3>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Thema:</strong> ${safeEventType}</p>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Gewünschter Zeitpunkt:</strong> ${formattedDate}</p>`
    )}
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      <strong style="color:#374151;">Hinweis:</strong> Dies ist eine automatische Eingangsbestätigung. Bitte antworten Sie nicht direkt auf diese E-Mail.
      Bei Rückfragen erreichen Sie uns unter
      <a href="mailto:${CLUB_CONFIG.email.info}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${CLUB_CONFIG.email.info}</a>
      oder telefonisch unter
      <a href="tel:${CLUB_CONFIG.phone.main}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${CLUB_CONFIG.phone.main}</a>.
    </p>
  `;

  return {
    subject,
    htmlContent: generateStatixEmailShell({ content, preheader: subject }),
  };
}
