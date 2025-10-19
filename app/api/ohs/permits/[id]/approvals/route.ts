import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const approval = await prisma.permitApproval.create({
      data: {
        permitId: id,
        level: body.level,
        approverRole: body.approverRole,
        approverName: body.approverName || null,
        status: body.status || 'PENDING',
        comments: body.comments || null,
        signedAt: body.status === 'APPROVED' || body.status === 'REJECTED' ? new Date() : null,
      },
    })

    // Update permit status if all approvals are complete
    if (body.status === 'APPROVED') {
      const allApprovals = await prisma.permitApproval.findMany({
        where: { permitId: id },
      })

      // If internal approval (level 1) is done, update permit to APPROVED
      if (body.level === 1) {
        await prisma.permit.update({
          where: { id },
          data: { 
            status: 'APPROVED',
            approvedBy: body.approverName,
          },
        })
      }

      // If client approval (level 2) is done, permit can be made ACTIVE
      if (body.level === 2) {
        await prisma.permit.update({
          where: { id },
          data: { 
            clientApprover: body.approverName,
          },
        })
      }
    }

    return NextResponse.json(approval, { status: 201 })
  } catch (error) {
    console.error('Error creating permit approval:', error)
    return NextResponse.json({ error: 'Failed to create approval' }, { status: 500 })
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const approvals = await prisma.permitApproval.findMany({
      where: { permitId: id },
      orderBy: { level: 'asc' },
    })

    return NextResponse.json(approvals)
  } catch (error) {
    console.error('Error fetching permit approvals:', error)
    return NextResponse.json({ error: 'Failed to fetch approvals' }, { status: 500 })
  }
}

