import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    // Check if offer exists
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        ad: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    if (!offer) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      )
    }

    // Check if offer has expired
    if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Offer has expired' },
        { status: 400 }
      )
    }

    // If user is authenticated, create a claim record
    if (session?.user?.id) {
      // Check if user already claimed this offer
      const existingClaim = await prisma.claim.findUnique({
        where: {
          userId_offerId: {
            userId: session.user.id,
            offerId: id
          }
        }
      })

      if (existingClaim) {
        return NextResponse.json(
          { success: false, error: 'You have already claimed this offer' },
          { status: 400 }
        )
      }

      // Create claim record
      await prisma.claim.create({
        data: {
          userId: session.user.id,
          offerId: id,
          claimedAt: new Date()
        }
      })
    }

    // Increment claim count
    const updatedOffer = await prisma.offer.update({
      where: { id },
      data: {
        claimCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedOffer,
      message: 'Offer claimed successfully!'
    })
  } catch (error) {
    console.error('Error claiming offer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to claim offer' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        ad: {
          include: {
            station: true,
            category: true
          }
        }
      }
    })

    if (!offer) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: offer
    })
  } catch (error) {
    console.error('Error fetching offer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offer' },
      { status: 500 }
    )
  }
}
