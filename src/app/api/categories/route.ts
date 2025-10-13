import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/categories - Get all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')
    const parentId = searchParams.get('parentId')

    const where: any = {}

    // Filter by active status
    if (active !== null) {
      where.active = active === 'true'
    }

    // Filter by parent (for hierarchical categories)
    if (parentId === 'null') {
      where.parentId = null // Root categories
    } else if (parentId) {
      where.parentId = parentId
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { name: 'asc' },
      ],
      include: {
        _count: {
          select: {
            ads: true,
            children: true,
          },
        },
        children: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    )
  }
}
