import { db } from '@/server/db';
import { templates, subscriptions, roasts, users, userPreferences, dailyQuotes, audioNudges, dailyCheckIns, audioGenerationJobs } from '@/src/db/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { Template } from './template-matcher';

export async function getAllTemplates(): Promise<Template[]> {
  try {
    const data = await db
      .select()
      .from(templates)
      .orderBy(desc(templates.createdAt));

    return data.map(row => ({
      id: row.id,
      filename: row.filename,
      keywords: row.keywords,
      mode: row.mode,
      mood: row.mood,
      storageUrl: row.storageUrl
    }));
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
}

export async function createTemplate(template: {
  filename: string;
  keywords: string;
  mode: string;
  mood: string;
  storageUrl: string;
}): Promise<boolean> {
  try {
    await db.insert(templates).values({
      filename: template.filename,
      keywords: template.keywords,
      mode: template.mode,
      mood: template.mood,
      storageUrl: template.storageUrl
    });
    return true;
  } catch (error) {
    console.error('Error creating template:', error);
    return false;
  }
}

export async function getUserSubscriptionStatus(userId: string): Promise<{
  isPro: boolean;
  tier: 'free' | 'one-time' | 'unlimited';
  subscriptionId?: string;
}> {
  try {
    const data = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!data || data.length === 0) {
      return { isPro: false, tier: 'free' };
    }

    const subscription = data[0];
    const tier = (subscription.tier || 'free') as 'free' | 'one-time' | 'unlimited';
    
    return {
      isPro: subscription.status === 'active',
      tier,
      subscriptionId: subscription.paddleSubscriptionId || undefined
    };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { isPro: false, tier: 'free' };
  }
}

export async function createOrUpdateSubscription(
  userId: string,
  paddleData: {
    subscriptionId?: string;
    tier: 'one-time' | 'unlimited';
    status: string;
  }
): Promise<boolean> {
  try {
    await db
      .insert(subscriptions)
      .values({
        userId,
        paddleSubscriptionId: paddleData.subscriptionId,
        tier: paddleData.tier,
        status: paddleData.status,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: {
          paddleSubscriptionId: paddleData.subscriptionId,
          tier: paddleData.tier,
          status: paddleData.status,
          updatedAt: new Date()
        }
      });
    return true;
  } catch (error) {
    console.error('Error updating subscription:', error);
    return false;
  }
}

export async function saveRoast(roast: {
  userId?: string;
  story: string;
  mode: string;
  title: string;
  lyrics: string;
  audioUrl: string;
  isTemplate: boolean;
}): Promise<string | null> {
  try {
    const result = await db
      .insert(roasts)
      .values({
        userId: roast.userId,
        story: roast.story,
        mode: roast.mode,
        title: roast.title,
        lyrics: roast.lyrics,
        audioUrl: roast.audioUrl,
        isTemplate: roast.isTemplate
      })
      .returning({ id: roasts.id });

    return result[0]?.id || null;
  } catch (error) {
    console.error('Error saving roast:', error);
    return null;
  }
}

export async function getUserRoasts(userId: string): Promise<any[]> {
  try {
    const data = await db
      .select()
      .from(roasts)
      .where(eq(roasts.userId, userId))
      .orderBy(desc(roasts.createdAt));

    return data || [];
  } catch (error) {
    console.error('Error fetching roasts:', error);
    return [];
  }
}

export async function getUserPreferences(userId: string) {
  try {
    const data = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    return data[0] || null;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
}

export async function createOrUpdateUserPreferences(
  userId: string,
  prefs: {
    dailyQuotesEnabled?: boolean;
    audioNudgesEnabled?: boolean;
    quoteScheduleHour?: number;
  }
) {
  try {
    await db
      .insert(userPreferences)
      .values({
        userId,
        dailyQuotesEnabled: prefs.dailyQuotesEnabled ?? false,
        audioNudgesEnabled: prefs.audioNudgesEnabled ?? false,
        quoteScheduleHour: prefs.quoteScheduleHour ?? 10,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          dailyQuotesEnabled: prefs.dailyQuotesEnabled,
          audioNudgesEnabled: prefs.audioNudgesEnabled,
          quoteScheduleHour: prefs.quoteScheduleHour,
          updatedAt: new Date()
        }
      });
    return true;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return false;
  }
}

export async function getUserCredits(userId: string): Promise<{
  creditsRemaining: number;
  tier: string;
  audioNudgesThisWeek: number;
}> {
  try {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const prefs = await getUserPreferences(userId);

    const now = new Date();
    const audioNudgesThisWeek = prefs?.audioNudgesThisWeek || 0;
    const weekResetDate = prefs?.weekResetDate || now;

    const daysSinceReset = Math.floor((now.getTime() - new Date(weekResetDate).getTime()) / (1000 * 60 * 60 * 24));
    const resetedAudioNudges = daysSinceReset >= 7 ? 0 : audioNudgesThisWeek;

    if (subscription[0]) {
      return {
        creditsRemaining: subscription[0].creditsRemaining || 0,
        tier: subscription[0].tier,
        audioNudgesThisWeek: resetedAudioNudges
      };
    }

    return {
      creditsRemaining: 0,
      tier: 'free',
      audioNudgesThisWeek: resetedAudioNudges
    };
  } catch (error) {
    console.error('Error fetching user credits:', error);
    return {
      creditsRemaining: 0,
      tier: 'free',
      audioNudgesThisWeek: 0
    };
  }
}

