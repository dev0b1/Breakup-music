// Centralized pricing config for client and server code.
// Exports public (NEXT_PUBLIC_*) values for client components and server-side ids as well.

export const SINGLE_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE || "";
export const SINGLE_AMOUNT = Number(process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE_AMOUNT) || 4.99;
export const SINGLE_LABEL = process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE_LABEL || `$${SINGLE_AMOUNT.toFixed(2)}`;
export const SINGLE_BUTTON_TEXT = process.env.NEXT_PUBLIC_PADDLE_PRICE_SINGLE_BUTTON_TEXT || `One-Time Full Unlock`;

export const PREMIUM_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM || "";
export const PREMIUM_AMOUNT = Number(process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_AMOUNT) || 12.99;
export const PREMIUM_LABEL = process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_LABEL || `$${PREMIUM_AMOUNT.toFixed(2)}/mo`;
export const PREMIUM_BUTTON_TEXT = process.env.NEXT_PUBLIC_PADDLE_PRICE_PREMIUM_BUTTON_TEXT || `Unlimited Roasts + History`;

// Server-side Paddle price ids (no NEXT_PUBLIC_) — exported here for convenience if server imports this file.
// Prefer explicit names using SINGLE / PREMIUM so envs are readable.
// Fall back to legacy NEXT_PADDLE_PRICE_ID_1/_2 if present.
export const SERVER_PRICE_ID_SINGLE = process.env.NEXT_PADDLE_PRICE_ID_SINGLE || process.env.NEXT_PADDLE_PRICE_ID_1 || "";
export const SERVER_PRICE_ID_PREMIUM = process.env.NEXT_PADDLE_PRICE_ID_PREMIUM || process.env.NEXT_PADDLE_PRICE_ID_2 || "";

// Backwards-compatible aliases (some places previously referenced SERVER_PRICE_ID_1/2)
export const SERVER_PRICE_ID_1 = SERVER_PRICE_ID_SINGLE;
export const SERVER_PRICE_ID_2 = SERVER_PRICE_ID_PREMIUM;

export default {
  SINGLE_PRICE_ID,
  SINGLE_AMOUNT,
  SINGLE_LABEL,
  SINGLE_BUTTON_TEXT,
  PREMIUM_PRICE_ID,
  PREMIUM_AMOUNT,
  PREMIUM_LABEL,
  PREMIUM_BUTTON_TEXT,
  SERVER_PRICE_ID_1,
  SERVER_PRICE_ID_2,
};
