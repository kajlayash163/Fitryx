import sql from './db'

/**
 * DB-backed rate limiter — persists across serverless cold starts.
 * Falls back to allowing the request if the rate_limits table doesn't exist yet.
 */
export async function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const windowStart = new Date(Date.now() - windowMs).toISOString()

    // Count requests within the window
    const [row] = await sql`
      SELECT COUNT(*)::INT as count
      FROM rate_limits
      WHERE key = ${key} AND created_at > ${windowStart}
    `
    const count = row?.count ?? 0

    if (count >= limit) {
      return { allowed: false, remaining: 0 }
    }

    // Record this request
    await sql`INSERT INTO rate_limits (key) VALUES (${key})`

    return { allowed: true, remaining: limit - count - 1 }
  } catch (err) {
    // Table might not exist yet — allow the request and log warning
    console.warn('[rate-limit] DB query failed (table may not exist):', (err as Error).message)
    return { allowed: true, remaining: limit }
  }
}

/**
 * Cleanup old rate-limit entries (call via cron or periodically).
 */
export async function cleanupRateLimits() {
  try {
    await sql`DELETE FROM rate_limits WHERE created_at < NOW() - INTERVAL '1 hour'`
  } catch {
    // Ignore if table doesn't exist
  }
}
