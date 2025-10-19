import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const permit = await prisma.permit.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        location: body.location || null,
        contractor: body.contractor || null,
        issuedBy: body.issuedBy || null,
        approvedBy: body.approvedBy || null,
        clientApprover: body.clientApprover || null,
        validFrom: new Date(body.validFrom),
        validUntil: new Date(body.validUntil),
        status: body.status,
        hazards: body.hazards || null,
        controlMeasures: body.controlMeasures || null,
      },
    })

    return NextResponse.json(permit)
  } catch (error) {
    console.error('Error updating permit:', error)
    return NextResponse.json({ error: 'Failed to update permit' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.permit.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting permit:', error)
    return NextResponse.json({ error: 'Failed to delete permit' }, { status: 500 })
  }
}

