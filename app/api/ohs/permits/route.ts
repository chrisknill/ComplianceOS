import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const permits = await prisma.permit.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(permits)
  } catch (error) {
    console.error('Error fetching permits:', error)
    return NextResponse.json({ error: 'Failed to fetch permits' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const permit = await prisma.permit.create({
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
        status: body.status || 'PENDING',
        hazards: body.hazards || null,
        controlMeasures: body.controlMeasures || null,
      },
    })

    return NextResponse.json(permit, { status: 201 })
  } catch (error) {
    console.error('Error creating permit:', error)
    return NextResponse.json({ error: 'Failed to create permit' }, { status: 500 })
  }
}

