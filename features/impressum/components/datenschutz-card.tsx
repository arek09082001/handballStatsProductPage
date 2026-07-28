'use client';

import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { BoardKicker, Grain, MarkerUnderline } from '@/features/landing-page/components/tactic';

/**
 * The Datenschutzerklärung on the paper ground — the long-form Read register of
 * the Trainertafel world (see DESIGN.md). Warm ink on paper, Archivo section
 * headings each carrying a short marker swipe, orange list markers and links set
 * as a soft marker highlight rather than an underline. Structured i18n content,
 * every source string and outbound link preserved from the previous version.
 */
export default function DatenschutzCard() {
  const privacyT = useTranslations('legalPage.privacy');
  const preambleT = useTranslations('legalPage.privacy.preamble');
  const responsiblePartyT = useTranslations('legalPage.privacy.responsibleParty');
  const processingOverviewT = useTranslations('legalPage.privacy.processingOverview');
  const legalBasisT = useTranslations('legalPage.privacy.legalBasis');
  const securityMeasuresT = useTranslations('legalPage.privacy.securityMeasures');
  const webHostingT = useTranslations('legalPage.privacy.webHosting');
  const cookiesT = useTranslations('legalPage.privacy.cookies');
  const contactRequestsT = useTranslations('legalPage.privacy.contactRequests');
  const appSectionsT = useTranslations('legalPage.privacy.appSections');
  const dataSubjectRightsT = useTranslations('legalPage.privacy.dataSubjectRights');
  const socialMediaT = useTranslations('legalPage.privacy.socialMedia');
  const dataRetentionT = useTranslations('legalPage.privacy.dataRetention');
  const definitionsT = useTranslations('legalPage.privacy.definitions');

  const processedDataTypes = processingOverviewT.raw('processedDataTypes') as string[];
  const affectedPeople = processingOverviewT.raw('affectedPeople') as string[];
  const purposes = processingOverviewT.raw('purposes') as string[];
  const legalBasisItems = legalBasisT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const webHostingSummaryItems = webHostingT.raw('summaryItems') as Array<{
    label: string;
    value: string;
  }>;
  const vercelItems = webHostingT.raw('vercelItems') as Array<{
    label: string;
    value?: string;
  }>;
  const analyticsItems = webHostingT.raw('analyticsItems') as Array<{
    label: string;
    value?: string;
  }>;
  const cookieItems = cookiesT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const contactRequestItems = contactRequestsT.raw('items') as Array<{
    label: string;
    value: string;
  }>;
  const appSections = appSectionsT.raw('sections') as Array<{
    title: string;
    paragraphs: string[];
    items?: Array<{ label: string; value?: string; url?: string }>;
  }>;
  const dataSubjectRightsItems = dataSubjectRightsT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const socialMediaItems = socialMediaT.raw('instagramItems') as Array<{
    label: string;
    value?: string;
  }>;
  const dataRetentionItems = dataRetentionT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const definitionItems = definitionsT.raw('items') as Array<{
    title: string;
    description: string;
  }>;

  const bodyText = 'text-[1.0625rem] leading-[1.72] text-ink/80 [overflow-wrap:anywhere]';
  const listClass = 'mt-4 list-disc space-y-2 pl-6 marker:text-primary/60';
  const liClass = 'text-[1.0625rem] leading-[1.68] text-ink/80 [overflow-wrap:anywhere]';
  const h3Class = 'mt-8 font-display text-lg font-bold tracking-tight text-ink';
  const subBlock = 'mt-8 border-t border-ink/10 pt-6';
  const linkClass =
    'font-semibold text-ink no-underline break-words [overflow-wrap:anywhere] [box-shadow:inset_0_-0.28em_0_hsl(var(--primary)/0.18)] transition-shadow hover:[box-shadow:inset_0_-0.6em_0_hsl(var(--primary)/0.26)]';

  return (
    <section
      id='datenschutz'
      data-download-section='datenschutz'
      className='relative w-full overflow-hidden bg-paper pb-16 scroll-mt-24 [&_strong]:font-semibold [&_strong]:text-ink'>
      <Grain tone='paper' />

      <div className='relative mx-auto max-w-3xl px-6 pt-14 sm:px-8 md:pt-20'>
        {/* Kopf */}
        <BoardKicker color='marker'>{privacyT('shortTitle')}</BoardKicker>
        <h2 className='mt-3 font-display text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.2rem]'>
          <span className='relative inline-block'>
            {privacyT('title')}
            <MarkerUnderline color='marker' strokeWidth={4} className='opacity-70' />
          </span>
        </h2>

        {/* Präambel */}
        <Section title={preambleT('title')} first>
          <p className={bodyText}>{preambleT('paragraph1')}</p>
          <p className={`mt-4 ${bodyText}`}>{preambleT('paragraph2')}</p>
          <p className='mt-4 text-sm text-ink/50'>{preambleT('updatedAt')}</p>
        </Section>

        {/* Verantwortlicher */}
        <Section title={responsiblePartyT('title')}>
          <div className={`space-y-2 ${bodyText}`}>
            <p className='font-semibold text-ink'>
              {CLUB_CONFIG.legal.responsiblePerson} / {CLUB_CONFIG.fullName}
            </p>
            <p>
              {CLUB_CONFIG.address.careOf}
              <br />
              {CLUB_CONFIG.address.street}
              <br />
              {CLUB_CONFIG.address.postalCode} {CLUB_CONFIG.address.city},{' '}
              {CLUB_CONFIG.address.country}
            </p>
            <p>
              {responsiblePartyT('representativesLabel')}{' '}
              {CLUB_CONFIG.legal.responsiblePerson}
            </p>
            <p>
              {responsiblePartyT('emailLabel')}{' '}
              <a href={`mailto:${CLUB_CONFIG.email.main}`} className={linkClass}>
                {CLUB_CONFIG.email.main}
              </a>
            </p>
          </div>
        </Section>

        {/* Übersicht der Verarbeitungen */}
        <Section title={processingOverviewT('title')}>
          <p className={bodyText}>{processingOverviewT('description')}</p>

          <h3 className={h3Class}>{processingOverviewT('processedDataTypesTitle')}</h3>
          <ul className={listClass}>
            {processedDataTypes.map(item => (
              <li key={item} className={liClass}>
                {item}
              </li>
            ))}
          </ul>

          <h3 className={h3Class}>{processingOverviewT('affectedPeopleTitle')}</h3>
          <ul className={listClass}>
            {affectedPeople.map(item => (
              <li key={item} className={liClass}>
                {item}
              </li>
            ))}
          </ul>

          <h3 className={h3Class}>{processingOverviewT('purposesTitle')}</h3>
          <ul className={listClass}>
            {purposes.map(item => (
              <li key={item} className={liClass}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Maßgebliche Rechtsgrundlagen */}
        <Section title={legalBasisT('title')}>
          <p className={bodyText}>
            <strong>{legalBasisT('introLabel')}</strong> {legalBasisT('introText')}
          </p>
          <ul className={listClass}>
            {legalBasisItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
        </Section>

        {/* Sicherheitsmaßnahmen */}
        <Section title={securityMeasuresT('title')}>
          <p className={bodyText}>{securityMeasuresT('paragraph1')}</p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{securityMeasuresT('connectionLabel')}</strong>{' '}
            {securityMeasuresT('connectionText')}
          </p>
        </Section>

        {/* Bereitstellung des Onlineangebots und Webhosting */}
        <Section title={webHostingT('title')}>
          <p className={bodyText}>{webHostingT('description')}</p>
          <div className={`mt-4 space-y-2 ${bodyText}`}>
            {webHostingSummaryItems.map(item => (
              <p key={item.label}>
                <strong>{item.label}</strong> {item.value}
              </p>
            ))}
          </div>

          {/* Auftragsverarbeitung */}
          <div className={subBlock}>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              {webHostingT('processorSectionTitle')}
            </h3>
            <p className={`mt-4 ${bodyText}`}>{webHostingT('processorSectionText')}</p>
          </div>

          {/* Vercel */}
          <div className={subBlock}>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              {webHostingT('vercelTitle')}
            </h3>
            <p className={`mt-4 ${bodyText}`}>{webHostingT('vercelDescription')}</p>
            <div className={`mt-4 space-y-2 ${bodyText}`}>
              <p>
                <strong>{vercelItems[0].label}</strong> {vercelItems[0].value}
              </p>
              <p>
                <strong>{vercelItems[1].label}</strong>{' '}
                <a
                  href='https://vercel.com/legal/dpa'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClass}>
                  https://vercel.com/legal/dpa
                </a>
              </p>
              <p>
                <strong>{vercelItems[2].label}</strong>{' '}
                <a
                  href='https://vercel.com/legal/dpa'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClass}>
                  https://vercel.com/legal/dpa
                </a>
              </p>
            </div>
          </div>

          {/* Vercel Analytics & Speed Insights */}
          <div className={subBlock}>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              {webHostingT('analyticsTitle')}
            </h3>
            <p className={`mt-4 ${bodyText}`}>{webHostingT('analyticsDescription')}</p>
            <div className={`mt-4 space-y-2 ${bodyText}`}>
              <p>
                <strong>{analyticsItems[0].label}</strong> {analyticsItems[0].value}
              </p>
              <p>
                <strong>{analyticsItems[1].label}</strong> {analyticsItems[1].value}
              </p>
              <p>
                <strong>{analyticsItems[2].label}</strong> {analyticsItems[2].value}
              </p>
              <p>
                <strong>{analyticsItems[3].label}</strong>{' '}
                <a
                  href='https://vercel.com/legal/privacy-policy'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClass}>
                  https://vercel.com/legal/privacy-policy
                </a>
              </p>
              <p>
                <strong>{analyticsItems[4].label}</strong> {analyticsItems[4].value}
              </p>
            </div>
          </div>
        </Section>

        {/* Einsatz von Cookies */}
        <Section title={cookiesT('title')}>
          <p className={bodyText}>{cookiesT('description')}</p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{cookiesT('storageDurationLabel')}</strong>{' '}
            {cookiesT('storageDurationText')}
          </p>
          <ul className={listClass}>
            {cookieItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> {item.description}
              </li>
            ))}
          </ul>
        </Section>

        {/* Kontakt- und Anfrageverwaltung */}
        <Section title={contactRequestsT('title')}>
          <p className={bodyText}>{contactRequestsT('description')}</p>
          <div className={`mt-4 space-y-2 ${bodyText}`}>
            {contactRequestItems.map(item => (
              <p key={item.label}>
                <strong>{item.label}</strong> {item.value}
              </p>
            ))}
          </div>
        </Section>

        {/* Datenverarbeitung in der Statix App */}
        <Section title={appSectionsT('title')}>
          <p className={bodyText}>{appSectionsT('intro')}</p>
          {appSections.map((section, index) => (
            <div key={section.title} className={index === 0 ? 'mt-6' : subBlock}>
              <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
                {section.title}
              </h3>
              {section.paragraphs.map(paragraph => (
                <p key={paragraph} className={`mt-4 ${bodyText}`}>
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <div className={`mt-4 space-y-2 ${bodyText}`}>
                  {section.items.map(item => (
                    <p key={item.label}>
                      <strong>{item.label}</strong>{' '}
                      {item.url ? (
                        <a
                          href={item.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={linkClass}>
                          {item.url}
                        </a>
                      ) : (
                        item.value
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Section>

        {/* Rechte der betroffenen Personen */}
        <Section title={dataSubjectRightsT('title')}>
          <p className={bodyText}>{dataSubjectRightsT('description')}</p>
          <ul className={listClass}>
            {dataSubjectRightsItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> {item.description}
              </li>
            ))}
          </ul>
        </Section>

        {/* Präsenzen in sozialen Netzwerken */}
        <Section title={socialMediaT('title')}>
          <p className={bodyText}>{socialMediaT('description')}</p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{socialMediaItems[0].label}</strong> {socialMediaItems[0].value}{' '}
            <strong>{socialMediaItems[1].label}</strong> {socialMediaItems[1].value}{' '}
            <strong>{socialMediaItems[2].label}</strong>{' '}
            <a
              href='https://www.instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              className={linkClass}>
              https://www.instagram.com
            </a>
            ;<strong> {socialMediaItems[3].label}</strong>{' '}
            <a
              href='https://privacycenter.instagram.com/policy/'
              target='_blank'
              rel='noopener noreferrer'
              className={linkClass}>
              https://privacycenter.instagram.com/policy/
            </a>
            . <strong>{socialMediaItems[4].label}</strong> {socialMediaItems[4].value}
          </p>
        </Section>

        {/* Allgemeine Informationen zur Datenspeicherung und Löschung */}
        <Section title={dataRetentionT('title')}>
          <p className={bodyText}>{dataRetentionT('description')}</p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{dataRetentionT('retentionLabel')}</strong>{' '}
            {dataRetentionT('retentionText')}
          </p>
          <ul className={listClass}>
            {dataRetentionItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
        </Section>

        {/* Begriffsdefinitionen */}
        <Section title={definitionsT('title')}>
          <p className={bodyText}>{definitionsT('description')}</p>
          <ul className={listClass}>
            {definitionItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> {item.description}
              </li>
            ))}
          </ul>
          <p className='mt-6 text-sm text-ink/50'>
            <a
              href='https://datenschutz-generator.de/'
              title={definitionsT('generatorLinkTitle')}
              target='_blank'
              rel='noopener noreferrer nofollow'
              className={linkClass}>
              {definitionsT('generatorLinkLabel')}
            </a>
          </p>
        </Section>
      </div>
    </section>
  );
}

/**
 * A single privacy section on the paper ground: an Archivo heading carrying a
 * short marker swipe, seated below a hairline ink divider with generous space
 * above it (more room over the heading than under, per the reading rhythm).
 */
function Section({
  title,
  children,
  first = false,
}: {
  title: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <section className={first ? 'mt-12' : 'mt-12 border-t border-ink/10 pt-10'}>
      <h2 className='font-display text-[1.5rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[1.7rem]'>
        {title}
      </h2>
      <div className='mt-6'>{children}</div>
    </section>
  );
}
