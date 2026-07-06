import { CLUB_CONFIG } from '@/lib/club-config';
import { SITE_URL } from '@/lib/seo';

/**
 * Statix branded email shell.
 *
 * A single, reusable transactional-email frame — dark branded header with the
 * Statix app logo, a white content area, and a dark footer with navigation and
 * legal links. Every outgoing email (contact, newsletter, notifications, …)
 * wraps its body in this shell so the whole product speaks with one voice.
 *
 * Images are served as absolute URLs from a public Supabase Storage bucket so
 * they render reliably in every email client.
 */

const SUPABASE_STORAGE =
  'https://yrrpdrsagfxtpjcdubau.supabase.co/storage/v1/object/public/email-assets';
const LOGO_URL = `${SUPABASE_STORAGE}/statix-logo.png`;

// Brand palette (shared with the app shell).
const HEADER_BG = '#0b1220';
const FOOTER_BG = '#0f172a';
const ACCENT = '#ea6a1d';
const PAGE_BG = '#eef2f7';

type Locale = 'en' | 'de';

export interface StatixEmailShellOptions {
  /** Inner HTML for the white content area. */
  content: string;
  /** Hidden preview text shown in the inbox list. */
  preheader?: string;
  /** Footer + tagline language. Defaults to German. */
  locale?: Locale;
  /** When set, renders a GDPR unsubscribe link in the footer. */
  unsubscribeUrl?: string;
}

const COPY: Record<Locale, {
  tagline: string;
  home: string;
  imprint: string;
  privacy: string;
  rights: string;
  unsubscribe: string;
}> = {
  de: {
    tagline: 'Statistik-App für Handball',
    home: 'Startseite',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    rights: 'Alle Rechte vorbehalten',
    unsubscribe: 'Vom Newsletter abmelden',
  },
  en: {
    tagline: 'Handball statistics, live',
    home: 'Home',
    imprint: 'Imprint',
    privacy: 'Privacy',
    rights: 'All rights reserved',
    unsubscribe: 'Unsubscribe from the newsletter',
  },
};

/**
 * Wrap arbitrary email content in the branded Statix shell.
 */
export function generateStatixEmailShell({
  content,
  preheader,
  locale = 'de',
  unsubscribeUrl,
}: StatixEmailShellOptions): string {
  const t = COPY[locale];
  const year = new Date().getFullYear();

  const preheaderHtml = preheader
    ? `<div style="display:none;font-size:1px;color:${PAGE_BG};max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>`
    : '';

  const unsubscribeRow = unsubscribeUrl
    ? `<tr>
                  <td align="center" style="padding-top:10px;">
                    <a href="${unsubscribeUrl}" style="color:#64748b;font-size:11px;text-decoration:underline;">${t.unsubscribe}</a>
                  </td>
                </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${CLUB_CONFIG.name}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${PAGE_BG};font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  ${preheaderHtml}

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${PAGE_BG};">
    <tr>
      <td align="center" style="padding:32px 16px 48px;">

        <!-- Email card (600px) -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;border-radius:14px;overflow:hidden;
                      box-shadow:0 8px 40px rgba(15,23,42,0.14);">

          <!-- ── HEADER: logo + wordmark ── -->
          <tr>
            <td bgcolor="${HEADER_BG}" style="background-color:${HEADER_BG};padding:26px 40px;border-bottom:3px solid ${ACCENT};">
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${LOGO_URL}" alt="${CLUB_CONFIG.name}" width="52" height="52"
                         style="display:block;border:0;width:52px;height:52px;" />
                  </td>
                  <td style="vertical-align:middle;padding-left:14px;">
                    <div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;line-height:1.1;">${CLUB_CONFIG.name}</div>
                    <div style="font-size:12px;color:#94a3b8;letter-spacing:0.04em;padding-top:3px;">${t.tagline}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── CONTENT ── -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 36px;">
              ${content}
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td bgcolor="${FOOTER_BG}" style="background-color:${FOOTER_BG};padding:26px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:18px;">
                    <a href="${SITE_URL}" style="color:#94a3b8;text-decoration:none;font-size:12px;margin:0 7px;display:inline-block;">${t.home}</a>
                    <span style="color:#334155;font-size:12px;">·</span>
                    <a href="${SITE_URL}/impressum" style="color:#94a3b8;text-decoration:none;font-size:12px;margin:0 7px;display:inline-block;">${t.imprint}</a>
                    <span style="color:#334155;font-size:12px;">·</span>
                    <a href="${CLUB_CONFIG.social.instagram.url}" style="color:#94a3b8;text-decoration:none;font-size:12px;margin:0 7px;display:inline-block;">Instagram</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="border-top:1px solid #1e293b;padding-top:16px;padding-bottom:14px;">
                    <p style="margin:0 0 6px;font-size:11px;color:#475569;line-height:1.7;">
                      ${CLUB_CONFIG.fullName}&nbsp;&middot;&nbsp;${CLUB_CONFIG.address.street}&nbsp;&middot;&nbsp;${CLUB_CONFIG.address.cityWithPostal}
                    </p>
                    <p style="margin:0;font-size:11px;color:#475569;">
                      <a href="mailto:${CLUB_CONFIG.email.info}" style="color:${ACCENT};text-decoration:none;">${CLUB_CONFIG.email.info}</a>
                    </p>
                  </td>
                </tr>
                ${unsubscribeRow}
                <tr>
                  <td align="center" style="border-top:1px solid #1e293b;padding:12px 0 18px;">
                    <p style="margin:0;font-size:10px;color:#334155;">
                      &copy; ${year}&nbsp;${CLUB_CONFIG.shortName}&nbsp;&middot;&nbsp;${t.rights}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}
