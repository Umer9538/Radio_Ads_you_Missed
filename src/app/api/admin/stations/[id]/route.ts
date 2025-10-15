import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

/**
 * PUT /api/admin/stations/[id] - Update station (Admin only)
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

    // Check if station exists
    const existingStation = await prisma.station.findUnique({
      where: { id },
    })

    if (!existingStation) {
      return NextResponse.json(
        { success: false, error: 'Station not found' },
        { status: 404 }
      )
    }

    const {
      name,
      frequency,
      location,
      description,
      logoUrl,
      websiteUrl,
      active,
    } = body

    // Prepare update data
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (frequency !== undefined) updateData.frequency = frequency
    if (location !== undefined) updateData.location = location
    if (description !== undefined) updateData.description = description
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl
    if (active !== undefined) updateData.active = active

    // Update station
    const updatedStation = await prisma.station.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      message: 'Station updated successfully',
      data: updatedStation,
    })
  } catch (error) {
    console.error('Error updating station:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update station' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/stations/[id] - Delete station (Admin only)
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

    // Check if station exists
    const existingStation = await prisma.station.findUnique({
      where: { id },
      include: {
        _count: {
          select: { ads: true },
        },
      },
    })

    if (!existingStation) {
      return NextResponse.json(
        { success: false, error: 'Station not found' },
        { status: 404 }
      )
    }

    // Check if station has ads
    if (existingStation._count.ads > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete station with ${existingStation._count.ads} associated ads. Please delete or reassign the ads first.`,
        },
        { status: 400 }
      )
    }

    // Delete station
    await prisma.station.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Station deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting station:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete station' },
      { status: 500 }
    )
  }
}
