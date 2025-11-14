# 💔 Breakup Song Generator

A viral Next.js web application that generates personalized AI breakup songs with Paddle subscription billing, social sharing, and emotional healing features.

## Features

- 🎵 **AI-Powered Song Generation**: Create unique breakup songs from your story
- 💳 **Paddle Billing Integration**: Subscription tiers and single song purchases
- 📱 **Social Sharing**: Share on TikTok, Instagram, WhatsApp, and Twitter
- 🎨 **Three Emotional Styles**: Sad, Savage, or Healing vibes
- 🎧 **Audio Preview**: 10-second previews before purchase
- 💎 **Premium Features**: AI breakup advice and no-contact guidance
- 📱 **Mobile-First Design**: Responsive and beautiful on all devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS with custom heartbreak theme
- **Animations**: Framer Motion for smooth transitions
- **Payments**: Paddle Billing for subscriptions and one-time purchases
- **Audio**: React-H5-Audio-Player for playback
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Copy the environment variables:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Configure your environment variables:
   - Get Paddle credentials from [Paddle Dashboard](https://vendors.paddle.com/)
   - Get ElevenLabs API key from [ElevenLabs](https://elevenlabs.io/)

### Development

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:5000](http://localhost:5000) in your browser.

## Paddle Integration

This app uses Paddle Billing for payments. To set up:

1. **Sandbox Mode** (for testing):
   - Set \`NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox\`
   - Use sandbox credentials from Paddle Dashboard

2. **Create Products & Prices** in Paddle Dashboard:
   - Standard Plan: $9/month (5 songs)
   - Premium Plan: $19/month (20 songs + advice)
   - Single Song: $2.99 one-time

3. **Webhook Setup**:
   - Add webhook URL: \`your-domain.com/api/webhook\`
   - Copy the webhook secret to \`.env\`

## ElevenLabs Music API Integration

The app is scaffolded for ElevenLabs Music API integration:

1. Get your API key from [ElevenLabs](https://elevenlabs.io/)
2. Add it to \`.env\` as \`ELEVENLABS_API_KEY\`
3. Implement the song generation in \`lib/elevenlabs.ts\`
4. Update the API route in \`app/api/generate-song/route.ts\`

### Integration Points:

\`\`\`typescript
// lib/elevenlabs.ts
const elevenlabs = new ElevenLabsMusicAPI(process.env.ELEVENLABS_API_KEY);

const song = await elevenlabs.generateSong({
  prompt: userStory,
  duration: 120, // 2 minutes
  style: selectedStyle,
});
\`\`\`

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── generate-song/    # Song generation endpoint
│   │   └── song/[id]/         # Song retrieval endpoint
│   ├── story/                 # Story input page
│   ├── preview/               # Song preview page
│   ├── success/               # Payment success page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── Header.tsx             # Navigation header
│   ├── Footer.tsx             # Site footer
│   ├── StyleSelector.tsx      # Song style picker
│   ├── SongPlayer.tsx         # Audio player
│   ├── SubscriptionCTA.tsx    # Pricing/checkout
│   ├── LoadingAnimation.tsx   # Loading states
│   ├── SocialShareButtons.tsx # Share functionality
│   └── PaddleLoader.tsx       # Paddle.js loader
├── lib/
│   └── elevenlabs.ts          # ElevenLabs API client
└── public/
    └── audio/                 # Audio files
\`\`\`

## Subscription Tiers

### Free
- 10-second song previews
- All song styles
- Share previews

### Standard ($9/month)
- 5 full songs per month
- HD audio quality
- Download MP3 files
- Social sharing

### Premium ($19/month)
- 20 full songs per month
- HD audio quality
- Download MP3 files
- Social sharing
- AI breakup advice
- No-contact tips & guidance
- Priority support

## Deployment

This app is ready to deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Remember to:
- Switch Paddle to production mode
- Update webhook URLs to production domain
- Test the full payment flow

## License

MIT

## Support

For issues or questions, please open a GitHub issue or contact support.

---

Made with 💔 and AI
