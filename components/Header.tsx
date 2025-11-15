"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            >
              <span className="text-3xl">🔥</span>
            </motion.div>
            <span className="text-2xl font-black bg-gradient-to-r from-exroast-pink to-exroast-gold bg-clip-text text-transparent">
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
              <button className="bg-gradient-to-r from-exroast-pink to-orange-500 hover:from-exroast-pink/90 hover:to-orange-600 text-white px-8 py-3 rounded-full font-black text-lg transition-all duration-200 shadow-lg hover:shadow-exroast-pink/50 hover:shadow-2xl">
                Roast My Ex 🔥
              </button>
            </Link>
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
                <button className="w-full bg-gradient-to-r from-exroast-pink to-orange-500 hover:from-exroast-pink/90 hover:to-orange-600 text-white px-8 py-3 rounded-full font-black text-lg transition-all duration-200 shadow-lg hover:shadow-exroast-pink/50 hover:shadow-2xl">
                  Roast My Ex 🔥
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
