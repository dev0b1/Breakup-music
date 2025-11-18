/**
 * Paddle price ID -> internal tier/credit mapping.
 *
 * By default this reads NEXT_PADDLE_PRICE_ID_1 and NEXT_PADDLE_PRICE_ID_2 from env.
 * Assumption (change these env names if you prefer explicit mapping):
 * - NEXT_PADDLE_PRICE_ID_1 => 'unlimited' subscription (refills 20 credits)
 * - NEXT_PADDLE_PRICE_ID_2 => one-time credits pack (grants 20 credits)
 *
 * If these assumptions are incorrect, update your .env to set the appropriate
 * values or replace the mapping logic below.
 */

type PriceMapping = {
  [priceId: string]: {
    kind: 'subscription' | 'credits' | 'purchase';
    // 'purchase' denotes a one-time product (e.g. single song unlock)
    tier?: 'unlimited' | 'one-time' | 'free';
    creditsAmount?: number;
  };
};

export function getPaddlePriceMapping(): PriceMapping {
  // Prefer explicit names that use SINGLE / PREMIUM for clarity.
  const p1 = process.env.NEXT_PADDLE_PRICE_ID_SINGLE || process.env.NEXT_PADDLE_PRICE_ID_1 || process.env.PADDLE_PRICE_ID_1 || '';
  const p2 = process.env.NEXT_PADDLE_PRICE_ID_PREMIUM || process.env.NEXT_PADDLE_PRICE_ID_2 || process.env.PADDLE_PRICE_ID_2 || '';

  const mapping: PriceMapping = {};

  if (p1) {
    // Map SINGLE -> one-time single-song purchase
    mapping[p1] = { kind: 'purchase', tier: 'one-time', creditsAmount: 0 };
  }

  if (p2) {
    // Map PREMIUM -> subscription/credits pack (default: grant 20 credits for example)
    mapping[p2] = { kind: 'credits', tier: 'one-time', creditsAmount: 20 };
  }

  return mapping;
}

export function mapPriceIdToAction(priceId?: string) {
  if (!priceId) return null;
  const mapping = getPaddlePriceMapping();
  return mapping[priceId] || null;
}
