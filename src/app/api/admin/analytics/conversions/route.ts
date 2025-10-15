import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/analytics/conversions - Get offer conversion rates
 * Query params: startDate, endDate
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

    // Build where clause for date filtering
    const dateFilter: any = {}
    if (startDate || endDate) {
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
    }

    // Get all offers with their ads
    const offers = await prisma.offer.findMany({
      include: {
        ad: {
          include: {
            station: {
              select: { name: true },
            },
            category: {
              select: { name: true },
            },
          },
        },
        _count: {
          select: {
            claims: true,
          },
        },
      },
    })

    // Get play counts for ads with offers
    const conversionData = await Promise.all(
      offers.map(async (offer) => {
        // Get plays for this ad within date range
        const plays = await prisma.playHistory.count({
          where: {
            adId: offer.adId,
            ...(Object.keys(dateFilter).length > 0 ? { playedAt: dateFilter } : {}),
          },
        })

        // Get claims for this offer within date range
        const claims = await prisma.claim.count({
          where: {
            offerId: offer.id,
            ...(Object.keys(dateFilter).length > 0 ? { claimedAt: dateFilter } : {}),
          },
        })

        // Get unique users who played this ad
        const uniqueViewers = await prisma.playHistory.findMany({
          where: {
            adId: offer.adId,
            userId: { not: null },
            ...(Object.keys(dateFilter).length > 0 ? { playedAt: dateFilter } : {}),
          },
          distinct: ['userId'],
          select: { userId: true },
        })

        // Calculate conversion rate (claims / unique viewers)
        const conversionRate = uniqueViewers.length > 0 ? (claims / uniqueViewers.length) * 100 : 0

        // Calculate click-through rate (claims / plays)
        const clickThroughRate = plays > 0 ? (claims / plays) * 100 : 0

        return {
          offer: {
            id: offer.id,
            title: offer.title,
            redemptionType: offer.redemptionType,
            active: offer.active,
          },
          ad: {
            id: offer.ad.id,
            title: offer.ad.title,
            brand: offer.ad.brand,
            station: offer.ad.station.name,
            category: offer.ad.category.name,
          },
          metrics: {
            plays,
            uniqueViewers: uniqueViewers.length,
            claims,
            conversionRate: Math.round(conversionRate * 100) / 100,
            clickThroughRate: Math.round(clickThroughRate * 100) / 100,
          },
        }
      })
    )

    // Sort by conversion rate
    const sortedData = conversionData.sort(
      (a, b) => b.metrics.conversionRate - a.metrics.conversionRate
    )

    // Calculate overall metrics
    const totalPlays = conversionData.reduce((sum, item) => sum + item.metrics.plays, 0)
    const totalClaims = conversionData.reduce((sum, item) => sum + item.metrics.claims, 0)
    const totalUniqueViewers = conversionData.reduce((sum, item) => sum + item.metrics.uniqueViewers, 0)

    const overallConversionRate = totalUniqueViewers > 0 ? (totalClaims / totalUniqueViewers) * 100 : 0
    const overallClickThroughRate = totalPlays > 0 ? (totalClaims / totalPlays) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        overall: {
          totalOffers: offers.length,
          activeOffers: offers.filter(o => o.active).length,
          totalPlays,
          totalUniqueViewers,
          totalClaims,
          conversionRate: Math.round(overallConversionRate * 100) / 100,
          clickThroughRate: Math.round(overallClickThroughRate * 100) / 100,
        },
        byOffer: sortedData,
      },
    })
  } catch (error) {
    console.error('Error fetching conversion analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversion analytics' },
      { status: 500 }
    )
  }
}
