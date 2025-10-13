import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// DELETE /api/favorites/[id] - Remove ad from favorites
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id: adId } = await params

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_adId: {
          userId: session.user.id,
          adId
        }
      }
    })

    if (!favorite) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_adId: {
          userId: session.user.id,
          adId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Removed from favorites successfully'
    })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}

// GET /api/favorites/[id] - Check if ad is favorited
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({
        success: true,
        data: { isFavorited: false }
      })
    }

    const { id: adId } = await params

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_adId: {
          userId: session.user.id,
          adId
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { isFavorited: !!favorite }
    })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check favorite status' },
      { status: 500 }
    )
  }
}
