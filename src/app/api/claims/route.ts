import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/claims - Get user's claimed offers
export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit
    const showRedeemed = searchParams.get('redeemed') === 'true'

    const where: any = {
      user: {
        email: session.user.email,
      },
    }

    if (showRedeemed !== undefined) {
      where.redeemed = showRedeemed
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        orderBy: { claimedAt: 'desc' },
        skip,
        take: limit,
        include: {
          offer: {
            include: {
              ad: {
                include: {
                  station: {
                    select: {
                      name: true,
                      location: true,
                    },
                  },
                  category: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.claim.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: claims,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

// POST /api/claims - Claim an offer
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { offerId } = body

    if (!offerId) {
      return NextResponse.json(
        { success: false, error: 'Offer ID is required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if offer exists and is active
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        ad: {
          select: {
            title: true,
            brand: true,
          },
        },
      },
    })

    if (!offer) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      )
    }

    if (!offer.active) {
      return NextResponse.json(
        { success: false, error: 'Offer is no longer active' },
        { status: 400 }
      )
    }

    // Check if offer has expired
    if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Offer has expired' },
        { status: 400 }
      )
    }

    // Check if max claims reached
    if (offer.maxClaims && offer.claimCount >= offer.maxClaims) {
      return NextResponse.json(
        { success: false, error: 'Offer has reached maximum claims' },
        { status: 400 }
      )
    }

    // Check if user already claimed this offer
    const existingClaim = await prisma.claim.findUnique({
      where: {
        userId_offerId: {
          userId: user.id,
          offerId: offerId,
        },
      },
    })

    if (existingClaim) {
      return NextResponse.json(
        { success: false, error: 'You have already claimed this offer' },
        { status: 400 }
      )
    }

    // Get request info for tracking
    const headers = request.headers
    const ipAddress = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown'
    const userAgent = headers.get('user-agent') || 'unknown'

    // Create claim and increment offer claim count in a transaction
    const claim = await prisma.$transaction(async (tx) => {
      const newClaim = await tx.claim.create({
        data: {
          userId: user.id,
          offerId: offerId,
          ipAddress,
          userAgent,
        },
        include: {
          offer: {
            include: {
              ad: {
                select: {
                  id: true,
                  title: true,
                  brand: true,
                },
              },
            },
          },
        },
      })

      // Increment offer claim count
      await tx.offer.update({
        where: { id: offerId },
        data: { claimCount: { increment: 1 } },
      })

      return newClaim
    })

    return NextResponse.json({
      success: true,
      data: claim,
      message: 'Offer claimed successfully',
    })
  } catch (error: any) {
    console.error('Error claiming offer:', error)

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'You have already claimed this offer' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to claim offer' },
      { status: 500 }
    )
  }
}
