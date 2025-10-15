/**
 * Rate Limiting Utility
 *
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis-based rate limiting
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const rateLimitStore: RateLimitStore = {}

interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the window
   */
  limit: number
  /**
   * Time window in milliseconds
   */
  windowMs: number
}

/**
 * Rate limiter function
 * @param identifier - Unique identifier for the client (IP address, user ID, etc.)
 * @param options - Rate limit options
 * @returns Object with success status and remaining requests
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60000 } // Default: 10 requests per minute
): {
  success: boolean
  limit: number
  remaining: number
  reset: number
} {
  const now = Date.now()
  const key = identifier

  // Clean up old entries periodically (every 100 calls)
  if (Math.random() < 0.01) {
    cleanupStore(now)
  }

  // Initialize or get existing entry
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + options.windowMs,
    }
  }

  const record = rateLimitStore[key]

  // Increment count
  record.count++

  // Check if limit exceeded
  if (record.count > options.limit) {
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: record.resetTime,
    }
  }

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - record.count,
    reset: record.resetTime,
  }
}

/**
 * Clean up expired entries from the store
 */
function cleanupStore(now: number): void {
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key]
    }
  })
}

/**
 * Get client identifier from request
 * Uses IP address or forwarded IP
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

/**
 * Rate limit configurations for different endpoints
 */
export const RateLimitConfig = {
  // Authentication endpoints (strict)
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 5 requests per 15 minutes
  },
  // Public API endpoints (moderate)
  api: {
    limit: 100,
    windowMs: 60 * 1000, // 100 requests per minute
  },
  // Search endpoints (lenient)
  search: {
    limit: 50,
    windowMs: 60 * 1000, // 50 requests per minute
  },
  // File upload endpoints (strict)
  upload: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 10 requests per hour
  },
  // Contact form (strict)
  contact: {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 requests per hour
  },
}
