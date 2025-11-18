import { NextRequest, NextResponse } from 'next/server';
import { getUserPreferences, createOrUpdateUserPreferences } from '@/lib/db-service';

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const preferences = await getUserPreferences(userId);

    if (preferences) {
      return NextResponse.json({
        success: true,
        preferences: {
          dailyQuotesEnabled: preferences.dailyQuotesEnabled,
          audioNudgesEnabled: preferences.audioNudgesEnabled,
          quoteScheduleHour: preferences.quoteScheduleHour,
          audioNudgesThisWeek: preferences.audioNudgesThisWeek,
        }
      });
    }

    return NextResponse.json({
      success: true,
      preferences: {
        dailyQuotesEnabled: false,
        audioNudgesEnabled: false,
        quoteScheduleHour: 10,
        audioNudgesThisWeek: 0,
      }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, dailyQuotesEnabled, audioNudgesEnabled, quoteScheduleHour } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const success = await createOrUpdateUserPreferences(userId, {
      dailyQuotesEnabled,
      audioNudgesEnabled,
      quoteScheduleHour,
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Preferences updated successfully'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Update preferences error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
