import { NextRequest, NextResponse } from 'next/server';
import { getUserCredits } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const credits = await getUserCredits(userId);

    const canGenerateAudioNudge = credits.tier === 'free' 
      ? credits.audioNudgesThisWeek < 1 
      : credits.creditsRemaining > 0;

    return NextResponse.json({
      success: true,
      creditsRemaining: credits.creditsRemaining,
      tier: credits.tier,
      audioNudgesThisWeek: credits.audioNudgesThisWeek,
      canGenerateAudioNudge,
      maxFreeAudioNudgesPerWeek: 1,
    });
  } catch (error) {
    console.error('Check credits error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
