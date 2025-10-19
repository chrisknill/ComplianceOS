import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createAttendeeSchema, updateAttendeeSchema } from '@/lib/validation/management-review'

// GET /api/management-review/[id]/attendees - Get attendees for a review
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
    const attendees = await prisma.managementReviewAttendee.findMany({
      where: { reviewId: id },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(attendees)

  } catch (error) {
    console.error('Error fetching attendees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    )
  }
}

// POST /api/management-review/[id]/attendees - Add attendee to review
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
    // Check if review exists
    const review = await prisma.managementReview.findUnique({
      where: { id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = createAttendeeSchema.parse(body)

    const attendee = await prisma.managementReviewAttendee.create({
      data: {
        ...validatedData,
        reviewId: id,
      },
    })

    // Create audit log entry
    await prisma.managementReviewAudit.create({
      data: {
        reviewId: id,
        actorId: session.user.id,
        event: 'UPDATED',
        details: `Attendee ${validatedData.name} added`,
      },
    })

    return NextResponse.json(attendee, { status: 201 })

  } catch (error) {
    console.error('Error creating attendee:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create attendee' },
      { status: 500 }
    )
  }
}
