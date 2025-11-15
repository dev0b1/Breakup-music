"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StyleSelector, SongStyle } from "@/components/StyleSelector";
import FileUpload from "@/components/FileUpload";
import LoadingProgress, { LoadingStep } from "@/components/LoadingProgress";
import { FiEdit, FiImage } from "react-icons/fi";

type InputMode = 'text' | 'screenshot';

export default function StoryPage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [story, setStory] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [style, setStyle] = useState<SongStyle>("petty");
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState<LoadingStep>('ocr');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleGenerate = async () => {
    if (inputMode === 'text' && story.trim().length < 10) {
      alert("Spill more tea! We need at least 10 characters to roast properly 🔥");
      return;
    }

    if (inputMode === 'screenshot' && !screenshot) {
      alert("Upload that screenshot! We need the receipts 👀");
      return;
    }

    setIsGenerating(true);
    setLoadingStep('ocr');
    setLoadingProgress(0);

    try {
      let extractedText = story;

      if (inputMode === 'screenshot' && screenshot) {
        setLoadingStep('ocr');
        
        const formData = new FormData();
        formData.append('image', screenshot);

        const ocrResponse = await fetch('/api/ocr', {
          method: 'POST',
          body: formData,
        });

        const ocrData = await ocrResponse.json();

        if (!ocrData.success) {
          throw new Error(ocrData.error || 'Failed to extract text from screenshot');
        }

        extractedText = ocrData.cleanedText;
      }

      setLoadingStep('lyrics');
      setLoadingProgress(30);

      const response = await fetch("/api/generate-song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story: extractedText,
          style,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLoadingStep('complete');
        setLoadingProgress(100);
        
        setTimeout(() => {
          router.push(`/preview?songId=${data.songId}`);
        }, 500);
      } else {
        throw new Error(data.error || "Failed to generate song");
      }
    } catch (error) {
      console.error("Error generating song:", error);
      alert(`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-exroast-black px-4">
        <LoadingProgress currentStep={loadingStep} progress={loadingProgress} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-exroast-black">
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
              <h1 className="text-5xl md:text-6xl font-black text-white">
                Spill the Tea <span className="text-gradient">👀</span>
              </h1>
              <p className="text-2xl text-exroast-gold font-bold">
                What did they do? We need ALL the details 🔥
              </p>
            </div>

            <div className="card space-y-6">
              {/* Input Mode Selector */}
              <div className="flex gap-4">
                <button
                  onClick={() => setInputMode('text')}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 ${
                    inputMode === 'text'
                      ? 'bg-gradient-to-r from-exroast-pink to-orange-500 text-white shadow-lg shadow-exroast-pink/50'
                      : 'bg-exroast-black/50 text-gray-400 border-2 border-gray-700 hover:border-exroast-gold'
                  }`}
                >
                  <FiEdit className="inline mr-2" />
                  Type It Out
                </button>
                <button
                  onClick={() => setInputMode('screenshot')}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-lg transition-all duration-300 ${
                    inputMode === 'screenshot'
                      ? 'bg-gradient-to-r from-exroast-pink to-orange-500 text-white shadow-lg shadow-exroast-pink/50'
                      : 'bg-exroast-black/50 text-gray-400 border-2 border-gray-700 hover:border-exroast-gold'
                  }`}
                >
                  <FiImage className="inline mr-2" />
                  Upload Screenshot
                </button>
              </div>

              {/* Text Input */}
              {inputMode === 'text' && (
                <div className="space-y-2">
                  <label className="block text-xl font-black text-exroast-gold">
                    Spill the tea — what did they do? 👀
                  </label>
                  <div className="relative">
                    <textarea
                      value={story}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setStory(e.target.value);
                        }
                      }}
                      maxLength={500}
                      placeholder="They ghosted me after 2 years... They cheated with my best friend... They said I was 'too much'... Give us EVERYTHING 🗡️"
                      className="w-full h-48 input-field resize-none text-lg"
                    />
                    <div className="absolute bottom-4 right-4 text-sm text-gray-500 font-bold">
                      {story.length}/500
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 italic">
                    💡 The more specific, the more savage the roast
                  </p>
                </div>
              )}

              {/* Screenshot Upload */}
              {inputMode === 'screenshot' && (
                <div className="space-y-2">
                  <label className="block text-xl font-black text-exroast-gold">
                    Drop those receipts 📸
                  </label>
                  <FileUpload
                    onFileSelect={(file) => setScreenshot(file)}
                    onClear={() => setScreenshot(null)}
                  />
                  <p className="text-sm text-gray-400 italic">
                    💡 Upload a chat screenshot for max petty energy
                  </p>
                </div>
              )}

              {/* Style Selector */}
              <div className="pt-4">
                <StyleSelector
                  selected={style}
                  onChange={setStyle}
                />
              </div>

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={inputMode === 'text' && story.trim().length < 10}
                className={`w-full py-6 rounded-2xl font-black text-2xl transition-all duration-300 ${
                  inputMode === 'text' && story.trim().length < 10
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-exroast-pink to-orange-500 text-white shadow-2xl shadow-exroast-pink/50 hover:shadow-3xl'
                }`}
              >
                Generate My Roast 🔥💅
              </motion.button>

              <p className="text-center text-sm text-gray-400">
                Free 15-second preview • Full roast $4.99 • Takes 30 seconds
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
