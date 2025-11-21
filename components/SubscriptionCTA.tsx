"use client";

import { motion } from "framer-motion";
import { FaCheck, FaStar, FaCrown } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { openSingleCheckout, openTierCheckout } from "@/lib/checkout";
import {
  SINGLE_PRICE_ID,
  SINGLE_AMOUNT,
  SINGLE_LABEL,
  SINGLE_BUTTON_TEXT,
  PREMIUM_PRICE_ID,
  PREMIUM_AMOUNT,
  PREMIUM_LABEL,
  PREMIUM_BUTTON_TEXT,
} from "@/lib/pricing";

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  icon: any;
  priceId: string;
}

// Align tiers with the pricing page: One-Time Pro ($4.99) and Unlimited Pro ($12.99/mo)
const tiers: SubscriptionTier[] = [
  {
    id: "one-time",
    name: "One-Time Pro",
    price: SINGLE_AMOUNT,
    interval: "one-time",
    priceId: SINGLE_PRICE_ID || "pri_single",
    icon: FaStar,
    features: [
      "Tailored Suno AI song",
      "Personalized from YOUR story",
      "Full 30-35s song",
      "No watermark",
      "Download MP3",
    ],
  },
  {
    id: "unlimited",
    name: "Unlimited Pro",
    price: PREMIUM_AMOUNT,
    interval: "month",
    priceId: PREMIUM_PRICE_ID || "pri_premium",
    icon: FaCrown,
    popular: true,
    features: [
      "UNLIMITED personalized songs",
      "Upload chat screenshots",
      "AI reads chats for ultra-petty lines",
      "Unlimited history & saves",
      "Clean MP3 downloads (no watermark)",
    ],
  },
];

interface SubscriptionCTAProps {
  songId?: string | null;
  // autoOpenSingle: when true and songId present, immediately open the single-song checkout
  autoOpenSingle?: boolean;
}

