import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const body = await req.json()
    
    // Generate reference number
    const year = new Date().getFullYear()
    const prefix = body.caseType
    const count = await prisma.nonConformance.count({
      where: {
        refNumber: {
          startsWith: `${prefix}-${year}-`
        }
      }
    })
    const refNumber = `${prefix}-${year}-${String(count + 1).padStart(4, '0')}`
    
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
        owner: body.owner || body.raisedBy,
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

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('Error creating non-conformance:', error)
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 })
  }
}

