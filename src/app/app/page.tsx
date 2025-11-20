"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { DailyCheckInTab } from "@/components/DailyCheckInTab";
import { RoastModeTab } from "@/components/RoastModeTab";
import { ConfettiPop } from "@/components/ConfettiPop";
import { FaSpinner, FaFire, FaDumbbell } from "react-icons/fa";

type Tab = "daily" | "roast";

export default function AppPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [currentTab, setCurrentTab] = useState<Tab>("daily");
  const [user, setUser] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const initUser = async (sessionUser: any) => {
      if (!mounted) return;
      setUser(sessionUser);
      setUserAvatar(sessionUser.user_metadata?.avatar_url || "");
      await Promise.all([
        fetchStreak(sessionUser.id),
        checkTodayCheckIn(sessionUser.id)
      ]);
      setIsLoading(false);
    };

    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error?.message?.includes('parse') || error?.message?.includes('JSON')) {
          await supabase.auth.signOut();
          router.push("/auth");
          return;
        }

        if (session?.user) {
          await initUser(session.user);
        } else {
          router.push("/auth");
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            if (event === 'SIGNED_IN' && session?.user) {
              await initUser(session.user);
            } else if (event === 'SIGNED_OUT') {
              router.push("/auth");
            }
          }
        );

        authSubscription = subscription;

      } catch (err) {
        console.error('[app/page] Auth error:', err);
        if (mounted) router.push('/auth');
      }
    };

    checkUser();

    return () => { 
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, [router, supabase]);

  const fetchStreak = async (userId: string) => {
    try {
      const response = await fetch(`/api/user/streak?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStreak(data.currentStreak || 0);
      }
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  const checkTodayCheckIn = async (userId: string) => {
    try {
      const response = await fetch(`/api/daily/check-in?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setHasCheckedInToday(!!data.checkIn);
      }
    } catch (error) {
      console.error("Error checking today's check-in:", error);
    }
  };

  const handleStreakUpdate = (newStreak: number) => {
    setStreak(newStreak);
    setHasCheckedInToday(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3200);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getFireEmojis = () => {
    if (streak === 0) return "";
    if (streak <= 12) return "🔥".repeat(streak);
    return `🔥×${streak}`;
  };

  const getStreakMessage = () => {
    if (streak === 0) return "Ready to start your streak today?";
    return `Day ${streak} strong`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-exroast-gold text-6xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-exroast-gold text-6xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative pb-20 md:pb-0">
      <AnimatedBackground />
      
      {/* Fixed Header - 50-60px */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-white/10 h-14 md:h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-black text-gradient">
            ExRoast.fm 🔥
          </h1>
          
          {/* Profile Avatar Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-exroast-gold"
                />
              ) : (
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-exroast-pink to-exroast-gold flex items-center justify-center text-white font-black text-sm">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-black border-2 border-exroast-gold rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
              <div className="p-3 border-b border-white/10">
                <p className="text-white font-bold text-sm truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => router.push("/account")}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
              >
                Account Settings
              </button>
              <button
                onClick={() => router.push("/history")}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors text-sm"
              >
                History
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-white/10 transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Streak Bar - 60-70px */}
      <div className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-gradient-to-r from-purple-900/80 via-purple-700/70 to-amber-500/60 backdrop-blur-md border-b-2 border-amber-500/30 h-16 md:h-[70px] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <div className="flex items-center justify-between md:justify-start gap-4">
            {/* Left: Streak Text */}
            <div className="flex-1 md:flex-initial">
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight drop-shadow-lg">
                {getStreakMessage()}
              </h2>
              {!hasCheckedInToday && streak > 0 && (
                <button 
                  onClick={() => setCurrentTab("daily")}
                  className="text-xs md:text-sm text-amber-300 hover:text-amber-100 transition-colors mt-0.5 font-bold"
                >
                  Check in to make it {streak + 1} →
                </button>
              )}
              {!hasCheckedInToday && streak === 0 && (
                <button 
                  onClick={() => setCurrentTab("daily")}
                  className="text-xs md:text-sm text-amber-300 hover:text-amber-100 transition-colors mt-0.5 font-bold"
                >
                  Check in today →
                </button>
              )}
            </div>
            
            {/* Right: Fire Emojis */}
            <div className="text-xl sm:text-2xl md:text-3xl drop-shadow-lg">
              {getFireEmojis()}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block fixed top-[106px] lg:top-[118px] left-0 right-0 z-40 bg-black/95 border-b-2 border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center gap-8">
            <button
              onClick={() => setCurrentTab("roast")}
              className={`relative px-8 py-4 font-black text-lg transition-all duration-200 ${
                currentTab === "roast"
                  ? "text-exroast-pink border-b-4 border-exroast-pink"
                  : "text-gray-500 hover:text-white border-b-4 border-transparent"
              }`}
            >
              <span className="flex items-center gap-2">
                🔥 Roast Mode
              </span>
            </button>
            <button
              onClick={() => setCurrentTab("daily")}
              className={`relative px-8 py-4 font-black text-lg transition-all duration-200 ${
                currentTab === "daily"
                  ? "text-purple-400 border-b-4 border-purple-400"
                  : "text-gray-500 hover:text-white border-b-4 border-transparent"
              }`}
            >
              <span className="flex items-center gap-3">
                💪 Daily Glow-Up
                {!hasCheckedInToday && (
                  <span className="flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full">
                    1
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="pt-32 md:pt-40 lg:pt-48 px-3 sm:px-4 md:px-6 pb-8 relative z-10">
        <div className={`max-w-5xl mx-auto transition-colors duration-300 ${
          currentTab === "daily" 
            ? "bg-gradient-to-b from-purple-900/30 via-purple-800/20 to-purple-900/30" 
            : "bg-gradient-to-b from-red-900/30 via-red-800/20 to-black/60"
        } rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl border border-white/10`}>
          <AnimatePresence mode="wait">
            {currentTab === "daily" && (
              <motion.div
                key="daily"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <DailyCheckInTab 
                  userId={user?.id} 
                  onStreakUpdate={handleStreakUpdate}
                  hasCheckedInToday={hasCheckedInToday}
                />
              </motion.div>
            )}
            {currentTab === "roast" && (
              <motion.div
                key="roast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <RoastModeTab userId={user?.id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-white/20 h-20">
        <div className="h-full flex items-stretch">
          {/* Left: Roast Tab */}
          <button
            onClick={() => setCurrentTab("roast")}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
              currentTab === "roast"
                ? "bg-gradient-to-t from-red-600/20 to-transparent text-exroast-pink"
                : "text-gray-400"
            }`}
          >
            <FaFire className="text-2xl" />
            <span className="text-xs font-bold">Roast</span>
          </button>
          
          {/* Center: Streak (Tappable to Daily) */}
          <button
            onClick={() => setCurrentTab("daily")}
            className="w-32 flex flex-col items-center justify-center bg-gradient-to-t from-purple-900/20 to-transparent border-x border-white/10"
          >
            <div className="text-lg font-black text-white leading-tight">
              Day {streak}
            </div>
            <div className="text-xs text-gray-400 font-bold">strong</div>
            <div className="text-base mt-0.5">{getFireEmojis()}</div>
          </button>
          
          {/* Right: Daily Tab */}
          <button
            onClick={() => setCurrentTab("daily")}
            className={`relative flex-1 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${
              currentTab === "daily"
                ? "bg-gradient-to-t from-purple-600/20 to-transparent text-purple-400"
                : "text-gray-400"
            }`}
          >
            {!hasCheckedInToday && (
              <span className="absolute top-3 right-1/4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
            <FaDumbbell className="text-2xl" />
            <span className="text-xs font-bold">Daily</span>
          </button>
        </div>
      </nav>

      {showConfetti && <ConfettiPop show={showConfetti} onComplete={() => setShowConfetti(false)} />}
    </div>
  );
}