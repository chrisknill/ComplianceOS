import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/management-review/[id]/actions/[actionId] - Update action
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, actionId } = await params
    const body = await request.json()
    const { title, ownerId, dueDate, status, linkage } = body

    // Check if action exists and belongs to this review
    const existingAction = await prisma.managementReviewAction.findFirst({
      where: {
        id: actionId,
        reviewId: id,
      },
    })

    if (!existingAction) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    const updatedAction = await prisma.managementReviewAction.update({
      where: { id: actionId },
      data: {
        ...(title && { title: title.trim() }),
        ...(ownerId !== undefined && { ownerId: ownerId?.trim() || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(status && { status }),
        ...(linkage !== undefined && { linkage: linkage?.trim() || null }),
      },
    })

    // Return the updated review
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: true,
        outputs: true,
        actions: {
          orderBy: { createdAt: 'desc' },
        },
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
    console.error('Error updating action:', error)
    return NextResponse.json(
      { error: 'Failed to update action' },
      { status: 500 }
    )
  }
}

// DELETE /api/management-review/[id]/actions/[actionId] - Delete action
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, actionId } = await params

    // Check if action exists and belongs to this review
    const existingAction = await prisma.managementReviewAction.findFirst({
      where: {
        id: actionId,
        reviewId: id,
      },
    })

    if (!existingAction) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    await prisma.managementReviewAction.delete({
      where: { id: actionId },
    })

    // Return the updated review
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: true,
        outputs: true,
        actions: {
          orderBy: { createdAt: 'desc' },
        },
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
    console.error('Error deleting action:', error)
    return NextResponse.json(
      { error: 'Failed to delete action' },
      { status: 500 }
    )
  }
}
