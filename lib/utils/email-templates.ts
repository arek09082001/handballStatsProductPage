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

interface FeedbackSummaryData {
  rating: number;
  ratingLabel: string;
  categoryLabel: string;
  message: string;
  /** Empty when the visitor sent the feedback anonymously. */
  name: string;
  /** Empty when the visitor sent the feedback anonymously. */
  email: string;
}

interface FeedbackConfirmationData {
  name: string;
  categoryLabel: string;
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

// ─── Feedback ────────────────────────────────────────────────────────────────

/**
 * Render the rating as filled and empty stars. Entities instead of the emoji
 * characters, because a fair share of desktop mail clients render `★` from a
 * fallback font and the row ends up ragged.
 */
function ratingStars(rating: number): string {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));

  return `<span style="font-size:18px;letter-spacing:2px;color:${ACCENT};">${'&#9733;'.repeat(
    filled
  )}<span style="color:#cbd5e1;">${'&#9733;'.repeat(5 - filled)}</span></span>`;
}

/**
 * Generate the feedback summary sent to the team — one card with the rating,
 * the area the feedback is about and who sent it, followed by the verbatim
 * message. This is the mail the feedback page exists for; everything else on
 * the route is there to fill it in.
 */
export function generateFeedbackSummaryEmail(data: FeedbackSummaryData): {
  subject: string;
  htmlContent: string;
} {
  const safeCategory = escapeHtml(data.categoryLabel);
  const safeRatingLabel = escapeHtml(data.ratingLabel);
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br />');
  const hasSender = data.email.trim() !== '' || data.name.trim() !== '';
  const safeName = escapeHtml(data.name.trim() || 'Anonym');
  const safeEmail = escapeHtml(data.email.trim());

  // The subject is plain text, not HTML — escaping it here would put a literal
  // "&amp;" in the inbox. The category label is a server-side constant, so the
  // raw value is safe to use.
  const subject = `Neues Feedback (${data.rating}/5): ${data.categoryLabel}`;

  const senderRow = hasSender
    ? `<p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Von:</strong> ${safeName}${
        safeEmail
          ? ` &middot; <a href="mailto:${safeEmail}" style="color:${ACCENT};text-decoration:none;">${safeEmail}</a>`
          : ''
      }</p>`
    : `<p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Von:</strong> Anonym (keine Kontaktdaten hinterlassen)</p>`;

  const content = `
    ${eyebrow('Neues Feedback')}
    ${heading(safeCategory)}
    ${infoCard(
      `<p style="margin:4px 0 10px;font-size:14px;color:#374151;"><strong>Bewertung:</strong> ${ratingStars(
        data.rating
      )} <span style="color:#64748b;">${data.rating}/5 &middot; ${safeRatingLabel}</span></p>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Bereich:</strong> ${safeCategory}</p>
       ${senderRow}`
    )}
    <div style="border:1px solid #e2e8f0;border-radius:10px;padding:16px 18px;margin:0 0 20px;">
      <h3 style="margin:0 0 10px;font-size:15px;color:#1e293b;">Feedback</h3>
      <p style="margin:0;font-size:15px;color:#374151;line-height:1.65;">${safeMessage}</p>
    </div>
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      ${
        safeEmail
          ? `Antworten Sie direkt an <a href="mailto:${safeEmail}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${safeEmail}</a>.`
          : 'Dieses Feedback wurde ohne Kontaktdaten abgegeben – eine Antwort ist nicht möglich.'
      }
    </p>
  `;

  return {
    subject,
    htmlContent: generateStatixEmailShell({ content, preheader: subject }),
  };
}

/**
 * Generate the acknowledgement sent back to a visitor who left an e-mail
 * address with their feedback. Skipped entirely for anonymous submissions.
 */
export function generateFeedbackConfirmationEmail(
  data: FeedbackConfirmationData
): { subject: string; htmlContent: string } {
  const safeName = escapeHtml(data.name.trim());
  const safeCategory = escapeHtml(data.categoryLabel);
  const subject = `Danke für dein Feedback – ${CLUB_CONFIG.name}`;

  const content = `
    ${eyebrow('Feedback erhalten')}
    ${heading(safeName ? `Danke, ${safeName}!` : 'Danke für dein Feedback!')}
    ${paragraph(`Dein Feedback zum Bereich <strong>${safeCategory}</strong> ist bei uns angekommen.`, 12)}
    ${paragraph('Wir lesen jede Rückmeldung selbst und lassen sie direkt in die Weiterentwicklung von Statix einfließen. Wenn wir Rückfragen haben, melden wir uns persönlich bei dir.')}
    ${infoCard(
      `<h3 style="margin:0 0 10px;font-size:15px;color:#1e293b;">Dein Feedback im Überblick</h3>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Bereich:</strong> ${safeCategory}</p>
       <p style="margin:4px 0;font-size:14px;color:#374151;"><strong>Status:</strong> Eingegangen</p>`
    )}
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      <strong style="color:#374151;">Hinweis:</strong> Diese E-Mail wurde automatisch erstellt. Bitte antworte nicht direkt auf diese Nachricht.
      Du erreichst uns unter
      <a href="mailto:${CLUB_CONFIG.email.info}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${CLUB_CONFIG.email.info}</a>.
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
