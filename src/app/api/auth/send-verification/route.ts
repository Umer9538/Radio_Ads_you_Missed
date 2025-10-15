import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'

// POST /api/auth/send-verification - Send or resend verification email
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        firstName: true,
        lastName: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Generate verification token (32 bytes = 64 hex characters)
    const verificationToken = randomBytes(32).toString('hex')

    // Token expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Invalidate any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: user.email,
      },
    })

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: verificationToken,
        expires: expiresAt,
      },
    })

    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`

    // Send verification email
    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    console.log('Email verification requested:', {
      email: user.email,
      verificationUrl,
      expiresAt,
    })

    /*
    Example email integration (uncomment and configure):

    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: user.email,
      subject: 'Verify Your Email Address',
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
                background: linear-gradient(135deg, #00d4ff, #00ff88);
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
              <h2>Verify Your Email Address</h2>
              <p>Hi ${user.firstName || 'there'},</p>
              <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
              <a href="${verificationUrl}" class="button">Verify Email</a>
              <p>Or copy and paste this link into your browser:</p>
              <p>${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
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
      message: 'Verification email has been sent. Please check your inbox.',
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}
