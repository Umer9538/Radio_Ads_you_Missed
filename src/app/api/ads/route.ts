import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { DEFAULT_PAGE_SIZE } from '@/utils/constants'

// GET /api/ads - Search and filter ads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE)), 100)
    const skip = (page - 1) * limit

    // Search query
    const query = searchParams.get('query') || ''

    // Filters
    const stationId = searchParams.get('stationId')
    const stationName = searchParams.get('station')
    const categoryId = searchParams.get('categoryId')
    const categoryName = searchParams.get('category')
    const brand = searchParams.get('brand')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const hasOffer = searchParams.get('hasOffer')
    const sortBy = searchParams.get('sortBy') || 'date_desc'

    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
    }

    // Search in title, description, brand
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { product: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Filter by station (ID or name)
    if (stationId) {
      where.stationId = stationId
    } else if (stationName) {
      where.station = {
        name: { equals: stationName, mode: 'insensitive' }
      }
    }

    // Filter by category (ID or name)
    if (categoryId) {
      where.categoryId = categoryId
    } else if (categoryName) {
      where.category = {
        name: { equals: categoryName, mode: 'insensitive' }
      }
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' }
    }

    if (dateFrom || dateTo) {
      where.airDate = {}
      if (dateFrom) where.airDate.gte = new Date(dateFrom)
      if (dateTo) where.airDate.lte = new Date(dateTo)
    }

    if (hasOffer === 'true') {
      where.offers = {
        some: {
          active: true,
          OR: [
            { expiryDate: null },
            { expiryDate: { gte: new Date() } },
          ],
        },
      }
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    switch (sortBy) {
      case 'date_asc':
        orderBy = { airDate: 'asc' }
        break
      case 'date_desc':
        orderBy = { airDate: 'desc' }
        break
      case 'popularity':
        orderBy = { playCount: 'desc' }
        break
      case 'relevance':
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Execute query
    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          station: {
            select: {
              id: true,
              name: true,
              frequency: true,
              location: true,
              logoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          offers: {
            where: {
              active: true,
              OR: [
                { expiryDate: null },
                { expiryDate: { gte: new Date() } },
              ],
            },
            select: {
              id: true,
              title: true,
              expiryDate: true,
              redemptionType: true,
              discountPercent: true,
              discountAmount: true,
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      }),
      prisma.ad.count({ where }),
    ])

    // Parse tags from JSON string
    const adsWithParsedTags = ads.map(ad => ({
      ...ad,
      tags: ad.tags ? JSON.parse(ad.tags) : [],
    }))

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: adsWithParsedTags,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching ads:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch ads',
      },
      { status: 500 }
    )
  }
}
