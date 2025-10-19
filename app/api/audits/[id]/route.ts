import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateAuditSchema = z.object({
  auditTypeId: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  scope: z.string().min(1).optional(),
  objectives: z.string().optional(),
  auditStandard: z.string().min(1).optional(),
  auditCriteria: z.string().optional(),
  plannedStartDate: z.string().datetime().optional(),
  plannedEndDate: z.string().datetime().optional(),
  actualStartDate: z.string().datetime().optional(),
  actualEndDate: z.string().datetime().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DEFERRED']).optional(),
  ragStatus: z.enum(['GREEN', 'AMBER', 'RED']).optional(),
  leadAuditor: z.string().optional(),
  leadAuditorName: z.string().optional(),
  auditTeam: z.string().optional(),
  auditee: z.string().optional(),
  auditeeName: z.string().optional(),
  location: z.string().optional(),
  auditMethod: z.enum(['ON_SITE', 'REMOTE', 'HYBRID']).optional(),
  effectiveness: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  attachments: z.string().optional(),
})

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
    const audit = await prisma.audit.findUnique({
      where: { id },
      include: {
        auditType: true,
        auditFindings: {
          orderBy: { createdAt: 'desc' },
        },
        logs: {
          orderBy: { timestamp: 'desc' },
        },
      },
    })

    if (!audit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Error fetching audit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    const validatedData = updateAuditSchema.parse(body)

    // Get current audit to compare status changes
    const currentAudit = await prisma.audit.findUnique({
      where: { id },
    })

    if (!currentAudit) {
      return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
    }

    const audit = await prisma.audit.update({
      where: { id },
      data: {
        ...validatedData,
        plannedStartDate: validatedData.plannedStartDate ? new Date(validatedData.plannedStartDate) : undefined,
        plannedEndDate: validatedData.plannedEndDate ? new Date(validatedData.plannedEndDate) : undefined,
        actualStartDate: validatedData.actualStartDate ? new Date(validatedData.actualStartDate) : undefined,
        actualEndDate: validatedData.actualEndDate ? new Date(validatedData.actualEndDate) : undefined,
      },
      include: {
        auditType: true,
      },
    })

    // Log status changes
    if (validatedData.status && validatedData.status !== currentAudit.status) {
      await prisma.auditLog.create({
        data: {
          auditId: id,
          action: validatedData.status,
          performedBy: session.user.id,
          comments: `Status changed from ${currentAudit.status} to ${validatedData.status}`,
        },
      })
    }

    return NextResponse.json(audit)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating audit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

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
    await prisma.audit.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting audit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
