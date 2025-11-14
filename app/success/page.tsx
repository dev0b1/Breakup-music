"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaCheckCircle, FaDownload, FaMusic } from "react-icons/fa";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function SuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <FaCheckCircle className="text-8xl text-green-500 mx-auto" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Payment Successful! 🎉
              </h1>
              <p className="text-xl text-gray-600">
                Thank you for your purchase. Your full song is now unlocked!
              </p>
            </div>

            <div className="card space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <FaMusic className="text-4xl text-heartbreak-500" />
                <div className="text-left">
                  <h3 className="font-bold text-lg text-gray-900">What's Next?</h3>
                  <p className="text-gray-600">Your song is ready to download and share</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/preview">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <FaDownload />
                    <span>Download Song</span>
                  </motion.button>
                </Link>
                
                <Link href="/story">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <FaMusic />
                    <span>Create Another</span>
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="card bg-heartbreak-50 border-heartbreak-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Receipt & Account Info
              </h3>
              <p className="text-sm text-gray-600">
                A receipt has been sent to your email. You can manage your subscription 
                and downloads from your account dashboard.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
