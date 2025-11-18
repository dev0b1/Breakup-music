import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { transactions, songs, subscriptions } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { refillCredits } from "@/lib/db-service";
import { mapPriceIdToAction } from '@/lib/paddle-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("paddle-signature") || "";

    if (!process.env.PADDLE_API_KEY || !process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET) {
      console.warn("Paddle credentials not configured - webhook processing disabled");
      return NextResponse.json({ received: true, note: "Credentials not configured" });
    }

    let eventData: any;
    try {
      const { Paddle } = await import("@paddle/paddle-node-sdk");
      const paddle = new Paddle(process.env.PADDLE_API_KEY);
      
      eventData = await paddle.webhooks.unmarshal(
        body,
        process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET,
        signature
      );
      
      if (!eventData || !eventData.data) {
        throw new Error("Invalid event data structure");
      }
    } catch (verifyError) {
      console.error("Webhook signature verification failed:", verifyError);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

  const transactionId = eventData.data.id || `tx-${Date.now()}`;
  const existing = await db.select().from(transactions).where(eq(transactions.id, transactionId)).limit(1);
    
    if (existing.length === 0) {
      await db.insert(transactions).values({
        id: transactionId,
        songId: eventData.data.custom_data?.songId || null,
        userId: eventData.data.custom_data?.userId || null,
        amount: eventData.data.details?.totals?.total || "0",
        currency: eventData.data.currency_code || "USD",
        status: eventData.data.status || eventData.eventType,
        paddleData: JSON.stringify(eventData.data),
      });
    } else {
      console.log(`Transaction ${transactionId} already processed - skipping`);
      return NextResponse.json({ received: true, note: "Already processed" });
    }

    // Detect price_id if present (Paddle price ids look like `pri_...`) so we can
    // map purchases to internal actions even when custom_data isn't provided.
    const priceId = eventData.data.price_id || eventData.data.product_id || eventData.data.plan_id || eventData.data.checkout?.price_id;
    const priceAction = mapPriceIdToAction(priceId);
    if (priceAction) {
      console.log('Detected Paddle price action for priceId=', priceId, priceAction);
    }

    switch (eventData.eventType) {
      case "transaction.completed":
        await handleTransactionCompleted(eventData.data, priceAction);
        break;

      case "subscription.created":
        await handleSubscriptionCreated(eventData.data);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(eventData.data);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(eventData.data);
        break;

      default:
        console.log(`Unhandled event type: ${eventData.eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}

async function handleTransactionCompleted(transaction: any, priceAction: any = null) {
  console.log("Transaction completed:", transaction.id);

  // transaction.custom_data is preferred (client set userId/songId/type)
  const customData = transaction.custom_data || {};
  const customType = customData.type;
  const userId = customData.userId || null;

  // Handle credit purchases: either explicitly marked in custom_data or detected
  // via priceAction mapping from Paddle price ids.
  if (customType === 'credit_purchase' || (priceAction && priceAction.kind === 'credits')) {
    const credits = Number(customData.creditsAmount) || Number(priceAction?.creditsAmount) || 0;
    if (userId && credits > 0) {
      await refillCredits(userId, credits);
      console.log(`Refilled ${credits} credits for user ${userId} from transaction ${transaction.id}`);
    } else {
      console.warn('Credit purchase detected but missing userId or credits amount; skipping refill');
    }
    // Continue — a transaction can be both a credit purchase and include song info
  }

  // If transaction includes a song purchase, unlock it
  if (customData.songId) {
    const songId = customData.songId;
    const songResult = await db.select().from(songs).where(eq(songs.id, songId)).limit(1);

    if (songResult.length === 0) {
      console.error(`Song ${songId} not found for transaction ${transaction.id}`);
      return;
    }

    const song = songResult[0];

    if (song.isPurchased) {
      console.log(`Song ${songId} already purchased - skipping`);
      return;
    }

    await db.update(songs)
      .set({
        isPurchased: true,
        purchaseTransactionId: transaction.id,
        userId: userId || null,
        updatedAt: new Date(),
      })
      .where(eq(songs.id, songId));

    console.log(`Song ${songId} unlocked for user ${userId || 'anonymous'}`);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log("Subscription created:", subscription.id);
  
  const userId = subscription.custom_data?.userId;
  
  if (!userId) {
    console.warn("No userId in subscription custom_data");
    return;
  }

  const tier = subscription.custom_data?.tier || 'unlimited';
  
  await db
    .insert(subscriptions)
    .values({
      userId,
      paddleSubscriptionId: subscription.id,
      tier,
      status: 'active',
      creditsRemaining: tier === 'unlimited' ? 20 : 0,
      renewsAt: subscription.next_billed_at ? new Date(subscription.next_billed_at) : null,
    })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: {
        paddleSubscriptionId: subscription.id,
        tier,
        status: 'active',
        creditsRemaining: tier === 'unlimited' ? 20 : 0,
        renewsAt: subscription.next_billed_at ? new Date(subscription.next_billed_at) : null,
        updatedAt: new Date(),
      }
    });
  
  console.log(`Subscription created for user ${userId} with ${tier === 'unlimited' ? '20 credits' : '0 credits'}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log("Subscription updated:", subscription.id);
  
  const userId = subscription.custom_data?.userId;
  
  if (!userId) {
    console.warn("No userId in subscription custom_data");
    return;
  }

  const tier = subscription.custom_data?.tier || 'unlimited';
  const status = subscription.status;

  if (status === 'active' && subscription.billing_cycle) {
    const isRenewal = subscription.event_type === 'subscription.renewed' || 
                      (subscription.billing_cycle?.count && subscription.billing_cycle.count > 1);
    
    if (isRenewal && tier === 'unlimited') {
      await refillCredits(userId, 20);
      console.log(`Refilled 20 credits for user ${userId} on subscription renewal (rollover enabled)`);
    }
  }

  await db
    .update(subscriptions)
    .set({
      tier,
      status,
      renewsAt: subscription.next_billed_at ? new Date(subscription.next_billed_at) : null,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, subscription.id));
}

async function handleSubscriptionCanceled(subscription: any) {
  console.log("Subscription canceled:", subscription.id);
  
  await db
    .update(subscriptions)
    .set({
      status: 'canceled',
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.paddleSubscriptionId, subscription.id));
  
  console.log(`Subscription ${subscription.id} marked as canceled`);
}
