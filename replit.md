# HeartHeal - Replit Project

## Overview
HeartHeal is a Next.js web application for generating personalized AI breakup songs with emotional healing support, multiple mood modes, and social sharing features. Built with Next.js 16, Tailwind CSS, Framer Motion, Suno AI, and OpenRouter. Rebranded from "Breakup Song Generator" to "HeartHeal" with a high-conversion landing page.

## Recent Changes (November 15, 2025)

### Latest Updates - Viral Features Implementation (November 15, 2025)
- ✅ **Analysis Screen for Chat Uploads** - Shows red flag level (Low/Medium/High), heartbreak intensity (7-10), and recommended vibe after screenshot upload with 3-5 second loading animation
- ✅ **Enhanced UX - Character Counter** - Live character counter (0/500) on story textarea with maxLength enforcement
- ✅ **Enhanced UX - Mode Examples** - Added one-line examples under each mode:
  - Sad: "Why wasn't I enough?"
  - Savage: "Your loss, my glow-up"
  - Healing: "I'm better without you"
  - Vibe: "It is what it is"
  - Meme: "Red flags? I collected them all"
- ✅ **First-Time User Experience** - Free first song (20 sec preview) with subscription modal after playback
- ✅ **Subscription Modal** - Appears once after first song preview ends, uses localStorage to track, shows benefits and $9/month pricing
- ✅ **Mobile Responsive** - All new features optimized for mobile devices

### Previous Updates - Rebranding & Landing Page Redesign (November 15, 2025)
- ✅ **Rebranded to HeartHeal** - Updated all branding from "Breakup Song Generator" to "HeartHeal"
- ✅ **Redesigned landing page** - High-conversion design with emotional headlines, social proof, benefits-focused sections
- ✅ **Added onboarding modal** - Interactive 3-step wizard: emotional check-in → story input → mode selection
- ✅ **Updated AI model** - Changed from Claude 3.5 Sonnet to Mistral 7B Instruct (free tier)
- ✅ **Changed AI role** - AI now cleans up OCR text and generates Suno prompts instead of full lyrics
- ✅ **Added 5 emotional modes** - Sad, Savage, Healing, Vibe, and Meme (expanded from 3)

### Previous Updates - Suno AI Integration & Animated Lyrics
- ✅ **Integrated Suno AI** - Replaced ElevenLabs with Suno AI for professional music generation
- ✅ **Added OpenRouter integration** - Using Mistral 7B for OCR cleanup and prompt generation
- ✅ **Created LyricsOverlay component** - Smooth scrolling lyrics synchronized with song playback
- ✅ **Created AnimatedBackground component** - Floating hearts, musical notes, and gradient animations
- ✅ **Enhanced Share page** - Two-column layout with lyrics overlay, animated background, and custom audio player
- ✅ **Enhanced Preview page** - Added lyrics display with animations and improved social sharing
- ✅ **Implemented OCR workflow** - Screenshot → OCR → LLM → Suno AI complete pipeline

### Previous Updates - Professional UI Redesign (November 14, 2025)
- ✅ **Redesigned landing page** - Removed excessive pricing, focus on value and features
- ✅ **Created dedicated pricing page** (`/pricing`) with comprehensive tier comparison
- ✅ **Enhanced UI design** - Improved spacing, typography, card hover effects
- ✅ **Improved Paddle integration** - Better error handling and environment validation
- ✅ **Updated navigation** - Added "Get Started" button and pricing link in header
- ✅ **Next.js optimization** - Added image optimization and compression settings

### Initial Setup
- ✅ Initialized Next.js 16 project with App Router and TypeScript
- ✅ Configured Tailwind CSS with custom heartbreak color palette
- ✅ Created all core components (Header, Footer, StyleSelector, SongPlayer, SubscriptionCTA, LoadingAnimation, SocialShareButtons)
- ✅ Built landing page with animated broken heart and floating musical notes
- ✅ Created story input page with textarea and style selection (Sad, Savage, Healing)
- ✅ Built song preview page with audio player and subscription options
- ✅ Integrated Paddle.js for subscription checkout
- ✅ Added social share functionality for TikTok, Instagram, WhatsApp, Twitter
- ✅ Created API routes for song generation and retrieval
- ✅ Set up ElevenLabs Music API integration scaffolding

