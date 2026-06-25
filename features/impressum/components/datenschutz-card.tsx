'use client';

import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CLUB_CONFIG } from '@/lib/club-config';

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
  const contentClassName = 'min-w-0 break-words [overflow-wrap:anywhere]';
  const linkClassName = 'text-primary underline break-all [overflow-wrap:anywhere] hover:no-underline';
  const firstSectionClassName = 'w-full pt-2 md:rounded-xl md:border md:border-muted md:p-6 md:pt-6';
  const sectionClassName = 'w-full border-t border-border/50 pt-6 md:rounded-xl md:border md:border-muted md:p-6 md:pt-6';

  return (
    <div
      className='flex w-full items-center justify-center bg-muted pb-12'
      data-download-section='datenschutz'>
      <div className='w-full max-w-4xl px-6 sm:px-8'>
        <div className='flex flex-col gap-8 md:gap-6 md:overflow-hidden md:rounded-xl md:bg-background md:p-8 md:shadow-lg'>
          <h2 className='flex max-w-full flex-wrap items-center justify-center gap-2 text-center text-3xl font-bold text-primary [overflow-wrap:anywhere] md:justify-start md:text-left'>
            <div className='bg-primary rounded-full p-2'>
              <Shield className='text-primary-foreground' />
            </div>
            <span className='md:hidden'>{privacyT('shortTitle')}</span>
            <span className='hidden md:inline'>{privacyT('title')}</span>
          </h2>

          {/* Präambel */}
          <div className={firstSectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{preambleT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{preambleT('paragraph1')}</p>
            <p className={`mb-4 ${contentClassName}`}>{preambleT('paragraph2')}</p>
            <p className='text-sm text-muted-foreground'>{preambleT('updatedAt')}</p>
          </div>

          {/* Verantwortlicher */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{responsiblePartyT('title')}</h2>
            <div className={`space-y-2 ${contentClassName}`}>
              <p className='font-semibold'>
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
                <a
                  href={`mailto:${CLUB_CONFIG.email.main}`}
                  className={linkClassName}>
                  {CLUB_CONFIG.email.main}
                </a>
              </p>
            </div>
          </div>

          {/* Übersicht der Verarbeitungen */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{processingOverviewT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{processingOverviewT('description')}</p>

            <h3 className='mb-2 text-lg font-semibold'>{processingOverviewT('processedDataTypesTitle')}</h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              {processedDataTypes.map(item => (
                <li key={item} className={contentClassName}>{item}</li>
              ))}
            </ul>

            <h3 className='mb-2 text-lg font-semibold'>{processingOverviewT('affectedPeopleTitle')}</h3>
            <ul className='list-disc pl-6 mb-4 space-y-1'>
              {affectedPeople.map(item => (
                <li key={item} className={contentClassName}>{item}</li>
              ))}
            </ul>

            <h3 className='mb-2 text-lg font-semibold'>{processingOverviewT('purposesTitle')}</h3>
            <ul className='list-disc pl-6 space-y-1'>
              {purposes.map(item => (
                <li key={item} className={contentClassName}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Maßgebliche Rechtsgrundlagen */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{legalBasisT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>
              <strong>{legalBasisT('introLabel')}</strong>{' '}
              {legalBasisT('introText')}
            </p>
            <ul className='list-disc pl-6 space-y-3'>
              {legalBasisItems.map(item => (
                <li key={item.title} className={contentClassName}>
                  <strong>{item.title}</strong> - {item.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Sicherheitsmaßnahmen */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{securityMeasuresT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{securityMeasuresT('paragraph1')}</p>
            <p className={`mb-4 ${contentClassName}`}>
              <strong>{securityMeasuresT('connectionLabel')}</strong>{' '}
              {securityMeasuresT('connectionText')}
            </p>
          </div>

          {/* Bereitstellung des Onlineangebots und Webhosting */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{webHostingT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{webHostingT('description')}</p>
            <div className={`space-y-2 ${contentClassName}`}>
              {webHostingSummaryItems.map(item => (
                <p key={item.label}>
                  <strong>{item.label}</strong> {item.value}
                </p>
              ))}
            </div>

            {/* Auftragsverarbeitung */}
            <div className='mt-6 pt-6 border-t border-muted'>
              <h3 className='mb-3 text-lg font-semibold'>{webHostingT('processorSectionTitle')}</h3>
              <p className={`mb-4 ${contentClassName}`}>{webHostingT('processorSectionText')}</p>
            </div>

            {/* Vercel */}
            <div className='mt-6 pt-6 border-t border-muted'>
              <h3 className='mb-3 text-lg font-semibold'>{webHostingT('vercelTitle')}</h3>
              <p className={`mb-4 ${contentClassName}`}>{webHostingT('vercelDescription')}</p>
              <div className={`space-y-2 ${contentClassName}`}>
                <p>
                  <strong>{vercelItems[0].label}</strong> {vercelItems[0].value}
                </p>
                <p>
                  <strong>{vercelItems[1].label}</strong>{' '}
                  <a
                    href='https://vercel.com/legal/dpa'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={linkClassName}>
                    https://vercel.com/legal/dpa
                  </a>
                </p>
                <p>
                  <strong>{vercelItems[2].label}</strong>{' '}
                  <a
                    href='https://vercel.com/legal/dpa'
                    target='_blank'
                    rel='noopener noreferrer'
                    className={linkClassName}>
                    https://vercel.com/legal/dpa
                  </a>
                </p>
              </div>
            </div>

            {/* Vercel Analytics & Speed Insights */}
            <div className='mt-6 pt-6 border-t border-muted'>
              <h3 className='mb-3 text-lg font-semibold'>{webHostingT('analyticsTitle')}</h3>
              <p className={`mb-4 ${contentClassName}`}>{webHostingT('analyticsDescription')}</p>
              <div className={`space-y-2 ${contentClassName}`}>
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
                    className={linkClassName}>
                    https://vercel.com/legal/privacy-policy
                  </a>
                </p>
                <p>
                  <strong>{analyticsItems[4].label}</strong> {analyticsItems[4].value}
                </p>
              </div>
            </div>
          </div>

          {/* Einsatz von Cookies */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{cookiesT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{cookiesT('description')}</p>
            <p className={`mb-4 ${contentClassName}`}>
              <strong>{cookiesT('storageDurationLabel')}</strong>{' '}
              {cookiesT('storageDurationText')}
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              {cookieItems.map(item => (
                <li key={item.title} className={contentClassName}>
                  <strong>{item.title}</strong>{' '}
                  {item.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt- und Anfrageverwaltung */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{contactRequestsT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{contactRequestsT('description')}</p>
            <div className={`space-y-2 ${contentClassName}`}>
              {contactRequestItems.map(item => (
                <p key={item.label}>
                  <strong>{item.label}</strong> {item.value}
                </p>
              ))}
            </div>
          </div>

          {/* Rechte der betroffenen Personen */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{dataSubjectRightsT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{dataSubjectRightsT('description')}</p>
            <ul className='list-disc pl-6 space-y-3'>
              {dataSubjectRightsItems.map(item => (
                <li key={item.title} className={contentClassName}>
                  <strong>{item.title}</strong> {item.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Präsenzen in sozialen Netzwerken */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{socialMediaT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{socialMediaT('description')}</p>
            <div className='mb-4'>
              <p className={contentClassName}>
                <strong>{socialMediaItems[0].label}</strong> {socialMediaItems[0].value}{' '}
                <strong>{socialMediaItems[1].label}</strong> {socialMediaItems[1].value}{' '}
                <strong>{socialMediaItems[2].label}</strong>{' '}
                <a
                  href='https://www.instagram.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClassName}>
                  https://www.instagram.com
                </a>
                ;<strong> {socialMediaItems[3].label}</strong>{' '}
                <a
                  href='https://privacycenter.instagram.com/policy/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={linkClassName}>
                  https://privacycenter.instagram.com/policy/
                </a>
                . <strong>{socialMediaItems[4].label}</strong> {socialMediaItems[4].value}
              </p>
            </div>
          </div>

          {/* Allgemeine Informationen zur Datenspeicherung und Löschung */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{dataRetentionT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{dataRetentionT('description')}</p>
            <p className={`mb-4 ${contentClassName}`}>
              <strong>{dataRetentionT('retentionLabel')}</strong>{' '}
              {dataRetentionT('retentionText')}
            </p>
            <ul className='list-disc pl-6 space-y-2'>
              {dataRetentionItems.map(item => (
                <li key={item.title} className={contentClassName}>
                  <strong>{item.title}</strong> - {item.description}
                </li>
              ))}
            </ul>
          </div>

          {/* Begriffsdefinitionen */}
          <div className={sectionClassName}>
            <h2 className='mb-4 text-center text-xl font-semibold text-primary md:text-left'>{definitionsT('title')}</h2>
            <p className={`mb-4 ${contentClassName}`}>{definitionsT('description')}</p>
            <ul className='list-disc pl-6 space-y-3'>
              {definitionItems.map(item => (
                <li key={item.title} className={contentClassName}>
                  <strong>{item.title}</strong> {item.description}
                </li>
              ))}
            </ul>

            <p className='mt-6 text-sm text-muted-foreground'>
              <a
                href='https://datenschutz-generator.de/'
                title={definitionsT('generatorLinkTitle')}
                target='_blank'
                rel='noopener noreferrer nofollow'
                className={linkClassName}>
                {definitionsT('generatorLinkLabel')}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
