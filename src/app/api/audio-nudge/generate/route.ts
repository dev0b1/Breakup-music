import { NextRequest, NextResponse } from 'next/server';
import { createSunoNudgeClient } from '@/lib/suno-nudge';
import { 
  getUserCredits, 
  deductCredit, 
  incrementAudioNudgeCount, 
  saveAudioNudge 
} from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const { userId, userStory, dayNumber } = await request.json();

    if (!userId || !userStory) {
      return NextResponse.json(
        { success: false, error: 'User ID and story required' },
        { status: 400 }
      );
    }

    const credits = await getUserCredits(userId);

    const isFree = credits.tier === 'free';
    const isPro = credits.tier === 'unlimited' || credits.tier === 'one-time';

    if (isFree && credits.audioNudgesThisWeek >= 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Free tier limit reached. You get 1 audio nudge per week. Upgrade to Pro for 20 credits at $12.99/mo.',
          limitReached: true
        },
        { status: 429 }
      );
    }

    if (isPro && credits.creditsRemaining <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No credits remaining. Credits refill on subscription renewal.',
          limitReached: true
        },
        { status: 429 }
      );
    }

    console.log('Generating audio nudge with Suno AI...');
    
    const sunoNudgeClient = createSunoNudgeClient();
    const result = await sunoNudgeClient.generateAudioNudge({
      userStory,
      dayNumber: dayNumber || 1,
    });

    if (isFree) {
      await incrementAudioNudgeCount(userId);
    } else if (isPro) {
      await deductCredit(userId);
    }

    await saveAudioNudge(
      userId,
      userStory,
      dayNumber || 1,
      result.audioUrl,
      result.motivationText,
      isPro ? 1 : 0
    );

    console.log('Audio nudge generated successfully:', {
      audioUrl: result.audioUrl,
      motivationText: result.motivationText
    });

    return NextResponse.json({
      success: true,
      audioUrl: result.audioUrl,
      motivationText: result.motivationText,
      duration: result.duration,
      creditsRemaining: isPro ? credits.creditsRemaining - 1 : 0,
    });
  } catch (error: any) {
    console.error('Audio nudge generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate audio nudge' 
      },
      { status: 500 }
    );
  }
}
