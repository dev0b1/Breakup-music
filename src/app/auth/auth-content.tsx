"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaGoogle, FaSpinner } from "react-icons/fa";

export default function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/story";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirectTo);
      }
    };
    checkAuth();
  }, [router, redirectTo, supabase]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dest = redirectTo || '/story';
  // Start the normal OAuth flow. Any intended purchase is stored in
  // localStorage by the checkout helper and will be resumed after sign-in.
  setDebugInfo({ step: 'starting' });
  const redirectToFull = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?redirectTo=${encodeURIComponent(dest)}`;
  const res = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectToFull } });

      // Newer Supabase clients may return { data: { url } } to perform a redirect.
      // Older clients return { error } and perform a native redirect. Handle both.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { data, error } = res || {};

      if (error) {
        console.error('[login] signInWithOAuth error', error);
        setDebugInfo({ ...debugInfo, step: 'error', error });
        setError(error.message || String(error));
        setIsLoading(false);
        return;
      }

      if (data && (data as any).url) {
        // Save debug info and show link (in case popup/redirect is blocked on Vercel)
        const providerUrl = (data as any).url;
        setDebugInfo({ ...debugInfo, step: 'redirect-url', providerUrl, raw: data });
        console.log('[login] received redirect URL from supabase:', providerUrl);
        // Try to navigate browser to provider URL
        window.location.href = providerUrl;
        return;
      }

      // If no explicit redirect URL returned, Supabase should have redirected already.
      // As a fallback, clear loading state after a short wait so the UI doesn't hang.
      setTimeout(() => {
        setIsLoading(false);
        setDebugInfo({ ...debugInfo, step: 'no-redirect' });
      }, 1500);
    } catch (err) {
      setError("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black text-gradient">
              Welcome to ExRoast 🔥
            </h1>
            <p className="text-xl text-white font-bold">
              Sign in to roast your ex with AI
            </p>
            <p className="text-gray-400">
              Quick login with Google. No passwords, no spam.
            </p>
          </div>

          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-black py-4 px-6 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FaGoogle className="text-xl" />
                Sign in with Google
              </>
            )}
          </motion.button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">or continue as guest</span>
            </div>
          </div>

          {/* Guest Continue Button */}
          <motion.button
            onClick={() => router.push("/story")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-exroast-pink/20 hover:bg-exroast-pink/30 border-2 border-exroast-pink text-white py-4 px-6 rounded-xl font-black text-lg transition-all duration-300"
          >
            Continue as Guest
          </motion.button>

          {/* Benefits */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <p className="text-gray-400 text-sm font-bold">Benefits of signing in:</p>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-exroast-gold">✓</span> Save all your roasts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-exroast-gold">✓</span> Manage subscriptions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-exroast-gold">✓</span> Download your MP3s
              </li>
              <li className="flex items-center gap-2">
                <span className="text-exroast-gold">✓</span> Priority generation
              </li>
            </ul>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          We only use your email to save your roasts. Never spam. Ever.
        </p>

        {/* Debug Info (developer) */}
        {debugInfo && (
          <div className="mt-4 p-3 bg-black/60 border border-white/10 text-sm text-gray-300 rounded">
            <div className="font-bold mb-2">Debug</div>
            <pre className="whitespace-pre-wrap break-words">{JSON.stringify(debugInfo, null, 2)}</pre>
            {debugInfo?.providerUrl && (
              <div className="mt-2 flex gap-2">
                <a className="text-exroast-gold underline" href={debugInfo.providerUrl} target="_blank" rel="noreferrer">Open provider URL</a>
                <button className="ml-auto text-sm text-gray-200 bg-white/5 px-3 py-1 rounded" onClick={() => { navigator.clipboard?.writeText(debugInfo.providerUrl); }}>Copy URL</button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </main>
  );
}
