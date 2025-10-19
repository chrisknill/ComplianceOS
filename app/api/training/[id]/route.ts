import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update training record
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, dueDate, completed, score, documentUrl, documentName, notes } = body

    const record = await prisma.trainingRecord.update({
      where: { id },
      data: {
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: completed ? new Date(completed) : null,
        score: score ? parseInt(score) : null,
        documentUrl: documentUrl || null,
        documentName: documentName || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error updating training record:', error)
    return NextResponse.json(
      { error: 'Failed to update training record' },
      { status: 500 }
    )
  }
}

// DELETE - Delete training record
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.trainingRecord.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting training record:', error)
    return NextResponse.json(
      { error: 'Failed to delete training record' },
      { status: 500 }
    )
  }
}

