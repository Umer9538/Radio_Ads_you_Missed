import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/favorites - Get user's favorite ads
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        ad: {
          include: {
            station: {
              select: {
                id: true,
                name: true,
                frequency: true,
                location: true
              }
            },
            category: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            },
            offers: {
              where: {
                active: true,
                OR: [
                  { expiryDate: { gte: new Date() } },
                  { expiryDate: null }
                ]
              },
              select: {
                id: true,
                title: true,
                expiryDate: true,
                claimCount: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Parse tags from JSON string
    const favoritesWithParsedTags = favorites.map(fav => ({
      ...fav,
      ad: {
        ...fav.ad,
        tags: fav.ad.tags ? JSON.parse(fav.ad.tags) : []
      }
    }))

    return NextResponse.json({
      success: true,
      data: favoritesWithParsedTags
    })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST /api/favorites - Add ad to favorites
export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { adId } = body

    if (!adId) {
      return NextResponse.json(
        { success: false, error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    // Check if ad exists
    const ad = await prisma.ad.findUnique({
      where: { id: adId }
    })

    if (!ad) {
      return NextResponse.json(
        { success: false, error: 'Ad not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_adId: {
          userId: session.user.id,
          adId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Ad already in favorites' },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        adId
      }
    })

    return NextResponse.json({
      success: true,
      data: favorite,
      message: 'Added to favorites successfully'
    })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}
