import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ActionNotificationService } from '@/lib/action-notifications'

export async function GET() {
  try {
    const records = await prisma.nonConformance.findMany({
      orderBy: { dateRaised: 'desc' },
      include: {
        actions: true,
      },
    })
    return NextResponse.json(records)
  } catch (error) {
    console.error('Error fetching non-conformances:', error)
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    
    // Get assigned employee details
    let assignedEmployee = null
    if (body.assignedTo) {
      assignedEmployee = await prisma.user.findUnique({
        where: { id: body.assignedTo },
        select: { id: true, name: true, email: true, jobTitle: true, department: true }
      })
      
      if (!assignedEmployee) {
        console.error('Assigned employee not found:', body.assignedTo)
        return NextResponse.json({ error: 'Assigned employee not found' }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'No employee assigned to this case' }, { status: 400 })
    }
    
    // Generate reference number with MET prefix
    const year = new Date().getFullYear()
    const prefix = 'MET' // Use MET as default prefix for server-side
    const caseType = body.caseType
    const count = await prisma.nonConformance.count({
      where: {
        refNumber: {
          startsWith: `${prefix}-${caseType}-${year}-`
        }
      }
    })
    const refNumber = `${prefix}-${caseType}-${year}-${String(count + 1).padStart(3, '0')}`
    
    // Auto-assign owner and due date based on severity
    let dueDate = new Date()
    switch (body.severity) {
      case 'CRITICAL':
        dueDate.setDate(dueDate.getDate() + 5)
        break
      case 'HIGH':
        dueDate.setDate(dueDate.getDate() + 10)
        break
      case 'MEDIUM':
        dueDate.setDate(dueDate.getDate() + 15)
        break
      case 'LOW':
        dueDate.setDate(dueDate.getDate() + 20)
        break
    }
    
    const record = await prisma.nonConformance.create({
      data: {
        refNumber,
        caseType: body.caseType,
        title: body.title,
        raisedBy: body.raisedBy,
        process: body.process || null,
        area: body.area || null,
        department: body.department || null,
        category: body.category,
        severity: body.severity || 'MEDIUM',
        riskImpact: body.riskImpact || '[]',
        evidence: body.evidence || null,
        linkedItems: body.linkedItems || null,
        problemStatement: body.problemStatement,
        owner: assignedEmployee ? assignedEmployee.name : (body.owner || body.raisedBy),
        approver: body.approver || 'Quality Manager',
        dueDate,
        
        // Conditional fields
        customerName: body.customerName || null,
        customerContact: body.customerContact || null,
        complaintChannel: body.complaintChannel || null,
        complaintDate: body.complaintDate ? new Date(body.complaintDate) : null,
        externalRef: body.externalRef || null,
        contractualImpact: body.contractualImpact || false,
        responseDueDate: body.responseDueDate ? new Date(body.responseDueDate) : null,
        
        supplierName: body.supplierName || null,
        supplierContact: body.supplierContact || null,
        poReference: body.poReference || null,
        warrantyClause: body.warrantyClause || null,
        request8D: body.request8D || false,
        
        detectionPoint: body.detectionPoint || null,
        scrapRework: body.scrapRework || false,
        containmentNeeded: body.containmentNeeded || false,
        
        expectedBenefit: body.expectedBenefit || null,
        effortEstimate: body.effortEstimate || null,
        suggestedOwner: body.suggestedOwner || null,
      },
    })

    // Auto-create containment action if needed
    if (body.containmentNeeded && body.caseType === 'NC') {
      const containmentAction = await prisma.nCAction.create({
        data: {
          ncId: record.id,
          actionType: 'CONTAINMENT',
          title: 'Implement immediate containment measures',
          description: 'Isolate affected products/processes and prevent further non-conforming output',
          owner: record.owner,
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          priority: 'HIGH',
          status: 'OPEN',
        },
      })

      // Create global action link
      const globalAction = await prisma.action.create({
        data: {
          type: 'CORRECTIVE',
          title: `${refNumber}: Implement immediate containment measures`,
          details: `Linked to ${refNumber} - ${record.title}`,
          owner: record.owner,
          dueDate: containmentAction.dueDate,
          status: 'OPEN',
        },
      })

      // Link back to global action
      await prisma.nCAction.update({
        where: { id: containmentAction.id },
        data: { globalActionId: globalAction.id },
      })
    }

    // Create audit log
    await prisma.nCAuditLog.create({
      data: {
        ncId: record.id,
        eventType: 'CREATED',
        description: `Case ${refNumber} created`,
        userId: body.raisedBy,
        userName: body.raisedBy,
      },
    })

    // Send action assignment notification via centralized service
    if (assignedEmployee && assignedEmployee.email) {
      try {
        const notificationService = new ActionNotificationService()
        
        const actionData = ActionNotificationService.createNonConformanceAction(
          refNumber,
          body.title,
          body.caseType,
          body.severity,
          dueDate,
          {
            name: assignedEmployee.name,
            email: assignedEmployee.email,
            teamsUserId: null
          },
          {
            name: body.raisedBy,
            email: 'christopher.knill@gmail.com'
          },
          body.problemStatement,
          `${process.env.NEXTAUTH_URL}/nonconformance?tab=${body.caseType}&id=${record.id}`
        )

        const result = await notificationService.assignAction(actionData)
        
        if (!result.success) {
          console.error('Failed to send action assignment notification:', result.message)
          // Don't fail the request if notification fails - just log it
        } else {
          console.log('Action assignment notification sent successfully')
        }
      } catch (notificationError) {
        console.error('Failed to send action assignment notification:', notificationError)
        // Don't fail the request if notification fails - just log it
      }
    }

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Error creating non-conformance:', error)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }
}

