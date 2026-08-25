// FROZEN — static press data extracted from app/press/PressContent.tsx.
// Used as fallback when cms.articles DB table is unavailable (migration not yet applied).
// DO NOT EDIT the content — it reflects what was hardcoded before the CMS feature.
// Source: original PressContent.tsx announcements array

import type { ArticleDisplayItem } from './types';

export const FALLBACK_PRESS_ARTICLES: ArticleDisplayItem[] = [
  // FROZEN
  {
    id: 'fallback-press-1',
    slug: 'amsio-2026-inaugural-cycle-launch',
    category: 'press',
    featured: false,
    cover_url: null,
    published_at: null,
    created_at: '2026-01-01T00:00:00Z',
    title: 'AMSIO International Announces 2026 Inaugural Cycle Launch',
    excerpt:
      'The Alliance for International Mathematics, Science and Computational Intelligence Olympiad officially opens registration for its first cycle, spanning 20+ member countries across Asia, Europe, and the Americas.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-press-2',
    slug: 'grand-finals-2027-san-francisco',
    category: 'press',
    featured: false,
    cover_url: null,
    published_at: null,
    created_at: '2026-02-01T00:00:00Z',
    title: 'Grand Finals 2027: San Francisco Confirmed as Host City',
    excerpt:
      'AMSIO International confirms the United States as the host country for the inaugural Global Round in June 2027, bringing together top young academic performers from 20+ nations.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-press-3',
    slug: 'abc-education-group-academic-partner',
    category: 'press',
    featured: false,
    cover_url: null,
    published_at: null,
    created_at: '2026-03-01T00:00:00Z',
    title: 'ABC Education Group Named as Academic Partner',
    excerpt:
      'AMSIO International appoints ABC Education Group to support examination development across all four Subject Groups, under AMSIO authorization.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
];
