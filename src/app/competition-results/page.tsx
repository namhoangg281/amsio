import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { BRAND } from '@/lib/constants';
import CompetitionResultsContent from './CompetitionResultsContent';

export const metadata: Metadata = {
  title: 'Competition Results',
  description: `Official results, rankings, and certificates for all rounds of the ${BRAND.name} International Olympiad.`,
};

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TopPerformer {
  user_id: string;
  student_name: string;
  medal: string | null;
  r1_score: number | null;
  r2_score: number | null;
  gf_qualified: boolean;
  subjects: string[];
  certificate_pdf_url: string | null;
}

export interface CompetitionShowcase {
  id: string;
  name: string;
  year: number | null;
  status: string;
  top_performers: TopPerformer[];
}

// ─── DB row types ────────────────────────────────────────────────────────────

interface CompetitionRow {
  id: string;
  name: string;
  year: number | null;
  status: string;
}

interface ResultRow {
  user_id: string;
  competition_id: string;
  r1_score: number | null;
  r2_score: number | null;
  gf_qualified: boolean;
  medal: string | null;
  subjects: string[];
}

interface UserRow {
  id: string;
  full_name: string;
}

interface CertRow {
  user_id: string;
  pdf_url: string | null;
}

// ─── Server-side data fetch ──────────────────────────────────────────────────

const AMSIO_TENANT_ID = '00000000-0000-0000-0000-000000000002';
const TOP_N = 10;

function medalRank(medal: string | null): number {
  if (medal === 'Gold')   return 0;
  if (medal === 'Silver') return 1;
  if (medal === 'Bronze') return 2;
  return 3;
}

async function fetchCompetitionShowcase(): Promise<CompetitionShowcase[]> {
  const url        = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!url || !serviceKey) return [];

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: competitions, error: compError } = await supabase
    .schema('exam')
    .from('competitions')
    .select('id, name, year, status')
    .eq('tenant_id', AMSIO_TENANT_ID)
    .in('status', ['closed', 'active'])
    .order('year', { ascending: false })
    .returns<CompetitionRow[]>();

  if (compError || !competitions || competitions.length === 0) return [];

  const compIds = competitions.map((c) => c.id);

  const { data: results, error: resultsError } = await supabase
    .schema('exam')
    .from('competition_results')
    .select('user_id, competition_id, r1_score, r2_score, gf_qualified, medal, subjects')
    .eq('tenant_id', AMSIO_TENANT_ID)
    .in('competition_id', compIds)
    .is('deleted_at', null)
    .returns<ResultRow[]>();

  if (resultsError || !results || results.length === 0) {
    return competitions.map((c) => ({ ...c, top_performers: [] }));
  }

  const userIds = [...new Set(results.map((r) => r.user_id))];

  const { data: users } = await supabase
    .schema('core')
    .from('users')
    .select('id, full_name')
    .in('id', userIds)
    .returns<UserRow[]>();

  const userMap = new Map((users ?? []).map((u) => [u.id, u.full_name]));

  const { data: certs } = await supabase
    .schema('exam')
    .from('certificates')
    .select('user_id, pdf_url')
    .eq('tenant_id', AMSIO_TENANT_ID)
    .in('user_id', userIds)
    .eq('cert_type', 'exam_prize')
    .eq('is_official', true)
    .eq('is_revoked', false)
    .not('pdf_url', 'is', null)
    .returns<CertRow[]>();

  const certMap = new Map<string, string>();
  for (const cert of certs ?? []) {
    if (!certMap.has(cert.user_id) && cert.pdf_url) {
      certMap.set(cert.user_id, cert.pdf_url);
    }
  }

  const byComp = new Map<string, ResultRow[]>();
  for (const r of results) {
    const list = byComp.get(r.competition_id) ?? [];
    list.push(r);
    byComp.set(r.competition_id, list);
  }

  return competitions.map((comp) => {
    const sorted = (byComp.get(comp.id) ?? []).sort((a, b) => {
      const md = medalRank(a.medal) - medalRank(b.medal);
      if (md !== 0) return md;
      if (a.gf_qualified !== b.gf_qualified) return b.gf_qualified ? 1 : -1;
      const r2 = (b.r2_score ?? 0) - (a.r2_score ?? 0);
      if (r2 !== 0) return r2;
      return (b.r1_score ?? 0) - (a.r1_score ?? 0);
    });

    return {
      ...comp,
      top_performers: sorted.slice(0, TOP_N).map((r) => ({
        user_id:             r.user_id,
        student_name:        userMap.get(r.user_id) ?? 'Participant',
        medal:               r.medal,
        r1_score:            r.r1_score,
        r2_score:            r.r2_score,
        gf_qualified:        r.gf_qualified,
        subjects:            r.subjects,
        certificate_pdf_url: certMap.get(r.user_id) ?? null,
      })),
    };
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CompetitionResultsPage() {
  const competitions = await fetchCompetitionShowcase();
  return <CompetitionResultsContent competitions={competitions} />;
}
