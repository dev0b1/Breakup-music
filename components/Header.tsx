"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import SubscriptionPrompt from "./SubscriptionPrompt";
import { openSingleCheckout, openTierCheckout } from "@/lib/checkout";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [confirmSignOutOpen, setConfirmSignOutOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) setUser(session?.user || null);
    };
    checkUser();

    // subscribe to auth changes so header stays in-sync across redirects/reloads
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user || null);
    });

    // When a user signs in, first check if we have an intended purchase saved
    // (set before sign-in). If present, resume the checkout automatically.
    // Otherwise, check pro-status and show the subscription prompt once.
    (async () => {
      if (typeof window === 'undefined') return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user || null;
        if (currentUser) {
          // Resume intended purchase if present
          try {
            const ip = localStorage.getItem('intendedPurchase');
            if (ip) {
              // remove it immediately so repeated attempts don't trigger twice
              localStorage.removeItem('intendedPurchase');
              const parsed = JSON.parse(ip);
              // expiry guard: ignore intended purchases older than 10 minutes
              const ageMs = Date.now() - (parsed?.ts || 0);
              const TEN_MIN = 10 * 60 * 1000;
              if (ageMs > TEN_MIN) {
                // expired, fall back to normal subscription prompt flow
              } else {
                // small delay to allow any client scripts (Paddle) to initialize
                setTimeout(() => {
                  if (parsed?.type === 'single') {
                    openSingleCheckout({ songId: parsed.songId || null });
                  } else if (parsed?.type === 'tier') {
                    openTierCheckout(parsed.tierId, parsed.priceId || undefined);
                  }
                }, 200);
                return;
              }
            }
          } catch (e) {
            // ignore localStorage / JSON errors
          }

          // call our pro-status endpoint which accepts x-user-id header
          const res = await fetch('/api/user/pro-status', {
            method: 'GET',
            headers: { 'x-user-id': currentUser.id }
          });
          if (res.ok) {
            const json = await res.json();
            const isPro = !!json?.isPro;
            try {
              const seen = localStorage.getItem('seenSubscriptionPrompt');
              if (!isPro && seen !== 'true') {
                setShowSubscriptionPrompt(true);
              }
            } catch (e) {
              // ignore localStorage errors
            }
          }
        }
      } catch (e) {
        // ignore
      }
    })();

    // show one-time toast after sign in
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('justSignedIn') === 'true') {
        setShowToast(true);
        localStorage.removeItem('justSignedIn');
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (e) {}

    return () => {
      mounted = false;
      try { subscription?.unsubscribe?.(); } catch (e) {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, supabase]);

  // If the user becomes authenticated on the client and is on the public
  // landing page (`/`), send them to the main logged-in page (`/story`).
  useEffect(() => {
    if (user && pathname === '/') {
      router.push('/story');
    }
  }, [user, pathname, router]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-exroast-black/95 backdrop-blur-sm border-b border-exroast-pink/20"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-exroast-pink"
              style={{ filter: 'brightness(1.1) contrast(1.2)' }}
            >
              <span className="text-3xl">🔥</span>
            </motion.div>
            <span className="text-2xl font-black bg-gradient-to-r from-[#ff006e] to-[#ffd23f] bg-clip-text text-transparent">
              ExRoast.fm
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/pricing"
              className="text-exroast-gold hover:text-white transition-colors duration-200 font-bold"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="text-exroast-gold hover:text-white transition-colors duration-200 font-bold"
            >
              FAQ
            </Link>
            <Link href="/story">
              <button className="bg-[#ff4500] hover:bg-[#ff4500]/90 text-white px-8 py-3 rounded-full font-black text-lg transition-all duration-200 border-2 border-[#ffd23f] shadow-lg hover:shadow-[#ff006e]/70 hover:shadow-2xl">
                <span style={{ filter: 'brightness(1.1) contrast(1.2)' }}>Roast My Ex 🔥</span>
              </button>
            </Link>

            {/* Auth area */}
            {user ? (
              <div className="relative flex items-center gap-3">
                <button
                  onClick={() => router.push('/account')}
                  className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-full"
                >
                  <FaUserCircle className="text-xl text-white" />
                  <span className="text-sm text-white/90 truncate max-w-[120px]">{user.email}</span>
                </button>
                <button
                  onClick={() => setConfirmSignOutOpen(true)}
                  title="Sign out"
                  className="ml-2 text-gray-300 hover:text-white"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <Link href="/auth">
                <button className="bg-white text-black px-4 py-2 rounded-full font-bold">Sign in</button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-exroast-gold hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 pb-4 space-y-4"
            >
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-exroast-gold hover:text-white transition-colors duration-200 font-bold py-2"
              >
                Pricing
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-exroast-gold hover:text-white transition-colors duration-200 font-bold py-2"
              >
                FAQ
              </Link>
              <Link href="/story" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-[#ff4500] hover:bg-[#ff4500]/90 text-white px-8 py-3 rounded-full font-black text-lg transition-all duration-200 border-2 border-[#ffd23f] shadow-lg hover:shadow-[#ff006e]/70 hover:shadow-2xl">
                  <span style={{ filter: 'brightness(1.1) contrast(1.2)' }}>Roast My Ex 🔥</span>
                </button>
              </Link>

              {/* Mobile auth area */}
              <div className="pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-white">Signed in as</div>
                    <div className="text-gray-300 font-bold">{user.email}</div>
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full btn-primary">My Roasts</button>
                    </Link>
                    <button
                      onClick={() => setConfirmSignOutOpen(true)}
                      className="w-full mt-2 bg-white text-black py-3 rounded-full font-bold"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full bg-white text-black py-3 rounded-full font-bold">Sign in</button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {showToast && (
        <div className="fixed top-20 right-6 bg-exroast-gold text-black px-4 py-2 rounded-lg shadow-lg z-50">
          Signed in successfully
        </div>
      )}
      {/* Subscription prompt shown to new, non-pro users on first login */}
      <AnimatePresence>
        {showSubscriptionPrompt && (
          <SubscriptionPrompt
            onClose={() => {
              try { localStorage.setItem('seenSubscriptionPrompt', 'true'); } catch (e) {}
              setShowSubscriptionPrompt(false);
            }}
          />
        )}
      </AnimatePresence>
      {/* Sign-out confirmation modal */}
      <AnimatePresence>
        {confirmSignOutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-gray-900 rounded-xl p-6 max-w-sm w-full mx-4"
            >
              <h3 className="text-xl font-bold text-white mb-2">Confirm sign out</h3>
              <p className="text-gray-400 mb-4">Are you sure you want to sign out? You can sign back in anytime.</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmSignOutOpen(false)}
                  className="px-4 py-2 rounded-md bg-white/5 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await supabase.auth.signOut();
                      setUser(null);
                      setConfirmSignOutOpen(false);
                      router.push('/');
                    } catch (e) {
                      console.error('Sign out error', e);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-white text-black font-bold"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
