import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update audit
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, title, auditor, date, area, duration, status, outcome, actionItems, findings } = body

    const audit = await prisma.oHSAudit.update({
      where: { id: params.id },
      data: {
        type,
        title,
        auditor,
        date: date ? new Date(date) : undefined,
        area,
        duration,
        status,
        outcome,
        actionItems,
        findings,
      },
    })

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Error updating audit:', error)
    return NextResponse.json(
      { error: 'Failed to update audit' },
      { status: 500 }
    )
  }
}

// DELETE - Delete audit
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.oHSAudit.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting audit:', error)
    return NextResponse.json(
      { error: 'Failed to delete audit' },
      { status: 500 }
    )
  }
}

