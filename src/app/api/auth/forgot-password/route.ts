import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { isValidEmail } from '@/utils/helpers'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

// POST /api/auth/forgot-password - Request password reset
export async function POST(request: Request) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = rateLimit(identifier, RateLimitConfig.auth)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many password reset requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const { email } = body

    // Validation
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    // For security reasons, always return success even if email doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      })
    }

    // Generate reset token (32 bytes = 64 hex characters)
    const resetToken = randomBytes(32).toString('hex')

    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Invalidate any existing tokens for this email
    await prisma.passwordResetToken.updateMany({
      where: {
        email: user.email,
        used: false,
      },
      data: {
        used: true,
      },
    })

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token: resetToken,
        expires: expiresAt,
      },
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`

    // Send email with reset link
    try {
      const { sendPasswordResetEmail } = await import('@/lib/email')
      await sendPasswordResetEmail({
        to: user.email,
        firstName: user.firstName || undefined,
        resetUrl,
      })
      console.log('Password reset email sent to:', user.email)
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError)
      // Don't fail the request if email fails, but log it
      // In production, you might want to queue this for retry
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with that email, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Error in forgot password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
