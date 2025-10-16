import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateManagementReviewSchema, statusTransitionSchema } from '@/lib/validation/management-review'

// GET /api/management-review/[id] - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const review = await prisma.managementReview.findUnique({
      where: { id: params.id },
      include: {
        attendees: {
          orderBy: { createdAt: 'asc' },
        },
        inputs: {
          orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
        },
        outputs: {
          orderBy: [{ standard: 'asc' }, { clauseRef: 'asc' }],
        },
        actions: {
          orderBy: { createdAt: 'desc' },
        },
        evidenceLinks: {
          orderBy: { uploadedAt: 'desc' },
        },
        auditLog: {
          orderBy: { at: 'desc' },
        },
      },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parsedReview = {
      ...review,
      standards: JSON.parse(review.standards),
      agenda: review.agenda ? JSON.parse(review.agenda) : null,
    }

    return NextResponse.json(parsedReview)

  } catch (error) {
    console.error('Error fetching management review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch management review' },
      { status: 500 }
    )
  }
}

// PUT /api/management-review/[id] - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateManagementReviewSchema.parse(body)

    // Check if review exists
    const existingReview = await prisma.managementReview.findUnique({
      where: { id: params.id },
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Validate status transition if status is being changed
    if (validatedData.status && validatedData.status !== existingReview.status) {
      const transition = statusTransitionSchema.parse({
        fromStatus: existingReview.status as any,
        toStatus: validatedData.status as any,
      })
    }

    // Validate completion requirements if moving to COMPLETED
    if (validatedData.status === 'COMPLETED') {
      await validateCompletionRequirements(params.id)
    }

    const updateData: any = {
      ...validatedData,
      updatedById: session.user.id,
    }

    // Handle JSON fields
    if (validatedData.standards) {
      updateData.standards = JSON.stringify(validatedData.standards)
    }
    if (validatedData.agenda) {
      updateData.agenda = JSON.stringify(validatedData.agenda)
    }

    const review = await prisma.managementReview.update({
      where: { id: params.id },
      data: updateData,
      include: {
        attendees: true,
        inputs: true,
        outputs: true,
        actions: true,
        evidenceLinks: true,
      },
    })

    // Create audit log entry for status change
    if (validatedData.status && validatedData.status !== existingReview.status) {
      await prisma.managementReviewAudit.create({
        data: {
          reviewId: review.id,
          actorId: session.user.id,
          event: 'STATUS_CHANGE',
          details: `Status changed from ${existingReview.status} to ${validatedData.status}`,
        },
      })
    }

    // Create general audit log entry
    await prisma.managementReviewAudit.create({
      data: {
        reviewId: review.id,
        actorId: session.user.id,
        event: 'UPDATED',
        details: 'Review updated',
      },
    })

    // Parse JSON fields for response
    const parsedReview = {
      ...review,
      standards: JSON.parse(review.standards),
      agenda: review.agenda ? JSON.parse(review.agenda) : null,
    }

    return NextResponse.json(parsedReview)

  } catch (error) {
    console.error('Error updating management review:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update management review' },
      { status: 500 }
    )
  }
}

// DELETE /api/management-review/[id] - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if review exists
    const existingReview = await prisma.managementReview.findUnique({
      where: { id: params.id },
    })

    if (!existingReview) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Only allow deletion of DRAFT reviews
    if (existingReview.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Only draft reviews can be deleted' },
        { status: 400 }
      )
    }

    await prisma.managementReview.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Review deleted successfully' })

  } catch (error) {
    console.error('Error deleting management review:', error)
    return NextResponse.json(
      { error: 'Failed to delete management review' },
      { status: 500 }
    )
  }
}

// Validation function for completion requirements
async function validateCompletionRequirements(reviewId: string) {
  const review = await prisma.managementReview.findUnique({
    where: { id: reviewId },
    include: {
      attendees: true,
      inputs: true,
      outputs: true,
    },
  })

  if (!review) {
    throw new Error('Review not found')
  }

  const standards = JSON.parse(review.standards) as string[]
  const errors: string[] = []

  // Check required inputs are not pending
  const pendingInputs = review.inputs.filter(input => input.status === 'PENDING')
  if (pendingInputs.length > 0) {
    errors.push(`${pendingInputs.length} input items still have PENDING status`)
  }

  // Check at least one output exists for each standard
  for (const standard of standards) {
    const standardOutputs = review.outputs.filter(output => output.standard === standard)
    if (standardOutputs.length === 0) {
      errors.push(`No outputs/decisions found for ${standard}`)
    }
  }

  // Check minutes are provided (minimum 200 characters)
  if (!review.discussionNotes || review.discussionNotes.length < 200) {
    errors.push('Discussion notes must be at least 200 characters long')
  }

  // Check required attendees are present and signed
  const requiredAttendees = review.attendees.filter(attendee => attendee.required)
  for (const attendee of requiredAttendees) {
    if (!attendee.present) {
      errors.push(`Required attendee ${attendee.name} is not marked as present`)
    }
    if (!attendee.signedOffAt) {
      errors.push(`Required attendee ${attendee.name} has not signed off`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Review cannot be completed: ${errors.join(', ')}`)
  }
}
