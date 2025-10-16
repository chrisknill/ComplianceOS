import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch approvals for an action
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const approvals = await prisma.actionApproval.findMany({
      where: { actionId: params.id },
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

// POST - Create or update an action approval
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { level, approverRole, approverName, status, comments } = body

    // Check if approval already exists for this level
    const existing = await prisma.actionApproval.findFirst({
      where: {
        actionId: params.id,
        level,
      },
    })

    if (existing) {
      // Update existing approval
      const approval = await prisma.actionApproval.update({
        where: { id: existing.id },
        data: {
          approverName,
          status,
          comments,
          signedAt: status !== 'PENDING' ? new Date() : null,
        },
      })

      // Check if all required approvals are done
      const allApprovals = await prisma.actionApproval.findMany({
        where: { actionId: params.id },
      })

      const requiredLevels = [1, 2] // Levels 1 and 2 are required
      const allRequiredApproved = requiredLevels.every(
        (level) =>
          allApprovals.find((a) => a.level === level)?.status === 'APPROVED'
      )

      if (allRequiredApproved) {
        await prisma.action.update({
          where: { id: params.id },
          data: { status: 'COMPLETED' },
        })
      }

      // If any approval is rejected, set back to in progress
      if (status === 'REJECTED') {
        await prisma.action.update({
          where: { id: params.id },
          data: { status: 'IN_PROGRESS' },
        })
      }

      return NextResponse.json(approval)
    } else {
      // Create new approval
      const approval = await prisma.actionApproval.create({
        data: {
          actionId: params.id,
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

