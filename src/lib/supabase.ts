import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// Cookie-based client for data queries, shares session store with getAuthClient().
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cookie-based auth client — sessions stored in cookies so CMS
// middleware can read them for role-gated routes.
export function getAuthClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/* ── Auth helpers ── */

export async function signInAdmin(email: string, password: string) {
  const client = getAuthClient();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const client = getAuthClient();
  const { error } = await client.auth.signOut();
  return { error };
}

export async function getSession() {
  const client = getAuthClient();
  const { data: { session } } = await client.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const client = getAuthClient();
  const { data: { user } } = await client.auth.getUser();
  return user;
}

