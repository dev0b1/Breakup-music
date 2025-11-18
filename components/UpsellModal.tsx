"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaCrown, FaRocket, FaImage } from 'react-icons/fa';
import {
  SINGLE_LABEL,
  SINGLE_BUTTON_TEXT,
  PREMIUM_LABEL,
  PREMIUM_BUTTON_TEXT,
} from '@/lib/pricing';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (tier: 'one-time' | 'unlimited') => void;
}

export function UpsellModal({ isOpen, onClose, onUpgrade }: UpsellModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-exroast-pink/50 shadow-2xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-4xl md:text-5xl font-black mb-3">
                  <span className="bg-gradient-to-r from-exroast-pink to-exroast-gold bg-clip-text text-transparent">
                    That Template Slaps! 🔥
                  </span>
                </h2>
                <p className="text-xl text-gray-300">
                  But imagine YOUR ex's EXACT crimes getting roasted...
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-2xl font-black text-gray-400 mb-4">
                    Free (Current)
                  </h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-gray-500 mt-1 flex-shrink-0" />
                      <span>Fun library templates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-gray-500 mt-1 flex-shrink-0" />
                      <span>Matched to your vibe</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-gray-500 mt-1 flex-shrink-0" />
                      <span>15-second previews</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                      <span className="line-through">Personalized lyrics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                      <span className="line-through">Screenshot upload</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaTimes className="text-red-500 mt-1 flex-shrink-0" />
                      <span className="line-through">Full song (30-35s)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-exroast-pink/20 to-exroast-gold/20 rounded-xl p-6 border-2 border-exroast-gold relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <FaCrown className="text-exroast-gold text-3xl" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-exroast-gold mb-4">
                    Pro (Upgrade)
                  </h3>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-exroast-gold mt-1 flex-shrink-0" />
                      <span><strong>Tailored Suno AI songs</strong> from YOUR story</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaImage className="text-exroast-gold mt-1 flex-shrink-0" />
                      <span><strong>Upload chat screenshots</strong> for hyper-personal roasts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-exroast-gold mt-1 flex-shrink-0" />
                      <span><strong>Full 30-35s songs</strong> (no watermark)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-exroast-gold mt-1 flex-shrink-0" />
                      <span><strong>More relatable lyrics</strong> - zero robotic</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaCheck className="text-exroast-gold mt-1 flex-shrink-0" />
                      <span><strong>Ultra-petty digs</strong> on your ex's exact crimes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <FaRocket className="text-exroast-gold mt-1 flex-shrink-0" />
                      <span><strong>Unlimited history</strong> & sharing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpgrade('one-time')}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-black py-4 px-6 rounded-full text-lg border-2 border-gray-600 transition-all"
                >
                  <div className="text-2xl mb-1">{SINGLE_LABEL}</div>
                  <div className="text-sm font-normal">{SINGLE_BUTTON_TEXT}</div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onUpgrade('unlimited')}
                  className="bg-gradient-to-r from-exroast-pink to-exroast-gold text-white font-black py-4 px-6 rounded-full text-lg border-2 border-exroast-gold transition-all shadow-lg shadow-exroast-pink/50"
                >
                  <div className="text-2xl mb-1">{PREMIUM_LABEL}</div>
                  <div className="text-sm font-normal">{PREMIUM_BUTTON_TEXT}</div>
                  <div className="text-xs font-normal mt-1">⭐ Most Popular</div>
                </motion.button>
              </div>

              <p className="text-center text-gray-500 text-sm mt-6">
                Secure checkout powered by Paddle. Cancel anytime.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
