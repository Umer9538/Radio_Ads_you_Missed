import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

/**
 * POST /api/admin/ads - Create new ad (Admin only)
 */
export async function POST(request: Request) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = rateLimit(identifier, RateLimitConfig.api)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    )
  }

  try {
    const session = await auth()

    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      brand,
      audioUrl,
      thumbnailUrl,
      duration,
      airDate,
      stationId,
      categoryId,
      status,
    } = body

    // Validation
    if (!title || !brand || !audioUrl || !stationId || !categoryId || !duration || !airDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, brand, audioUrl, stationId, categoryId, duration, airDate' },
        { status: 400 }
      )
    }

    // Validate station exists
    const station = await prisma.station.findUnique({
      where: { id: stationId },
    })

    if (!station) {
      return NextResponse.json(
        { success: false, error: 'Station not found' },
        { status: 404 }
      )
    }

    // Validate category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    // Create ad
    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        brand,
        audioUrl,
        thumbnailUrl,
        duration: parseInt(duration),
        airDate: new Date(airDate),
        stationId,
        categoryId,
        status: status || 'DRAFT',
      },
      include: {
        station: true,
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Ad created successfully',
      data: ad,
    })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create ad' },
      { status: 500 }
    )
  }
}
