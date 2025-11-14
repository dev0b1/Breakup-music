"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StyleSelector, SongStyle } from "@/components/StyleSelector";
import { LoadingAnimation } from "@/components/LoadingAnimation";

export default function StoryPage() {
  const router = useRouter();
  const [story, setStory] = useState("");
  const [style, setStyle] = useState<SongStyle>("sad");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (story.trim().length < 10) {
      alert("Please tell us a bit more about your breakup (at least 10 characters)");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story,
          style,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/preview?songId=${data.songId}`);
      } else {
        throw new Error(data.error || "Failed to generate song");
      }
    } catch (error) {
      console.error("Error generating song:", error);
      alert("Something went wrong. Please try again.");
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation message="Creating your personalized song..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Tell Your <span className="text-gradient">Breakup Story</span>
              </h1>
              <p className="text-xl text-gray-600">
                Don't hold back. Let it all out. We'll turn it into music.
              </p>
            </div>

            <div className="card space-y-6">
              <div className="space-y-3">
                <label htmlFor="story" className="block text-lg font-semibold text-gray-700">
                  Your Story
                </label>
                <textarea
                  id="story"
                  rows={6}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Example: They said they needed space, then I saw them with someone new the next day. After 3 years together, I deserved better than that..."
                  className="input-field resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Be honest. The AI can handle it.</span>
                  <span>{story.length}/500</span>
                </div>
              </div>

              <StyleSelector selected={style} onChange={setStyle} />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={story.trim().length < 10}
                className="btn-primary w-full text-xl py-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate My Song 🎵
              </motion.button>
            </div>

            <div className="card bg-heartbreak-50 border-heartbreak-200">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">💡</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Pro Tips:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Be specific about what hurt the most</li>
                    <li>• Include details that made your relationship unique</li>
                    <li>• Don't worry about grammar - raw emotion works best</li>
                    <li>• The more honest you are, the better your song will be</li>
                  </ul>
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
