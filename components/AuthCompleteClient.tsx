"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AuthCompleteClient() {
  const router = useRouter();
  const search = useSearchParams();
  const supabase = createClientComponentClient();

  const returnToRaw = search.get('returnTo') || '/';

  useEffect(() => {
    (async () => {
      try {
        // If the provider sent an auth code to this URL (e.g. ?code=...), forward
        // the full query string to the canonical server callback so the server can
        // exchange the code for a session and set cookies. This avoids a race where
        // the client waits for a session that was never established on this URL.
        const code = search.get('code');
        if (code && typeof window !== 'undefined') {
          // Preserve the entire query string when forwarding.
          const qs = window.location.search || '';
          window.location.replace(`${window.location.origin}/auth/callback${qs}`);
          return;
        }

        const start = Date.now();
        let user = null;
        while (Date.now() - start < 3000) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user) {
            user = session.user;
            break;
          }
          await new Promise((r) => setTimeout(r, 250));
        }

        if (!user) {
          router.push('/login');
          return;
        }

        const decoded = decodeURIComponent(returnToRaw);
        if (!decoded.startsWith('/')) {
          router.push('/');
          return;
        }

        try {
          localStorage.setItem('justSignedIn', 'true');
        } catch (e) {}
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
