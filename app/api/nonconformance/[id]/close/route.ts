import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    // Check if all actions are completed
    const actions = await prisma.nCAction.findMany({
      where: { ncId: params.id },
    })

    const allActionsComplete = actions.every(action => action.status === 'DONE')

    if (!allActionsComplete) {
      return NextResponse.json(
        { error: 'Cannot close: Not all actions are completed' },
        { status: 400 }
      )
    }

    // Update the non-conformance to closed
    const record = await prisma.nonConformance.update({
      where: { id: params.id },
      data: {
        status: 'CLOSED',
        closedDate: new Date(),
        closureSignature: body.signature || null,
        closureApprovedBy: body.approvedBy || null,
        closureApprovedAt: new Date(),
        closureComments: body.comments || null,
      },
    })

    // Create audit log
    await prisma.nCAuditLog.create({
      data: {
        ncId: record.id,
        eventType: 'CLOSED',
        description: `Case ${record.refNumber} closed`,
        userId: body.approvedBy || 'System',
        userName: body.approvedBy || 'System',
        metadata: JSON.stringify({
          closureComments: body.comments,
          totalActions: actions.length,
        }),
      },
    })

    // Update linked global actions
    for (const action of actions) {
      if (action.globalActionId) {
        await prisma.action.update({
          where: { id: action.globalActionId },
          data: { status: 'COMPLETED' },
        })
      }
    }

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error closing non-conformance:', error)
    return NextResponse.json({ error: 'Failed to close record' }, { status: 500 })
  }
}

