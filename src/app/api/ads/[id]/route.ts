import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/ads/[id] - Get single ad details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ad = await prisma.ad.findUnique({
      where: { id },
      include: {
        station: {
          select: {
            id: true,
            name: true,
            frequency: true,
            location: true,
            logoUrl: true,
            websiteUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        offers: {
          where: {
            active: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            favorites: true,
            playHistory: true,
          },
        },
      },
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

    // Parse tags from JSON string
    const adWithParsedTags = {
      ...ad,
      tags: ad.tags ? JSON.parse(ad.tags) : [],
    }

    return NextResponse.json({
      success: true,
      data: adWithParsedTags,
    })
  } catch (error) {
    console.error('Error fetching ad:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ad',
      },
      { status: 500 }
    )
  }
}
