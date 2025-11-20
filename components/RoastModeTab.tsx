"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaSpinner, FaFire, FaPlay, FaDownload } from "react-icons/fa";

interface RoastModeTabProps {
  userId: string;
}

export function RoastModeTab({ userId }: RoastModeTabProps) {
  const router = useRouter();
  const [previousRoasts, setPreviousRoasts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPreviousRoasts();
  }, [userId]);

  const fetchPreviousRoasts = async () => {
    try {
      const response = await fetch(`/api/user/roasts?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPreviousRoasts(data.roasts || []);
      }
    } catch (error) {
      console.error("Error fetching previous roasts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Create New Roast Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-red-600 bg-clip-text text-transparent">
            Create Your Savage Roast 🔥
          </h2>
          <p className="text-lg md:text-xl text-gray-300 font-semibold">
            30-second AI diss track that ends them
          </p>
        </div>

        <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 md:p-8 shadow-xl">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl">🗡️</div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    Ready to roast?
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                    Spill the tea, pick your vibe (Petty Roast or Glow-Up Flex), and get your 30-second banger.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/app")}
              className="w-full text-lg md:text-xl font-black py-5 md:py-6 rounded-lg flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Spill the Tea & Create Roast</span>
              <FaFire className="text-2xl" />
            </button>
            
            <p className="text-center text-gray-500 text-xs md:text-sm">
              Full roast creation with OCR, style selection, and audio preview
            </p>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-white/30 font-bold text-xs md:text-sm">YOUR SAVAGE LIBRARY</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Previous Roasts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-black text-white">
            Previous Roasts
          </h3>
          <p className="text-base md:text-lg text-gray-400">
            {previousRoasts.length > 0
              ? `${previousRoasts.length} savage track${previousRoasts.length !== 1 ? "s" : ""} ready to share`
              : "No roasts yet – create your first masterpiece above!"}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <FaSpinner className="animate-spin text-orange-500 text-4xl" />
          </div>
        ) : previousRoasts.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-center py-16">
            <div className="text-6xl md:text-7xl mb-4">🎵</div>
            <p className="text-lg md:text-xl text-gray-400 font-bold">
              Your roasts will appear here
            </p>
            <p className="text-sm md:text-base text-gray-500 mt-2">
              Create your first one to build your savage library
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {previousRoasts.map((roast, index) => (
              <motion.div
                key={roast.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-black/60 backdrop-blur-xl border border-white/10 hover:border-white/20 cursor-pointer transition-all duration-300 rounded-lg p-4 md:p-5 shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl md:text-4xl">🎵</div>
                    {roast.mode && (
                      <span className={`text-[10px] md:text-xs font-black px-2 py-1 rounded-md ${
                        roast.mode === "petty" 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>
                        {roast.mode === "petty" ? "🔥 PETTY" : "👑 GLOW-UP"}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-base md:text-lg font-bold text-white line-clamp-2 min-h-[3rem]">
                    {roast.title || "Untitled Roast"}
                  </h4>
                  
                  {roast.audioUrl ? (
                    <div className="space-y-3">
                      <audio
                        controls
                        className="w-full"
                        src={roast.audioUrl}
                        style={{
                          filter: "hue-rotate(320deg) saturate(1.5)",
                        }}
                      />
                      <div className="flex gap-2">
                        <button className="flex-1 bg-orange-600/80 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2">
                          <FaPlay className="text-xs" /> Play
                        </button>
                        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-2 rounded-lg text-xs md:text-sm font-bold transition-colors flex items-center justify-center gap-2">
                          <FaDownload className="text-xs" /> Share
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 rounded-md px-3 py-2 text-center border border-white/10">
                      <p className="text-xs text-gray-400">Audio not available</p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center pt-2 border-t border-white/5">
                    {new Date(roast.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}