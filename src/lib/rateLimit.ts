import { env } from './env';

/*
 * Brief §12 — "Edge rate-limit (e.g. Upstash) to throttle abuse".
 *
 * Implementation: token-bucket via Redis REST (Vercel KV / Upstash Redis are
 * wire-compatible). 5 signup attempts per IP per hour.
 *
 * If KV is not configured (dev / preview without Redis), this becomes a no-op
 * that always allows — the honeypot still protects against bots.
 */

const WINDOW_SECONDS = 3600;
const MAX_REQUESTS = 5;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfter?: number;
};

export async function rateLimit(key: string): Promise<RateLimitResult> {
  if (!env.KV_REST_API_URL || !env.KV_REST_API_TOKEN) {
    return { ok: true, remaining: MAX_REQUESTS };
  }

  const ns = `ratelimit:signup:${key}`;
  try {
    // INCR + EXPIRE (NX) in a Redis pipeline via REST API.
    // Upstash/Vercel-KV REST: POST /pipeline with [["INCR", key], ["EXPIRE", key, ttl, "NX"]]
    const res = await fetch(`${env.KV_REST_API_URL}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.KV_REST_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', ns],
        ['EXPIRE', ns, String(WINDOW_SECONDS), 'NX'],
      ]),
    });

    if (!res.ok) {
      // Fail open — don't block legitimate users if Redis is down.
      console.warn('[rateLimit] redis non-OK, failing open', res.status);
      return { ok: true, remaining: MAX_REQUESTS };
    }
    const data = (await res.json()) as Array<{ result: number }>;
    const count = data[0]?.result ?? 0;
    const remaining = Math.max(0, MAX_REQUESTS - count);
    return {
      ok: count <= MAX_REQUESTS,
      remaining,
      retryAfter: count > MAX_REQUESTS ? WINDOW_SECONDS : undefined,
    };
  } catch (err) {
    console.warn('[rateLimit] error, failing open', err);
    return { ok: true, remaining: MAX_REQUESTS };
  }
}

/**
 * Extract a stable client identifier for rate-limiting. Prefers Cloudflare/
 * Vercel real-IP headers; falls back to forwarded chain; last resort "anon".
 */
export function clientKeyFromRequest(req: Request): string {
  const h = req.headers;
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-real-ip') ||
    (h.get('x-forwarded-for') || '').split(',')[0]?.trim() ||
    'anon'
  );
}
