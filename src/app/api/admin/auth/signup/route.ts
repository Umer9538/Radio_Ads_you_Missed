import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

/**
 * POST /api/admin/auth/signup - Create admin account with secret key
 * Supports both ADMIN and SUPER_ADMIN creation
 */
export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = rateLimit(identifier, RateLimitConfig.auth)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many signup attempts. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      )
    }

    const body = await request.json()
    const { firstName, lastName, email, password, adminSecretKey } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !adminSecretKey) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Validate admin secret key and determine role
    const SUPER_ADMIN_SECRET = process.env.SUPER_ADMIN_SECRET_KEY
    const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY

    let userRole: 'ADMIN' | 'SUPER_ADMIN'

    if (adminSecretKey === SUPER_ADMIN_SECRET) {
      userRole = 'SUPER_ADMIN'
    } else if (adminSecretKey === ADMIN_SECRET) {
      userRole = 'ADMIN'
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid admin secret key' },
        { status: 403 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create admin user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: userRole,
        emailVerified: new Date(), // Auto-verify admin accounts
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: `${userRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'} account created successfully`,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Admin signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create admin account' },
      { status: 500 }
    )
  }
}
