import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const part = token.split('.')[1];
    if (!part) return {};
    const padded = part.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');

  const origin = request.nextUrl.origin;
  const redirectTo = (path: string): NextResponse =>
    NextResponse.redirect(new URL(path, origin));

  if (errorParam) {
    const msg = encodeURIComponent(errorDesc ?? errorParam);
    return redirectTo(`${BASE}/portal/login?error=${msg}`);
  }

  if (!code) {
    return redirectTo(`${BASE}/portal/login?error=${encodeURIComponent('Missing authorization code. Please try signing in again.')}`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return redirectTo(`${BASE}/portal/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (!user || userError) {
    return redirectTo(`${BASE}/portal/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
  }

  // Read roles from JWT (custom_access_token_hook injects them into app_metadata.roles)
  const { data: { session } } = await supabase.auth.getSession();
  const jwtClaims = session?.access_token ? decodeJwtPayload(session.access_token) : {};
  const jwtApp = (jwtClaims['app_metadata'] as Record<string, unknown> | undefined) ?? {};
  const jwtRoles = jwtApp['roles'] as string[] | undefined;
  const storedRoles = user.app_metadata?.['roles'] as string[] | undefined;
  const appRoles: string[] = (jwtRoles && jwtRoles.length > 0) ? jwtRoles : (storedRoles ?? []);
  const metaRole = (user.user_metadata?.['role'] as string | undefined) ?? '';

  const isAdmin = appRoles.some(r =>
    ['amsio_admin', 'marketing_staff', 'super_admin', 'ops_staff'].includes(r)
  );
  const isSchool =
    appRoles.some(r => ['school', 'school_coordinator', 'institution_admin', 'school_admin'].includes(r)) ||
    metaRole === 'school_coordinator';
  const isPartner =
    appRoles.some(r => ['partner', 'national_partner', 'national_partner_admin'].includes(r)) ||
    metaRole === 'partner' || metaRole === 'national_partner';

  if (isAdmin) {
    return redirectTo(`${BASE}/admin`);
  } else if (isSchool) {
    return redirectTo(`${BASE}/portal/school`);
  } else if (isPartner) {
    return redirectTo(`${BASE}/portal/partner`);
  }
  return redirectTo(`${BASE}/portal/student`);
}
