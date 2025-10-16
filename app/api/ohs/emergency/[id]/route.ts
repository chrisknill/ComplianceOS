import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    
    const drill = await prisma.emergencyDrill.update({
      where: { id: params.id },
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
      },
    })

    return NextResponse.json(drill)
  } catch (error) {
    console.error('Error updating emergency drill:', error)
    return NextResponse.json({ error: 'Failed to update emergency drill' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.emergencyDrill.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting emergency drill:', error)
    return NextResponse.json({ error: 'Failed to delete emergency drill' }, { status: 500 })
  }
}

