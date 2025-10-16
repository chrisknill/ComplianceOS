import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contractors = await prisma.contractor.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(contractors)
  } catch (error) {
    console.error('Error fetching contractors:', error)
    return NextResponse.json({ error: 'Failed to fetch contractors' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const contractor = await prisma.contractor.create({
      data: {
        name: body.name,
        contact: body.contact || null,
        email: body.email || null,
        phone: body.phone || null,
        services: body.services || null,
        preQualified: body.preQualified || false,
        preQualDate: body.preQualDate ? new Date(body.preQualDate) : null,
        preQualExpiry: body.preQualExpiry ? new Date(body.preQualExpiry) : null,
        inductionStatus: body.inductionStatus || 'PENDING',
        inductionDate: body.inductionDate ? new Date(body.inductionDate) : null,
        safetyRating: body.safetyRating || null,
        lastEvaluation: body.lastEvaluation ? new Date(body.lastEvaluation) : null,
        status: body.status || 'ACTIVE',
        isoRefs: JSON.stringify(['45001:8.1.4.2', '45001:8.1.4.3']),
      },
    })

    return NextResponse.json(contractor, { status: 201 })
  } catch (error) {
    console.error('Error creating contractor:', error)
    return NextResponse.json({ error: 'Failed to create contractor' }, { status: 500 })
  }
}

