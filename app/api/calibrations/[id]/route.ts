import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update calibration
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
    const { dueDate, performedOn, result, certificateUrl } = body

    const calibration = await prisma.calibration.update({
      where: { id },
      data: {
        dueDate: dueDate ? new Date(dueDate) : undefined,
        performedOn: performedOn ? new Date(performedOn) : null,
        result: result || null,
        certificateUrl: certificateUrl || null,
      },
      include: {
        equipment: true,
      },
    })

    return NextResponse.json(calibration)
  } catch (error) {
    console.error('Error updating calibration:', error)
    return NextResponse.json(
      { error: 'Failed to update calibration' },
      { status: 500 }
    )
  }
}

// DELETE - Delete calibration
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
    await prisma.calibration.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting calibration:', error)
    return NextResponse.json(
      { error: 'Failed to delete calibration' },
      { status: 500 }
    )
  }
}

