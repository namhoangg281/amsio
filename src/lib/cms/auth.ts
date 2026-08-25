// CMS auth — uses @supabase/ssr directly for server-side auth checks.
// Role contract: marketing_staff appears in app_metadata.roles (array).

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function buildServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from Server Component — cookies are read-only in that context.
          }
        },
      },
    },
  );
}

export interface CmsIdentity {
  userId: string;
}

/**
 * custom_access_token_hook injects roles into the JWT at issuance time only —
 * it never writes back to auth.users.raw_app_meta_data. Both getUser() and
 * session.user therefore expose an empty roles array. getClaims() cryptographically
 * verifies the access token and returns the hook-injected claims.
 */
async function readVerifiedClaims(): Promise<{ userId: string; roles: string[] } | null> {
  const supabase = await buildServerClient();
  const { data, error } = await supabase.auth.getClaims();

  const claims = data?.claims;
  if (error || !claims?.sub) return null;

  const fromJwt = (claims.app_metadata as Record<string, unknown> | undefined)?.roles;
  const roles = Array.isArray(fromJwt) ? (fromJwt as string[]) : [];

  return { userId: claims.sub, roles };
}

/**
 * Returns the authenticated user's identity if they have the marketing_staff role,
 * or null otherwise. No @itran/* dependency — safe split-ready seam.
 */
export async function checkMarketingStaff(): Promise<CmsIdentity | null> {
  const verified = await readVerifiedClaims();
  if (!verified || !verified.roles.includes('marketing_staff')) return null;
  return { userId: verified.userId };
}

/**
 * Asserts marketing_staff role. Throws ITRAN-CMS-401 if not authenticated
 * or ITRAN-CMS-403 if role is missing. Always call as the FIRST line of any
 * CMS mutation route or Server Action.
 */
export async function requireMarketingStaff(): Promise<CmsIdentity> {
  const verified = await readVerifiedClaims();

  if (!verified) {
    throw new Error('ITRAN-CMS-401: Unauthenticated');
  }
  if (!verified.roles.includes('marketing_staff')) {
    throw new Error('ITRAN-CMS-403: Forbidden — marketing_staff role required');
  }

  return { userId: verified.userId };
}
