// ─── Section Types ──────────────────────────────────────────────────────────

export type IconName =
    | 'code'
    | 'target'
    | 'chart'
    | 'users'
    | 'zap'
    | 'shield'
    | 'globe'
    | 'search'
    | 'rocket'
    | 'star'
    | 'phone'
    | 'check';

export interface BaseSection {
    id?: string;
    title?: string;
    subtitle?: string;
    backgroundColor?: 'white' | 'light' | 'dark';
}

/** Einfacher Textblock – ein oder mehrere Absätze */
export interface TextSection extends BaseSection {
    type: 'text';
    content: string | string[];
}

/** Text + Bild nebeneinander */
export interface TextWithImageSection extends BaseSection {
    type: 'textWithImage';
    content: string | string[];
    image: string;
    imageAlt?: string;
    imagePosition?: 'left' | 'right';
}

/** Aufzählungsliste mit optionalem Einleitungstext */
export interface ListSection extends BaseSection {
    type: 'list';
    content?: string;
    items: string[];
}

/** Kacheln / Cards (z. B. Services, Vorteile) */
export interface CardItem {
    icon?: IconName;
    title: string;
    description: string;
    items?: string[];
}

export interface CardsSection extends BaseSection {
    type: 'cards';
    content?: string;
    cards: CardItem[];
    columns?: 2 | 3;
}

/** Call-to-Action Banner */
export interface CTASection extends BaseSection {
    type: 'cta';
    content?: string;
    primaryButton?: { label: string; href: string };
    secondaryButton?: { label: string; href: string };
}

/** Nummerierte Schritte / Prozess */
export interface StepsSection extends BaseSection {
    type: 'steps';
    content?: string;
    steps: { title: string; description: string }[];
}

export interface FAQSection extends BaseSection {
    type: 'faq';
    content?: string;
    items: { question: string; answer: string }[];
}

export type BlogSection =
    | TextSection
    | TextWithImageSection
    | ListSection
    | CardsSection
    | CTASection
    | StepsSection
    | FAQSection;

// ─── Blog Content ───────────────────────────────────────────────────────────

export interface BlogContent {
    title: string;
    description: string;
    keywords: string[];
    sections: BlogSection[];
}
