import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const record = await prisma.nonConformance.findUnique({
      where: { id },
      include: {
        actions: {
          orderBy: { createdAt: 'asc' },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!record) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error fetching non-conformance:', error)
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const record = await prisma.nonConformance.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        actions: true,
        auditLogs: true,
      },
    })

    // Create audit log
    await prisma.nCAuditLog.create({
      data: {
        ncId: record.id,
        eventType: 'EDITED',
        description: `Case ${record.refNumber} updated`,
        userId: body.updatedBy || 'System',
        userName: body.updatedBy || 'System',
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error updating non-conformance:', error)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.nonConformance.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting non-conformance:', error)
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}

