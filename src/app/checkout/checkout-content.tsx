"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import {
  SINGLE_PRICE_ID,
  PREMIUM_PRICE_ID,
} from '@/lib/pricing';

const tiers: { [key: string]: { priceId: string; name: string } } = {
  standard: {
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_STANDARD || "pri_standard",
    name: "Standard",
  },
  premium: {
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM || "pri_premium",
    name: "Premium",
  },
};

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const processCheckout = async () => {
      try {
        // Verify user is logged in
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUserEmail(user.email || null);

        // Get tier from query params
        const tier = searchParams.get("tier") || "premium";
        const type = searchParams.get("type");

        // Wait for Paddle to load
        await new Promise((resolve) => {
          const checkPaddle = setInterval(() => {
            if (typeof window !== "undefined" && (window as any).Paddle) {
              clearInterval(checkPaddle);
              resolve(null);
            }
          }, 100);
          setTimeout(() => {
            clearInterval(checkPaddle);
            resolve(null);
          }, 5000); // Max 5 seconds wait
        });

        if (!(window as any).Paddle) {
          setError("Payment system failed to load. Please try again.");
          setIsLoading(false);
          return;
        }

        let priceId: string;
        let successUrl: string;

        const songId = searchParams.get('songId');

        if (type === "single") {
          priceId = SINGLE_PRICE_ID || process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE || "pri_single";
          successUrl = `${window.location.origin}/success?type=single${songId ? `&songId=${songId}` : ''}`;
        } else {
          // support 'premium' and 'standard' tiers; prefer centralized PREMIUM_PRICE_ID for premium
          if (tier === 'premium') {
            priceId = PREMIUM_PRICE_ID || process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM || tiers['premium'].priceId;
          } else {
            const tierConfig = tiers[tier];
            if (!tierConfig) {
              setError("Invalid tier selected");
              setIsLoading(false);
              return;
            }
            priceId = tierConfig.priceId;
          }
          successUrl = `${window.location.origin}/success?tier=${tier}`;
        }

        // Validate price ID format (allow shorter sandbox ids but warn)
        const isPaddleFormatStrict = /^pri_[0-9a-zA-Z]{20,}$/.test(priceId);
        const isPaddleFormatLoose = /^pri_[0-9a-zA-Z]{5,}/.test(priceId);
        if (!isPaddleFormatLoose) {
          setError("Payment system not configured. Please contact support.");
          setIsLoading(false);
          return;
        }
        if (!isPaddleFormatStrict) {
          console.warn('Paddle price id appears shorter than mainnet format; this may be a sandbox id and is allowed for dev.');
        }

        // Build checkout payload. If we have a songId and user, attach custom_data so
        // webhook can unlock the specific song after transaction completion.
        const checkoutPayload: any = {
          items: [ { priceId: priceId, quantity: 1 } ],
          settings: { successUrl: successUrl, theme: 'light' }
        };

        if (songId) {
          checkoutPayload.customData = { songId, userId: user?.id || null };
        } else if (user) {
          checkoutPayload.customData = { userId: user.id };
        }

        // Open Paddle checkout
        (window as any).Paddle.Checkout.open(checkoutPayload);

        setIsLoading(false);
      } catch (err) {
        console.error("Checkout error:", err);
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    };

    processCheckout();
  }, [router, searchParams, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-4"
        >
          <FaSpinner className="text-5xl text-exroast-gold animate-spin mx-auto" />
          <h2 className="text-3xl font-bold text-white">Opening checkout...</h2>
          {userEmail ? (
            <div className="text-sm text-gray-400">Signed in as {userEmail}</div>
          ) : (
            <div className="text-sm text-gray-400">Signing in...</div>
          )}
          <p className="text-gray-400">Redirecting to Paddle</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center space-y-6 card max-w-md"
        >
          <h2 className="text-3xl font-bold text-red-500">Checkout Error</h2>
          <p className="text-gray-300">{error}</p>
          {userEmail ? (
            <p className="text-sm text-gray-400">Signed in as {userEmail}</p>
          ) : (
            <p className="text-sm text-gray-400">Not signed in</p>
          )}
          <button
            onClick={() => router.push("/pricing")}
            className="btn-primary w-full"
          >
            Back to Pricing
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center space-y-4"
      >
        <FaSpinner className="text-5xl text-exroast-gold animate-spin mx-auto" />
        <h2 className="text-3xl font-bold text-white">Opening checkout...</h2>
        <p className="text-gray-400">Redirecting to Paddle</p>
      </motion.div>
    </div>
  );
}
