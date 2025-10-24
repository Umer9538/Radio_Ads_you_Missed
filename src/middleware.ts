import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Use Node.js runtime instead of Edge to support Prisma
export const runtime = 'nodejs'

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Enable XSS protection (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy - control what information is sent in the Referer header
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy - control which browser features can be used
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  )

  // Content Security Policy
  if (!isDevelopment) {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.github.com;
      media-src 'self' https: blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `
      .replace(/\s{2,}/g, ' ')
      .trim()

    response.headers.set('Content-Security-Policy', cspHeader)
  }

  // Strict Transport Security - force HTTPS
  if (!isDevelopment) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    )
  }

  return response
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/search",
    "/ads",
    "/stations",
    "/categories",
    "/auth/signin",
    "/auth/signup",
    "/auth/error",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
    "/auth/resend-verification",
    "/about",
    "/contact",
    "/privacy",
    "/for-advertisers",
    "/for-agencies",
    "/for-stations",
  ]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // API routes that are public
  const publicApiRoutes = [
    "/api/auth",
    "/api/ads",
    "/api/stations",
    "/api/categories",
    "/api/offers",
    "/api/contact",
  ]
  const isPublicApiRoute = publicApiRoutes.some((route) =>
    pathname.startsWith(route)
  )

  let response: NextResponse

  // Redirect admins away from homepage to admin dashboard
  if (pathname === '/' && isLoggedIn && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
    response = NextResponse.redirect(new URL('/admin', req.url))
    return addSecurityHeaders(response)
  }

  // Allow public routes and public API routes
  if (isPublicRoute || isPublicApiRoute) {
    response = NextResponse.next()
    return addSecurityHeaders(response)
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      response = NextResponse.redirect(new URL("/auth/signin", req.url))
      return addSecurityHeaders(response)
    }
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      response = NextResponse.redirect(new URL("/", req.url))
      return addSecurityHeaders(response)
    }
  }

  // Protect user dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!isLoggedIn) {
      response = NextResponse.redirect(new URL("/auth/signin", req.url))
      return addSecurityHeaders(response)
    }
  }

  response = NextResponse.next()
  return addSecurityHeaders(response)
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
