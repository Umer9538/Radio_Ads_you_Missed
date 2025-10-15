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
    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    console.log('Password reset requested:', {
      email: user.email,
      resetUrl,
      expiresAt,
    })

    /*
    Example email integration (uncomment and configure):

    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Reset Your Password',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #ff1b6b, #ff6b00);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
              }
              .footer { margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Reset Your Password</h2>
              <p>Hi ${user.firstName || 'there'},</p>
              <p>You requested to reset your password. Click the button below to create a new password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p>${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this password reset, you can safely ignore this email.</p>
              <div class="footer">
                <p>Radio Ads You Missed</p>
              </div>
            </div>
          </body>
        </html>
      `
    })
    */

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
