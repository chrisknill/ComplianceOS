import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/management-review/[id]/evidence - Get all evidence for a review
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
    const evidence = await prisma.managementReviewEvidence.findMany({
      where: { reviewId: id },
      orderBy: { uploadedAt: 'desc' },
    })

    return NextResponse.json(evidence)
  } catch (error) {
    console.error('Error fetching evidence:', error)
    return NextResponse.json(
      { error: 'Failed to fetch evidence' },
      { status: 500 }
    )
  }
}

// POST /api/management-review/[id]/evidence - Add new evidence
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
    const { label, url } = body

    if (!label?.trim() || !url?.trim()) {
      return NextResponse.json({ error: 'Label and URL are required' }, { status: 400 })
    }

    const evidence = await prisma.managementReviewEvidence.create({
      data: {
        reviewId: id,
        label: label.trim(),
        url: url.trim(),
        uploadedBy: session.user.id,
      },
    })

    // Return the updated review with all evidence
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
    console.error('Error adding evidence:', error)
    return NextResponse.json(
      { error: 'Failed to add evidence' },
      { status: 500 }
    )
  }
}
