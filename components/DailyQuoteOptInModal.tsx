'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaFire, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

interface DailyQuoteOptInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptIn: (audioEnabled: boolean) => void;
  isPro: boolean;
}

export function DailyQuoteOptInModal({ 
  isOpen, 
  onClose, 
  onOptIn,
  isPro 
}: DailyQuoteOptInModalProps) {
  const [audioEnabled, setAudioEnabled] = useState(isPro);

  const handleOptIn = () => {
    onOptIn(audioEnabled);
    onClose();
  };

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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95%] max-w-lg"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border-2 border-exroast-pink/50 shadow-2xl relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-exroast-pink to-exroast-gold rounded-full flex items-center justify-center"
                >
                  <FaFire className="text-3xl text-white" />
                </motion.div>

                <h2 className="text-3xl md:text-4xl font-black mb-3">
                  <span className="bg-gradient-to-r from-exroast-pink to-exroast-gold bg-clip-text text-transparent">
                    Get daily petty power-ups? 🔥
                  </span>
                </h2>
                <p className="text-lg text-gray-300">
                  Keep the savage energy going every day
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 mb-6 border border-exroast-gold/20">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaCheck className="text-exroast-pink mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-bold">Daily Savage Quotes</p>
                      <p className="text-gray-400 text-sm">
                        1x/day text quote: &quot;They didn&apos;t lose you. You upgraded.&quot;
                      </p>
                    </div>
                  </div>

                  {isPro ? (
                    <div className="flex items-start gap-3">
                      <FaCheck className="text-exroast-gold mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-bold">15s Audio Nudges 💅</p>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={audioEnabled}
                              onChange={(e) => setAudioEnabled(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-exroast-pink rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-exroast-pink peer-checked:to-exroast-gold"></div>
                          </label>
                        </div>
                        <p className="text-gray-400 text-sm">
                          Personalized motivation with lo-fi trap beats (uses 1 credit)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-gray-600 mt-1 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-500 font-bold">15s Audio Nudges (Pro Only)</p>
                        <p className="text-gray-500 text-sm">
                          Free: 1 audio nudge/week. Pro: 20 credits at $12.99/mo
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleOptIn}
                  className="w-full bg-gradient-to-r from-exroast-pink to-exroast-gold text-white font-black py-4 px-6 rounded-xl text-lg hover:scale-105 transition-transform shadow-lg shadow-exroast-pink/30"
                >
                  Yes, Keep Me Petty 🔥
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full text-gray-400 hover:text-white font-bold py-2 transition-colors text-sm"
                >
                  Maybe Later
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">
                Cancel anytime from your preferences. Zero spam, just pure petty energy.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
