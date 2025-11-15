"use client";

import { FaTiktok, FaInstagram, FaWhatsapp, FaTwitter, FaLink } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

interface SocialShareButtonsProps {
  songId?: string;
  songTitle?: string;
  url?: string;
  title?: string;
  message?: string;
}

export function SocialShareButtons({ songId, songTitle, url, title, message }: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = url || (typeof window !== "undefined" && songId
    ? `${window.location.origin}/share/${songId}`
    : "");
  
  const shareText = message || `Check out my AI-generated HeartHeal song: "${title || songTitle}" 💔🎵`;

  const handleTikTok = () => {
    const tiktokUrl = `https://www.tiktok.com/upload?caption=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(tiktokUrl, "_blank");
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/", "_blank");
    navigator.clipboard.writeText(shareUrl);
  };

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const socialButtons = [
    {
      name: "TikTok",
      icon: FaTiktok,
      onClick: handleTikTok,
      color: "bg-black hover:bg-gray-800",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      onClick: handleInstagram,
      color: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      onClick: handleWhatsApp,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      onClick: handleTwitter,
      color: "bg-blue-400 hover:bg-blue-500",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-700">Share Your Song</h3>
      
      <div className="flex flex-wrap gap-3">
        {socialButtons.map((button) => {
          const Icon = button.icon;
          return (
            <motion.button
              key={button.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={button.onClick}
              className={`${button.color} text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg transition-all duration-300`}
            >
              <Icon className="text-xl" />
              <span className="font-medium">{button.name}</span>
            </motion.button>
          );
        })}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyLink}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg transition-all duration-300"
        >
          <FaLink className="text-xl" />
          <span className="font-medium">{copied ? "Copied!" : "Copy Link"}</span>
        </motion.button>
      </div>
    </div>
  );
}