## Project Architecture

### Frontend
- **Next.js 16 App Router**: Modern React framework with server components
- **Tailwind CSS**: Utility-first styling with custom heartbreak theme
- **Framer Motion**: Smooth animations and transitions
- **React Icons**: Icon library for UI elements

### Pages
1. `/` - Landing page with hero, features, how it works, FAQ (pricing removed for cleaner UX)
2. `/pricing` - Dedicated pricing page with all subscription tiers and FAQs
3. `/story` - Story input with text/screenshot options and style selection
4. `/preview` - Song preview with animated lyrics overlay, custom player, and social sharing
5. `/share/[id]` - Public song share page with full animations and lyrics
6. `/success` - Payment confirmation page

### Components
- `Header` - Navigation with logo and links
- `Footer` - Links and social media
- `StyleSelector` - Choose song vibe (Sad/Savage/Healing/Vibe/Meme)
- `SongPlayer` - Audio playback with controls
- `LyricsOverlay` - Animated scrolling lyrics synchronized to music
- `AnimatedBackground` - Floating hearts, musical notes, gradient animations
- `AnalysisScreen` - Chat screenshot analysis with red flags, heartbreak intensity, recommended vibe (NEW)
- `SubscriptionModal` - First-time user subscription prompt after preview (NEW)
- `SubscriptionCTA` - Pricing tiers and checkout
- `LoadingAnimation` - Spinning musical notes animation
- `LoadingProgress` - Progress indicator for song generation
- `FileUpload` - Screenshot upload component with preview thumbnail
- `SocialShareButtons` - Share to social platforms
- `PaddleLoader` - Paddle.js SDK initialization

### API Routes
- `/api/generate-song` - POST endpoint for song generation (OpenRouter + Suno AI)
- `/api/song/[id]` - GET endpoint for song retrieval
- `/api/ocr` - POST endpoint for text extraction from screenshots
- `/api/webhook` - Paddle webhook handler

### Libraries
- `lib/suno.ts` - Suno AI client for music generation (NEW)
- `lib/openrouter.ts` - OpenRouter client for LLM prompt generation (NEW)
- `lib/ocr.ts` - Tesseract.js OCR functionality
- `lib/lyrics.ts` - Lyrics generation utilities
- `lib/prisma.ts` - Prisma database client

## Paddle Billing Integration

### Subscription Tiers
- **Free**: $0 - 10-second previews, unlimited generations
- **Standard**: $9/month - 5 full songs, HD audio, MP3 downloads
- **Premium**: $19/month - 20 full songs, AI advice, no-contact tips, priority support
- **Single Song**: $2.99 - One-time purchase (optional alternative to subscriptions)

### Setup Instructions

1. **Create Paddle Account**
   - Sign up at https://www.paddle.com/
   - Complete account verification

2. **Create Products in Paddle Dashboard**
   - Create 3 subscription products (Standard, Premium, Single Song)
   - Note the Price IDs for each product

3. **Configure Environment Variables**
   Add these to your Replit Secrets:
   ```
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your_client_token_here
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox (or "production")
   NEXT_PUBLIC_PADDLE_PRICE_STANDARD=pri_01xxxxx (your actual price ID)
   NEXT_PUBLIC_PADDLE_PRICE_PREMIUM=pri_01xxxxx (your actual price ID)
   NEXT_PUBLIC_PADDLE_PRICE_SINGLE=pri_01xxxxx (your actual price ID)
   PADDLE_API_KEY=your_api_key_here
   PADDLE_NOTIFICATION_WEBHOOK_SECRET=pdl_ntfset_xxxxx
   ```

