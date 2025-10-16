import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const drills = await prisma.emergencyDrill.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(drills)
  } catch (error) {
    console.error('Error fetching emergency drills:', error)
    return NextResponse.json({ error: 'Failed to fetch emergency drills' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const drill = await prisma.emergencyDrill.create({
      data: {
        type: body.type,
        date: new Date(body.date),
        location: body.location || null,
        participants: body.participants || null,
        duration: body.duration || null,
        scenarioDesc: body.scenarioDesc || null,
        observations: body.observations || null,
        effectiveness: body.effectiveness || null,
        improvements: JSON.stringify(body.improvements || []),
        nextDrill: body.nextDrill ? new Date(body.nextDrill) : null,
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    })

    return NextResponse.json(drill, { status: 201 })
  } catch (error) {
    console.error('Error creating emergency drill:', error)
    return NextResponse.json({ error: 'Failed to create emergency drill' }, { status: 500 })
  }
}

