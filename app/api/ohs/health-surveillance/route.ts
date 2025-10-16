import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const surveillances = await prisma.healthSurveillance.findMany({
      orderBy: { userId: 'asc' },
    })
    return NextResponse.json(surveillances)
  } catch (error) {
    console.error('Error fetching health surveillances:', error)
    return NextResponse.json({ error: 'Failed to fetch health surveillances' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const surveillance = await prisma.healthSurveillance.create({
      data: {
        userId: body.userId,
        exposureType: body.exposureType,
        exposureLevel: body.exposureLevel || null,
        monitoringFreq: body.monitoringFreq || null,
        lastTest: body.lastTest ? new Date(body.lastTest) : null,
        nextTest: body.nextTest ? new Date(body.nextTest) : null,
        results: body.results || null,
        restrictions: body.restrictions || null,
        status: body.status || 'COMPLIANT',
        isoRefs: JSON.stringify(['45001:6.1.2.4', '45001:8.1.2']),
      },
    })

    return NextResponse.json(surveillance, { status: 201 })
  } catch (error) {
    console.error('Error creating health surveillance:', error)
    return NextResponse.json({ error: 'Failed to create health surveillance' }, { status: 500 })
  }
}

