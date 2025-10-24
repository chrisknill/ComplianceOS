import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/ohs/actions/[id] - Get single action
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
    const action = await prisma.action.findUnique({
      where: { id },
      include: {
        incident: true,
        audit: true,
      },
    })

    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    return NextResponse.json(action)
  } catch (error) {
    console.error('Error fetching action:', error)
    return NextResponse.json(
      { error: 'Failed to fetch action' },
      { status: 500 }
    )
  }
}

// PUT /api/ohs/actions/[id] - Update action
export async function PUT(
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
    const { type, title, details, owner, dueDate, status, completedAt, effectivenessReview } = body

    // Check if action exists
    const existingAction = await prisma.action.findUnique({
      where: { id },
    })

    if (!existingAction) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    const updatedAction = await prisma.action.update({
      where: { id },
      data: {
        ...(type && { type }),
        ...(title && { title: title.trim() }),
        ...(details !== undefined && { details: details?.trim() || null }),
        ...(owner !== undefined && { owner: owner?.trim() || null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(status && { status }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
        ...(effectivenessReview !== undefined && { effectivenessReview: effectivenessReview?.trim() || null }),
      },
    })

    return NextResponse.json(updatedAction)
  } catch (error) {
    console.error('Error updating action:', error)
    return NextResponse.json(
      { error: 'Failed to update action' },
      { status: 500 }
    )
  }
}

// DELETE /api/ohs/actions/[id] - Delete action
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check if action exists
    const existingAction = await prisma.action.findUnique({
      where: { id },
    })

    if (!existingAction) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 })
    }

    await prisma.action.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Action deleted successfully' })
  } catch (error) {
    console.error('Error deleting action:', error)
    return NextResponse.json(
      { error: 'Failed to delete action' },
      { status: 500 }
    )
  }
}
