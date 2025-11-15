"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SubscriptionCTA } from "@/components/SubscriptionCTA";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { LyricsOverlay } from "@/components/LyricsOverlay";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FaLock, FaDownload, FaPlay, FaPause } from "react-icons/fa";

interface Song {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
  lyrics: string;
  style: string;
  story: string;
  isPurchased: boolean;
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");
  
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [actualDuration, setActualDuration] = useState(10);
  const audioRef = useRef<HTMLAudioElement>(null);

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
      } else {
        console.error("Failed to fetch song");
      }
    } catch (error) {
      console.error("Error fetching song:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation message="Loading your song..." />
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Song not found</h1>
          <p className="text-gray-600">Please try generating a new song</p>
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

    if (!song.isPurchased && current >= 10) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
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
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      
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
                <div className="text-6xl mb-4">🎵</div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Your Song is <span className="text-gradient">Ready!</span>
              </h1>
              <p className="text-xl text-gray-600">
                Listen to your preview and see the lyrics come to life!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <LyricsOverlay 
                  lyrics={song.lyrics} 
                  duration={song.isPurchased ? actualDuration : 10}
                  isPlaying={isPlaying}
                />

                <div className="card bg-healing-50 border-healing-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Your Breakup Story
                  </h3>
                  <p className="text-gray-700 italic mb-4">"{song.story}"</p>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-healing-200 text-healing-800 rounded-full text-sm font-medium">
                      {song.style.charAt(0).toUpperCase() + song.style.slice(1)} Vibe
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card sticky top-24">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-gray-800">{song.title}</h3>
                      {!song.isPurchased && (
                        <span className="text-xs bg-heartbreak-100 text-heartbreak-700 px-3 py-1 rounded-full font-medium">
                          Preview (10s)
                        </span>
                      )}
                    </div>

                    <audio
                      ref={audioRef}
                      src={song.isPurchased ? song.fullUrl : song.previewUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={() => setIsPlaying(false)}
                    />

                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-heartbreak-500 hover:bg-heartbreak-600 text-white flex items-center justify-center transition-colors flex-shrink-0"
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
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Share Your Song</h4>
                      <SocialShareButtons 
                        url={shareUrl}
                        title={song.title}
                        message={`Check out my AI-generated HeartHeal song: ${song.title}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-heartbreak-50 to-heartbreak-100 border-2 border-heartbreak-200">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <FaLock className="text-3xl text-heartbreak-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Unlock the Full Song
                  </h3>
                  <p className="text-gray-600 mb-4">
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
                <SubscriptionCTA />
              </motion.div>
            )}

            <div className="card bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💙</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Premium Members Get:
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AI-powered breakup advice tailored to your situation</li>
                    <li>• No-contact tips and daily affirmations</li>
                    <li>• Healing playlists and meditation guides</li>
                    <li>• Priority support from our community</li>
                  </ul>
                  {!showSubscription && (
                    <button
                      onClick={() => setShowSubscription(true)}
                      className="mt-4 text-heartbreak-600 font-semibold hover:text-heartbreak-700 transition-colors"
                    >
                      Learn More →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
