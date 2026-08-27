import BoardCta from '@/components/custom-ui/board-cta';
import BoardFaq from '@/components/custom-ui/board-faq';
import { FEATURES_PAGE_PATH, type Feature } from '../data/features';
import FeatureHeader from '../components/feature-header';
import FeatureOverview from '../components/feature-overview';
import FeatureShots from '../components/feature-shots';
import FeatureSteps from '../components/feature-steps';
import FeatureLimits from '../components/feature-limits';
import FeatureRelated from '../components/feature-related';
import TaggingBenchMock from '../components/tagging-bench-mock';

/**
 * One feature page, `/funktionen/<slug>`.
 *
 * DIRECTION — "Die Trainertafel" (see DESIGN.md). Ground rhythm:
 * court (hero) → paper (what it is) → court (the screenshots) → paper (the
 * steps) → paper panel (the limits, then the FAQ) → paper (neighbours) → court
 * (the ask). The dark bands are the two that carry pictures of the app, which
 * is itself dark — a shot pinned to the court is a print on the board; the same
 * shot on paper is a cut-out.
 *
 * ORDER — a coach decides in this sequence: is this the thing I mean (hero),
 * what is it exactly (overview), show me (shots), how does my Tuesday change
 * (steps), where does it stop (limits), the two questions I still have (FAQ),
 * what else is there (related), fine (CTA).
 *
 * Everything is a server component except the FAQ accordion, so a feature page
 * ships essentially no JavaScript and stays fully crawlable — the same rule the
 * Ratgeber pages follow.
 * @returns A JSX element composing the ordered sections of one feature page.
 */
export default function FeaturePage({ feature }: { feature: Feature }) {
  // Three features carry exactly one screenshot: the hero pins it and the shot
  // band renders nothing. Without a court in the middle the page would run five
  // paper bands in a row, so the steps take the court there instead.
  const bandShots = feature.mock ? feature.shots : feature.shots.slice(1);
  const hasShotBand = bandShots.length > 0;

  return (
    <div className='flex w-full flex-col items-center bg-paper'>
      <FeatureHeader feature={feature} />
      <FeatureOverview feature={feature} />
      {feature.mock === 'tagging-bench' ? <TaggingBenchMock /> : null}
      <FeatureShots feature={feature} />
      <FeatureSteps feature={feature} tone={hasShotBand ? 'paper' : 'court'} />
      <FeatureLimits feature={feature} />
      <BoardFaq
        id='faq'
        kicker='Kurz gefragt'
        title={`Fragen zu ${feature.short ?? feature.name}`}
        items={feature.faq}
      />
      <FeatureRelated feature={feature} />
      <BoardCta
        kicker='Nächster Schritt'
        title='Probier es an einem echten Spiel aus'
        description='Die Live-Demo ist ein voll ausgestattetes Statix mit echten Spieldaten — ohne Account, direkt im Browser. Oder du legst dein Team an und erfasst dein erstes Spiel.'
        linkHref={FEATURES_PAGE_PATH}
        linkLabel='Alle Funktionen im Überblick'
      />
    </div>
  );
}
