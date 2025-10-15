import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

/**
 * POST /api/upload/image - Upload image/thumbnail file
 * Accepts: multipart/form-data with 'file' field
 * Returns: { success: true, url: string }
 */
export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request)
    const rateLimitResult = rateLimit(identifier, RateLimitConfig.upload)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many upload requests. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      )
    }

    const session = await auth()

    // Check authentication
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
        },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large. Maximum size is 5MB',
        },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const ext = path.extname(file.name)
    const filename = `image-${timestamp}-${randomStr}${ext}`

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filepath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    const fileUrl = `/uploads/images/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      size: file.size,
      type: file.type,
      message: 'Image uploaded successfully',
    })
  } catch (error) {
    console.error('Error uploading image file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload image file' },
      { status: 500 }
    )
  }
}
