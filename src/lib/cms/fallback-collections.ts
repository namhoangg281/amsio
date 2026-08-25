// Fallback collections — frozen arrays extracted from the hardcoded data that
// previously lived in the public pages (team/page.tsx, mission/page.tsx,
// PartnersSection.tsx). These are used when the DB returns no rows (e.g. the
// cms.collection_items table is empty or unreachable).
//
// W-094 FREEZE RULE: do NOT add new content here. Content updates go in the DB.
// These arrays are the safe floor — they match production at the time W-094 shipped.
//
// Evidence sources (hardcoded origin):
//   about/team/page.tsx   — secretariatRoles[]
//   about/mission/page.tsx — pillars[]
//   components/home/PartnersSection.tsx — PARTNERS[]

import type { CollectionItem, CollectionKey } from './types';

function makeItem(
  id: string,
  collectionKey: CollectionKey,
  sortOrder: number,
  translations: CollectionItem['translations'],
  metadata: CollectionItem['metadata'],
): CollectionItem {
  return {
    id,
    tenant_id: 'fallback',
    collection_key: collectionKey,
    sort_order: sortOrder,
    status: 'active',
    translations,
    metadata,
    created_at: '2026-08-20T00:00:00Z',
    updated_at: '2026-08-20T00:00:00Z',
    deleted_at: null,
    created_by: null,
  };
}

// Source: apps/amsio-website/src/app/about/team/page.tsx secretariatRoles[]
export const FALLBACK_TEAM: readonly CollectionItem[] = Object.freeze([
  makeItem('fallback-team-1', 'team', 1, {
    en: {
      title: 'Secretary-General',
      body: "Leads AMSIO International, represents the organisation internationally, and is ultimately responsible for delivery of the Council's strategic mandate.",
    },
  }, { role: 'Secretary-General', email: 'info@amsio.org' }),
  makeItem('fallback-team-2', 'team', 2, {
    en: {
      title: 'Director of Examinations',
      body: 'Oversees the four Subject Committees, manages the examination development pipeline, and is responsible for academic quality across all Subject Groups.',
    },
  }, { role: 'Director of Examinations', email: 'info@amsio.org' }),
  makeItem('fallback-team-3', 'team', 3, {
    en: {
      title: 'Director of Operations',
      body: 'Manages relationships with National Partners, coordinates round logistics, and leads planning for the annual Grand Finals.',
    },
  }, { role: 'Director of Operations', email: 'info@amsio.org' }),
  makeItem('fallback-team-4', 'team', 4, {
    en: {
      title: 'Director of Finance',
      body: 'Responsible for financial planning, budget oversight, fee allocation, and preparation of the annual financial summary presented to the Council.',
    },
  }, { role: 'Director of Finance', email: 'info@amsio.org' }),
  makeItem('fallback-team-5', 'team', 5, {
    en: {
      title: 'Director of Communications',
      body: 'Leads all external communications, media relations, digital presence, and brand standards across member countries.',
    },
  }, { role: 'Director of Communications', email: 'info@amsio.org' }),
]);

// Source: apps/amsio-website/src/app/about/mission/page.tsx pillars[]
// Note: the mission page shows 5 pillars but only 4 are in the "Four Pillars" section.
// Keeping all 5 from source; the "Educational Impact" pillar is last.
export const FALLBACK_MISSION_BLOCKS: readonly CollectionItem[] = Object.freeze([
  makeItem('fallback-mission-1', 'mission_blocks', 1, {
    en: { title: 'Excellence', body: 'We hold every examination, process, and partnership to the highest standard. Excellence is not an outcome we reward — it is the standard we set for ourselves in everything we build.' },
  }, { icon: '🏅' }),
  makeItem('fallback-mission-2', 'mission_blocks', 2, {
    en: { title: 'Integrity', body: 'Rigorous examination security, independent development by subject specialists, sealed distribution protocols, and a transparent multi-stage appeals process protect the value of every result.' },
  }, { icon: '🛡️' }),
  makeItem('fallback-mission-3', 'mission_blocks', 3, {
    en: { title: 'Innovation', body: 'Every assessment question is designed to reveal how a student reasons through a problem — not whether they have memorised a formula or fact. Contextual, novel scenarios replace drill-based recall.' },
  }, { icon: '💡' }),
  makeItem('fallback-mission-4', 'mission_blocks', 4, {
    en: { title: 'Global Collaboration', body: 'A single international standard applies across 20+ member countries. Every participant is assessed on the same terms, regardless of national curriculum, school resources, or geography.' },
  }, { icon: '🌍' }),
  makeItem('fallback-mission-5', 'mission_blocks', 5, {
    en: { title: 'Educational Impact', body: 'Beyond competition, AMSIO nurtures a generation of global citizens — students who think critically, collaborate across cultures, and carry internationally recognised credentials into their futures.' },
  }, { icon: '📚' }),
]);

// Source: apps/amsio-website/src/components/home/PartnersSection.tsx PARTNERS[]
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const FALLBACK_PARTNERS: readonly CollectionItem[] = Object.freeze([
  makeItem('fallback-partner-1', 'partners', 1, {
    en: {
      name: 'ABC Education Group',
      body: 'Providing academic leadership and ensuring the highest standards of assessment quality and educational excellence across all Subject Groups.',
    },
  }, {
    role: 'Academic Sponsorship Partner',
    logo_url: `${BASE}/images/logo/abc-logo-horizontal.png`,
    website_url: 'https://www.abceducationgroup.com/',
  }),
  makeItem('fallback-partner-2', 'partners', 2, {
    en: {
      name: 'Polaris Global Academy',
      body: 'Supporting the development and validation of assessment frameworks, examination content, and evaluation criteria, drawing on AP and U.S. high-school expertise.',
    },
  }, {
    role: 'Assessment Unit',
    logo_url: `${BASE}/images/logo/polaris-logo.png`,
    website_url: 'https://www.polarisglobalacademy.com/',
  }),
]);
