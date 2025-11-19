"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function openSingleCheckout(opts?: { songId?: string | null }) {
  const supabase = createClientComponentClient();

  // If user not signed in, start OAuth and redirect to /auth/complete
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Save the intended purchase so we can resume after sign-in.
    if (typeof window !== 'undefined') {
      try {
        const payload = { type: 'single', songId: opts?.songId || null, ts: Date.now() };
        localStorage.setItem('intendedPurchase', JSON.stringify(payload));
      } catch (e) {
        // ignore localStorage errors
      }
      // Start OAuth and redirect to our server callback so it can exchange
      // the code for a session cookie. After exchange the callback will
      // redirect back to the desired checkout path.
      try {
        const dest = opts?.songId ? `/checkout?songId=${opts.songId}` : `/checkout?type=single`;
        const redirectToFull = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(dest)}`;
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectToFull } });
      } catch (e) {
        // fallback to simple flow if options unsupported
        await supabase.auth.signInWithOAuth({ provider: 'google' });
      }
      return;
    }
    return;
  }

  if (typeof window === 'undefined') return;
  if (!(window as any).Paddle) {
    alert("Payment system is still loading. Please wait a moment and try again.");
    return;
  }

  const singlePriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE;
  const priceToUse = singlePriceId || (window as any).__NEXT_DATA__?.env?.NEXT_PUBLIC_PADDLE_PRICE_SINGLE;

  if (!priceToUse) {
    console.error('Single price id not configured');
    alert('Payment system not configured. Please contact support.');
    return;
  }

  const payload: any = {
    items: [{ priceId: priceToUse, quantity: 1 }],
    settings: {
      successUrl: `${window.location.origin}/success?type=single${opts?.songId ? `&songId=${opts.songId}` : ''}`,
      theme: 'light'
    }
  };

  payload.customData = {
    userId: user?.id || null,
    ...(opts?.songId ? { songId: opts.songId } : {})
  };

  (window as any).Paddle.Checkout.open(payload);
}

export async function openTierCheckout(tierId: string, priceId?: string) {
  const supabase = createClientComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // Save the intended tier purchase so we can resume after sign in.
    if (typeof window !== 'undefined') {
      try {
        const payload = { type: 'tier', tierId, priceId: priceId || null, ts: Date.now() };
        localStorage.setItem('intendedPurchase', JSON.stringify(payload));
      } catch (e) {
        // ignore localStorage errors
      }
      try {
        const dest = `/checkout?tier=${tierId}`;
        const redirectToFull = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(dest)}`;
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectToFull } });
      } catch (e) {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
      }
      return;
    }
    return;
  }

  if (typeof window === 'undefined') return;
  if (!(window as any).Paddle) {
    alert("Payment system is still loading. Please wait a moment and try again.");
    return;
  }

  const priceToUse = priceId || (process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM as string) || priceId;
  if (!priceToUse) {
    console.error('Tier priceId not configured');
    alert('Payment system not configured. Please contact support.');
    return;
  }

  const payload: any = {
    items: [{ priceId: priceToUse, quantity: 1 }],
    settings: {
      successUrl: `${window.location.origin}/success?tier=${tierId}`,
      theme: 'light'
    }
  };

  payload.customData = { userId: user?.id || null };

  (window as any).Paddle.Checkout.open(payload);
}
