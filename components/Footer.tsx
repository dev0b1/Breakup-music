"use client";

import Link from "next/link";
import { FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-exroast-black border-t border-exroast-pink/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🔥</span>
              <span className="text-2xl font-black bg-gradient-to-r from-exroast-pink to-exroast-gold bg-clip-text text-transparent">
                ExRoast.fm
              </span>
            </div>
            <p className="text-gray-400 text-sm font-bold">
              Turn your breakup into a savage 30-second roast song. Zero sadness. 100% petty. 💅
            </p>
          </div>

          <div>
            <h3 className="text-exroast-gold font-black text-lg mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/story" className="text-gray-400 hover:text-white transition-colors font-bold">
                  Create Roast
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors font-bold">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-gray-400 hover:text-white transition-colors font-bold">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-exroast-gold font-black text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors font-bold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors font-bold">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-exroast-gold font-black text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://tiktok.com/@exroastfm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-exroast-pink transition-colors text-2xl"
              >
                <FaTiktok />
              </a>
              <a
                href="https://instagram.com/exroastfm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-exroast-pink transition-colors text-2xl"
              >
                <FaInstagram />
              </a>
              <a
                href="https://twitter.com/exroastfm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-exroast-pink transition-colors text-2xl"
              >
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-exroast-pink/20">
          <div className="text-center mb-4">
            <p className="text-gray-400 text-sm font-bold">
              <span className="text-exroast-pink">Daily savage quotes + mood bangers waiting 🔥</span>
            </p>
          </div>
          <p className="text-gray-500 text-sm font-bold text-center">
            © {new Date().getFullYear()} ExRoast.fm. All rights reserved. Your ex? Not so much. 😈
          </p>
        </div>
      </div>
    </footer>
  );
}
