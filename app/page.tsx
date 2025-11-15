"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaHeart, FaMusic, FaArrowRight, FaTimes } from "react-icons/fa";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [userStory, setUserStory] = useState("");
  const [selectedMode, setSelectedMode] = useState("");

  const feelings = [
    { label: "Heartbroken", emoji: "💔", value: "heartbroken" },
    { label: "Angry / Savage", emoji: "😤", value: "savage" },
    { label: "Healing", emoji: "🌱", value: "healing" },
    { label: "Missing Them", emoji: "😢", value: "missing" },
    { label: "I Just Need a Laugh", emoji: "😂", value: "meme" },
  ];

  const modes = [
    { 
      name: "Sad", 
      emoji: "😢", 
      description: "Let it all out. Songs that understand your pain.",
      style: "sad",
      gradient: "from-blue-500 to-purple-500"
    },
    { 
      name: "Savage", 
      emoji: "🔥", 
      description: "Channel that anger. Empowering revenge anthems.",
      style: "savage",
      gradient: "from-red-500 to-pink-500"
    },
    { 
      name: "Healing", 
      emoji: "🌱", 
      description: "Move forward. Hopeful songs about growth.",
      style: "healing",
      gradient: "from-green-500 to-teal-500"
    },
    { 
      name: "Vibe", 
      emoji: "✨", 
      description: "Just vibing. Chill, atmospheric tracks.",
      style: "vibe",
      gradient: "from-purple-500 to-indigo-500"
    },
    { 
      name: "Meme", 
      emoji: "😂", 
      description: "Laugh it off. Funny, quirky healing songs.",
      style: "meme",
      gradient: "from-yellow-500 to-orange-500"
    },
  ];

  const handleCreateSong = () => {
    if (onboardingStep === 3 && selectedMode) {
      window.location.href = `/story?feeling=${selectedFeeling}&mode=${selectedMode}&story=${encodeURIComponent(userStory)}`;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-container">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="text-gradient">Heartbroken?</span>
              <br />
              <span className="text-gradient">Turn your pain into</span>
              <br />
              <span className="text-gradient">a song that heals. 💔</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            >
              Instant AI songs that say what you wish you could — sad, savage, healing, or funny.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOnboarding(true)}
                className="btn-primary flex items-center space-x-2 mx-auto text-lg px-10 py-5"
              >
                <span>Create My Song</span>
                <FaArrowRight />
              </motion.button>
              
              <p className="text-sm text-gray-500">
                Takes 10 seconds. No account needed.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Emotional Hook Section */}
        <section className="section-container bg-white/50">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why This Helps
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Breakups hurt. Overthinking hurts. Missing someone hurts.<br />
                HeartHeal gives you emotional release — a personalized soundtrack for your situation.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {modes.map((mode, index) => (
                <motion.div
                  key={mode.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`card text-center hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${mode.gradient} text-white cursor-pointer`}
                >
                  <div className="text-5xl mb-3">{mode.emoji}</div>
                  <h3 className="text-lg font-bold">{mode.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="text-4xl font-bold text-heartbreak-600 mb-2">17,000+</div>
              <p className="text-gray-600">Songs generated this week</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="text-4xl font-bold text-heartbreak-600 mb-2">40+</div>
              <p className="text-gray-600">Countries sharing their songs</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="card text-center"
            >
              <div className="text-4xl font-bold text-heartbreak-600 mb-2">90%</div>
              <p className="text-gray-600">Feel better after their first song</p>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-container bg-white/50">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Four simple steps to emotional release
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Tell us your vibe",
                description: "Share your story or skip it entirely. Your choice.",
                icon: "💭",
              },
              {
                step: "2",
                title: "Choose your mode",
                description: "Sad, Savage, Healing, Vibe, or Meme.",
                icon: "🎨",
              },
              {
                step: "3",
                title: "Get your song",
                description: "AI creates a personal song + lyrics just for you.",
                icon: "🎵",
              },
              {
                step: "4",
                title: "Download or share",
                description: "Keep it private or share it everywhere.",
                icon: "📲",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <div className="text-sm font-bold text-heartbreak-500 mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get What You Need
            </h2>
            <p className="text-xl text-gray-600">
              Actual outcomes, not just features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🧠",
                title: "Stop overthinking",
                description: "Express your feelings through music instead of spiraling.",
              },
              {
                icon: "🚫",
                title: "Get closure without texting",
                description: "Say what you need to say without contacting your ex.",
              },
              {
                icon: "😂",
                title: "Laugh again",
                description: "Turn your pain into something you can smile about.",
              },
              {
                icon: "🎨",
                title: "Turn pain into creativity",
                description: "Your heartbreak becomes art you actually want to keep.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Teaser Section */}
        <section className="section-container bg-gradient-to-br from-heartbreak-50 to-purple-50">
          <div className="card max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Your First Song is Free
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Premium gives you unlimited songs + fast generation. No commitment needed — start healing now.
            </p>
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-heartbreak-600 hover:text-heartbreak-700 font-semibold text-lg underline"
              >
                See pricing details →
              </motion.button>
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="section-container">
          <div className="bg-gradient-to-r from-heartbreak-500 to-heartbreak-600 text-white rounded-3xl p-12 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Feel Better?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join thousands turning their heartbreak into something beautiful
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowOnboarding(true)}
              className="bg-white text-heartbreak-600 px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              Create My Song Now
            </motion.button>
          </div>
        </section>
      </main>

      <Footer />

      {/* Onboarding Modal */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOnboarding(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowOnboarding(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>

              {/* Step 1: Emotional Check-in */}
              {onboardingStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      How are you feeling right now?
                    </h2>
                    <p className="text-gray-600">This helps us create the perfect song for you</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {feelings.map((feeling) => (
                      <button
                        key={feeling.value}
                        onClick={() => {
                          setSelectedFeeling(feeling.value);
                          setOnboardingStep(2);
                        }}
                        className="card hover:shadow-xl transition-all duration-300 flex items-center space-x-4 text-left p-6"
                      >
                        <span className="text-4xl">{feeling.emoji}</span>
                        <span className="text-xl font-semibold text-gray-900">{feeling.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Optional Story Input */}
              {onboardingStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Tell us your story
                    </h2>
                    <p className="text-gray-600">Or skip this step — it's totally optional</p>
                  </div>

                  <textarea
                    value={userStory}
                    onChange={(e) => setUserStory(e.target.value)}
                    placeholder="What happened? How do you feel? What do you wish you could say?"
                    className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-heartbreak-500 focus:border-transparent resize-none"
                  />

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setOnboardingStep(3)}
                      className="btn-secondary flex-1"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => setOnboardingStep(3)}
                      className="btn-primary flex-1"
                    >
                      Continue
                    </button>
                  </div>

                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="text-gray-500 hover:text-gray-700 text-sm w-full text-center"
                  >
                    ← Back
                  </button>
                </div>
              )}

              {/* Step 3: Choose Mode */}
              {onboardingStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Choose your mode
                    </h2>
                    <p className="text-gray-600">What kind of song matches your mood?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {modes.map((mode) => (
                      <button
                        key={mode.style}
                        onClick={() => setSelectedMode(mode.style)}
                        className={`card text-left p-6 transition-all duration-300 ${
                          selectedMode === mode.style
                            ? 'ring-4 ring-heartbreak-500 shadow-xl'
                            : 'hover:shadow-xl'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <span className="text-5xl">{mode.emoji}</span>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{mode.name}</h3>
                            <p className="text-gray-600">{mode.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setOnboardingStep(2)}
                      className="btn-secondary flex-1"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleCreateSong}
                      disabled={!selectedMode}
                      className={`btn-primary flex-1 ${!selectedMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Generate My Song
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
