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
import { handballPasstrainingUebungen } from './articles/handball-passtraining-uebungen';
import { handballWurftrainingSprungwurf } from './articles/handball-wurftraining-sprungwurf';
import { handballTempogegenstoss } from './articles/handball-tempogegenstoss';
import { handballPositionenErklaert } from './articles/handball-positionen-erklaert';
import { handballRegelnEinfachErklaert } from './articles/handball-regeln-einfach-erklaert';
import { handballMannschaftMotivieren } from './articles/handball-mannschaft-motivieren';
import { handballTeambuildingUebungen } from './articles/handball-teambuilding-uebungen';
import { handballSpielerentwicklungMessen } from './articles/handball-spielerentwicklung-messen';
import { handballMentaltraining } from './articles/handball-mentaltraining';
import { handballKreislaeuferSpielen } from './articles/handball-kreislaeufer-spielen';
import { handballManndeckung } from './articles/handball-manndeckung';
import { handball321Abwehr } from './articles/handball-3-2-1-abwehr';
import { handballKreuzenStossen } from './articles/handball-kreuzen-stossen';
import { handballBallhandlingVerbessern } from './articles/handball-ballhandling-verbessern';
import { handballTrainerWerden } from './articles/handball-trainer-werden';
import { handballMinihandballKinder } from './articles/handball-minihandball-kinder';
import { handball1Gegen1Verbessern } from './articles/handball-1-gegen-1-verbessern';
import { handballRueckraumspielerTipps } from './articles/handball-rueckraumspieler-tipps';
import { handballBlockenLernen } from './articles/handball-blocken-lernen';
import { handballExpectedGoalsXg } from './articles/handball-expected-goals-xg';
import { handballBallbesitzTempo } from './articles/handball-ballbesitz-tempo';
import { handballTorwartStatistik } from './articles/handball-torwart-statistik';
import { handballKoordinationstraining } from './articles/handball-koordinationstraining';
import { handballTrainingslagerPlanen } from './articles/handball-trainingslager-planen';
import { handballSpielformenTraining } from './articles/handball-spielformen-training';
import { handballLinkshaender } from './articles/handball-linkshaender';
import { handball60Abwehr } from './articles/handball-6-0-abwehr';
import { handball51Abwehr } from './articles/handball-5-1-abwehr';
import { handballUeberzahlUnterzahl } from './articles/handball-ueberzahl-unterzahl';
import { handballTimeoutNutzen } from './articles/handball-timeout-nutzen';
import { handballZeitstrafeRegeln } from './articles/handball-zeitstrafe-regeln';
import { handballSpielfeldMasse } from './articles/handball-spielfeld-masse';
import { handballAusruestungEinsteiger } from './articles/handball-ausruestung-einsteiger';
import { handballPassivesSpiel } from './articles/handball-passives-spiel';
import { handballKommunikationSpielfeld } from './articles/handball-kommunikation-spielfeld';
import { handballAthletiktraining } from './articles/handball-athletiktraining';
import { handballBelastungssteuerung } from './articles/handball-belastungssteuerung';
import { handballStatistikZettelExcelApp } from './articles/handball-statistik-zettel-excel-app';
import { handballAbwehrsystemAuswaehlen } from './articles/handball-abwehrsystem-auswaehlen';
import { handballJugendtrainerKennzahlenErstesJahr } from './articles/handball-jugendtrainer-kennzahlen-erstes-jahr';
import { handballStatistikVereinEinfuehren } from './articles/handball-statistik-verein-einfuehren';

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
 *
 * Deliberately NOT registered: `articles/handball-wurfquoten-studie.ts`. The
 * data study exists as a finished scaffold – structure, methodology section and
 * table layout – but every figure in it is still a `TODO(daten)` placeholder.
 * It goes live only once the operator supplies the aggregated values; see the
 * file header for the exact list.
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
  handballPasstrainingUebungen,
  handballWurftrainingSprungwurf,
  handballTempogegenstoss,
  handballPositionenErklaert,
  handballRegelnEinfachErklaert,
  handballMannschaftMotivieren,
  handballTeambuildingUebungen,
  handballSpielerentwicklungMessen,
  handballMentaltraining,
  handballKreislaeuferSpielen,
  handballManndeckung,
  handball321Abwehr,
  handballKreuzenStossen,
  handballBallhandlingVerbessern,
  handballTrainerWerden,
  handballMinihandballKinder,
  handball1Gegen1Verbessern,
  handballRueckraumspielerTipps,
  handballBlockenLernen,
  handballExpectedGoalsXg,
  handballBallbesitzTempo,
  handballTorwartStatistik,
  handballKoordinationstraining,
  handballTrainingslagerPlanen,
  handballSpielformenTraining,
  handballLinkshaender,
  handball60Abwehr,
  handball51Abwehr,
  handballUeberzahlUnterzahl,
  handballTimeoutNutzen,
  handballZeitstrafeRegeln,
  handballSpielfeldMasse,
  handballAusruestungEinsteiger,
  handballPassivesSpiel,
  handballKommunikationSpielfeld,
  handballAthletiktraining,
  handballBelastungssteuerung,
  handballStatistikZettelExcelApp,
  handballAbwehrsystemAuswaehlen,
  handballJugendtrainerKennzahlenErstesJahr,
  handballStatistikVereinEinfuehren,
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
