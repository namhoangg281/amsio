// FROZEN — static news data extracted from app/news/NewsContent.tsx.
// Used as fallback when cms.articles DB table is unavailable (migration not yet applied).
// DO NOT EDIT the content — it reflects what was hardcoded before the CMS feature.
// Source: original NewsContent.tsx (newsCards, featuredPost)

import type { ArticleDisplayItem } from './types';

export const FALLBACK_FEATURED_NEWS: ArticleDisplayItem = {
  // FROZEN
  id: 'fallback-featured',
  slug: 'amsio-2026-2027-season-launch',
  category: 'news',
  featured: true,
  cover_url: null,
  published_at: '2026-05-01T00:00:00Z',
  created_at: '2026-05-01T00:00:00Z',
  title: 'AMSIO International Launches 2026–2027 Season',
  excerpt:
    'AMSIO International officially launches the 2026–2027 competition season, uniting 20+ National Partners across Asia, Europe, the Americas, and beyond. Covering four subject groups — Mathematics, Science, Language, and Computational Intelligence — the season will conclude with the Global Round to be held in the United States in June 2027.',
  body: '',
  seo_title: '',
  seo_description: '',
};

export const FALLBACK_NEWS_ARTICLES: ArticleDisplayItem[] = [
  // FROZEN
  {
    id: 'fallback-1',
    slug: 'round-1-registration-open',
    category: 'news',
    featured: false,
    cover_url: null,
    published_at: '2026-06-01T00:00:00Z',
    created_at: '2026-06-01T00:00:00Z',
    title: 'Round 1 Registration Now Open — Check with Your National Partner',
    excerpt:
      'Schools in all 20+ member countries may now register participants for Round 1. Contact your local National Partner for deadlines, fees, and registration portals specific to your country.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-2',
    slug: 'global-round-2027-host-confirmed',
    category: 'news',
    featured: false,
    cover_url: null,
    published_at: '2026-05-01T00:00:00Z',
    created_at: '2026-05-01T00:00:00Z',
    title: 'Global Round 2027 Host City Confirmed: United States',
    excerpt:
      'AMSIO International confirms the United States as the host country for the inaugural Global Round in June 2027. Details on venue, schedule, and delegation arrangements will follow.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-3',
    slug: 'amsio-welcomes-15-national-partners',
    category: 'news',
    featured: false,
    cover_url: null,
    published_at: '2026-04-01T00:00:00Z',
    created_at: '2026-04-01T00:00:00Z',
    title: 'AMSIO Welcomes 15 National Partners for Inaugural Season',
    excerpt:
      'Cambodia, China, Indonesia, Japan, Malaysia, Singapore, South Korea, Thailand, Vietnam, Canada, United States, Germany, Poland, Switzerland, and the United Kingdom have each appointed a National Partner to administer AMSIO in their country.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-4',
    slug: 'academic-partner-abc-education-group',
    category: 'news',
    featured: false,
    cover_url: null,
    published_at: '2026-03-01T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    title: 'Academic Partner ABC Education Group Appointed',
    excerpt:
      'ABC Education Group, headquartered in Boston, has been appointed as AMSIO\'s Academic Partner, supporting examination development and academic quality assurance across all Subject Groups.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-5',
    slug: 'amsio-international-founded',
    category: 'news',
    featured: false,
    cover_url: null,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    title: 'AMSIO International Founded — A New Standard for Global Academic Excellence',
    excerpt:
      'AMSIO International — the Alliance for International Mathematics, Science and Computational Intelligence Olympiad — is officially established, with a mission to empower global education leaders through rigorous, fair, and internationally recognised academic competition.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
  {
    id: 'fallback-6',
    slug: 'competition-structure-finalised',
    category: 'news',
    featured: false,
    cover_url: null,
    published_at: '2026-02-01T00:00:00Z',
    created_at: '2026-02-01T00:00:00Z',
    title: 'Competition Structure Finalised: Four Subject Groups, Three Rounds',
    excerpt:
      'The full competition structure has been finalised. Round 1 (State Qualifier) leads to Round 2 (National Finals), then the Global Round — with 35 grade divisions across four subjects.',
    body: '',
    seo_title: '',
    seo_description: '',
  },
];
