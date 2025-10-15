import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/analytics/top-ads - Get most played ads
 * Query params: startDate, endDate, limit
 */
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
      select: { role: true },
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build where clause for date filtering
    const whereClause: any = {}
    if (startDate || endDate) {
      whereClause.playedAt = {}
      if (startDate) whereClause.playedAt.gte = new Date(startDate)
      if (endDate) whereClause.playedAt.lte = new Date(endDate)
    }

    // Get play counts by ad
    const playsByAd = await prisma.playHistory.groupBy({
      by: ['adId'],
      where: whereClause,
      _count: {
        id: true,
      },
      _sum: {
        duration: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    })

    // Get ad details
    const topAdsData = await Promise.all(
      playsByAd.map(async (item) => {
        const ad = await prisma.ad.findUnique({
          where: { id: item.adId },
          include: {
            station: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                offers: true,
                favorites: true,
              },
            },
          },
        })

        // Get unique listeners
        const uniqueListeners = await prisma.playHistory.findMany({
          where: {
            adId: item.adId,
            userId: { not: null },
            ...(startDate || endDate ? { playedAt: whereClause.playedAt } : {}),
          },
          distinct: ['userId'],
          select: { userId: true },
        })

        // Calculate completion rate
        const completedPlays = await prisma.playHistory.count({
          where: {
            adId: item.adId,
            ...(startDate || endDate ? { playedAt: whereClause.playedAt } : {}),
            duration: ad?.duration ? { gte: ad.duration * 0.75 } : undefined,
          },
        })

        const completionRate = item._count.id > 0 ? (completedPlays / item._count.id) * 100 : 0

        return {
          ad: {
            id: ad?.id,
            title: ad?.title,
            brand: ad?.brand,
            station: ad?.station?.name,
            category: ad?.category?.name,
            duration: ad?.duration,
            thumbnailUrl: ad?.thumbnailUrl,
          },
          metrics: {
            plays: item._count.id,
            totalDuration: item._sum.duration || 0,
            averageDuration: item._count.id > 0 ? (item._sum.duration || 0) / item._count.id : 0,
            uniqueListeners: uniqueListeners.length,
            completionRate: Math.round(completionRate * 100) / 100,
            offers: ad?._count.offers || 0,
            favorites: ad?._count.favorites || 0,
          },
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: topAdsData,
    })
  } catch (error) {
    console.error('Error fetching top ads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top ads' },
      { status: 500 }
    )
  }
}
