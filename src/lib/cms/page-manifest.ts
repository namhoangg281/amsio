// CMS page manifest — static registry of all AMSIO marketing pages.
// No @itran/* imports (split-ready seam).
// Used by /cms/pages dashboard and the publish API.

import type { CollectionKey, MediaUsageTag } from './types';

export interface TextSection {
  /** Human-readable label shown in the CMS editor. */
  label: string;
  /** Translation string namespace (= first dot-segment in the DB row). */
  namespace: string;
  /**
   * Key prefix within the namespace (may be empty string for the full namespace).
   * E.g. namespace="home", keyPrefix="hero" selects keys like "hero.title".
   */
  keyPrefix: string;
}

export interface PageManifest {
  /** Stable identifier used in route params and activity log. */
  pageId: string;
  /** Display label in the CMS list. */
  label: string;
  /** Public-facing URL — used for revalidatePath() on publish. */
  url: string;
  /** Ordered list of text sections editable on this page. */
  textSections: TextSection[];
  /** Collection keys relevant to this page (link to existing collection editor). */
  collections: CollectionKey[];
  /** Media usage tags relevant to this page (link to existing media library). */
  media: MediaUsageTag[];
}

// ---------------------------------------------------------------------------
// 25 static marketing pages
// ---------------------------------------------------------------------------

