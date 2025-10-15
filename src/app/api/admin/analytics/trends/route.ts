import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/analytics/trends - Get time-based trends
 * Query params: startDate, endDate, groupBy (day/week/month)
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
    const groupBy = searchParams.get('groupBy') || 'day'

    // Default to last 30 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    const startParam = searchParams.get('startDate')
    const endParam = searchParams.get('endDate')

    const start = startParam ? new Date(startParam) : startDate
    const end = endParam ? new Date(endParam) : endDate

    // Get play history within date range
    const playHistory = await prisma.playHistory.findMany({
      where: {
        playedAt: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        playedAt: 'asc',
      },
    })

    // Get user registrations within date range
    const userRegistrations = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        createdAt: true,
      },
    })

    // Get claims within date range
    const claims = await prisma.claim.findMany({
      where: {
        claimedAt: {
          gte: start,
          lte: end,
        },
      },
      select: {
        claimedAt: true,
      },
    })

    // Group data by time period
    const groupData = (data: any[], dateField: string) => {
      const grouped: Record<string, number> = {}

      data.forEach(item => {
        const date = new Date(item[dateField])
        let key: string

        if (groupBy === 'day') {
          key = date.toISOString().split('T')[0]
        } else if (groupBy === 'week') {
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split('T')[0]
        } else {
          // month
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        }

        grouped[key] = (grouped[key] || 0) + 1
      })

      return Object.entries(grouped)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
    }

    const playTrends = groupData(playHistory, 'playedAt')
    const userTrends = groupData(userRegistrations, 'createdAt')
    const claimTrends = groupData(claims, 'claimedAt')

    // Calculate growth rates
    const calculateGrowth = (trends: any[]) => {
      if (trends.length < 2) return 0
      const latest = trends[trends.length - 1].count
      const previous = trends[trends.length - 2].count
      if (previous === 0) return latest > 0 ? 100 : 0
      return ((latest - previous) / previous) * 100
    }

    return NextResponse.json({
      success: true,
      data: {
        plays: {
          trends: playTrends,
          growth: Math.round(calculateGrowth(playTrends) * 100) / 100,
          total: playHistory.length,
        },
        users: {
          trends: userTrends,
          growth: Math.round(calculateGrowth(userTrends) * 100) / 100,
          total: userRegistrations.length,
        },
        claims: {
          trends: claimTrends,
          growth: Math.round(calculateGrowth(claimTrends) * 100) / 100,
          total: claims.length,
        },
        period: {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          groupBy,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching trends analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends analytics' },
      { status: 500 }
    )
  }
}
