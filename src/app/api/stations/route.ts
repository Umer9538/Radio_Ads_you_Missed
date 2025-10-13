import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/stations - Get all radio stations
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const location = searchParams.get('location')

    const where: any = {}

    // Filter by active status
    if (active !== null) {
      where.active = active === 'true'
    }

    // Filter by location
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    const stations = await prisma.station.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
      include: {
        _count: {
          select: {
            ads: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: stations,
    })
  } catch (error) {
    console.error('Error fetching stations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stations',
      },
      { status: 500 }
    )
  }
}
