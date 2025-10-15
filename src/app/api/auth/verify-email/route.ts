import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/auth/verify-email - Verify email with token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })

      return NextResponse.json(
        { success: false, error: 'Verification token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
      select: {
        id: true,
        email: true,
        emailVerified: true,
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
      // Delete the token since it's no longer needed
      await prisma.verificationToken.delete({
        where: { token },
      })

      return NextResponse.json(
        { success: false, error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Update user as verified and delete token in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      }),
      prisma.verificationToken.delete({
        where: { token },
      }),
    ])

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now access all features.',
    })
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify email' },
      { status: 500 }
    )
  }
}

// GET /api/auth/verify-email - Check token validity
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required', valid: false },
        { status: 400 }
      )
    }

    // Find token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
      select: {
        identifier: true,
        expires: true,
      },
    })

    if (!verificationToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid token', valid: false },
        { status: 400 }
      )
    }

    // Check if expired
    if (new Date() > verificationToken.expires) {
      return NextResponse.json(
        { success: false, error: 'Token has expired', valid: false },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      email: verificationToken.identifier,
    })
  } catch (error) {
    console.error('Error checking verification token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify token', valid: false },
      { status: 500 }
    )
  }
}
