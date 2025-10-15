import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

/**
 * GET /api/admin/analytics/export - Export analytics data
 * Query params: type (plays|users|claims|ads), format (csv|json), startDate, endDate
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
    const type = searchParams.get('type') || 'plays'
    const format = searchParams.get('format') || 'csv'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      if (startDate) dateFilter.gte = new Date(startDate)
      if (endDate) dateFilter.lte = new Date(endDate)
    }

    let data: any[] = []
    let headers: string[] = []

    // Fetch data based on type
    switch (type) {
      case 'plays':
        const plays = await prisma.playHistory.findMany({
          where: Object.keys(dateFilter).length > 0 ? { playedAt: dateFilter } : {},
          include: {
            ad: {
              select: {
                title: true,
                brand: true,
                station: { select: { name: true } },
                category: { select: { name: true } },
              },
            },
            user: {
              select: {
                email: true,
              },
            },
          },
          orderBy: { playedAt: 'desc' },
        })

        headers = ['Date', 'Ad Title', 'Brand', 'Station', 'Category', 'Duration (s)', 'User Email']
        data = plays.map(p => ({
          date: p.playedAt.toISOString(),
          title: p.ad.title,
          brand: p.ad.brand,
          station: p.ad.station.name,
          category: p.ad.category.name,
          duration: p.duration,
          userEmail: p.user?.email || 'Guest',
        }))
        break

      case 'users':
        const users = await prisma.user.findMany({
          where: Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {},
          select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            emailVerified: true,
            _count: {
              select: {
                playHistory: true,
                favorites: true,
                claims: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        })

        headers = ['Email', 'First Name', 'Last Name', 'Role', 'Joined Date', 'Verified', 'Plays', 'Favorites', 'Claims']
        data = users.map(u => ({
          email: u.email,
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          role: u.role,
          joinedDate: u.createdAt.toISOString(),
          verified: u.emailVerified ? 'Yes' : 'No',
          plays: u._count.playHistory,
          favorites: u._count.favorites,
          claims: u._count.claims,
        }))
        break

      case 'claims':
        const claims = await prisma.claim.findMany({
          where: Object.keys(dateFilter).length > 0 ? { claimedAt: dateFilter } : {},
          include: {
            offer: {
              select: {
                title: true,
                redemptionType: true,
                ad: {
                  select: {
                    title: true,
                    brand: true,
                  },
                },
              },
            },
            user: {
              select: {
                email: true,
              },
            },
          },
          orderBy: { claimedAt: 'desc' },
        })

        headers = ['Claimed Date', 'Offer Title', 'Redemption Type', 'Ad Title', 'Brand', 'User Email', 'Status']
        data = claims.map(c => ({
          claimedDate: c.claimedAt.toISOString(),
          offerTitle: c.offer.title,
          redemptionType: c.offer.redemptionType,
          adTitle: c.offer.ad.title,
          brand: c.offer.ad.brand,
          userEmail: c.user.email,
          status: c.redeemedAt ? 'Redeemed' : 'Claimed',
        }))
        break

      case 'ads':
        const ads = await prisma.ad.findMany({
          where: Object.keys(dateFilter).length > 0 ? { airDate: dateFilter } : {},
          include: {
            station: { select: { name: true } },
            category: { select: { name: true } },
            _count: {
              select: {
                offers: true,
                favorites: true,
              },
            },
          },
          orderBy: { airDate: 'desc' },
        })

        headers = ['Title', 'Brand', 'Station', 'Category', 'Air Date', 'Duration (s)', 'Plays', 'Offers', 'Favorites', 'Status']
        data = ads.map(a => ({
          title: a.title,
          brand: a.brand,
          station: a.station.name,
          category: a.category.name,
          airDate: a.airDate.toISOString(),
          duration: a.duration,
          plays: a.playCount,
          offers: a._count.offers,
          favorites: a._count.favorites,
          status: a.status,
        }))
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid export type' },
          { status: 400 }
        )
    }

    // Generate CSV or JSON
    if (format === 'csv') {
      const csv = [
        headers.join(','),
        ...data.map(row =>
          headers.map(header => {
            const value = row[header.toLowerCase().replace(/\s+/g, '').replace(/\(.*\)/, '')]
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value
          }).join(',')
        ),
      ].join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    } else {
      // JSON format
      return NextResponse.json({
        success: true,
        data,
        meta: {
          type,
          exportedAt: new Date().toISOString(),
          count: data.length,
          dateRange: {
            start: startDate,
            end: endDate,
          },
        },
      })
    }
  } catch (error) {
    console.error('Error exporting analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export analytics data' },
      { status: 500 }
    )
  }
}
