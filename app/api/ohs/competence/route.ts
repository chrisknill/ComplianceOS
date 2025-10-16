import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const competences = await prisma.oHSCompetence.findMany({
      orderBy: { userId: 'asc' },
    })
    return NextResponse.json(competences)
  } catch (error) {
    console.error('Error fetching competences:', error)
    return NextResponse.json({ error: 'Failed to fetch competences' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const competence = await prisma.oHSCompetence.create({
      data: {
        userId: body.userId,
        role: body.role,
        requiredPPE: JSON.stringify(body.requiredPPE || []),
        training: JSON.stringify(body.training || []),
        medicalFit: body.medicalFit !== undefined ? body.medicalFit : true,
        medicalDate: body.medicalDate ? new Date(body.medicalDate) : null,
        medicalExpiry: body.medicalExpiry ? new Date(body.medicalExpiry) : null,
        authorized: JSON.stringify(body.authorized || []),
        restrictions: body.restrictions || null,
        isoRefs: JSON.stringify(['45001:7.2', '45001:7.3']),
      },
    })

    return NextResponse.json(competence, { status: 201 })
  } catch (error) {
    console.error('Error creating competence:', error)
    return NextResponse.json({ error: 'Failed to create competence' }, { status: 500 })
  }
}

