import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/stations/[id] - Get single station
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const station = await prisma.station.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
      },
    })

    if (!station) {
      return NextResponse.json(
        {
          success: false,
          error: 'Station not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: station,
    })
  } catch (error) {
    console.error('Error fetching station:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch station',
      },
      { status: 500 }
    )
  }
}
