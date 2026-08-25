// AMSIO Website — Standalone Middleware (zero @itran/* dependencies)
// Protects /cms/* routes with Supabase auth. Public pages pass through.

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CMS_ROLES = ['marketing_staff', 'ops_staff', 'center_admin', 'super_admin', 'exam_manager'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API routes
  if (pathname.startsWith('/cms/login') || pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Service misconfigured' }, { status: 503 });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const loginUrl = new URL('/cms/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role from JWT claims
  const roles: string[] = session.user?.app_metadata?.roles ?? [];
  const hasAccess = roles.some(r => CMS_ROLES.includes(r));
  if (!hasAccess) {
    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
  }

  return response;
}

export const config = {
  matcher: ['/cms/((?!_next/static|_next/image|favicon.ico).*)'],
};
