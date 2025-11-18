"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { FaGoogle, FaSpinner } from "react-icons/fa";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/story";
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      const redirectToFull = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/complete?returnTo=${encodeURIComponent(dest)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectToFull,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
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
      </motion.div>
    </main>
  );
}
