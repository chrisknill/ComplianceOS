import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for query parameters
const querySchema = z.object({
  reviewId: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CLOSED']).optional(),
  limit: z.string().transform(Number).optional(),
})

// GET /api/management-review/actions - Get all management review actions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedQuery = querySchema.parse(queryParams)

    // Build where clause
    const whereClause: any = {}
    if (validatedQuery.reviewId) {
      whereClause.reviewId = validatedQuery.reviewId
    }
    if (validatedQuery.status) {
      whereClause.status = validatedQuery.status
    }

    const actions = await prisma.managementReviewAction.findMany({
      where: whereClause,
      include: {
        review: {
          select: {
            id: true,
            title: true,
            date: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: validatedQuery.limit || undefined,
    })

    // Transform the data to match the expected format
    const transformedActions = actions.map(action => ({
      id: action.id,
      type: 'MANAGEMENT_REVIEW',
      title: action.title,
      details: action.linkage || '',
      owner: action.ownerId || '',
      dueDate: action.dueDate,
      status: action.status,
      source: 'Management Review',
      reviewId: action.reviewId,
      reviewTitle: action.review.title,
      reviewDate: action.review.date,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
    }))

    return NextResponse.json(transformedActions)
  } catch (error) {
    console.error('Error fetching management review actions:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch management review actions' },
      { status: 500 }
    )
  }
}