export function SubscriptionCTA({ songId, autoOpenSingle }: SubscriptionCTAProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, [supabase]);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    setIsLoading(tier.id);
    try {
      // Re-check auth state at click time to avoid stale `user` state causing
      // an unnecessary redirect to the auth page when the user is actually signed in.
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      let resolvedUser = freshUser;
      if (!resolvedUser) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) resolvedUser = sessionData.session.user;
        } catch (e) {
          // ignore
        }
      }

      if (!resolvedUser) {
        // Let the checkout helper handle sign-in flow consistently
        await openTierCheckout(tier.id, tier.priceId);
        return;
      }

      await openTierCheckout(tier.id, tier.priceId);
    } catch (err) {
      console.error('handleSubscribe error', err);
      alert('Unable to open checkout. Please try again or contact support.');
    } finally {
      setIsLoading(null);
    }
  };

  // Open single-song checkout. If songId is provided, attach it as customData so
  // the server-side webhook can unlock the correct song on transaction completion.
  const handleSingleSongPurchase = async (opts?: { songId?: string }) => {
    setIsLoading("single");

    try {
      // Re-check auth state at click time to avoid stale `user` state causing
      // an unnecessary redirect to the auth page when the user is actually signed in.
      const { data: { user: freshUser } } = await supabase.auth.getUser();
      let resolvedUser = freshUser;
      if (!resolvedUser) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) resolvedUser = sessionData.session.user;
        } catch (e) {
          // ignore
        }
      }

      if (!resolvedUser) {
        // If user isn't signed in, start Google OAuth and redirect to checkout after auth.
        const redirectPath = opts?.songId ? `/checkout?songId=${opts.songId}` : `/checkout?type=single`;
        if (typeof window !== 'undefined') {
          const redirectTo = `${window.location.origin}/auth/callback`;
          try { document.cookie = `post_auth_redirect=${encodeURIComponent(redirectPath)}; path=/; max-age=600`; } catch (e) {}
          await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
        } else {
          const redirect = opts?.songId ? `/checkout?songId=${opts.songId}` : `/checkout?type=single`;
          router.push(`/auth?redirectTo=${encodeURIComponent(redirect)}`);
        }
        return;
      }

      if (typeof window === "undefined") {
        throw new Error("Window is not defined");
      }

      if (!(window as any).Paddle) {
        alert("Payment system is still loading. Please wait a moment and try again.");
        setIsLoading(null);
        return;
      }

      const singlePriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE;

      if (!SINGLE_PRICE_ID && !singlePriceId) {
        console.error("Paddle price ID for single purchase not configured. Please set up your Paddle products.");
        alert("Payment system not configured. Please contact support.");
        setIsLoading(null);
        return;
      }
      const priceToCheck = singlePriceId || SINGLE_PRICE_ID;
      const isPaddleFormat = /^pri_[0-9a-zA-Z]{5,}/.test(priceToCheck);
      if (!isPaddleFormat) {
        console.warn(`Price ID "${singlePriceId}" doesn't match Paddle format (this is a best-effort check).`);
      }

      // Build checkout payload. Paddle SDK will convert camelCase customData -> custom_data
      const checkoutPayload: any = {
        items: [
          { priceId: priceToCheck, quantity: 1 }
        ],
        settings: {
          successUrl: `${window.location.origin}/success?type=single${opts?.songId ? `&songId=${opts.songId}` : ''}`,
          theme: 'light'
        }
      };

      // If we have a songId, attach it so webhook can unlock the right song.
      if (opts?.songId) {
        checkoutPayload.customData = {
          songId: opts.songId,
          userId: user?.id || null,
        };
      } else {
        checkoutPayload.customData = { userId: user?.id || null };
      }

      (window as any).Paddle.Checkout.open(checkoutPayload);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Unable to open checkout. Please try again or contact support.");
    } finally {
      setIsLoading(null);
    }
  };

  // NOTE: autoOpenSingle previously automatically opened the single-song checkout
  // when the component mounted. That caused accidental purchases when upstream
  // flows set the flag (for example, after a preview/upsell). To avoid unexpected
  // checkout openings, we intentionally DO NOT auto-open checkout here. Users
  // must explicitly click the purchase button to start the checkout flow.

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Unlock Full Songs
        </h2>
        <p className="text-gray-600 text-lg">
          Choose the plan that fits your heartbreak journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isPopular = tier.popular;
          
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-3xl p-8 ${
                    tier.id === 'one-time'
                      ? "bg-gray-900/90 text-white shadow-2xl border-2 border-gray-800"
                      : isPopular
                      ? "bg-gradient-to-br from-heartbreak-500 to-heartbreak-600 text-white shadow-2xl border-4 border-heartbreak-400 transform scale-105"
                      : "bg-white border-2 border-gray-200 shadow-lg"
                  }`}>
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-full ${tier.id === 'one-time' ? "bg-white/5" : isPopular ? "bg-white/20" : "bg-heartbreak-100"}`}>
                  <Icon className={`text-2xl ${(isPopular || tier.id === 'one-time') ? "text-white" : "text-heartbreak-500"}`} />
                </div>
                <h3 className={`text-2xl font-bold ${(isPopular || tier.id === 'one-time') ? "text-white" : "text-gray-900"}`}>
                  {tier.name}
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className={`text-5xl font-bold ${(isPopular || tier.id === 'one-time') ? "text-white" : "text-gray-900"}`}>
                    ${tier.price}
                  </span>
                  <span className={`ml-2 ${(isPopular || tier.id === 'one-time') ? "text-white/80" : "text-gray-500"}`}>
                    {tier.interval === 'month' ? `/${tier.interval}` : ''}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <FaCheck className={`text-lg mt-0.5 flex-shrink-0 ${(isPopular || tier.id === 'one-time') ? "text-white" : "text-heartbreak-500"}`} />
                    <span className={(isPopular || tier.id === 'one-time') ? "text-white" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // If this is the one-time product, open the single purchase flow.
                  // handleSingleSongPurchase will redirect to Google sign-in if needed
                  // and then to checkout after auth. For other tiers, use subscription flow.
                  if (tier.id === 'one-time') {
                    handleSingleSongPurchase({ songId: songId || undefined });
                  } else {
                    handleSubscribe(tier);
                  }
                }}
                disabled={isLoading === tier.id}
                className={
                  (tier.id === 'one-time' || isPopular)
                    ? 'btn-primary w-full'
                    : 'w-full py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 bg-gradient-to-r from-heartbreak-500 to-heartbreak-600 text-white hover:shadow-xl'
                }
              >
                {isLoading === tier.id ? "Loading..." : (tier.id === 'one-time' ? `Get One Song` : (tier.id === 'unlimited' ? `Go Unlimited` : `Subscribe to ${tier.name}`))}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}
