"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface SingleCheckoutOpts {
  songId?: string | null;
}

interface IntendedPurchase {
  type: 'single' | 'tier';
  songId?: string | null;
  tierId?: string;
  priceId?: string | null;
  ts: number;
}

// Helper to safely access localStorage
const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Failed to set localStorage key: ${key}`, e);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Failed to remove localStorage key: ${key}`, e);
    }
  }
};

// Helper to resolve user session with fallback
async function resolveUser() {
  const supabase = createClientComponentClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (user) return user;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    return sessionData?.session?.user || null;
  } catch (e) {
    console.warn('Failed to get session', e);
    return null;
  }
}

// Helper to handle Paddle availability
function checkPaddleAvailability(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (!(window as any).Paddle) {
    alert("Payment system is still loading. Please wait a moment and try again.");
    return false;
  }
  
  return true;
}

// Helper to setup Paddle event callbacks for cleanup
function setupPaddleCallbacks() {
  return {
    eventCallback: (data: any) => {
      console.log('[Paddle Event]', data.name, data);
      
      // Clean up the checkout flag when modal closes or completes
      if (data.name === 'checkout.closed' || data.name === 'checkout.completed') {
        console.log('[Paddle Event] Clearing inCheckout flag due to:', data.name);
        safeLocalStorage.removeItem('inCheckout');
      }
    }
  };
}

export async function openSingleCheckout(opts?: SingleCheckoutOpts) {
  console.log('[openSingleCheckout] Starting with opts:', opts);
  
  const user = await resolveUser();
  console.log('[openSingleCheckout] User resolved:', user ? `${user.email} (${user.id})` : 'null');

  if (!user) {
    console.log('[openSingleCheckout] User is null, redirecting to /pricing');
    // Redirect to pricing page for explicit sign-in
    if (typeof window !== 'undefined') {
      const payload: IntendedPurchase = {
        type: 'single',
        songId: opts?.songId || null,
        ts: Date.now()
      };
      safeLocalStorage.setItem('intendedPurchase', JSON.stringify(payload));
      window.location.href = '/pricing';
    }
    return;
  }

  console.log('[openSingleCheckout] Checking Paddle availability...');
  if (!checkPaddleAvailability()) {
    console.error('[openSingleCheckout] Paddle not available');
    return;
  }

  const singlePriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE;
  console.log('[openSingleCheckout] singlePriceId:', singlePriceId);

  if (!singlePriceId) {
    console.error('Single price ID not configured');
    alert('Payment system not configured. Please contact support.');
    return;
  }

  const payload: any = {
    items: [{ priceId: singlePriceId, quantity: 1 }],
    settings: {
      successUrl: `${window.location.origin}/success?type=single${opts?.songId ? `&songId=${opts.songId}` : ''}`,
      theme: 'light',
      ...setupPaddleCallbacks()
    },
    customData: {
      userId: user.id,
      ...(opts?.songId && { songId: opts.songId })
    }
  };

  console.log('[openSingleCheckout] Payload created:', { successUrl: payload.settings.successUrl, customData: payload.customData });

  // Mark checkout as in progress
  safeLocalStorage.setItem('inCheckout', 'true');
  console.log('[openSingleCheckout] Set localStorage.inCheckout = true');

  try {
    console.log('[openSingleCheckout] Calling Paddle.Checkout.open()...');
    (window as any).Paddle.Checkout.open(payload);
    console.log('[openSingleCheckout] Paddle.Checkout.open() called successfully');
  } catch (error) {
    console.error('[openSingleCheckout] Error opening Paddle checkout:', error);
    safeLocalStorage.removeItem('inCheckout');
    alert('Failed to open payment system. Please try again.');
  }
}

export async function openTierCheckout(tierId: string, priceId?: string) {
  console.log('[openTierCheckout] Starting with tierId:', tierId, 'priceId:', priceId);
  
  const user = await resolveUser();
  console.log('[openTierCheckout] User resolved:', user ? `${user.email} (${user.id})` : 'null');

  if (!user) {
    console.log('[openTierCheckout] User is null, redirecting to /pricing');
    // Redirect to pricing page for explicit sign-in
    if (typeof window !== 'undefined') {
      const payload: IntendedPurchase = {
        type: 'tier',
        tierId,
        priceId: priceId || null,
        ts: Date.now()
      };
      safeLocalStorage.setItem('intendedPurchase', JSON.stringify(payload));
      window.location.href = '/pricing';
    }
    return;
  }

  console.log('[openTierCheckout] Checking Paddle availability...');
  if (!checkPaddleAvailability()) {
    console.error('[openTierCheckout] Paddle not available');
    return;
  }

  const priceToUse = priceId || process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM;
  console.log('[openTierCheckout] priceToUse:', priceToUse);

  if (!priceToUse) {
    console.error('Tier priceId not configured');
    alert('Payment system not configured. Please contact support.');
    return;
  }

  const payload: any = {
    items: [{ priceId: priceToUse, quantity: 1 }],
    settings: {
      successUrl: `${window.location.origin}/success?tier=${tierId}`,
      theme: 'light',
      ...setupPaddleCallbacks()
    },
    customData: {
      userId: user.id
    }
  };

  console.log('[openTierCheckout] Payload created:', { successUrl: payload.settings.successUrl, customData: payload.customData });

  // Mark checkout as in progress
  safeLocalStorage.setItem('inCheckout', 'true');
  console.log('[openTierCheckout] Set localStorage.inCheckout = true');

  try {
    console.log('[openTierCheckout] Calling Paddle.Checkout.open()...');
    (window as any).Paddle.Checkout.open(payload);
    console.log('[openTierCheckout] Paddle.Checkout.open() called successfully');
  } catch (error) {
    console.error('[openTierCheckout] Error opening Paddle checkout:', error);
    safeLocalStorage.removeItem('inCheckout');
    alert('Failed to open payment system. Please try again.');
  }
}