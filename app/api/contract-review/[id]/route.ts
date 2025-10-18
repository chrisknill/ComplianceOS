import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema for updating a contract
const updateContractSchema = z.object({
  contractNumber: z.string().min(1, 'Contract number is required').optional(),
  contractTitle: z.string().min(1, 'Contract title is required').optional(),
  contractType: z.enum(['SUPPLY', 'SERVICE', 'CONSULTING', 'MAINTENANCE', 'OTHER']).optional(),
  supplierName: z.string().min(1, 'Supplier name is required').optional(),
  supplierContact: z.string().optional(),
  supplierEmail: z.string().email().optional().or(z.literal('')),
  value: z.number().positive().optional(),
  currency: z.string().optional(),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  renewalDate: z.string().datetime().nullable().optional(),
  status: z.enum(['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED', 'TERMINATED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  reviewerName: z.string().optional(),
  reviewDate: z.string().datetime().nullable().optional(),
  approvalDate: z.string().datetime().nullable().optional(),
  approverName: z.string().optional(),
  comments: z.string().optional(),
  terms: z.string().optional(),
  complianceNotes: z.string().optional(),
  nextReviewDate: z.string().datetime().nullable().optional(),
})

// GET /api/contract-review/[id] - Get a single contract review
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

    const contract = await prisma.contractReview.findUnique({
      where: { id },
      include: {
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
        reviews: {
          orderBy: { timestamp: 'desc' },
        },
      },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract review not found' }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error fetching contract review:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contract review' },
      { status: 500 }
    )
  }
}

// PUT /api/contract-review/[id] - Update a contract review
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
    const validatedData = updateContractSchema.parse(body)

    // Get the current contract to track changes
    const currentContract = await prisma.contractReview.findUnique({
      where: { id },
    })

    if (!currentContract) {
      return NextResponse.json({ error: 'Contract review not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = { ...validatedData }
    
    // Convert date strings to Date objects
    if (validatedData.startDate !== undefined) {
      updateData.startDate = validatedData.startDate ? new Date(validatedData.startDate) : null
    }
    if (validatedData.endDate !== undefined) {
      updateData.endDate = validatedData.endDate ? new Date(validatedData.endDate) : null
    }
    if (validatedData.renewalDate !== undefined) {
      updateData.renewalDate = validatedData.renewalDate ? new Date(validatedData.renewalDate) : null
    }
    if (validatedData.reviewDate !== undefined) {
      updateData.reviewDate = validatedData.reviewDate ? new Date(validatedData.reviewDate) : null
    }
    if (validatedData.approvalDate !== undefined) {
      updateData.approvalDate = validatedData.approvalDate ? new Date(validatedData.approvalDate) : null
    }
    if (validatedData.nextReviewDate !== undefined) {
      updateData.nextReviewDate = validatedData.nextReviewDate ? new Date(validatedData.nextReviewDate) : null
    }

    const updatedContract = await prisma.contractReview.update({
      where: { id },
      data: updateData,
      include: {
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
        reviews: {
          orderBy: { timestamp: 'desc' },
        },
      },
    })

    // Create review log entry for the update
    await prisma.contractReviewLog.create({
      data: {
        contractId: id,
        action: 'UPDATED',
        performedBy: session.user.name || session.user.email,
        comments: 'Contract review updated',
      },
    })

    return NextResponse.json(updatedContract)
  } catch (error) {
    console.error('Error updating contract review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update contract review' },
      { status: 500 }
    )
  }
}

// DELETE /api/contract-review/[id] - Delete a contract review
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

    const existingContract = await prisma.contractReview.findUnique({
      where: { id },
    })

    if (!existingContract) {
      return NextResponse.json({ error: 'Contract review not found' }, { status: 404 })
    }

    await prisma.contractReview.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Contract review deleted successfully' })
  } catch (error) {
    console.error('Error deleting contract review:', error)
    return NextResponse.json(
      { error: 'Failed to delete contract review' },
      { status: 500 }
    )
  }
}
