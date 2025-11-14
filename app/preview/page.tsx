"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SongPlayer } from "@/components/SongPlayer";
import { SubscriptionCTA } from "@/components/SubscriptionCTA";
import { SocialShareButtons } from "@/components/SocialShareButtons";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { FaLock, FaDownload } from "react-icons/fa";

interface Song {
  id: string;
  title: string;
  previewUrl: string;
  fullUrl: string;
  style: string;
  story: string;
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const songId = searchParams.get("songId");
  
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSubscription, setShowSubscription] = useState(false);

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

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Listen to your 10-second preview below
              </p>
            </div>

            <SongPlayer
              audioUrl={song.previewUrl}
              title={song.title}
              isPreview={true}
              previewDuration={10}
            />

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

            <div className="card">
              <SocialShareButtons songId={song.id} songTitle={song.title} />
            </div>

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