export const pageManifests: PageManifest[] = [
  // ── Home ──────────────────────────────────────────────────────────────────
  {
    pageId: 'home',
    label: 'Home',
    url: '/',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Hero', namespace: 'home', keyPrefix: 'hero' },
      { label: 'Stats', namespace: 'home', keyPrefix: 'stats' },
      { label: 'Subjects', namespace: 'home', keyPrefix: 'subjects' },
      { label: 'Timeline', namespace: 'home', keyPrefix: 'timeline' },
      { label: 'Grand Finals', namespace: 'home', keyPrefix: 'grandFinals' },
      { label: 'Countries', namespace: 'home', keyPrefix: 'countries' },
      { label: 'Pathways', namespace: 'home', keyPrefix: 'pathways' },
      { label: 'Testimonials', namespace: 'home', keyPrefix: 'testimonials' },
      { label: 'CTA Banner', namespace: 'home', keyPrefix: 'cta' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['team', 'partners', 'mission_blocks', 'olympiad_intro'],
    media: ['og_image'],
  },

  // ── About ─────────────────────────────────────────────────────────────────
  {
    pageId: 'about',
    label: 'About',
    url: '/about',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'about' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['team', 'mission_blocks'],
    media: ['og_image', 'team_photo'],
  },

  // ── About — Mission ───────────────────────────────────────────────────────
  {
    pageId: 'about-mission',
    label: 'About — Mission',
    url: '/about/mission',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'about' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['mission_blocks'],
    media: [],
  },

  // ── About — Team ─────────────────────────────────────────────────────────
  {
    pageId: 'about-team',
    label: 'About — Team',
    url: '/about/team',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'about' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['team'],
    media: ['team_photo'],
  },

  // ── About — Governance ───────────────────────────────────────────────────
  {
    pageId: 'about-governance',
    label: 'About — Governance',
    url: '/about/governance',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'about' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad ──────────────────────────────────────────────────────────────
  {
    pageId: 'olympiad',
    label: 'Olympiad',
    url: '/olympiad',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['olympiad_intro'],
    media: [],
  },

  // ── Olympiad — Mathematics ────────────────────────────────────────────────
  {
    pageId: 'olympiad-mathematics',
    label: 'Olympiad — Mathematics',
    url: '/olympiad/mathematics',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Olympiad Page', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad — Science ────────────────────────────────────────────────────
  {
    pageId: 'olympiad-science',
    label: 'Olympiad — Science',
    url: '/olympiad/science',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Olympiad Page', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad — Language ───────────────────────────────────────────────────
  {
    pageId: 'olympiad-language',
    label: 'Olympiad — Language',
    url: '/olympiad/language',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Olympiad Page', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad — Computational Intelligence ─────────────────────────────────
  {
    pageId: 'olympiad-ci',
    label: 'Olympiad — Computational Intelligence',
    url: '/olympiad/ci',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Olympiad Page', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad — Rounds ─────────────────────────────────────────────────────
  {
    pageId: 'olympiad-rounds',
    label: 'Olympiad — Rounds',
    url: '/olympiad/rounds',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Olympiad Page', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad — Sample Papers ──────────────────────────────────────────────
  {
    pageId: 'olympiad-sample-papers',
    label: 'Olympiad — Sample Papers',
    url: '/olympiad/sample-papers',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Sample Papers', namespace: 'pages', keyPrefix: 'samplePapers' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Olympiad — FAQ ────────────────────────────────────────────────────────
  {
    pageId: 'olympiad-faq',
    label: 'Olympiad — FAQ',
    url: '/olympiad/faq',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Olympiad Page', namespace: 'pages', keyPrefix: 'olympiad' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Countries ─────────────────────────────────────────────────────────────
  {
    pageId: 'countries',
    label: 'Countries',
    url: '/countries',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'countries' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['partners'],
    media: ['partner_logo'],
  },

  // ── Countries — Become a Partner ──────────────────────────────────────────
  {
    pageId: 'countries-become-partner',
    label: 'Countries — Become a Partner',
    url: '/countries/become-partner',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'countries' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Grand Finals ──────────────────────────────────────────────────────────
  {
    pageId: 'grand-finals',
    label: 'Grand Finals',
    url: '/grand-finals',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'grandFinals' },
      { label: 'Home — Grand Finals', namespace: 'home', keyPrefix: 'grandFinals' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: ['og_image'],
  },

  // ── For Schools ───────────────────────────────────────────────────────────
  {
    pageId: 'for-schools',
    label: 'For Schools',
    url: '/for-schools',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'forSchools' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── For Schools — Register ────────────────────────────────────────────────
  {
    pageId: 'for-schools-register',
    label: 'For Schools — Register',
    url: '/for-schools/register',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'forSchools' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── For Parents ───────────────────────────────────────────────────────────
  {
    pageId: 'for-parents',
    label: 'For Parents',
    url: '/for-parents',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'forParents' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── For Partners ──────────────────────────────────────────────────────────
  {
    pageId: 'for-partners',
    label: 'For Partners',
    url: '/for-partners',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'forPartners' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: ['partners'],
    media: [],
  },

  // ── Competition Results ───────────────────────────────────────────────────
  {
    pageId: 'competition-results',
    label: 'Competition Results',
    url: '/competition-results',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'results' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── Contact ───────────────────────────────────────────────────────────────
  {
    pageId: 'contact',
    label: 'Contact',
    url: '/contact',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'contact' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },

  // ── News ──────────────────────────────────────────────────────────────────
  {
    pageId: 'news',
    label: 'News',
    url: '/news',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'news' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: ['article_cover'],
  },

  // ── Press ─────────────────────────────────────────────────────────────────
  {
    pageId: 'press',
    label: 'Press',
    url: '/press',
    textSections: [
      { label: 'Navigation', namespace: 'nav', keyPrefix: '' },
      { label: 'Page Content', namespace: 'pages', keyPrefix: 'press' },
      { label: 'Footer', namespace: 'footer', keyPrefix: '' },
    ],
    collections: [],
    media: ['press_kit', 'article_cover'],
  },

  // ── Portal — Login ────────────────────────────────────────────────────────
  {
    pageId: 'cms-login',
    label: 'CMS — Login',
    url: '/cms/login',
    textSections: [
      { label: 'Portal Auth', namespace: 'portal', keyPrefix: '' },
    ],
    collections: [],
    media: [],
  },
];

/** Look up a manifest by pageId. Returns undefined if not found. */
export function getPageManifest(pageId: string): PageManifest | undefined {
  return pageManifests.find((p) => p.pageId === pageId);
}

/**
 * Convert a dot-path key to a friendly human label.
 * Example: "home.hero.title" -> "Home › Hero › Title"
 */
export function toFriendlyLabel(dotPath: string): string {
  return dotPath
    .split('.')
    .map((seg) =>
      // camelCase -> words: "heroTitle" -> "Hero Title"
      seg
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase())
        .trim(),
    )
    .join(' › ');
}
