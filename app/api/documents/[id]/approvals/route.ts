import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch approvals for a document
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const approvals = await prisma.documentApproval.findMany({
      where: { documentId: id },
      orderBy: { level: 'asc' },
    })

    return NextResponse.json(approvals)
  } catch (error) {
    console.error('Error fetching approvals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch approvals' },
      { status: 500 }
    )
  }
}

// POST - Create or update an approval
export async function POST(
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
    const { level, approverRole, approverName, status, comments } = body

    // Check if approval already exists for this level
    const existing = await prisma.documentApproval.findFirst({
      where: {
        documentId: id,
        level,
      },
    })

    if (existing) {
      // Update existing approval
      const approval = await prisma.documentApproval.update({
        where: { id: existing.id },
        data: {
          approverName,
          status,
          comments,
          signedAt: status !== 'PENDING' ? new Date() : null,
        },
      })

      // If all required approvals are done, update document status
      const allApprovals = await prisma.documentApproval.findMany({
        where: { documentId: id },
      })

      const requiredLevels = [1, 2] // Levels 1 and 2 are required
      const allRequiredApproved = requiredLevels.every(
        (level) =>
          allApprovals.find((a) => a.level === level)?.status === 'APPROVED'
      )

      if (allRequiredApproved) {
        await prisma.document.update({
          where: { id },
          data: { status: 'APPROVED' },
        })
      }

      // If any approval is rejected, set document back to draft
      if (status === 'REJECTED') {
        await prisma.document.update({
          where: { id },
          data: { status: 'DRAFT' },
        })
      }

      return NextResponse.json(approval)
    } else {
      // Create new approval
      const approval = await prisma.documentApproval.create({
        data: {
          documentId: id,
          level,
          approverRole,
          approverName,
          status,
          comments,
          signedAt: status !== 'PENDING' ? new Date() : null,
        },
      })

      return NextResponse.json(approval)
    }
  } catch (error) {
    console.error('Error creating/updating approval:', error)
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    )
  }
}

