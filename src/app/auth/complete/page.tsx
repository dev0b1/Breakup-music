"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthComplete() {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createClientComponentClient();

  const returnToRaw = search.get('returnTo') || '/';

  useEffect(() => {
    (async () => {
      try {
        // After Supabase OAuth returns control, the session cookie may not be
        // immediately available to the client. Poll for up to 3s for the session
        // to appear before proceeding.
        const start = Date.now();
        let user = null;
        while (Date.now() - start < 3000) {
          // getSession is more reliable for checking auth state immediately
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            user = session.user;
            break;
          }
          // small delay then retry
          await new Promise((r) => setTimeout(r, 250));
        }

        if (!user) {
          // Not authenticated — send to login page
          router.push('/login');
          return;
        }

        // decode and sanitize returnTo
        const decoded = decodeURIComponent(returnToRaw);
        if (!decoded.startsWith('/')) {
          // Prevent open redirect
          router.push('/');
          return;
        }

        router.push(decoded);
      } catch (err) {
        console.error('Auth finalize error', err);
        router.push('/');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnToRaw]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-exroast-gold text-4xl mb-4">Finalizing sign-in…</div>
        <div className="text-gray-400">You will be redirected shortly.</div>
      </div>
    </div>
  );
}
