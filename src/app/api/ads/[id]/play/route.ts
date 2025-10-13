import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getDeviceType } from '@/utils/helpers'

// POST /api/ads/[id]/play - Track ad play event
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const body = await request.json()

    const { duration, completed } = body

    // Check if ad exists
    const ad = await prisma.ad.findUnique({
      where: { id },
    })

    if (!ad) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ad not found',
        },
        { status: 404 }
      )
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || ''
    const deviceType = getDeviceType(userAgent)
    const referrer = request.headers.get('referer') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      undefined

    // Create play history record
    await prisma.playHistory.create({
      data: {
        adId: id,
        userId: session?.user?.id || null,
        duration: duration || null,
        completed: completed || false,
        userAgent,
        deviceType,
        referrer,
        ipAddress,
      },
    })

    // Increment play count
    await prisma.ad.update({
      where: { id },
      data: {
        playCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Play event tracked',
    })
  } catch (error) {
    console.error('Error tracking play event:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track play event',
      },
      { status: 500 }
    )
  }
}
