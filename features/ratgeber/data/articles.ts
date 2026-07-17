import type { Article, ArticleCategory, ArticleCategoryGroup } from '../types';
import { ARTICLE_CATEGORIES } from '../types';

import { wurfquoteBerechnen } from './articles/wurfquote-berechnen';
import { handballStatistikFuehren } from './articles/handball-statistik-fuehren';
import { handballTrainingPlanen } from './articles/handball-training-planen';
import { handballSaisonvorbereitung } from './articles/handball-saisonvorbereitung';
import { handballAufwaermenUebungen } from './articles/handball-aufwaermen-uebungen';
import { handballAbwehrsysteme } from './articles/handball-abwehrsysteme';
import { handballAngriffssystemeEinsteiger } from './articles/handball-angriffssysteme-einsteiger';
import { handballTorwarttraining } from './articles/handball-torwarttraining';
import { handballSpielanalyse } from './articles/handball-spielanalyse';
import { jugendhandballTrainieren } from './articles/jugendhandball-trainieren';
import { siebenmeterTrainieren } from './articles/siebenmeter-trainieren';
import { handballKonditionVerbessern } from './articles/handball-kondition-verbessern';
import { handballPasstrainingUebungen } from './articles/handball-passtraining-uebungen';
import { handballWurftrainingSprungwurf } from './articles/handball-wurftraining-sprungwurf';
import { handballTempogegenstoss } from './articles/handball-tempogegenstoss';
import { handballPositionenErklaert } from './articles/handball-positionen-erklaert';
import { handballRegelnEinfachErklaert } from './articles/handball-regeln-einfach-erklaert';
import { handballMannschaftMotivieren } from './articles/handball-mannschaft-motivieren';
import { handballTeambuildingUebungen } from './articles/handball-teambuilding-uebungen';
import { handballSpielerentwicklungMessen } from './articles/handball-spielerentwicklung-messen';
import { handballKrafttraining } from './articles/handball-krafttraining';
import { handballSprungkraftVerbessern } from './articles/handball-sprungkraft-verbessern';
import { handballSchnelligkeitVerbessern } from './articles/handball-schnelligkeit-verbessern';
import { handballVerletzungenVorbeugen } from './articles/handball-verletzungen-vorbeugen';
import { handballErnaehrung } from './articles/handball-ernaehrung';
import { handballMentaltraining } from './articles/handball-mentaltraining';
import { handballKreislaeuferSpielen } from './articles/handball-kreislaeufer-spielen';
import { handballManndeckung } from './articles/handball-manndeckung';
import { handball321Abwehr } from './articles/handball-3-2-1-abwehr';
import { handballKreuzenStossen } from './articles/handball-kreuzen-stossen';
import { handballFinteLernen } from './articles/handball-finte-lernen';
import { handballBallhandlingVerbessern } from './articles/handball-ballhandling-verbessern';
import { handballSchlagwurfTechnik } from './articles/handball-schlagwurf-technik';
import { handballTrainerWerden } from './articles/handball-trainer-werden';
import { handballMinihandballKinder } from './articles/handball-minihandball-kinder';
import { handball1Gegen1Verbessern } from './articles/handball-1-gegen-1-verbessern';
import { handballHarzTipps } from './articles/handball-harz-tipps';
import { handballTorwartTipps } from './articles/handball-torwart-tipps';
import { handballSiebenmeterHalten } from './articles/handball-siebenmeter-halten';
import { handballAussenspielerTipps } from './articles/handball-aussenspieler-tipps';
import { handballRueckraumspielerTipps } from './articles/handball-rueckraumspieler-tipps';
import { handballSpielmacherWerden } from './articles/handball-spielmacher-werden';
import { handballAbwehr1Gegen1 } from './articles/handball-abwehr-1-gegen-1';
import { handballBlockenLernen } from './articles/handball-blocken-lernen';
import { handballWurfarten } from './articles/handball-wurfarten';
import { handballKempaTrick } from './articles/handball-kempa-trick';
import { handballAlleineTrainieren } from './articles/handball-alleine-trainieren';
import { handballNervositaetVorSpielen } from './articles/handball-nervositaet-vor-spielen';
import { handballRegeneration } from './articles/handball-regeneration';
import { handballWelchePositionPasstZuMir } from './articles/handball-welche-position-passt-zu-mir';