export async function deductCredit(userId: string): Promise<boolean> {
  try {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!subscription[0]) {
      return false;
    }

    const currentCredits = subscription[0].creditsRemaining || 0;
    
    if (currentCredits <= 0) {
      return false;
    }

    await db
      .update(subscriptions)
      .set({
        creditsRemaining: currentCredits - 1,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.userId, userId));

    return true;
  } catch (error) {
    console.error('Error deducting credit:', error);
    return false;
  }
}

export async function incrementAudioNudgeCount(userId: string): Promise<boolean> {
  try {
    const prefs = await getUserPreferences(userId);
    const now = new Date();
    
    if (!prefs) {
      await db.insert(userPreferences).values({
        userId,
        audioNudgesThisWeek: 1,
        weekResetDate: now,
        updatedAt: now
      });
      return true;
    }

    const daysSinceReset = Math.floor((now.getTime() - new Date(prefs.weekResetDate).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 7) {
      await db
        .update(userPreferences)
        .set({
          audioNudgesThisWeek: 1,
          weekResetDate: now,
          updatedAt: now
        })
        .where(eq(userPreferences.userId, userId));
    } else {
      await db
        .update(userPreferences)
        .set({
          audioNudgesThisWeek: (prefs.audioNudgesThisWeek || 0) + 1,
          updatedAt: now
        })
        .where(eq(userPreferences.userId, userId));
    }

    return true;
  } catch (error) {
    console.error('Error incrementing audio nudge count:', error);
    return false;
  }
}

export async function refillCredits(userId: string, amount: number = 20): Promise<boolean> {
  try {
    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (!subscription[0]) {
      return false;
    }

    const currentCredits = subscription[0].creditsRemaining || 0;
    
    await db
      .update(subscriptions)
      .set({
        creditsRemaining: currentCredits + amount,
        updatedAt: new Date()
      })
      .where(eq(subscriptions.userId, userId));

    return true;
  } catch (error) {
    console.error('Error refilling credits:', error);
    return false;
  }
}

export async function saveDailyQuote(
  userId: string,
  quoteText: string,
  audioUrl: string | null,
  deliveryMethod: string
): Promise<boolean> {
  try {
    await db.insert(dailyQuotes).values({
      userId,
      quoteText,
      audioUrl,
      deliveryMethod
    });
    return true;
  } catch (error) {
    console.error('Error saving daily quote:', error);
    return false;
  }
}

export async function saveAudioNudge(
  userId: string,
  userStory: string,
  dayNumber: number,
  audioUrl: string,
  motivationText: string,
  creditsUsed: number = 1
): Promise<boolean> {
  try {
    await db.insert(audioNudges).values({
      userId,
      userStory,
      dayNumber,
      audioUrl,
      motivationText,
      creditsUsed
    });
    return true;
  } catch (error) {
    console.error('Error saving audio nudge:', error);
    return false;
  }
}

// Job queue helpers
export async function enqueueAudioJob(job: { userId: string; type: string; payload: any }): Promise<string | null> {
  try {
    const result = await db.insert(audioGenerationJobs).values({
      userId: job.userId,
      type: job.type,
      payload: JSON.stringify(job.payload),
    }).returning({ id: audioGenerationJobs.id });

    return result?.[0]?.id || null;
  } catch (error) {
    console.error('Error enqueueing audio job:', error);
    return null;
  }
}

export async function claimPendingJob(): Promise<any | null> {
  try {
    // Atomically find one pending job and mark it processing
    const claimed = await db.update(audioGenerationJobs)
      .set({ status: 'processing', attempts: sql`attempts + 1`, updatedAt: new Date() })
      .where(eq(audioGenerationJobs.status, 'pending'))
      .returning({ id: audioGenerationJobs.id, userId: audioGenerationJobs.userId, type: audioGenerationJobs.type, payload: audioGenerationJobs.payload, attempts: audioGenerationJobs.attempts });

    // returning may return multiple; pick the first
    if (claimed && claimed.length > 0) {
      return claimed[0];
    }
    return null;
  } catch (error) {
    console.error('Error claiming pending job:', error);
    return null;
  }
}

export async function markJobSucceeded(jobId: string, resultUrl: string): Promise<boolean> {
  try {
    await db.update(audioGenerationJobs).set({ status: 'succeeded', resultUrl, updatedAt: new Date() }).where(eq(audioGenerationJobs.id, jobId));
    return true;
  } catch (error) {
    console.error('Error marking job succeeded:', error);
    return false;
  }
}

export async function markJobFailed(jobId: string, errorMsg: string): Promise<boolean> {
  try {
    await db.update(audioGenerationJobs).set({ status: 'failed', error: errorMsg, updatedAt: new Date() }).where(eq(audioGenerationJobs.id, jobId));
    return true;
  } catch (error) {
    console.error('Error marking job failed:', error);
    return false;
  }
}

export async function reserveCredit(userId: string): Promise<boolean> {
  try {
    const updated = await db.update(subscriptions)
      .set({ creditsRemaining: sql`credits_remaining - 1`, updatedAt: new Date() })
      .where(and(eq(subscriptions.userId, userId), sql`credits_remaining > 0`))
      .returning({ id: subscriptions.id, creditsRemaining: subscriptions.creditsRemaining });

    return !!(updated && updated.length > 0);
  } catch (error) {
    console.error('Error reserving credit:', error);
    return false;
  }
}

export async function refundCredit(userId: string, amount: number = 1): Promise<boolean> {
  try {
    const subscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
    if (!subscription || subscription.length === 0) return false;
    const current = subscription[0].creditsRemaining || 0;
    await db.update(subscriptions).set({ creditsRemaining: current + amount, updatedAt: new Date() }).where(eq(subscriptions.userId, userId));
    return true;
  } catch (error) {
    console.error('Error refunding credit:', error);
    return false;
  }
}

export async function getUserStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: Date | null;
}> {
  try {
    const userData = await db
      .select({
        currentStreak: users.currentStreak,
        longestStreak: users.longestStreak,
        lastCheckInDate: users.lastCheckInDate
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData || userData.length === 0) {
      return { currentStreak: 0, longestStreak: 0, lastCheckInDate: null };
    }

    return userData[0] as { currentStreak: number; longestStreak: number; lastCheckInDate: Date | null };
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return { currentStreak: 0, longestStreak: 0, lastCheckInDate: null };
  }
}

/**
 * Ensure a minimal user row exists for the provided userId.
 * This helps with legacy/anonymous flows where an auth user id exists
 * but the `users` table row hasn't been created yet. We insert a
 * synthetic email to satisfy the `NOT NULL` constraint.
 */
export async function ensureUserRow(userId: string): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existing && existing.length > 0) return true;

    const syntheticEmail = `${userId}@no-email.exroast`;

    await db.insert(users).values({
      id: userId,
      email: syntheticEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error('Error ensuring user row exists:', error);
    return false;
  }
}

