"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaUserCircle } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import SubscriptionPrompt from "./SubscriptionPrompt";
import SettingsMenu from "./SettingsMenu";
import { openSingleCheckout, openTierCheckout } from "@/lib/checkout";

export function Header({ userProp }: { userProp?: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(() => userProp || null);
  // legacy sign-out modal removed; mobile sign-out now calls supabase.auth.signOut directly
  const [showToast, setShowToast] = useState(false);
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const checkUser = async () => {
      if (userProp) {
        // parent provided a user (e.g., /story) — use it and skip client/server checks
        setUser(userProp);
        return;
      }
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          setUser(session.user);
          return;
        }
      } catch (e) {
        // ignore
      }

      // Fallback: try server-side session endpoint (uses cookies) in case
      // the client auth helper can't read the session immediately.
      try {
        const res = await fetch('/api/session');
        if (res.ok) {
          const json = await res.json();
          if (mounted && json?.user) {
            setUser(json.user);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      if (mounted) setUser(null);
    };
    checkUser();

    // keep header in sync if parent passes a new user later
    // (e.g., story page fetches session and passes it)
    // Note: we intentionally update state only when userProp is truthy
    // to avoid clobbering the client-driven session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (userProp) {
      setUser(userProp);
    }

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
            {!user && (
              <>
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
              </>
            )}

            {!user && pathname !== '/story' && (
              <Link href={"/template"}>
                <button className="bg-[#ff4500] hover:bg-[#ff4500]/90 text-white px-8 py-3 rounded-full font-black text-lg transition-all duration-200 border-2 border-[#ffd23f] shadow-lg hover:shadow-[#ff006e]/70 hover:shadow-2xl">
                  <span style={{ filter: 'brightness(1.1) contrast(1.2)' }}>Roast My Ex 🔥</span>
                </button>
              </Link>
            )}

            {/* Auth area */}
            {user ? (
              <div className="relative flex items-center gap-3">
                {/* Desktop 'My Roasts' quick access (matches mobile) */}
                <button
                  onClick={() => setShowSettingsMenu(true)}
                  className="hidden md:inline-flex items-center bg-white/5 px-3 py-2 rounded-full font-bold text-sm"
                >
                  My Roasts
                </button>

                <button
                  onClick={() => setShowSettingsMenu(true)}
                  onMouseDown={(e) => e.preventDefault()}
                  aria-haspopup="menu"
                  aria-expanded={showSettingsMenu}
                  aria-controls="settings-menu"
                  className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-full"
                  title={user.email}
                >
                  {user?.user_metadata?.avatar_url ? (
                    // use a simple img tag to avoid next/image complications inside the header
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-xl text-white" />
                  )}
                  <span className="text-sm text-white/90 truncate max-w-[120px]">{user.email}</span>
                </button>

                {/* Settings dropdown (opened by account button) */}
                <div className="relative">
                  {showSettingsMenu && (
                    <div className="absolute right-0 mt-12" id="settings-menu">
                      <SettingsMenu user={user} onClose={() => setShowSettingsMenu(false)} />
                    </div>
                  )}
                </div>
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
              <button
                onClick={() => { setMobileMenuOpen(false); router.push('/checkout'); }}
                className="w-full bg-gradient-to-r from-[#ff006e] to-[#ffd23f] text-black px-4 py-3 rounded-full font-bold"
              >
                Upgrade
              </button>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-exroast-gold hover:text-white transition-colors duration-200 font-bold py-2"
              >
                FAQ
              </Link>
              {!user && pathname !== '/story' && (
                <Link href="/template" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-[#ff4500] hover:bg-[#ff4500]/90 text-white px-8 py-3 rounded-full font-black text-lg transition-all duration-200 border-2 border-[#ffd23f] shadow-lg hover:shadow-[#ff006e]/70 hover:shadow-2xl">
                    <span style={{ filter: 'brightness(1.1) contrast(1.2)' }}>Roast My Ex 🔥</span>
                  </button>
                </Link>
              )}

              {/* Mobile auth area */}
              <div className="pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-white">Signed in as</div>
                    <div className="text-gray-300 font-bold">{user.email}</div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowSettingsMenu(true);
                      }}
                      className="w-full btn-primary"
                    >
                      My Roasts
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          setMobileMenuOpen(false);
                          await supabase.auth.signOut();
                          setUser(null);
                          router.push('/');
                        } catch (e) {
                          console.error('Sign out error', e);
                        }
                      }}
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
      {/* legacy sign-out modal removed */}
    </motion.header>
  );
}
