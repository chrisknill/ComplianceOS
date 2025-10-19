import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  try {
    const { id, actionId } = await params
    const body = await req.json()
    
    // Update the action
    const action = await prisma.nCAction.update({
      where: { id: actionId },
      data: {
        ...body,
        completedDate: body.status === 'DONE' ? new Date() : null,
        updatedAt: new Date(),
      },
    })

    // Update linked global action if exists
    if (action.globalActionId) {
      await prisma.action.update({
        where: { id: action.globalActionId },
        data: {
          status: body.status === 'DONE' ? 'COMPLETED' : body.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'OPEN',
        },
      })
    }

    // Check if all actions are now complete for auto-closure
    const allActions = await prisma.nCAction.findMany({
      where: { ncId: id },
    })

    const allComplete = allActions.every(a => a.status === 'DONE')

    if (allComplete) {
      // Get the NC record
      const nc = await prisma.nonConformance.findUnique({
        where: { id },
      })

      // Auto-update status to pending verification if not already closed
      if (nc && nc.status !== 'CLOSED') {
        await prisma.nonConformance.update({
          where: { id },
          data: {
            status: 'PENDING_VERIFICATION',
          },
        })

        // Create audit log
        await prisma.nCAuditLog.create({
          data: {
            ncId: id,
            eventType: 'STATUS_CHANGE',
            description: `All actions completed - status changed to Pending Verification`,
            userId: 'System',
            userName: 'System',
          },
        })
      }
    }

    return NextResponse.json(action)
  } catch (error) {
    console.error('Error updating action:', error)
    return NextResponse.json({ error: 'Failed to update action' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; actionId: string }> }
) {
  try {
    const { id, actionId } = await params
    // Get the action to find linked global action
    const action = await prisma.nCAction.findUnique({
      where: { id: actionId },
    })

    // Delete linked global action if exists
    if (action?.globalActionId) {
      await prisma.action.delete({
        where: { id: action.globalActionId },
      })
    }

    // Delete the NC action
    await prisma.nCAction.delete({
      where: { id: actionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting action:', error)
    return NextResponse.json({ error: 'Failed to delete action' }, { status: 500 })
  }
}

