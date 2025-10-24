import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/management-review/[id]/outputs/[outputId] - Update output
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outputId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outputId } = await params
    const body = await request.json()
    const { standard, clauseRef, decision, type } = body

    // Check if output exists and belongs to this review
    const existingOutput = await prisma.managementReviewOutput.findFirst({
      where: {
        id: outputId,
        reviewId: id,
      },
    })

    if (!existingOutput) {
      return NextResponse.json({ error: 'Output not found' }, { status: 404 })
    }

    const updatedOutput = await prisma.managementReviewOutput.update({
      where: { id: outputId },
      data: {
        ...(standard && { standard: standard.trim() }),
        ...(clauseRef && { clauseRef: clauseRef.trim() }),
        ...(decision && { decision: decision.trim() }),
        ...(type && { type }),
      },
    })

    // Return the updated review
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
    console.error('Error updating output:', error)
    return NextResponse.json(
      { error: 'Failed to update output' },
      { status: 500 }
    )
  }
}

// DELETE /api/management-review/[id]/outputs/[outputId] - Delete output
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; outputId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, outputId } = await params

    // Check if output exists and belongs to this review
    const existingOutput = await prisma.managementReviewOutput.findFirst({
      where: {
        id: outputId,
        reviewId: id,
      },
    })

    if (!existingOutput) {
      return NextResponse.json({ error: 'Output not found' }, { status: 404 })
    }

    await prisma.managementReviewOutput.delete({
      where: { id: outputId },
    })

    // Return the updated review
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
    console.error('Error deleting output:', error)
    return NextResponse.json(
      { error: 'Failed to delete output' },
      { status: 500 }
    )
  }
}
