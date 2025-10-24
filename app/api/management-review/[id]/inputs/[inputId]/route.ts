import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/management-review/[id]/inputs/[inputId] - Update input
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; inputId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, inputId } = await params
    const body = await request.json()
    const { standard, clauseRef, title, description, dataSource, evidence, status, remarks } = body

    // Check if input exists and belongs to this review
    const existingInput = await prisma.managementReviewInput.findFirst({
      where: {
        id: inputId,
        reviewId: id,
      },
    })

    if (!existingInput) {
      return NextResponse.json({ error: 'Input not found' }, { status: 404 })
    }

    const updatedInput = await prisma.managementReviewInput.update({
      where: { id: inputId },
      data: {
        ...(standard && { standard: standard.trim() }),
        ...(clauseRef && { clauseRef: clauseRef.trim() }),
        ...(title && { title: title.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(dataSource !== undefined && { dataSource: dataSource?.trim() || null }),
        ...(evidence !== undefined && { evidence: evidence?.trim() || null }),
        ...(status && { status }),
        ...(remarks !== undefined && { remarks: remarks?.trim() || null }),
      },
    })

    // Return the updated review
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: {
          orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
        },
        outputs: true,
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
    console.error('Error updating input:', error)
    return NextResponse.json(
      { error: 'Failed to update input' },
      { status: 500 }
    )
  }
}

// DELETE /api/management-review/[id]/inputs/[inputId] - Delete input
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; inputId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, inputId } = await params

    // Check if input exists and belongs to this review
    const existingInput = await prisma.managementReviewInput.findFirst({
      where: {
        id: inputId,
        reviewId: id,
      },
    })

    if (!existingInput) {
      return NextResponse.json({ error: 'Input not found' }, { status: 404 })
    }

    await prisma.managementReviewInput.delete({
      where: { id: inputId },
    })

    // Return the updated review
    const updatedReview = await prisma.managementReview.findUnique({
      where: { id },
      include: {
        attendees: true,
        inputs: {
          orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
        },
        outputs: true,
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
    console.error('Error deleting input:', error)
    return NextResponse.json(
      { error: 'Failed to delete input' },
      { status: 500 }
    )
  }
}
