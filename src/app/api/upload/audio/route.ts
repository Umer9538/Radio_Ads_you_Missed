import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

/**
 * POST /api/upload/audio - Upload audio file
 * Accepts: multipart/form-data with 'file' field
 * Returns: { success: true, url: string, duration: number }
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
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/aac',
      'audio/m4a',
      'audio/x-m4a',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid file type. Allowed: MP3, WAV, OGG, AAC, M4A',
        },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: 'File too large. Maximum size is 50MB',
        },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const ext = path.extname(file.name)
    const filename = `audio-${timestamp}-${randomStr}${ext}`

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'audio')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const filepath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Get audio duration using audio metadata (simplified - in production use a library like 'music-metadata')
    // For now, we'll return a placeholder and require duration to be provided separately
    const fileUrl = `/uploads/audio/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
      size: file.size,
      type: file.type,
      message: 'Audio file uploaded successfully',
    })
  } catch (error) {
    console.error('Error uploading audio file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload audio file' },
      { status: 500 }
    )
  }
}
