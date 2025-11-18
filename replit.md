# ExRoast.fm

## Overview
ExRoast.fm is a Next.js web application designed to transform user breakup stories into savage, TikTok-viral AI roast songs. The project's vision is to offer a platform for users to express their post-breakup emotions through humor and empowerment, leveraging AI for creative content generation. It aims to capture a market seeking entertaining and cathartic digital experiences, with ambitions for viral social media engagement. Key capabilities include AI-driven song generation, personalized audio nudges, and a credit-based subscription model.

## User Preferences
- Mobile-first responsive design
- Bold, aggressive fonts (font-black everywhere)
- Dark theme: black (#0f0f0f) background, hot pink/gold accents
- Club/revenge party aesthetic
- TikTok-viral positioning
- No placeholder data - production-ready code

## System Architecture

### UI/UX Decisions
The application features a dark theme using almost black (#0f0f0f), hot pink (#ff006e), and gold (#ffd23f) for a club/revenge party aesthetic. The design is mobile-first with bold, aggressive typography (font-black throughout). Key visual elements include a neon gradient logo, solid CTA buttons with strong glows, and enhanced visibility for emojis and icons. Animated features like neon spark storms, confetti explosions, and a fast typewriter effect for headlines contribute to a dynamic and engaging user experience. Subtle tooltips replace intrusive onboarding, and all elements are optimized for performance with GPU acceleration where possible.

### Technical Implementations
The frontend is built with **Next.js 16 App Router**, utilizing **Tailwind CSS** for styling and **Framer Motion** for animations. The application is entirely **Drizzle ORM-only** for database interactions, with Prisma having been completely removed.
Core features include:
- **Song Generation Flow**: User input (text or screenshot) leads to LLM-generated prompts by OpenRouter, followed by music generation via Suno AI.
- **Retention Features**: Includes daily savage text quotes and personalized 15-20 second Suno AI audio nudges with lo-fi trap/hype beats, delivered via opt-in mechanisms.
- **Credit System**: Implemented for managing access to audio nudges, with free, one-time, and unlimited tiers.
- **OCR Processing**: Tesseract.js is used for text extraction from uploaded chat screenshots.
- **Lyrics Overlay**: Smooth-scrolling lyrics synchronized with song playback.
- **Performance Optimizations**: Sub-1 second load times, GPU-accelerated animations, and lazy-loaded assets.

### Feature Specifications
- **Landing Page (`/`)**: Focuses on savage messaging and TikTok-viral positioning. Features a "Daily Petty Power-Ups" section showcasing text quotes and audio nudges with visual cards explaining Free vs Pro tiers.
- **Pricing Page (`/pricing`)**: Outlines free, one-time ($4.99), and unlimited ($12.99/month) tiers with clear benefits and visuals.
- **Story Input Page (`/story`)**: Allows users to input breakup stories via text or screenshot, with mode selection (Petty Roast / Glow-Up Flex). Includes upfront daily motivation opt-in checkboxes (text quotes + optional audio nudges) before roast generation.
- **Preview Page (`/preview`)**: Displays a 15-second watermarked song preview for free users, with options to unlock the full song.
- **Share Page (`/share/[id]`)**: Public page for sharing generated songs, including a TikTok share button.
- **Success Page (`/success`)**: Payment confirmation.
- **API Endpoints**: Key endpoints include `/api/generate-song`, `/api/ocr`, `/api/webhook` (Paddle), and endpoints for daily quotes, audio nudges, and credit checks.

### System Design Choices
The system is designed for scalability and performance, emphasizing mobile-first responsiveness and a cohesive dark-themed aesthetic. The choice of Next.js App Router and server components allows for efficient rendering. The integration of various AI services (Suno AI, OpenRouter) and a robust payment gateway (Paddle) ensures a full-featured product. Database schema includes tables for `user_preferences`, `daily_quotes`, `audio_nudges`, and `subscriptions` with credit tracking.

## External Dependencies

- **Suno AI**: Used for professional music generation and personalized audio nudges.
- **OpenRouter**: Integrates Mistral 7B for generating savage, TikTok-viral roast prompts and lyrics.
- **Paddle**: Payment gateway for subscription management, including webhook handling for credit refills.
- **Supabase**: Backend-as-a-Service for database hosting, managed via Drizzle ORM.
- **Tesseract.js**: OCR library for extracting text from uploaded chat screenshots.
- **Framer Motion**: Animation library.
- **Tailwind CSS**: Utility-first CSS framework.
- **React Icons**: Icon library.