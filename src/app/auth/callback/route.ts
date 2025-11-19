import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectTo = searchParams.get('redirectTo') || '/story';

  if (code) {
    console.log('[auth/callback] received code, redirectTo=', redirectTo);
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message || error);
    } else {
      console.log('[auth/callback] exchangeCodeForSession succeeded');
    }

    if (!error) {
      // Redirect to checkout if user came from subscribe button
      if (redirectTo === '/checkout') {
        return NextResponse.redirect(new URL('/checkout', request.url));
      }
      // Otherwise redirect to the original page
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(new URL('/login?error=authentication_failed', request.url));
}
