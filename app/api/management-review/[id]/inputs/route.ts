import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createInputSchema, updateInputSchema } from '@/lib/validation/management-review'

// GET /api/management-review/[id]/inputs - Get inputs for a review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const standard = searchParams.get('standard')

    const where: any = { reviewId: params.id }
    if (standard) {
      where.standard = standard
    }

    const inputs = await prisma.managementReviewInput.findMany({
      where,
      orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
    })

    return NextResponse.json(inputs)

  } catch (error) {
    console.error('Error fetching inputs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inputs' },
      { status: 500 }
    )
  }
}

// POST /api/management-review/[id]/inputs - Add input to review
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if review exists
    const review = await prisma.managementReview.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = createInputSchema.parse(body)

    const input = await prisma.managementReviewInput.create({
      data: {
        ...validatedData,
        reviewId: params.id,
        evidence: validatedData.evidence ? JSON.stringify(validatedData.evidence) : null,
      },
    })

    // Create audit log entry
    await prisma.managementReviewAudit.create({
      data: {
        reviewId: params.id,
        actorId: session.user.id,
        event: 'UPDATED',
        details: `Input ${validatedData.title} added`,
      },
    })

    return NextResponse.json(input, { status: 201 })

  } catch (error) {
    console.error('Error creating input:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create input' },
      { status: 500 }
    )
  }
}