/** URL segment for the Ratgeber section. Change here to rename the section. */
export const RATGEBER_BASE_PATH = '/ratgeber';

/** Full path for a single article, e.g. '/ratgeber/wurfquote-berechnen'. */
export function articlePath(slug: string): string {
  return `${RATGEBER_BASE_PATH}/${slug}`;
}

/**
 * All Ratgeber articles. Registering a new article = adding one data module
 * import here; it then flows automatically into the hub, sitemap, llms.txt and
 * cross-links.
 */
export const ARTICLES: Article[] = [
  wurfquoteBerechnen,
  handballStatistikFuehren,
  handballTrainingPlanen,
  handballSaisonvorbereitung,
  handballAufwaermenUebungen,
  handballAbwehrsysteme,
  handballAngriffssystemeEinsteiger,
  handballTorwarttraining,
  handballSpielanalyse,
  jugendhandballTrainieren,
  siebenmeterTrainieren,
  handballKonditionVerbessern,
  handballPasstrainingUebungen,
  handballWurftrainingSprungwurf,
  handballTempogegenstoss,
  handballPositionenErklaert,
  handballRegelnEinfachErklaert,
  handballMannschaftMotivieren,
  handballTeambuildingUebungen,
  handballSpielerentwicklungMessen,
  handballKrafttraining,
  handballSprungkraftVerbessern,
  handballSchnelligkeitVerbessern,
  handballVerletzungenVorbeugen,
  handballErnaehrung,
  handballMentaltraining,
  handballKreislaeuferSpielen,
  handballManndeckung,
  handball321Abwehr,
  handballKreuzenStossen,
  handballFinteLernen,
  handballBallhandlingVerbessern,
  handballSchlagwurfTechnik,
  handballTrainerWerden,
  handballMinihandballKinder,
  handball1Gegen1Verbessern,
  handballHarzTipps,
  handballTorwartTipps,
  handballSiebenmeterHalten,
  handballAussenspielerTipps,
  handballRueckraumspielerTipps,
  handballSpielmacherWerden,
  handballAbwehr1Gegen1,
  handballBlockenLernen,
  handballWurfarten,
  handballKempaTrick,
  handballAlleineTrainieren,
  handballNervositaetVorSpielen,
  handballRegeneration,
  handballWelchePositionPasstZuMir,
];

/** Articles sorted newest-first by publication date. */
export function getAllArticles(): Article[] {
  return [...ARTICLES].sort((a, b) =>
    a.datePublished < b.datePublished ? 1 : a.datePublished > b.datePublished ? -1 : 0,
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return ARTICLES.map((article) => article.slug);
}

/**
 * Related articles for cross-linking: the article's explicit `relatedSlugs`
 * first, then same-category articles, then any remaining articles as a final
 * fallback – always returning up to `limit` distinct articles.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const related: Article[] = [];
  const seen = new Set<string>([article.slug]);

  const add = (candidate: Article | undefined) => {
    if (!candidate || seen.has(candidate.slug) || related.length >= limit) return;
    related.push(candidate);
    seen.add(candidate.slug);
  };

  for (const slug of article.relatedSlugs ?? []) {
    add(getArticleBySlug(slug));
  }

  for (const candidate of getAllArticles()) {
    if (related.length >= limit) break;
    if (candidate.category === article.category) add(candidate);
  }

  for (const candidate of getAllArticles()) {
    if (related.length >= limit) break;
    add(candidate);
  }

  return related.slice(0, limit);
}

/** Articles grouped by category (in ARTICLE_CATEGORIES order), for the hub. */
export function getArticlesByCategory(): ArticleCategoryGroup[] {
  const all = getAllArticles();

  return ARTICLE_CATEGORIES.map((category: ArticleCategory) => ({
    category,
    articles: all.filter((article) => article.category === category),
  })).filter((group) => group.articles.length > 0);
}
