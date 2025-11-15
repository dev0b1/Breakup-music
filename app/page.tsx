"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AnimatedCounter from "@/components/AnimatedCounter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-exroast-black">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-container relative">
          <div className="absolute inset-0 bg-black -z-10"></div>
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight px-4"
            >
              <motion.span 
                className="text-gradient inline-block"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Turn Your Breakup
              </motion.span>
              <br />
              <motion.span 
                className="text-gradient inline-block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Into a Savage
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="inline-block"
              >
                <span className="text-white">30-Second</span>{" "}
                <span className="text-gradient">Roast Song</span>
              </motion.span>
              <br />
              <motion.span 
                className="text-white flex items-center justify-center gap-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                In Seconds 🔥
              </motion.span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl text-exroast-gold max-w-3xl mx-auto px-4 font-bold"
            >
              Zero sadness. 100% savage. TikTok-viral AI roasts.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              <Link href="/story">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary flex items-center space-x-3 mx-auto text-xl px-12 py-6"
                >
                  <span>Roast My Ex Now</span>
                  <span className="text-2xl">🔥</span>
                  <FaArrowRight />
                </motion.button>
              </Link>
              
              <p className="text-base text-gray-400 font-bold">
                Free 15-second preview • Full roast $4.99 • No sadness allowed 💅
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vibe Modes Section */}
        <section className="section-container">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Pick Your Vibe
              </h2>
              <p className="text-xl md:text-2xl text-exroast-gold font-bold">
                Petty? Victory lap? We got you. 👑
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="card hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-exroast-pink/20 to-red-900/20 border-exroast-pink cursor-pointer"
              >
                <div className="text-7xl mb-4 animate-fire">🔥</div>
                <h3 className="text-3xl font-black text-white mb-2">Petty Roast</h3>
                <p className="text-lg text-gray-300 mb-3">Savage, brutal, hilarious</p>
                <p className="text-base italic text-gray-400">"They thought they were the catch? LOL"</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="card hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-exroast-gold/20 to-yellow-900/20 border-exroast-gold cursor-pointer"
              >
                <div className="text-7xl mb-4">👑</div>
                <h3 className="text-3xl font-black text-white mb-2">Glow-Up Flex</h3>
                <p className="text-lg text-gray-300 mb-3">Upbeat victory anthem</p>
                <p className="text-base italic text-gray-400">"I'm thriving, they're crying"</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="section-container bg-gradient-to-b from-transparent to-exroast-pink/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="card text-center"
            >
              <div className="text-5xl font-black text-exroast-pink mb-2">
                <AnimatedCounter end={50000} suffix="+" duration={2.5} />
              </div>
              <p className="text-exroast-gold font-bold">Exes roasted this week</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="card text-center"
            >
              <div className="text-5xl font-black text-exroast-pink mb-2">
                <AnimatedCounter end={2.1} suffix="M+" decimals={1} duration={2.5} />
              </div>
              <p className="text-exroast-gold font-bold">TikTok views</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="card text-center"
            >
              <div className="text-5xl font-black text-exroast-pink mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2} />
              </div>
              <p className="text-exroast-gold font-bold">Savage guarantee</p>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              How It Works
            </h2>
            <p className="text-2xl text-exroast-gold font-bold">
              3 steps to revenge perfection 💅
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Spill the tea",
                description: "Text or upload a chat screenshot. We want ALL the details. 👀",
                icon: "☕",
              },
              {
                step: "2",
                title: "Pick your vibe",
                description: "Petty roast or glow-up flex? Choose your energy.",
                icon: "🗡️",
              },
              {
                step: "3",
                title: "Get your roast",
                description: "AI creates a 30-second banger. Share on TikTok and watch them cry.",
                icon: "🔥",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card text-center"
              >
                <motion.div 
                  className="text-7xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <div className="text-sm font-black text-exroast-gold mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-black text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section-container bg-gradient-to-b from-exroast-gold/5 to-transparent">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
              Why ExRoast.fm?
            </h2>
            <p className="text-2xl text-exroast-gold font-bold">
              Because therapy is expensive and this is hilarious
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "😈",
                title: "Get even (legally)",
                description: "Roast them without texting. No restraining orders needed.",
              },
              {
                icon: "💅",
                title: "Instant revenge",
                description: "30 seconds to a TikTok-viral roast song. They'll hear it.",
              },
              {
                icon: "🎯",
                title: "100% petty",
                description: "Zero healing vibes. Pure savage energy. As it should be.",
              },
              {
                icon: "🚀",
                title: "Go viral",
                description: "Share on TikTok. Watch your ex's friends send it to them.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="card text-center hover:shadow-2xl transition-all duration-300"
              >
                <motion.div 
                  className="text-6xl mb-4"
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-black text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-container">
          <div className="card max-w-3xl mx-auto text-center bg-gradient-to-br from-exroast-pink/10 to-exroast-gold/10 border-4 border-exroast-pink">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Pricing That Slaps 💸
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl text-exroast-gold font-bold">
                🔥 Free: 15-second watermarked preview
              </p>
              <p className="text-2xl text-exroast-gold font-bold">
                💎 $4.99: Full 30-second roast (one-time)
              </p>
              <p className="text-2xl text-exroast-gold font-bold">
                👑 $12.99/mo: Unlimited roasts, no watermark
              </p>
            </div>
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-xl px-10 py-4"
              >
                See Full Pricing →
              </motion.button>
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="section-container">
          <div className="bg-gradient-to-r from-exroast-pink to-orange-600 rounded-3xl p-12 md:p-16 text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white">
              Ready to Roast Your Ex?
            </h2>
            <p className="text-2xl text-white/90 max-w-2xl mx-auto font-bold">
              Your ex is out there living rent-free in your head. Time to evict them. 🔥
            </p>
            <Link href="/story">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-exroast-pink px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Roast My Ex Now 💅
              </motion.button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
