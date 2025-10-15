import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/claims/[id] - Get a specific claim
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const claim = await prisma.claim.findUnique({
      where: { id },
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
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      )
    }

    // Verify the claim belongs to the requesting user
    if (claim.user.email !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: claim,
    })
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claim' },
      { status: 500 }
    )
  }
}

// PATCH /api/claims/[id] - Mark claim as redeemed
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { redeemed } = body

    if (typeof redeemed !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Redeemed status is required' },
        { status: 400 }
      )
    }

    // Find the claim and verify ownership
    const existingClaim = await prisma.claim.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true },
        },
      },
    })

    if (!existingClaim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      )
    }

    if (existingClaim.user.email !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Update the claim
    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: {
        redeemed,
        redeemedAt: redeemed ? new Date() : null,
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

    return NextResponse.json({
      success: true,
      data: updatedClaim,
      message: redeemed
        ? 'Claim marked as redeemed'
        : 'Claim marked as not redeemed',
    })
  } catch (error) {
    console.error('Error updating claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update claim' },
      { status: 500 }
    )
  }
}

// DELETE /api/claims/[id] - Delete a claim (if user wants to unclaim)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Find the claim and verify ownership
    const existingClaim = await prisma.claim.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true },
        },
        offer: true,
      },
    })

    if (!existingClaim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      )
    }

    if (existingClaim.user.email !== session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete claim and decrement offer claim count in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.claim.delete({
        where: { id },
      })

      // Decrement offer claim count
      await tx.offer.update({
        where: { id: existingClaim.offerId },
        data: { claimCount: { decrement: 1 } },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Claim deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete claim' },
      { status: 500 }
    )
  }
}
