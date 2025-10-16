import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateAttendeeSchema } from '@/lib/validation/management-review'

// PUT /api/management-review/[id]/attendees/[attendeeId] - Update attendee
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; attendeeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateAttendeeSchema.parse(body)

    // Check if attendee exists
    const existingAttendee = await prisma.managementReviewAttendee.findUnique({
      where: { id: params.attendeeId },
    })

    if (!existingAttendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })
    }

    // Verify the attendee belongs to the review
    if (existingAttendee.reviewId !== params.id) {
      return NextResponse.json({ error: 'Attendee not found in this review' }, { status: 404 })
    }

    const attendee = await prisma.managementReviewAttendee.update({
      where: { id: params.attendeeId },
      data: validatedData,
    })

    // Create audit log entry for sign-off
    if (validatedData.signedOffAt && !existingAttendee.signedOffAt) {
      await prisma.managementReviewAudit.create({
        data: {
          reviewId: params.id,
          actorId: session.user.id,
          event: 'SIGN_OFF',
          details: `Attendee ${attendee.name} signed off`,
        },
      })
    }

    return NextResponse.json(attendee)

  } catch (error) {
    console.error('Error updating attendee:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update attendee' },
      { status: 500 }
    )
  }
}

// DELETE /api/management-review/[id]/attendees/[attendeeId] - Remove attendee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; attendeeId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if attendee exists
    const existingAttendee = await prisma.managementReviewAttendee.findUnique({
      where: { id: params.attendeeId },
    })

    if (!existingAttendee) {
      return NextResponse.json({ error: 'Attendee not found' }, { status: 404 })
    }

    // Verify the attendee belongs to the review
    if (existingAttendee.reviewId !== params.id) {
      return NextResponse.json({ error: 'Attendee not found in this review' }, { status: 404 })
    }

    await prisma.managementReviewAttendee.delete({
      where: { id: params.attendeeId },
    })

    // Create audit log entry
    await prisma.managementReviewAudit.create({
      data: {
        reviewId: params.id,
        actorId: session.user.id,
        event: 'UPDATED',
        details: `Attendee ${existingAttendee.name} removed`,
      },
    })

    return NextResponse.json({ message: 'Attendee removed successfully' })

  } catch (error) {
    console.error('Error deleting attendee:', error)
    return NextResponse.json(
      { error: 'Failed to remove attendee' },
      { status: 500 }
    )
  }
}
