"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubscriptionCTA } from "@/components/SubscriptionCTA";
import { SubscriptionModal } from "@/components/SubscriptionModal";
import { UpsellModal } from "@/components/UpsellModal";
import { DailyQuoteOptInModal } from "@/components/DailyQuoteOptInModal";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { LyricsOverlay } from "@/components/LyricsOverlay";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FaLock, FaDownload, FaPlay, FaPause } from "react-icons/fa";
import { getDailySavageQuote } from "@/lib/suno-nudge";

interface Song {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
  lyrics: string;
  style: string;
  story: string;
  isPurchased: boolean;
  isTemplate?: boolean;
}

export default function PreviewContent() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");
  
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  // If the user selects the one-time unlock from the upsell, we set this to
  // true so the SubscriptionCTA will auto-open the single-song checkout for
  // this song (by passing songId + custom data to Paddle).
  const [pendingSinglePurchase, setPendingSinglePurchase] = useState(false);
  const [showDailyQuoteOptIn, setShowDailyQuoteOptIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [actualDuration, setActualDuration] = useState(10);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasShownModalRef = useRef(false);

  useEffect(() => {
    if (songId) {
      fetchSong(songId);
    }
  }, [songId]);

  const fetchSong = async (id: string) => {
    try {
      const response = await fetch(`/api/song/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setSong(data.song);
        
        if (typeof window !== 'undefined') {
          const hasSeenDailyQuoteOptIn = localStorage.getItem('hasSeenDailyQuoteOptIn');
          if (!hasSeenDailyQuoteOptIn) {
            setTimeout(() => {
              setShowDailyQuoteOptIn(true);
            }, 2000);
          }
        }
      } else {
        console.error("Failed to fetch song");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDailyQuoteOptIn = async (audioEnabled: boolean) => {
    const userId = songId || '';
    const testQuote = getDailySavageQuote(1);
    
    console.log('Daily Quote Opt-In Flow:');
    console.log('- User ID:', userId);
    console.log('- Audio Enabled:', audioEnabled);
    console.log('- Test Quote:', testQuote);
    
    if (audioEnabled) {
      console.log('- Audio Nudge URL: [Will be generated via Suno AI on daily schedule]');
      console.log('- Test Audio Generation: User would receive 15-20s motivational audio with lo-fi trap beats');
    }

    // If the user isn't authenticated (we don't have a UUID user id),
    // save the opt-in locally and avoid calling the server which expects a
    // real userId (uuid). This prevents server-side failures for anonymous
    // visitors.
    const isUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id || '');

    if (!isUuid(userId)) {
      // Save preferences locally for anonymous users
      if (typeof window !== 'undefined') {
        localStorage.setItem('hasSeenDailyQuoteOptIn', 'true');
        localStorage.setItem('dailyQuotesEnabled', 'true');
        localStorage.setItem('audioNudgesEnabled', audioEnabled ? 'true' : 'false');
        alert(`🔥 You're in! Daily savage quotes activated locally.\n\nToday's quote: ${testQuote}\n\n${audioEnabled ? 'Audio nudges (local) enabled - upgrade to Pro for server-sent audio nudges!' : 'Text quotes only - upgrade to Pro for server audio nudges!'}`);
      }
      return;
    }

    try {
      const response = await fetch('/api/daily-quotes/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, audioEnabled })
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Opt-in successful!');
        console.log('Test quote from API:', data.testQuote);
        console.log("Today's savage quote:", testQuote);

        if (typeof window !== 'undefined') {
          localStorage.setItem('hasSeenDailyQuoteOptIn', 'true');
          alert(`🔥 You're in! Daily savage quotes activated.\n\nToday's quote: ${testQuote}\n\n${audioEnabled ? 'Audio nudges enabled - you\'ll get personalized 15s motivation with beats!' : 'Text quotes only - upgrade to Pro for audio nudges!'}`);
        }
      } else {
        console.error('Opt-in failed:', data.error);
        if (typeof window !== 'undefined') {
          alert('❌ Oops! Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Opt-in error:', error);
      if (typeof window !== 'undefined') {
        alert('❌ Network error. Please check your connection and try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] relative flex items-center justify-center">
        <LoadingAnimation message="Loading your song..." />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-[70vh] relative flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gradient">Song not found</h1>
          <p className="text-white">Please try generating a new song</p>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    setCurrentTime(current);

    if (song.isTemplate && current >= 15 && !hasShownModalRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setShowUpsellModal(true);
      hasShownModalRef.current = true;
    } else if (!song.isPurchased && current >= 10) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      
      // Trigger first-time modal since preview was truncated
      handleAudioEnded();
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    
    // Show subscription modal for first-time users after preview ends
    // Only for unpurchased songs
    if (!song.isPurchased && !hasShownModalRef.current && typeof window !== 'undefined') {
      const hasGeneratedFirstSong = localStorage.getItem('hasGeneratedFirstSong');
      if (!hasGeneratedFirstSong) {
        setTimeout(() => {
          setShowFirstTimeModal(true);
          localStorage.setItem('hasGeneratedFirstSong', 'true');
          hasShownModalRef.current = true;
        }, 500);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const loadedDuration = audioRef.current.duration;
    setActualDuration(loadedDuration);
    setDuration(song.isPurchased ? loadedDuration : 10);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${song?.id}` : '';

  return (
    <main className="pt-32 pb-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block"
            >
              <div className="text-6xl mb-4">🔥</div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Your Song is Ready!
            </h1>
            <p className="text-xl text-white">
              Your savage roast is ready! Listen and share 🔥
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <LyricsOverlay 
                lyrics={song.lyrics} 
                duration={song.isPurchased ? actualDuration : 10}
                isPlaying={isPlaying}
              />

              <div className="card bg-black">
                <h3 className="text-xl font-bold text-gradient mb-4">
                  Your Breakup Story
                </h3>
                <p className="text-white italic mb-4">"{song.story}"</p>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-exroast-gold text-black rounded-full text-sm font-medium">
                    {song.style.charAt(0).toUpperCase() + song.style.slice(1)} Vibe
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card sticky top-24">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-gradient">{song.title}</h3>
                    {!song.isPurchased && (
                      <span className="text-xs bg-exroast-pink text-white px-3 py-1 rounded-full font-medium">
                        Preview (10s)
                      </span>
                    )}
                  </div>

                  <audio
                    ref={audioRef}
                    src={song.isPurchased ? song.fullUrl : song.previewUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleAudioEnded}
                  />

                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlay}
                      className="w-14 h-14 rounded-full bg-exroast-pink hover:bg-exroast-gold text-white flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      {isPlaying ? <FaPause className="text-xl" /> : <FaPlay className="text-xl ml-1" />}
                    </motion.button>

                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => {
                          if (audioRef.current) {
                            audioRef.current.currentTime = parseFloat(e.target.value);
                            setCurrentTime(parseFloat(e.target.value));
                          }
                        }}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-heartbreak-500"
                      />
                      <div className="flex justify-between text-xs text-white mt-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <h4 className="text-sm font-semibold text-white mb-3">Share Your Song</h4>
                    <SocialShareButtons 
                      url={shareUrl}
                      title={song.title}
                      message={`Check out my AI-generated breakup song: ${song.title}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-black to-heartbreak-100 border-2 border-heartbreak-200">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FaLock className="text-3xl text-exroast-gold" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gradient mb-2">
                  Unlock the Full Song
                </h3>
                <p className="text-white mb-4">
                  Love what you hear? Get the complete song, download it as an MP3, 
                  and share it with the world. Choose a subscription or buy just this one song.
                </p>
                {!showSubscription && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSubscription(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaDownload />
                    <span>Unlock Full Song</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {showSubscription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5 }}
            >
              {/* Pass songId so single-song purchases attach custom_data for webhook fulfillment.
                  If pendingSinglePurchase is true, autoOpenSingle will cause SubscriptionCTA to
                  immediately open the single-song checkout. */}
              <SubscriptionCTA songId={song?.id} autoOpenSingle={pendingSinglePurchase} />
            </motion.div>
          )}

          <div className="card bg-black">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">👑</div>
              <div>
                <h3 className="font-semibold text-gradient mb-2">
                  Premium Members Get:
                </h3>
                <ul className="space-y-1 text-sm text-white">
                  <li>• AI-powered savage roast advice tailored to your situation</li>
                  <li>• No-contact tips and confidence affirmations</li>
                  <li>• Exclusive roast playlists and power-up guides</li>
                  <li>• Priority support from our savage community</li>
                </ul>
                {!showSubscription && (
                  <button
                    onClick={() => setShowSubscription(true)}
                    className="mt-4 text-exroast-gold font-semibold hover:text-white transition-colors"
                  >
                    Learn More →
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <SubscriptionModal 
        isOpen={showFirstTimeModal} 
        onClose={() => setShowFirstTimeModal(false)} 
      />
      
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        onUpgrade={(tier) => {
          console.log('Upgrading to:', tier);
          setShowUpsellModal(false);
          // If the user selected the one-time full unlock, mark a pending single purchase
          // so the SubscriptionCTA will auto-open the single-song checkout for this song.
          if (tier === 'one-time') {
            setPendingSinglePurchase(true);
            setShowSubscription(true);
          } else {
            setShowSubscription(true);
          }
        }}
      />

      <DailyQuoteOptInModal
        isOpen={showDailyQuoteOptIn}
        onClose={() => {
          setShowDailyQuoteOptIn(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('hasSeenDailyQuoteOptIn', 'true');
          }
        }}
        onOptIn={handleDailyQuoteOptIn}
        isPro={song?.isPurchased || false}
      />
    </main>
  );
}
