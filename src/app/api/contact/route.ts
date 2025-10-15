import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { isValidEmail } from '@/utils/helpers'
import { rateLimit, getClientIdentifier, RateLimitConfig } from '@/lib/rate-limit'

// POST /api/contact - Submit contact form
export async function POST(request: Request) {
  // Apply rate limiting
  const identifier = getClientIdentifier(request)
  const rateLimitResult = rateLimit(identifier, RateLimitConfig.contact)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many contact form submissions. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  try {
    const session = await auth()
    const body = await request.json()

    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      )
    }

    if (subject.length < 5 || subject.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Subject must be between 5 and 200 characters' },
        { status: 400 }
      )
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      )
    }

    // Get user ID if logged in
    let userId: string | null = null
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      })
      userId = user?.id || null
    }

    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        userId,
        name,
        email,
        subject,
        message,
        status: 'NEW',
      },
    })

    // TODO: Send email notification to admin
    // You can integrate an email service like Resend, SendGrid, or Nodemailer here
    console.log('New contact submission:', {
      id: submission.id,
      name,
      email,
      subject,
    })

    /*
    Example email integration (uncomment and configure):

    import { Resend } from 'resend'
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'notifications@yourdomain.com',
      to: 'support@yourdomain.com',
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })
    */

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We\'ll get back to you soon!',
      data: {
        id: submission.id,
      },
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get contact submissions (admin only)
export async function GET(request: Request) {
  try {
    const session = await auth()

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get submissions
    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      prisma.contactSubmission.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}
