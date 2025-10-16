import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  createManagementReviewSchema, 
  updateManagementReviewSchema,
  reviewQuerySchema 
} from '@/lib/validation/management-review'

// GET /api/management-review - List all reviews with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = {
      status: searchParams.get('status') || undefined,
      standards: searchParams.get('standards')?.split(',') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const validatedQuery = reviewQuerySchema.parse(query)

    // Build where clause
    const where: any = {
      orgId: 'default-org', // In a real app, this would come from user's organization
    }

    if (validatedQuery.status) {
      where.status = validatedQuery.status
    }

    if (validatedQuery.standards?.length) {
      where.standards = {
        contains: validatedQuery.standards[0], // SQLite doesn't support array operations well
      }
    }

    if (validatedQuery.dateFrom || validatedQuery.dateTo) {
      where.scheduledAt = {}
      if (validatedQuery.dateFrom) {
        where.scheduledAt.gte = new Date(validatedQuery.dateFrom)
      }
      if (validatedQuery.dateTo) {
        where.scheduledAt.lte = new Date(validatedQuery.dateTo)
      }
    }

    if (validatedQuery.search) {
      where.title = {
        contains: validatedQuery.search,
        mode: 'insensitive',
      }
    }

    const [reviews, total] = await Promise.all([
      prisma.managementReview.findMany({
        where,
        include: {
          attendees: true,
          inputs: true,
          outputs: true,
          actions: true,
          evidenceLinks: true,
          _count: {
            select: {
              attendees: true,
              inputs: true,
              outputs: true,
              actions: true,
              evidenceLinks: true,
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
        skip: (validatedQuery.page - 1) * validatedQuery.limit,
        take: validatedQuery.limit,
      }),
      prisma.managementReview.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total,
        pages: Math.ceil(total / validatedQuery.limit),
      },
    })

  } catch (error) {
    console.error('Error fetching management reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch management reviews' },
      { status: 500 }
    )
  }
}

// POST /api/management-review - Create new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createManagementReviewSchema.parse(body)

    const review = await prisma.managementReview.create({
      data: {
        ...validatedData,
        orgId: 'default-org', // In a real app, this would come from user's organization
        standards: JSON.stringify(validatedData.standards),
        agenda: validatedData.agenda ? JSON.stringify(validatedData.agenda) : null,
        createdById: session.user.id,
      },
      include: {
        attendees: true,
        inputs: true,
        outputs: true,
        actions: true,
        evidenceLinks: true,
      },
    })

    // Create audit log entry
    await prisma.managementReviewAudit.create({
      data: {
        reviewId: review.id,
        actorId: session.user.id,
        event: 'CREATED',
        details: 'Management review created',
      },
    })

    return NextResponse.json(review, { status: 201 })

  } catch (error) {
    console.error('Error creating management review:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create management review' },
      { status: 500 }
    )
  }
}
