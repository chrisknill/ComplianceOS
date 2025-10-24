import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/management-review/[id]/outputs - Get all outputs for a review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const outputs = await prisma.managementReviewOutput.findMany({
      where: { reviewId: id },
      orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
    })

    return NextResponse.json(outputs)
  } catch (error) {
    console.error('Error fetching outputs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch outputs' },
      { status: 500 }
    )
  }
}

// POST /api/management-review/[id]/outputs - Add new output
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { standard, clauseRef, decision, type } = body

    if (!decision?.trim() || !standard || !clauseRef) {
      return NextResponse.json({ error: 'Decision, Standard, and Clause Reference are required' }, { status: 400 })
    }

    const output = await prisma.managementReviewOutput.create({
      data: {
        reviewId: id,
        standard: standard.trim(),
        clauseRef: clauseRef.trim(),
        decision: decision.trim(),
        type: type || 'Improvement Opportunity',
      },
    })

    // Return the updated review with all outputs
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: true,
        outputs: {
          orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
        },
        actions: true,
        evidenceLinks: true,
        auditLog: true,
      },
    })

    if (!updatedReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parsedReview = {
      ...updatedReview,
      standards: JSON.parse(updatedReview.standards),
      agenda: updatedReview.agenda ? JSON.parse(updatedReview.agenda) : null,
    }

    return NextResponse.json(parsedReview)
  } catch (error) {
    console.error('Error adding output:', error)
    return NextResponse.json(
      { error: 'Failed to add output' },
      { status: 500 }
    )
  }
}