export async function saveDailyCheckIn(checkIn: {
  userId: string;
  mood: string;
  message: string;
  motivationText?: string;
  motivationAudioUrl?: string;
}): Promise<string | null> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await db
      .select()
      .from(dailyCheckIns)
      .where(and(
        eq(dailyCheckIns.userId, checkIn.userId),
        gte(dailyCheckIns.createdAt, today)
      ))
      .limit(1);

    if (existingCheckIn.length > 0) {
      return null;
    }

    const insertResult = await db.insert(dailyCheckIns).values({
      userId: checkIn.userId,
      mood: checkIn.mood,
      message: checkIn.message,
      motivationText: checkIn.motivationText,
      motivationAudioUrl: checkIn.motivationAudioUrl
    }).returning({ id: dailyCheckIns.id });
    const insertedId = insertResult?.[0]?.id || null;
    // Ensure a users row exists so updateUserStreak can operate correctly.
    // Some auth flows may not have created the `users` table row (anonymous or legacy sign-ups).
    try {
      await ensureUserRow(checkIn.userId);
    } catch (e) {
      // best-effort: log and continue to attempt to update streak
      console.warn('ensureUserRow failed, continuing to update streak:', e);
    }

    await updateUserStreak(checkIn.userId);
    return insertedId;
  } catch (error) {
    console.error('Error saving daily check-in:', error);
    return null;
  }
}

async function updateUserStreak(userId: string): Promise<void> {
  try {
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData || userData.length === 0) return;

    const user = userData[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newStreak = 1;

    if (user.lastCheckInDate) {
      const lastCheckIn = new Date(user.lastCheckInDate);
      lastCheckIn.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        newStreak = (user.currentStreak || 0) + 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      } else {
        newStreak = user.currentStreak || 1;
      }
    }

    const newLongestStreak = Math.max(newStreak, user.longestStreak || 0);

    await db
      .update(users)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCheckInDate: today,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error('Error updating user streak:', error);
  }
}

export async function getTodayCheckIn(userId: string): Promise<any | null> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIn = await db
      .select()
      .from(dailyCheckIns)
      .where(and(
        eq(dailyCheckIns.userId, userId),
        gte(dailyCheckIns.createdAt, today)
      ))
      .orderBy(desc(dailyCheckIns.createdAt))
      .limit(1);

    return checkIn.length > 0 ? checkIn[0] : null;
  } catch (error) {
    console.error('Error fetching today check-in:', error);
    return null;
  }
}
