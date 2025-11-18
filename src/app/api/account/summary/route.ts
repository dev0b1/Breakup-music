import { NextRequest, NextResponse } from 'next/server';
import { getUserRoasts, getUserPreferences, getUserSubscriptionStatus } from '@/lib/db-service';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }

    const [roasts, prefs, subscription] = await Promise.all([
      getUserRoasts(userId),
      getUserPreferences(userId),
      getUserSubscriptionStatus(userId),
    ]);

    return NextResponse.json({ success: true, roasts, prefs, subscription });
  } catch (err) {
    console.error('Account summary error', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
