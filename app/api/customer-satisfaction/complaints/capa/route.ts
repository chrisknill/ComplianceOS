import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createCapaFromComplaintSchema = z.object({
  complaintId: z.string().min(1, 'Complaint ID is required'),
  actionType: z.enum(['CORRECTIVE', 'PREVENTIVE']).default('CORRECTIVE'),
  description: z.string().min(1, 'Description is required'),
  assignedToName: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createCapaFromComplaintSchema.parse(body)

    // Get complaint details
    const complaint = await prisma.customerComplaint.findUnique({
      where: { id: validatedData.complaintId },
      include: { project: true }
    })

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 })
    }

    // Generate CAPA action number
    const year = new Date().getFullYear()
    const count = await prisma.customerComplaintAction.count({
      where: {
        actionType: 'CAPA',
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`)
        }
      }
    })
    const capaActionNumber = `CAPA-${year}-${String(count + 1).padStart(4, '0')}`

    // Create CAPA action
    const capaAction = await prisma.customerComplaintAction.create({
      data: {
        complaintId: validatedData.complaintId,
        actionType: 'CAPA',
        description: validatedData.description,
        assignedToName: validatedData.assignedToName,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        status: 'PENDING',
        capaActionNumber: capaActionNumber,
      }
    })

    // Create log entry
    await prisma.customerComplaintLog.create({
      data: {
        complaintId: validatedData.complaintId,
        action: 'CAPA_CREATED',
        performedByName: 'System',
        comments: `CAPA action ${capaActionNumber} created from customer complaint`,
      }
    })

    // Update complaint status if needed
    if (complaint.status === 'OPEN') {
      await prisma.customerComplaint.update({
        where: { id: validatedData.complaintId },
        data: { status: 'INVESTIGATING' }
      })

      await prisma.customerComplaintLog.create({
        data: {
          complaintId: validatedData.complaintId,
          action: 'STATUS_CHANGED',
          performedByName: 'System',
          comments: 'Status changed to INVESTIGATING due to CAPA creation',
        }
      })
    }

    return NextResponse.json({
      message: 'CAPA action created successfully',
      capaAction,
      capaActionNumber
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating CAPA from complaint:', error)
    return NextResponse.json({ error: 'Failed to create CAPA action' }, { status: 500 })
  }
}

// Get CAPA actions for a complaint
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const complaintId = searchParams.get('complaintId')

    if (!complaintId) {
      return NextResponse.json({ error: 'Complaint ID is required' }, { status: 400 })
    }

    const capaActions = await prisma.customerComplaintAction.findMany({
      where: {
        complaintId: complaintId,
        actionType: 'CAPA'
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(capaActions)
  } catch (error) {
    console.error('Error fetching CAPA actions:', error)
    return NextResponse.json({ error: 'Failed to fetch CAPA actions' }, { status: 500 })
  }
}
