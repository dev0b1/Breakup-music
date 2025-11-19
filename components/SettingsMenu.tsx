"use client";

import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from "next/navigation";
import { openSingleCheckout, openTierCheckout } from '@/lib/checkout';

export default function SettingsMenu({ user, onClose }: { user?: any; onClose?: () => void }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      try { localStorage.removeItem('intendedPurchase'); } catch (e) {}
      router.push('/');
    } catch (e) {
      console.error('Sign out failed', e);
    } finally {
      setLoading(false);
      onClose?.();
    }
  };

  // Focus + keyboard handling: focus first focusable on open, close on Escape,
  // and trap Tab within the menu. We'll render a centered modal overlay on
  // desktop and a full-screen modal on mobile. Clicking the overlay or the
  // close button will call onClose to dismiss.
  const [isMobile, setIsMobile] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const m = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(m.matches);
    update();
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);

  // fetch credits and roasts when menu opens (requires user)
  const [roasts, setRoasts] = useState<any[] | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user?.id) {
        setCredits(0);
        setRoasts([]);
        return;
      }

      try {
        const res = await fetch('/api/account/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
        if (!res.ok) throw new Error('no summary');
        const json = await res.json();
        if (!mounted) return;
        const c = Number(json?.subscription?.creditsRemaining ?? 0) || 0;
        setCredits(c);
        setRoasts(Array.isArray(json?.roasts) ? json.roasts : []);
      } catch (e) {
        if (mounted) {
          setCredits(0);
          setRoasts([]);
        }
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  useEffect(() => {
    // focus first button when mounted
    const el = document.getElementById('settings-menu');
    if (el) {
      const btn = el.querySelector('button');
      (btn as HTMLElement | null)?.focus?.();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
      if (e.key === 'Tab') {
        // focus trap
        const container = document.getElementById('settings-menu');
        if (!container) return;
        const focusable = Array.from(container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
          .filter((n: any) => !n.hasAttribute('disabled')) as HTMLElement[];
        if (focusable.length === 0) return;
        const idx = focusable.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey) {
          if (idx === 0) {
            focusable[focusable.length - 1].focus();
            e.preventDefault();
          }
        } else {
          if (idx === focusable.length - 1) {
            focusable[0].focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  // Render modal overlay (full-screen on mobile, centered modal on desktop)
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-start md:items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div
        id="settings-menu"
        ref={containerRef}
        className="w-full max-w-5xl bg-gray-900 border border-exroast-pink/30 rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header - spans both columns */}
        <div className="flex items-center justify-between p-4 border-b border-white/6">
          <div className="flex items-center gap-4">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl">👤</div>
            )}
            <div>
              <div className="text-white font-black">{user?.email || 'Account'}</div>
              <div className="text-sm text-white/70">Credits: <span className="font-bold">{credits ?? 0}</span></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { openSingleCheckout(); onClose?.(); }}
              className="hidden sm:inline-flex items-center bg-gradient-to-r from-[#ff006e] to-[#ffd23f] text-black font-bold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform"
            >
              Upgrade 🔥
            </button>
            <button
              onClick={() => onClose?.()}
              aria-label="Close settings"
              className="text-white/60 hover:text-white p-2 rounded"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body: two columns on desktop */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: account, credits, quick actions */}
          <div className="space-y-4">
            <button
              onClick={() => { router.push('/account'); onClose?.(); }}
              className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/6 flex items-center justify-between"
            >
              <span className="font-bold">Account</span>
              <span className="text-sm text-white/70">Manage profile</span>
            </button>

            <div className="bg-gradient-to-r from-[#111014] to-[#0f0f12] p-4 rounded-lg border border-exroast-pink/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/80">Credits available</div>
                  <div className="text-2xl font-extrabold mt-1">{credits ?? 0}</div>
                </div>
                <div>
                  <button
                    onClick={() => { openTierCheckout('unlimited'); onClose?.(); }}
                    className="bg-exroast-pink px-4 py-2 rounded-full font-bold"
                  >
                    Go Unlimited
                  </button>
                </div>
              </div>
              <div className="text-xs text-white/60 mt-3">Unlimited roasts + audio nudges when you upgrade.</div>
            </div>

            <div className="mt-2">
              <div className="text-sm text-white/70 mb-2">Quick actions</div>
              <div className="space-y-2">
                <button
                  onClick={() => { openSingleCheckout(); onClose?.(); }}
                  className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/6"
                >
                  Upgrade - Buy full roast
                </button>
              </div>
            </div>
          </div>

          {/* Right column: My Roasts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-white/70">My Roasts</div>
              <div className="text-xs text-white/60">Recent</div>
            </div>

            <div className="bg-white/3 rounded-lg p-2 max-h-64 overflow-auto">
              {roasts === null ? (
                <div className="text-white/60 p-4">Loading…</div>
              ) : roasts.length === 0 ? (
                <div className="text-white/60 p-4">No roasts yet</div>
              ) : (
                <div className="divide-y divide-white/6">
                  {roasts.slice(0, 8).map((r: any) => (
                    <button
                      key={r.id}
                      onClick={() => { onClose?.(); router.push(`/preview?songId=${r.id}`); }}
                      className="w-full text-left px-3 py-3 hover:bg-white/5 flex items-center justify-between"
                    >
                      <div className="flex-1 pr-4">
                        <div className="text-sm font-bold text-white truncate">{r.title || 'Untitled Roast'}</div>
                        <div className="text-xs text-white/60">{new Date(r.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-white/50">▶</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer row - spans both columns */}
          <div className="md:col-span-2">
            <div className="border-t border-white/6 mt-4 pt-4" />
            <div className="mt-3">
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={loading}
              >
                {loading ? 'Signing out…' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
