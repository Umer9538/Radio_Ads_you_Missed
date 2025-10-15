import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/analytics/engagement - Get detailed engagement metrics
 * Query params: startDate, endDate, stationId, categoryId
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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const stationId = searchParams.get('stationId')
    const categoryId = searchParams.get('categoryId')

    // Build where clause for filtering
    const whereClause: any = {}
    if (startDate) {
      whereClause.playedAt = { gte: new Date(startDate) }
    }
    if (endDate) {
      whereClause.playedAt = {
        ...whereClause.playedAt,
        lte: new Date(endDate),
      }
    }

    const adWhereClause: any = {}
    if (stationId) adWhereClause.stationId = stationId
    if (categoryId) adWhereClause.categoryId = categoryId

    // Get play history with filters
    const playHistory = await prisma.playHistory.findMany({
      where: {
        ...whereClause,
        ad: adWhereClause,
      },
      include: {
        ad: {
          include: {
            station: true,
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })

    // Calculate engagement metrics
    const totalPlays = playHistory.length
    const uniqueUsers = new Set(playHistory.map(p => p.userId).filter(Boolean)).size
    const uniqueAds = new Set(playHistory.map(p => p.adId)).size

    // Average play duration
    const totalDuration = playHistory.reduce((sum, p) => sum + (p.duration || 0), 0)
    const averageDuration = totalPlays > 0 ? totalDuration / totalPlays : 0

    // Completion rate (plays that reached 75% or more)
    const completedPlays = playHistory.filter(p => {
      if (!p.duration || !p.ad?.duration) return false
      return (p.duration / p.ad.duration) >= 0.75
    }).length
    const completionRate = totalPlays > 0 ? (completedPlays / totalPlays) * 100 : 0

    // Engagement by station
    const stationEngagement: Record<string, any> = {}
    playHistory.forEach(p => {
      const stationName = p.ad?.station?.name || 'Unknown'
      if (!stationEngagement[stationName]) {
        stationEngagement[stationName] = {
          plays: 0,
          duration: 0,
          uniqueAds: new Set(),
        }
      }
      stationEngagement[stationName].plays++
      stationEngagement[stationName].duration += p.duration || 0
      stationEngagement[stationName].uniqueAds.add(p.adId)
    })

    const engagementByStation = Object.entries(stationEngagement).map(([name, data]: [string, any]) => ({
      station: name,
      plays: data.plays,
      averageDuration: data.plays > 0 ? data.duration / data.plays : 0,
      uniqueAds: data.uniqueAds.size,
    }))

    // Engagement by category
    const categoryEngagement: Record<string, any> = {}
    playHistory.forEach(p => {
      const categoryName = p.ad?.category?.name || 'Unknown'
      if (!categoryEngagement[categoryName]) {
        categoryEngagement[categoryName] = {
          plays: 0,
          duration: 0,
          uniqueAds: new Set(),
        }
      }
      categoryEngagement[categoryName].plays++
      categoryEngagement[categoryName].duration += p.duration || 0
      categoryEngagement[categoryName].uniqueAds.add(p.adId)
    })

    const engagementByCategory = Object.entries(categoryEngagement).map(([name, data]: [string, any]) => ({
      category: name,
      plays: data.plays,
      averageDuration: data.plays > 0 ? data.duration / data.plays : 0,
      uniqueAds: data.uniqueAds.size,
    }))

    // User engagement rate (average plays per user)
    const userEngagementRate = uniqueUsers > 0 ? totalPlays / uniqueUsers : 0

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalPlays,
          uniqueUsers,
          uniqueAds,
          averageDuration: Math.round(averageDuration),
          completionRate: Math.round(completionRate * 100) / 100,
          userEngagementRate: Math.round(userEngagementRate * 100) / 100,
        },
        byStation: engagementByStation.sort((a, b) => b.plays - a.plays),
        byCategory: engagementByCategory.sort((a, b) => b.plays - a.plays),
      },
    })
  } catch (error) {
    console.error('Error fetching engagement analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch engagement analytics' },
      { status: 500 }
    )
  }
}
