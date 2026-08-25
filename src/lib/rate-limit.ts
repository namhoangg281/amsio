/**
 * Upstash Redis rate limiter — replaces in-memory Map (SEC-18/chatbox parity fix)
 * Falls back to in-memory if UPSTASH_REDIS_REST_URL not configured
 * Falls back to in-memory Map if Redis is not configured.
 *
 * Required env vars (production):
 *   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
 *   UPSTASH_REDIS_REST_TOKEN=xxx
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Per-config cache — keyed by "${maxRequests}:${windowMs}" so each call-site gets the
// correct sliding window rather than a single shared 60-req/60s singleton.
const ratelimitCache = new Map<string, Ratelimit>();

function getRatelimit(maxRequests: number, windowMs: number): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const cacheKey = `${maxRequests}:${windowMs}`;
  const cached = ratelimitCache.get(cacheKey);
  if (cached) return cached;

  const rl = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(maxRequests, `${Math.round(windowMs / 1000)} s`),
    analytics: false,
    prefix: 'itran:amsio:rl',
  });
  ratelimitCache.set(cacheKey, rl);
  return rl;
}

// In-memory fallback (for local dev without Redis)
const fallbackMap = new Map<string, { count: number; resetAt: number }>();

function checkFallback(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = fallbackMap.get(key);
  if (!entry || now > entry.resetAt) {
    fallbackMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

export async function checkRateLimitAsync(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  const rl = getRatelimit(maxRequests, windowMs);
  if (!rl) return checkFallback(key, maxRequests, windowMs);
  const { success } = await rl.limit(key);
  return success;
}
