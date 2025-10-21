import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

// PUT /api/admin/users/[id] - Update user role
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { role } = body

    // Validate role
    if (!['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Only SUPER_ADMIN can create/modify SUPER_ADMIN accounts
    if (role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can assign super admin role' },
        { status: 403 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent users from modifying their own role
    if (user.id === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify your own role' },
        { status: 403 }
      )
    }

    // Only SUPER_ADMIN can modify other SUPER_ADMIN accounts
    if (user.role === 'SUPER_ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can modify super admin accounts' },
        { status: 403 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent users from deleting their own account
    if (user.id === session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete your own account' },
        { status: 403 }
      )
    }

    // Only SUPER_ADMIN can delete other SUPER_ADMIN or ADMIN accounts
    if ((user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Only super admins can delete admin accounts' },
        { status: 403 }
      )
    }

    // Delete user and all related data
    await prisma.$transaction([
      // Delete user's favorites
      prisma.favorite.deleteMany({
        where: { userId: id }
      }),
      // Delete user's play history
      prisma.playHistory.deleteMany({
        where: { userId: id }
      }),
      // Delete user's claims
      prisma.claim.deleteMany({
        where: { userId: id }
      }),
      // Delete user's search history
      prisma.searchHistory.deleteMany({
        where: { userId: id }
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id }
      })
    ])

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
