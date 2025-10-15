import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/admin/stats - Get admin statistics
export async function GET(request: Request) {
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
      select: { id: true, role: true },
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get all stats in parallel
    const [
      totalUsers,
      totalAds,
      totalStations,
      totalCategories,
      totalClaims,
      adsWithPlayCount
    ] = await Promise.all([
      // Count total users
      prisma.user.count(),
      // Count total ads
      prisma.ad.count(),
      // Count total stations
      prisma.station.count(),
      // Count total categories
      prisma.category.count(),
      // Count total claims
      prisma.claim.count(),
      // Get ads with play counts to calculate total plays
      prisma.ad.findMany({
        select: {
          playCount: true,
        },
      }),
    ])

    // Calculate total plays
    const totalPlays = adsWithPlayCount.reduce((sum, ad) => sum + ad.playCount, 0)

    // Count active offers (ads with offers)
    const adsWithOffers = await prisma.ad.findMany({
      where: {
        offers: {
          some: {},
        },
      },
      select: {
        _count: {
          select: {
            offers: true,
          },
        },
      },
    })

    const totalOffers = adsWithOffers.reduce((sum, ad) => sum + ad._count.offers, 0)

    const stats = {
      totalUsers,
      totalAds,
      totalStations,
      totalCategories,
      totalOffers,
      totalPlays,
      totalClaims,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch admin stats' },
      { status: 500 }
    )
  }
}
