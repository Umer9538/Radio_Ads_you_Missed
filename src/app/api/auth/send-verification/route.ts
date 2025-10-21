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
    try {
      const { sendVerificationEmail } = await import('@/lib/email')
      await sendVerificationEmail({
        to: user.email,
        firstName: user.firstName || undefined,
        verificationUrl,
      })
      console.log('Verification email sent to:', user.email)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Don't fail the request if email fails, but log it
      // In production, you might want to queue this for retry
    }

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
