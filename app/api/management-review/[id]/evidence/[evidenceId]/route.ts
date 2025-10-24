import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/management-review/[id]/evidence/[evidenceId] - Update evidence
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; evidenceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, evidenceId } = await params
    const body = await request.json()
    const { label, url } = body

    // Check if evidence exists and belongs to this review
    const existingEvidence = await prisma.managementReviewEvidence.findFirst({
      where: {
        id: evidenceId,
        reviewId: id,
      },
    })

    if (!existingEvidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
    }

    const updatedEvidence = await prisma.managementReviewEvidence.update({
      where: { id: evidenceId },
      data: {
        ...(label && { label: label.trim() }),
        ...(url && { url: url.trim() }),
      },
    })

    // Return the updated review
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: true,
        outputs: true,
        actions: true,
        evidenceLinks: {
          orderBy: { uploadedAt: 'desc' },
        },
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
    console.error('Error updating evidence:', error)
    return NextResponse.json(
      { error: 'Failed to update evidence' },
      { status: 500 }
    )
  }
}

// DELETE /api/management-review/[id]/evidence/[evidenceId] - Delete evidence
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; evidenceId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, evidenceId } = await params

    // Check if evidence exists and belongs to this review
    const existingEvidence = await prisma.managementReviewEvidence.findFirst({
      where: {
        id: evidenceId,
        reviewId: id,
      },
    })

    if (!existingEvidence) {
      return NextResponse.json({ error: 'Evidence not found' }, { status: 404 })
    }

    await prisma.managementReviewEvidence.delete({
      where: { id: evidenceId },
    })

    // Return the updated review
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: true,
        outputs: true,
        actions: true,
        evidenceLinks: {
          orderBy: { uploadedAt: 'desc' },
        },
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
    console.error('Error deleting evidence:', error)
    return NextResponse.json(
      { error: 'Failed to delete evidence' },
      { status: 500 }
    )
  }
}
