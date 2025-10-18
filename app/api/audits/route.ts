import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAuditSchema = z.object({
  auditTypeId: z.string().min(1, 'Audit type is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  scope: z.string().min(1, 'Scope is required'),
  objectives: z.string().optional(),
  auditStandard: z.string().min(1, 'Audit standard is required'),
  auditCriteria: z.string().optional(),
  plannedStartDate: z.string().datetime(),
  plannedEndDate: z.string().datetime(),
  actualStartDate: z.string().datetime().optional(),
  actualEndDate: z.string().datetime().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DEFERRED']).default('PLANNED'),
  ragStatus: z.enum(['GREEN', 'AMBER', 'RED']).default('GREEN'),
  leadAuditor: z.string().optional(),
  leadAuditorName: z.string().optional(),
  auditTeam: z.string().optional(), // JSON array
  auditee: z.string().optional(),
  auditeeName: z.string().optional(),
  location: z.string().optional(),
  auditMethod: z.enum(['ON_SITE', 'REMOTE', 'HYBRID']).optional(),
  effectiveness: z.number().min(1).max(5).optional(),
  notes: z.string().optional(),
  attachments: z.string().optional(), // JSON array
})

const updateAuditSchema = createAuditSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const auditTypeId = searchParams.get('auditTypeId')
    const status = searchParams.get('status')
    const ragStatus = searchParams.get('ragStatus')
    const auditStandard = searchParams.get('auditStandard')
    const year = searchParams.get('year')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const sortBy = searchParams.get('sortBy') || 'plannedStartDate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {}
    if (auditTypeId) where.auditTypeId = auditTypeId
    if (status) where.status = status
    if (ragStatus) where.ragStatus = ragStatus
    if (auditStandard) where.auditStandard = auditStandard
    if (year) {
      const startDate = new Date(`${year}-01-01T00:00:00.000Z`)
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`)
      where.plannedStartDate = {
        gte: startDate,
        lte: endDate,
      }
    }

    const skip = (page - 1) * limit

    const [audits, total] = await Promise.all([
      prisma.audit.findMany({
        where,
        include: {
          auditType: true,
          auditFindings: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          logs: {
            orderBy: { timestamp: 'desc' },
            take: 5,
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.audit.count({ where }),
    ])

    return NextResponse.json({
      audits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching audits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createAuditSchema.parse(body)

    // Generate audit number
    const year = new Date().getFullYear()
    const count = await prisma.audit.count({
      where: {
        auditNumber: {
          startsWith: `AUD-${year}-`,
        },
      },
    })
    const auditNumber = `AUD-${year}-${String(count + 1).padStart(4, '0')}`

    const audit = await prisma.audit.create({
      data: {
        ...validatedData,
        auditNumber,
        plannedStartDate: new Date(validatedData.plannedStartDate),
        plannedEndDate: new Date(validatedData.plannedEndDate),
        actualStartDate: validatedData.actualStartDate ? new Date(validatedData.actualStartDate) : null,
        actualEndDate: validatedData.actualEndDate ? new Date(validatedData.actualEndDate) : null,
        createdBy: session.user.id,
      },
      include: {
        auditType: true,
      },
    })

    // Create initial log entry
    await prisma.auditLog.create({
      data: {
        auditId: audit.id,
        action: 'CREATED',
        performedBy: session.user.id,
        comments: 'Audit created',
      },
    })

    return NextResponse.json(audit, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating audit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
