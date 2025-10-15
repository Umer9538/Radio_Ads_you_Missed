import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

// POST /api/auth/reset-password - Reset password with token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token, password } = body

    // Validation
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      )
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find valid reset token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is already used
    if (resetToken.used) {
      return NextResponse.json(
        { success: false, error: 'This reset token has already been used' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (new Date() > resetToken.expires) {
      return NextResponse.json(
        { success: false, error: 'This reset token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash new password
    const hashedPassword = await hash(password, 10)

    // Update user password and mark token as used in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: {
          used: true,
        },
      }),
    ])

    // Invalidate all other reset tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: {
        email: resetToken.email,
        used: false,
      },
      data: {
        used: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}

// GET /api/auth/reset-password - Verify reset token
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find token
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      select: {
        id: true,
        email: true,
        expires: true,
        used: true,
      },
    })

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid token', valid: false },
        { status: 400 }
      )
    }

    // Check if token is used or expired
    if (resetToken.used || new Date() > resetToken.expires) {
      return NextResponse.json(
        { success: false, error: 'Token is expired or already used', valid: false },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      email: resetToken.email,
    })
  } catch (error) {
    console.error('Error verifying reset token:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify token', valid: false },
      { status: 500 }
    )
  }
}
