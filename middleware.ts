import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if not authenticated and trying to access protected routes
  // Treat `/story` as a protected route so anonymous visitors are sent to auth.
  if (!user && (
    request.nextUrl.pathname.startsWith('/checkout') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname === '/story'
  )) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If the user IS authenticated, don't allow them to view the public landing page.
  // Redirect logged-in users who try to access `/` to the roast page `/story`.
  if (user) {
    // Redirect logged-in users away from public pages to /story
    const publicPaths = ['/', '/pricing', '/auth', '/login'];
    if (publicPaths.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = '/story';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
