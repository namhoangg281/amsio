import { supabase } from "./supabase";

/* ── Countries ── */
export async function fetchCountries() {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .order("name", { ascending: true });
  return { data, error };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function upsertCountry(country: Record<string, any>) {
  const { data, error } = await supabase
    .from("countries")
    .upsert(country, { onConflict: "code" })
    .select()
    .single();
  return { data, error };
}

/* ── Schools ── */
export async function fetchSchools(countryId?: string) {
  let query = supabase
    .from("schools")
    .select(`*, countries(name, flag, code)`)
    .order("name", { ascending: true });
  if (countryId) query = query.eq("country_id", countryId);
  const { data, error } = await query;
  return { data, error };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertSchool(school: Record<string, any>) {
  const { data, error } = await supabase
    .from("schools")
    .insert(school)
    .select()
    .single();
  return { data, error };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSchool(id: string, updates: Record<string, any>) {
  const { data, error } = await supabase
    .from("schools")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return { data, error };
}

/* ── Students ── */
export async function fetchStudents(filters?: {
  countryId?: string;
  schoolId?: string;
  subject?: string;
  r1Result?: string;
}) {
  let query = supabase
    .from("students_legacy")
    .select(`*, schools(name, code), countries(name, flag)`)
    .order("full_name", { ascending: true });

  if (filters?.countryId) query = query.eq("country_id", filters.countryId);
  if (filters?.schoolId)  query = query.eq("school_id",  filters.schoolId);
  if (filters?.r1Result)  query = query.eq("r1_result",  filters.r1Result);
  if (filters?.subject)   query = query.contains("subjects", [filters.subject]);

  const { data, error } = await query;
  return { data, error };
}

/* ── Announcements ── */
export async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function createAnnouncement(announcement: {
  subject: string;
  body: string;
  target: string;
  status: string;
  created_by: string;
  recipients?: number;
  sent_at?: string;
}) {
  const { data, error } = await supabase
    .from("announcements")
    .insert(announcement)
    .select()
    .single();
  return { data, error };
}

/* ── Portal helpers ── */

/** @deprecated Use fetchStudentByUserId instead — matches by user_id FK */
export async function fetchStudentByEmail(email: string) {
  const { data, error } = await supabase
    .from("students_legacy")
    .select(`*, schools(name, code), countries(name, flag)`)
    .eq("email", email)
    .maybeSingle();
  return { data, error };
}

export async function fetchStudentByUserId(userId: string) {
  const { data, error } = await supabase
    .from("students_legacy")
    .select(`*, schools(name, code), countries(name, flag)`)
    .eq("user_id", userId)
    .maybeSingle();
  return { data, error };
}

export async function fetchSchoolByCoordinatorEmail(email: string) {
  const { data, error } = await supabase
    .from("schools")
    .select(`*, countries(name, flag, code)`)
    .eq("coordinator_email", email)
    .maybeSingle();
  return { data, error };
}

export async function fetchCountryByPartnerEmail(email: string) {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("partner_email", email)
    .maybeSingle();
  return { data, error };
}

export async function fetchStudentsBySchoolId(schoolId: string) {
  const { data, error } = await supabase
    .from("students_legacy")
    .select("*")
    .eq("school_id", schoolId)
    .order("full_name", { ascending: true });
  return { data, error };
}

export async function fetchSchoolsByCountryId(countryId: string) {
  const { data, error } = await supabase
    .from("schools")
    .select(`*, countries(name, flag, code)`)
    .eq("country_id", countryId)
    .order("name", { ascending: true });
  return { data, error };
}

/* ── Country by code ── */
export async function fetchCountryByCode(code: string) {
  const { data, error } = await supabase
    .from("countries")
    .select("id, name, code, flag, status, partner_name, partner_email, partner_rep")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  return { data, error };
}

/* ── School by code (registration validation) ── */
export async function fetchSchoolByCode(code: string) {
  const { data, error } = await supabase
    .from("schools")
    .select("id, name, country_id")
    .eq("code", code.toUpperCase())
    .eq("status", "Active")
    .maybeSingle();
  return { data, error };
}

/* ── Email availability check (real-time dedup in registration forms) ── */

/**
 * Check whether an email is already registered in auth.users.
 * Uses a SECURITY DEFINER RPC so the anon key can query auth.users safely.
 * Returns false on any error (fail-open — signUp will catch dups at submit).
 */
export async function checkEmailTaken(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_email_taken", {
    p_email: email.toLowerCase().trim(),
  });
  if (error) return false;
  return Boolean(data);
}

/* ── Exam Results (student portal) ── */

export interface ExamResultRow {
  id: string;
  subject_code: string;
  final_score: number | null;
  max_score: number | null;
  percentile: number | null;
  prize_tier: string | null;
  grade_level: number | null;
  is_published: boolean;
}

/**
 * Fetch published exam results for the authenticated student.
 * Uses getAuthClient() so the cookie-based session is included.
 */
export async function fetchStudentExamResults(
  authClient: ReturnType<typeof import("./supabase").getAuthClient>,
  userId: string,
): Promise<{ data: ExamResultRow[] | null; error: unknown }> {
  const { data, error } = await authClient
    .schema("exam")
    .from("exam_results")
    .select(
      "id, subject_code, final_score, max_score, percentile, prize_tier, grade_level, is_published",
    )
    .eq("user_id", userId)
    .eq("is_published", true)
    .order("subject_code", { ascending: true });

  return { data: data as ExamResultRow[] | null, error };
}

/* ── Global KPIs (aggregated) ── */
export async function fetchGlobalKPIs() {
  const { data: countries, error: ce } = await supabase
    .from("countries")
    .select("schools_count, students_count, revenue")
    .eq("status", "Active");

  if (ce || !countries) return null;

  return {
    totalCountries: countries.length,
    totalSchools:   countries.reduce((s, c) => s + (c.schools_count ?? 0), 0),
    totalStudents:  countries.reduce((s, c) => s + (c.students_count ?? 0), 0),
    totalRevenue:   countries.reduce((s, c) => s + Number(c.revenue ?? 0), 0),
  };
}