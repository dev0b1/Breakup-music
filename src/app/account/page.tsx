"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaSpinner } from 'react-icons/fa';

export default function AccountPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        // redirect to login
        window.location.href = '/login?redirectTo=/account';
        return;
      }

      try {
        const res = await fetch('/api/account/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        });
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load account summary', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-exroast-gold" />
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Your Account</h1>
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-300">Email: {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-3">Subscription</h3>
            <p className="text-gray-300">{data?.subscription ? (data.subscription.isPro ? `Pro (${data.subscription.tier})` : 'Free') : 'Unknown'}</p>
            <p className="text-sm text-gray-400 mt-2">Manage your plan on the Pricing page.</p>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold mb-3">Preferences</h3>
            <p className="text-gray-300">Daily Quotes: {data?.prefs?.dailyQuotesEnabled ? 'Enabled' : 'Disabled'}</p>
            <p className="text-gray-300">Audio Nudges: {data?.prefs?.audioNudgesEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>

        <div className="card p-6 mt-6">
          <h3 className="text-lg font-bold mb-3">Your Roasts</h3>
          {data?.roasts && data.roasts.length > 0 ? (
            <ul className="space-y-3">
              {data.roasts.map((r: any) => (
                <li key={r.id} className="border p-3 rounded-md bg-black/40">
                  <div className="text-white font-bold">{r.title || 'Untitled'}</div>
                  <div className="text-gray-400 text-sm">{r.story?.slice(0, 120)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">You have no saved roasts yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
