import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateUserPreferences } from '@/lib/db-service';
import { getDailySavageQuote } from '@/lib/suno-nudge';

export async function POST(request: NextRequest) {
  try {
    const { userId, audioEnabled } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const success = await createOrUpdateUserPreferences(userId, {
      dailyQuotesEnabled: true,
      audioNudgesEnabled: audioEnabled || false,
    });

    if (success) {
      const testQuote = getDailySavageQuote(1);
      
      console.log('Daily Quote Opt-In Success:', {
        userId,
        audioEnabled,
        testQuote
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully opted in to daily savage quotes',
        testQuote,
        audioEnabled
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to save preferences' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Opt-in error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
