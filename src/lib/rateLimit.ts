/**
 * In-memory sliding window rate limiter for Next.js API routes.
 * Tracks client requests within a configurable time window and cleans up stale entries.
 */

export interface RateLimitOptions {
  limit?: number; // Maximum allowed requests within windowMs
  windowMs?: number; // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in seconds when the window resets
  retryAfter?: number; // Seconds to wait before retrying
}

interface RateLimitRecord {
  timestamps: number[];
  lastSeen: number;
}

// In-memory store mapping identifier -> RateLimitRecord
const store = new Map<string, RateLimitRecord>();

const MAX_STORE_SIZE = 10000;
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute

/**
 * Periodically purge stale entries from the store to prevent unbounded memory growth.
 */
function cleanupStore(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL && store.size < MAX_STORE_SIZE) {
    return;
  }

  lastCleanup = now;
  const cutoff = now - windowMs;

  for (const [key, record] of store.entries()) {
    if (record.lastSeen < cutoff) {
      store.delete(key);
    }
  }

  // If still above max capacity, drop oldest entries
  if (store.size > MAX_STORE_SIZE) {
    const keysToDelete = Array.from(store.keys()).slice(
      0,
      store.size - MAX_STORE_SIZE
    );
    for (const key of keysToDelete) {
      store.delete(key);
    }
  }
}

/**
 * Check and record a request against rate limits using a sliding window.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const envLimit = process.env.RATE_LIMIT_CONTACT_MAX
    ? Number(process.env.RATE_LIMIT_CONTACT_MAX)
    : undefined;
  const limit = options.limit ?? envLimit ?? 5; // Default: 5 requests

  const envWindowMs = process.env.RATE_LIMIT_CONTACT_WINDOW_MS
    ? Number(process.env.RATE_LIMIT_CONTACT_WINDOW_MS)
    : undefined;
  const windowMs = options.windowMs ?? envWindowMs ?? 60 * 60 * 1000; // Default: 1 hour (3600000 ms)

  cleanupStore(windowMs);

  const now = Date.now();
  const windowStart = now - windowMs;

  let record = store.get(identifier);
  if (!record) {
    record = { timestamps: [], lastSeen: now };
    store.set(identifier, record);
  }

  // Filter out timestamps outside the current sliding window
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
  record.lastSeen = now;

  if (record.timestamps.length >= limit) {
    // Earliest timestamp inside the window determines when next slot opens
    const oldestTimestamp = record.timestamps[0];
    const retryAfterMs = Math.max(0, oldestTimestamp + windowMs - now);
    const retryAfter = Math.ceil(retryAfterMs / 1000);
    const reset = Math.ceil((oldestTimestamp + windowMs) / 1000);

    return {
      success: false,
      limit,
      remaining: 0,
      reset,
      retryAfter: Math.max(retryAfter, 1),
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const reset = Math.ceil((now + windowMs) / 1000);

  return {
    success: true,
    limit,
    remaining,
    reset,
  };
}

/**
 * Helper to clear the rate limit store (useful in tests).
 */
export function resetRateLimitStore() {
  store.clear();
}

/**
 * Extract client IP address from standard request headers.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp?.trim()) return cfIp.trim();

  const trueClientIp = request.headers.get("true-client-ip");
  if (trueClientIp?.trim()) return trueClientIp.trim();

  return "127.0.0.1";
}
