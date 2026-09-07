'use client';

import { useTranslations } from 'next-intl';
import {
  BoardCard,
  Grain,
  SectionHeading,
} from '@/features/landing-page/components/tactic';
import { CLUB_CONFIG } from '@/lib/club-config';
import { usePricingLabels } from '../data/use-pricing-labels';

/**
 * The one band on this page that is not a table: why there is a price at all,
 * in the operator's own voice and signed with his name.
 *
 * A price rise on a free tool is a trust event, and trust is not restored by a
 * feature grid. It is restored by naming the reason (the bill grows with every
 * squad), the limit (this cannot be carried privately) and the promise that
 * follows from it (the core stays free). Deliberately short — the numbers are
 * two bands further down.
 * @returns A JSX element rendering the operator's note on the paper ground.
 */
export default function PricingWhy() {
  const t = useTranslations('pricingPage.why');
  const labels = usePricingLabels();

  return (
    <section className='relative w-full overflow-hidden bg-paper py-20 md:py-28'>
      <Grain tone='paper' />
      <div className='relative mx-auto max-w-3xl px-6 sm:px-10'>
        <SectionHeading
          align='left'
          kicker={t('kicker')}
          title={t('title')}
          description={t('description', labels)}
        />

        <BoardCard pin='tape' className='mt-10 p-6 sm:p-8'>
          <p className='max-w-[66ch] text-[17px] leading-8 text-ink/85'>
            {t('paragraph1', labels)}
          </p>
          <p className='mt-5 max-w-[66ch] text-[15px] leading-7 text-ink/75'>
            {t('paragraph2', labels)}
          </p>
          <p className='mt-5 max-w-[66ch] text-[15px] leading-7 text-ink/75'>
            {t('paragraph3', labels)}
          </p>
          <p className='mt-6 font-hand text-2xl text-primary'>
            {CLUB_CONFIG.address.contactName}
          </p>
          <p className='text-[13px] text-ink/70'>{t('signatureRole')}</p>
        </BoardCard>
      </div>
    </section>
  );
}
