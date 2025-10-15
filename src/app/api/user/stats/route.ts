import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/user/stats - Get user statistics
export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Get stats in parallel
    const [favoritesCount, claimedOffersCount] = await Promise.all([
      // Count favorites
      prisma.favorite.count({
        where: { userId: user.id },
      }),
      // Count claimed offers
      prisma.claim.count({
        where: { userId: user.id },
      }),
    ])

    // For now, we don't have play history or search tracking
    // These can be added when those features are implemented
    const stats = {
      favoritesCount,
      playHistoryCount: 0, // TODO: Implement play history tracking
      claimedOffersCount,
      searchCount: 0, // TODO: Implement search history tracking
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