4. **Set up Webhook**
   - In Paddle dashboard, go to Developer Tools > Webhooks
   - Add webhook URL: `https://your-replit-url.repl.co/api/webhook`
   - Select events: `transaction.completed`, `subscription.created`, `subscription.updated`, `subscription.canceled`

5. **Test in Sandbox Mode**
   - Use Paddle's test card numbers
   - Verify webhook events are received
   - Test subscription flows

### Error Handling
The app includes comprehensive error handling for Paddle:
- Validates environment variables before checkout
- Provides user-friendly error messages
- Logs errors to console for debugging
- Prevents checkout with invalid price IDs

## AI Integration

### Suno AI Music Generation
The app uses Suno AI (via third-party API providers) for professional music generation:

**Required Environment Variables:**
```
SUNO_API_KEY=your_api_key_here
```

**Integration Flow:**
1. User provides breakup story (text or screenshot)
2. OCR extracts text from screenshot (if applicable)
3. OpenRouter/LLM generates song lyrics and metadata
4. Suno AI generates the actual music
5. Song is stored in database with preview and full URLs

**Implementation:** See `lib/suno.ts` for the Suno API client

### OpenRouter LLM Integration
The app uses OpenRouter to access Claude 3.5 Sonnet for intelligent prompt generation:

**Required Environment Variables:**
```
OPENROUTER_API_KEY=your_api_key_here
```

**Purpose:**
- Converts raw breakup stories into structured song lyrics
- Generates song titles and genre/style tags
- Optimizes prompts for Suno AI music generation

**Implementation:** See `lib/openrouter.ts` for the OpenRouter API client

### Tesseract.js OCR
Extracts text from chat screenshots using client-side OCR:
- Implementation: `lib/ocr.ts`
- API endpoint: `/api/ocr`
- No API key required (runs in-browser)

## User Preferences
- Mobile-first responsive design
- Smooth animations using Framer Motion
- Heartbreak color palette (pale red, white, gray)
- Rounded, friendly fonts
- No placeholder data - production-ready code

## Dependencies
```json
{
  "@paddle/paddle-js": "^1.5.1",
  "next": "^16.0.3",
  "react": "^19.2.0",
  "tailwindcss": "^4.1.17",
  "framer-motion": "^12.23.24",
  "react-icons": "^5.5.0",
  "react-h5-audio-player": "^3.10.1",
  "clsx": "^2.1.1"
}
```

## Development
- Dev server runs on port 5000 (required for Replit webview)
- All hosts allowed for iframe compatibility
- TypeScript strict mode enabled

## Complete Workflow

### Song Generation Flow
1. **User Input**: User enters breakup story as text OR uploads chat screenshot
2. **OCR Processing** (if screenshot): Tesseract.js extracts text from image
3. **LLM Generation**: OpenRouter (Claude 3.5) converts story into:
   - Song title
   - Genre/style tags
   - Full lyrics (200-400 words)
4. **Music Generation**: Suno AI creates the actual song (30-60 seconds)
5. **Preview Display**: User sees:
   - Animated lyrics overlay
   - Custom audio player
   - Animated background with floating elements
   - Social share buttons
6. **Sharing**: Users can share song on TikTok, Instagram, WhatsApp, Twitter

### Technical Features
- **Mobile-first responsive design** with Tailwind CSS
- **Smooth animations** using Framer Motion
- **Lyrics scrolling** synchronized to song duration (60s default)
- **CSS-only animations** for background (no video generation)
- **Export functionality** (premium feature - locked)
- **AI Breakup Advice** (premium feature - upsell in UI)

## Next Steps
1. ✅ Suno AI and OpenRouter integration complete
2. Set up Paddle products and prices in dashboard
3. Configure webhook endpoint for subscription events
4. Test payment flow in sandbox mode
5. Add user authentication for song history
6. Implement download functionality for purchased songs
7. Test complete OCR → LLM → Suno workflow with real API keys
