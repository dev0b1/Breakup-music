"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import AnimatedCounter from "@/components/AnimatedCounter";
import { SparkStorm } from "@/components/SparkStorm";
import { DemoVideo } from "@/components/DemoVideo";
import { TypewriterText } from "@/components/TypewriterText";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <SparkStorm />
      <div className="relative z-10">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-container relative">
          <div className="absolute inset-0 bg-black -z-10"></div>
          <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight px-4 text-gold-hero">
              <TypewriterText text="Turn Your Breakup" className="text-gold-hero inline-block" delay={200} />
              <br />
              <TypewriterText text="Into a Savage" className="text-gold-hero inline-block" delay={1000} />
              <br />
              <TypewriterText text="30-Second Roast Song" className="text-gold-hero inline-block" delay={1800} />
              <br />
              <motion.span 
                className="text-pink-hero flex items-center justify-center gap-4 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.6 }}
              >
                In Seconds 🔥
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl sm:text-2xl md:text-3xl text-white max-w-3xl mx-auto px-4 font-bold"
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
                  className="btn-primary btn-pulse flex items-center space-x-3 mx-auto text-xl px-12 py-6"
                >
                  <span>Roast My Ex Now</span>
                  <span className="text-2xl emoji-enhanced">🔥</span>
                  <FaArrowRight />
                </motion.button>
              </Link>
              
              <DemoVideo />
              
              <p className="text-base text-white font-bold">
                Free 15-second preview • Full roast $4.99 • No sadness allowed <span className="emoji-enhanced">💅</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Vibe Modes Section */}
        <section className="section-container">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-gradient">
                Pick Your Vibe
              </h2>
              <p className="text-xl md:text-2xl text-white font-bold">
                Petty? Victory lap? We got you. <span className="emoji-enhanced">👑</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="card hover:shadow-2xl transition-all duration-300 border-exroast-pink cursor-pointer"
              >
                <div className="text-7xl mb-4 animate-fire emoji-enhanced">🔥</div>
                <h3 className="text-3xl font-black text-gradient mb-2">Petty Roast</h3>
                <p className="text-lg text-white mb-3">Savage, brutal, hilarious</p>
                <p className="text-base italic text-white">"They thought they were the catch? LOL"</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="card hover:shadow-2xl transition-all duration-300 border-exroast-gold cursor-pointer"
              >
                <div className="text-7xl mb-4 emoji-enhanced">👑</div>
                <h3 className="text-3xl font-black text-gradient mb-2">Glow-Up Flex</h3>
                <p className="text-lg text-white mb-3">Upbeat victory anthem</p>
                <p className="text-base italic text-white">"I'm thriving, they're crying"</p>
              </motion.div>
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
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="card text-center"
            >
              <div className="text-6xl font-black text-exroast-gold mb-2">
                <AnimatedCounter end={50000} suffix="+" duration={2.5} />
              </div>
              <p className="text-white font-bold">Exes roasted this week</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="card text-center"
            >
              <div className="text-6xl font-black text-exroast-gold mb-2">
                <AnimatedCounter end={2.1} suffix="M+" decimals={1} duration={2.5} />
              </div>
              <p className="text-white font-bold">TikTok views</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="card text-center"
            >
              <div className="text-6xl font-black text-exroast-gold mb-2">
                <AnimatedCounter end={100} suffix="%" duration={2} />
              </div>
              <p className="text-white font-bold">Savage guarantee</p>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gradient mb-4">
              How It Works
            </h2>
            <p className="text-2xl text-white font-bold">
              3 steps to revenge perfection 💅
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Spill the tea",
                description: "Text or upload a chat screenshot. We want ALL the details.",
                icon: "🗡️",
              },
              {
                step: "2",
                title: "Pick your vibe",
                description: "Petty roast or glow-up flex? Choose your energy.",
                icon: "👑",
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
                  className="text-7xl mb-4 emoji-enhanced"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.icon}
                </motion.div>
                <div className="text-sm font-black text-exroast-gold mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-black text-gradient mb-3">
                  {item.title}
                </h3>
                <p className="text-white text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Daily Savage Quotes Section */}
        <section className="section-container bg-gradient-to-b from-black via-exroast-pink/5 to-black">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-5xl md:text-6xl font-black text-gradient mb-4">
                Daily Petty Power-Ups 🔥
              </h2>
              <p className="text-2xl text-white font-bold">
                Stay savage with daily motivation + optional audio bangers
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: -1 }}
              className="card border-2 border-exroast-gold"
            >
              <div className="text-6xl mb-4 emoji-enhanced">💬</div>
              <h3 className="text-3xl font-black text-gradient mb-3">Daily Savage Quotes</h3>
              <p className="text-lg text-white mb-4">
                Wake up to brutal motivation every day
              </p>
              <div className="space-y-2 text-left">
                <p className="text-white italic">"They didn't lose you. You upgraded."</p>
                <p className="text-white italic">"Closure? That's what doors are for."</p>
                <p className="text-white italic">"You're not heartbroken. You're free."</p>
              </div>
              <div className="mt-6 bg-exroast-gold/20 border-2 border-exroast-gold rounded-lg px-4 py-3">
                <p className="text-white font-bold">✅ FREE - Unlimited text quotes</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className="card border-2 border-exroast-pink"
            >
              <div className="text-6xl mb-4 emoji-enhanced">🎵</div>
              <h3 className="text-3xl font-black text-gradient mb-3">Audio Nudges</h3>
              <p className="text-lg text-white mb-4">
                15-20s personalized motivation with lo-fi trap beats
              </p>
              <div className="space-y-2 text-left">
                <p className="text-white">🎤 Confident narrator voice</p>
                <p className="text-white">🎧 Lo-fi trap/hype beat background</p>
                <p className="text-white">💅 Tailored to YOUR breakup story</p>
              </div>
              <div className="mt-6 space-y-2">
                <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                  <p className="text-white font-bold text-sm">FREE: 1 audio/week</p>
                </div>
                <div className="bg-exroast-pink/20 border-2 border-exroast-pink rounded-lg px-4 py-3">
                  <p className="text-white font-bold">PRO ($12.99/mo): 20 credits/month</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-xl text-white font-bold mb-6">
              Opt in after your first roast or anytime on your account 👑
            </p>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="section-container">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-gradient mb-4">
              Why ExRoast.fm?
            </h2>
            <p className="text-2xl text-white font-bold">
              Because therapy is expensive and this is hilarious
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🗡️",
                title: "Get even (legally)",
                description: "Roast them without texting. No restraining orders needed.",
              },
              {
                icon: "💅",
                title: "Instant revenge",
                description: "30 seconds to a TikTok-viral roast song. They'll hear it.",
              },
              {
                icon: "🔥",
                title: "100% petty",
                description: "Zero healing vibes. Pure savage energy. As it should be.",
              },
              {
                icon: "👑",
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
                  className="text-6xl mb-4 emoji-enhanced"
                  whileHover={{ scale: 1.3, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {benefit.icon}
                </motion.div>
                <h3 className="text-xl font-black text-gradient mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="section-container">
          <div className="card max-w-3xl mx-auto text-center border-2 border-exroast-pink">
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-6">
              Pricing That Slaps <span className="emoji-enhanced">🔥</span>
            </h2>
            <div className="space-y-4 mb-8">
              <p className="text-2xl font-bold">
                <span className="emoji-enhanced">🔥</span> <span className="text-white">Free: 15-second watermarked preview</span>
              </p>
              <p className="text-2xl font-bold">
                <span className="emoji-enhanced">💅</span> <span className="text-exroast-gold text-3xl">$4.99</span><span className="text-white">: Full 30-second roast (one-time)</span>
              </p>
              <p className="text-2xl font-bold">
                <span className="emoji-enhanced">👑</span> <span className="text-exroast-gold text-3xl">$12.99/mo</span><span className="text-white">: Unlimited roasts, no watermark</span>
              </p>
            </div>
            <Link href="/pricing">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-xl px-10 py-4"
              >
                See Full Pricing →
              </motion.button>
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="section-container">
          <div className="card border-2 border-exroast-pink">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-6xl font-black text-gradient">
                Ready to Roast Your Ex?
              </h2>
              <p className="text-2xl text-white max-w-2xl mx-auto font-bold">
                Your ex is out there living rent-free in your head. Time to evict them. <span className="emoji-enhanced">🔥</span>
              </p>
              <Link href="/story">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-12 py-6 text-2xl"
                >
                  Roast My Ex Now <span className="emoji-enhanced">💅</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      </div>
    </div>
  );
}
