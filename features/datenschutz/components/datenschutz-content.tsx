'use client';

import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';
import { Grain } from '@/features/landing-page/components/tactic';

/**
 * The body of the standalone Datenschutzerklärung at `/datenschutz`, on the
 * paper ground — the long-form Read register of the Trainertafel world (see
 * DESIGN.md). Warm ink on paper, Archivo section headings, orange list markers
 * and links set as a soft marker highlight rather than an underline.
 *
 * It used to be the second half of the Impressum page, reachable only as
 * `/impressum#datenschutz`. A privacy policy that lives behind a fragment on
 * another page's document is legal but reads as an afterthought — and a Play
 * Store review expects a URL whose whole subject is the policy. The page owns
 * the H1 now, so this component starts straight at the first section.
 */
export default function DatenschutzContent() {
  const preambleT = useTranslations('legalPage.privacy.preamble');
  const responsiblePartyT = useTranslations('legalPage.privacy.responsibleParty');
  const controllerRolesT = useTranslations('legalPage.privacy.controllerRoles');
  const processingOverviewT = useTranslations('legalPage.privacy.processingOverview');
  const legalBasisT = useTranslations('legalPage.privacy.legalBasis');
  const securityMeasuresT = useTranslations('legalPage.privacy.securityMeasures');
  const webHostingT = useTranslations('legalPage.privacy.webHosting');
  const cookiesT = useTranslations('legalPage.privacy.cookies');
  const contactRequestsT = useTranslations('legalPage.privacy.contactRequests');
  const appSectionsT = useTranslations('legalPage.privacy.appSections');
  const childrenT = useTranslations('legalPage.privacy.childrenAndMinors');
  const dataSubjectRightsT = useTranslations('legalPage.privacy.dataSubjectRights');
  const socialMediaT = useTranslations('legalPage.privacy.socialMedia');
  const dataRetentionT = useTranslations('legalPage.privacy.dataRetention');
  const definitionsT = useTranslations('legalPage.privacy.definitions');

  const processedDataTypes = processingOverviewT.raw('processedDataTypes') as string[];
  const affectedPeople = processingOverviewT.raw('affectedPeople') as string[];
  const purposes = processingOverviewT.raw('purposes') as string[];
  const controllerRoleItems = controllerRolesT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const legalBasisItems = legalBasisT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const securityMeasures = securityMeasuresT.raw('measures') as string[];
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
  const cookieTableItems = cookiesT.raw('tableItems') as Array<{
    title: string;
    description: string;
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
  const childrenItems = childrenT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const dataSubjectRightsItems = dataSubjectRightsT.raw('items') as Array<{
    title: string;
    description: string;
  }>;
  const socialMediaItems = socialMediaT.raw('instagramItems') as Array<{
    label: string;
    value?: string;
  }>;
  const dataRetentionTechnicalItems = dataRetentionT.raw('technicalItems') as Array<{
    title: string;
    description: string;
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
      className='relative w-full overflow-hidden bg-paper pb-16 [&_strong]:font-semibold [&_strong]:text-ink'>
      <Grain tone='paper' />

      <div className='relative mx-auto max-w-3xl px-6 pt-4 sm:px-8 md:pt-8'>
        {/* Präambel */}
        <Section title={preambleT('title')} first>
          <p className={bodyText}>{preambleT('paragraph1')}</p>
          <p className={`mt-4 ${bodyText}`}>{preambleT('paragraph2')}</p>
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
            <p>
              {responsiblePartyT('phoneLabel')}{' '}
              <a href={`tel:${CLUB_CONFIG.phone.main}`} className={linkClass}>
                {CLUB_CONFIG.phone.main}
              </a>
            </p>
          </div>
          <p className={`mt-6 ${bodyText}`}>
            <strong>{responsiblePartyT('dpoLabel')}</strong>{' '}
            {responsiblePartyT('dpoText')}
          </p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{responsiblePartyT('supervisoryLabel')}</strong>{' '}
            {responsiblePartyT('supervisoryText')}
          </p>
        </Section>

        {/* Wer ist wofür verantwortlich? — die Rollenteilung Verein/Anbieter,
            ohne die der Rest der Erklärung nicht zu lesen ist. */}
        <Section title={controllerRolesT('title')}>
          <p className={bodyText}>{controllerRolesT('description')}</p>
          <ul className={listClass}>
            {controllerRoleItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
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
          <h3 className={h3Class}>{securityMeasuresT('measuresTitle')}</h3>
          <ul className={listClass}>
            {securityMeasures.map(measure => (
              <li key={measure} className={liClass}>
                {measure}
              </li>
            ))}
          </ul>
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
            <LabelledList
              items={vercelItems}
              bodyText={bodyText}
              linkClass={linkClass}
            />
          </div>

          {/* Vercel Analytics & Speed Insights */}
          <div className={subBlock}>
            <h3 className='font-display text-lg font-bold tracking-tight text-ink'>
              {webHostingT('analyticsTitle')}
            </h3>
            <p className={`mt-4 ${bodyText}`}>{webHostingT('analyticsDescription')}</p>
            <LabelledList
              items={analyticsItems}
              bodyText={bodyText}
              linkClass={linkClass}
            />
          </div>
        </Section>

        {/* Cookies und Speicherung auf dem Endgerät */}
        <Section title={cookiesT('title')}>
          <p className={bodyText}>{cookiesT('description')}</p>
          <h3 className={h3Class}>{cookiesT('tableTitle')}</h3>
          <ul className={listClass}>
            {cookieTableItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
          <p className={`mt-6 ${bodyText}`}>
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

        {/* Kontakt-, Feedback- und Anfrageverwaltung */}
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
                <LabelledList
                  items={section.items}
                  bodyText={bodyText}
                  linkClass={linkClass}
                />
              )}
            </div>
          ))}
        </Section>

        {/* Kinder und Jugendliche — Statix läuft in Jugendmannschaften, also
            gehört das an eine eigene Überschrift und nicht in eine Fußnote. */}
        <Section title={childrenT('title')}>
          <p className={bodyText}>{childrenT('description')}</p>
          <ul className={listClass}>
            {childrenItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
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
          <p className={`mt-6 ${bodyText}`}>
            <strong>{dataSubjectRightsT('howToLabel')}</strong>{' '}
            {dataSubjectRightsT('howToText')}
          </p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{dataSubjectRightsT('obligationLabel')}</strong>{' '}
            {dataSubjectRightsT('obligationText')}
          </p>
        </Section>

        {/* Präsenzen in sozialen Netzwerken */}
        <Section title={socialMediaT('title')}>
          <p className={bodyText}>{socialMediaT('description')}</p>
          <LabelledList
            items={socialMediaItems}
            bodyText={bodyText}
            linkClass={linkClass}
          />
        </Section>

        {/* Speicherdauer und Löschung */}
        <Section title={dataRetentionT('title')}>
          <p className={bodyText}>{dataRetentionT('description')}</p>
          <p className={`mt-4 ${bodyText}`}>
            <strong>{dataRetentionT('technicalLabel')}</strong>{' '}
            {dataRetentionT('technicalText')}
          </p>
          <ul className={listClass}>
            {dataRetentionTechnicalItems.map(item => (
              <li key={item.title} className={liClass}>
                <strong>{item.title}</strong> - {item.description}
              </li>
            ))}
          </ul>
          <p className={`mt-6 ${bodyText}`}>
            <strong>{dataRetentionT('contentLabel')}</strong>{' '}
            {dataRetentionT('contentText')}
          </p>
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
 * The recurring "Label: value" block under a processing description. A row
 * whose entry carries a `url` renders the URL itself as the link text, which is
 * what a privacy policy wants — a reader must be able to copy the address out
 * of a printout. Rendered from the array, never by index, so inserting a row
 * (a new legal basis, a transfer basis) cannot silently shift a link onto the
 * wrong label the way the previous hand-indexed markup did.
 */
function LabelledList({
  items,
  bodyText,
  linkClass,
}: {
  items: Array<{ label: string; value?: string; url?: string }>;
  bodyText: string;
  linkClass: string;
}) {
  return (
    <div className={`mt-4 space-y-2 ${bodyText}`}>
      {items.map(item => (
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
    <section className={first ? 'mt-10' : 'mt-12 border-t border-ink/10 pt-10'}>
      <h2 className='font-display text-[1.5rem] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink sm:text-[1.7rem]'>
        {title}
      </h2>
      <div className='mt-6'>{children}</div>
    </section>
  );
}
