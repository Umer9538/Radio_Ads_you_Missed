// Cache configuration utilities for API routes

export const CACHE_TIMES = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
} as const

export function setCacheHeaders(
  response: Response,
  maxAge: number = CACHE_TIMES.MEDIUM,
  staleWhileRevalidate: number = maxAge * 2
) {
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  )
  return response
}

export function setNoCacheHeaders(response: Response) {
  response.headers.set(
    'Cache-Control',
    'private, no-cache, no-store, must-revalidate'
  )
  return response
}
