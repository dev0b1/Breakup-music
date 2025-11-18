"use client";
import { useState, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaUserCircle } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [showToast, setShowToast] = useState(false);
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // show one-time toast after sign in
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('justSignedIn') === 'true') {
        setShowToast(true);
        localStorage.removeItem('justSignedIn');
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
              <div className="relative">
                <button
                  onClick={() => router.push('/account')}
                  className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-full"
                >
                  <FaUserCircle className="text-xl text-white" />
                  <span className="text-sm text-white/90 truncate max-w-[120px]">{user.email}</span>
                </button>
              </div>
            ) : (
              <Link href="/login">
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
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
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
    </motion.header>
  );
}
