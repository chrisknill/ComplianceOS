import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createComplaintSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  customerCompany: z.string().optional(),
  complaintType: z.enum(['PRODUCT', 'SERVICE', 'BILLING', 'DELIVERY', 'SUPPORT', 'OTHER']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().optional(),
  assignedToName: z.string().optional(),
  tags: z.string().optional(), // JSON array as string
})

const querySchema = z.object({
  search: z.string().optional(),
  complaintType: z.string().optional(),
  priority: z.string().optional(),
  status: z.string().optional(),
  assignedTo: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse({
      search: searchParams.get('search'),
      complaintType: searchParams.get('complaintType'),
      priority: searchParams.get('priority'),
      status: searchParams.get('status'),
      assignedTo: searchParams.get('assignedTo'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (query.search) {
      where.OR = [
        { complaintNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerCompany: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    
    if (query.complaintType && query.complaintType !== 'ALL') {
      where.complaintType = query.complaintType
    }
    
    if (query.priority && query.priority !== 'ALL') {
      where.priority = query.priority
    }
    
    if (query.status && query.status !== 'ALL') {
      where.status = query.status
    }
    
    if (query.assignedTo && query.assignedTo !== 'ALL') {
      where.assignedToName = query.assignedTo
    }

    const [complaints, total] = await Promise.all([
      prisma.customerComplaint.findMany({
        where,
        include: {
          actions: {
            orderBy: { createdAt: 'desc' }
          },
          logs: {
            orderBy: { timestamp: 'desc' }
          },
          _count: {
            select: {
              actions: true,
              logs: true
            }
          }
        },
        orderBy: { receivedDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customerComplaint.count({ where })
    ])

    return NextResponse.json({
      complaints,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching complaints:', error)
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createComplaintSchema.parse(body)

    // Generate complaint number
    const year = new Date().getFullYear()
    const count = await prisma.customerComplaint.count({
      where: {
        complaintNumber: {
          startsWith: `CC-${year}-`
        }
      }
    })
    const complaintNumber = `CC-${year}-${String(count + 1).padStart(4, '0')}`

    // Auto-assign due date based on priority
    let dueDate = new Date()
    switch (validatedData.priority) {
      case 'CRITICAL':
        dueDate.setDate(dueDate.getDate() + 1)
        break
      case 'HIGH':
        dueDate.setDate(dueDate.getDate() + 3)
        break
      case 'MEDIUM':
        dueDate.setDate(dueDate.getDate() + 7)
        break
      case 'LOW':
        dueDate.setDate(dueDate.getDate() + 14)
        break
    }

    const complaint = await prisma.customerComplaint.create({
      data: {
        ...validatedData,
        complaintNumber,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : dueDate,
        tags: validatedData.tags ? JSON.parse(validatedData.tags) : null,
      },
      include: {
        actions: true,
        logs: true,
      }
    })

    // Create initial log entry
    await prisma.customerComplaintLog.create({
      data: {
        complaintId: complaint.id,
        action: 'CREATED',
        comments: 'Complaint created',
      }
    })

    return NextResponse.json(complaint, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating complaint:', error)
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 })
  }
}
