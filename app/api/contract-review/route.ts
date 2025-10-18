import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schemas
const createContractSchema = z.object({
  contractNumber: z.string().min(1, 'Contract number is required'),
  contractTitle: z.string().min(1, 'Contract title is required'),
  contractType: z.enum(['SUPPLY', 'SERVICE', 'CONSULTING', 'MAINTENANCE', 'OTHER']),
  supplierName: z.string().min(1, 'Supplier name is required'),
  supplierContact: z.string().optional(),
  supplierEmail: z.string().email().optional().or(z.literal('')),
  value: z.number().positive().optional(),
  currency: z.string().default('USD'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  renewalDate: z.string().datetime().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  reviewerName: z.string().optional(),
  comments: z.string().optional(),
  terms: z.string().optional(),
  complianceNotes: z.string().optional(),
  nextReviewDate: z.string().datetime().optional(),
})

const querySchema = z.object({
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'TERMINATED']).optional(),
  contractType: z.enum(['SUPPLY', 'SERVICE', 'CONSULTING', 'MAINTENANCE', 'OTHER']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  search: z.string().optional(),
  limit: z.string().transform(Number).optional(),
})

// GET /api/contract-review - List all contract reviews
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    const validatedQuery = querySchema.parse(queryParams)

    // Build where clause
    const whereClause: any = {}
    if (validatedQuery.status) {
      whereClause.status = validatedQuery.status
    }
    if (validatedQuery.contractType) {
      whereClause.contractType = validatedQuery.contractType
    }
    if (validatedQuery.priority) {
      whereClause.priority = validatedQuery.priority
    }
    if (validatedQuery.riskLevel) {
      whereClause.riskLevel = validatedQuery.riskLevel
    }
    if (validatedQuery.search) {
      whereClause.OR = [
        { contractNumber: { contains: validatedQuery.search, mode: 'insensitive' } },
        { contractTitle: { contains: validatedQuery.search, mode: 'insensitive' } },
        { supplierName: { contains: validatedQuery.search, mode: 'insensitive' } },
      ]
    }

    const contracts = await prisma.contractReview.findMany({
      where: whereClause,
      include: {
        attachments: true,
        reviews: {
          orderBy: { timestamp: 'desc' },
          take: 5, // Latest 5 review logs
        },
      },
      orderBy: { createdAt: 'desc' },
      take: validatedQuery.limit || 50,
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Error fetching contract reviews:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch contract reviews' },
      { status: 500 }
    )
  }
}

// POST /api/contract-review - Create new contract review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createContractSchema.parse(body)

    // Create contract review
    const contract = await prisma.contractReview.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        renewalDate: validatedData.renewalDate ? new Date(validatedData.renewalDate) : null,
        nextReviewDate: validatedData.nextReviewDate ? new Date(validatedData.nextReviewDate) : null,
        reviewerId: session.user.id,
        reviewerName: session.user.name || session.user.email,
      },
      include: {
        attachments: true,
        reviews: true,
      },
    })

    // Create initial review log
    await prisma.contractReviewLog.create({
      data: {
        contractId: contract.id,
        action: 'CREATED',
        performedBy: session.user.name || session.user.email,
        comments: 'Contract review created',
      },
    })

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('Error creating contract review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create contract review' },
      { status: 500 }
    )
  }
}
