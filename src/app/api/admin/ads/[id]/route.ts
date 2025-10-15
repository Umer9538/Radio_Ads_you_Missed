import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

/**
 * PUT /api/admin/ads/[id] - Update ad (Admin only)
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()

    // Check if ad exists
    const existingAd = await prisma.ad.findUnique({
      where: { id },
    })

    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      )
    }

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

    // Validate station if provided
    if (stationId) {
      const station = await prisma.station.findUnique({
        where: { id: stationId },
      })

      if (!station) {
        return NextResponse.json(
          { success: false, error: 'Station not found' },
          { status: 404 }
        )
      }
    }

    // Validate category if provided
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      })

      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Category not found' },
          { status: 404 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (brand !== undefined) updateData.brand = brand
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl
    if (duration !== undefined) updateData.duration = parseInt(duration)
    if (airDate !== undefined) updateData.airDate = new Date(airDate)
    if (stationId !== undefined) updateData.stationId = stationId
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (status !== undefined) updateData.status = status

    // Update ad
    const updatedAd = await prisma.ad.update({
      where: { id },
      data: updateData,
      include: {
        station: true,
        category: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Ad updated successfully',
      data: updatedAd,
    })
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update ad' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/ads/[id] - Delete ad (Admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    // Check if ad exists
    const existingAd = await prisma.ad.findUnique({
      where: { id },
    })

    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      )
    }

    // Delete ad (this will cascade delete related records if configured in schema)
    await prisma.ad.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Ad deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting ad:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete ad' },
      { status: 500 }
    )
  }
}
