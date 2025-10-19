import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const surveillance = await prisma.healthSurveillance.update({
      where: { id },
      data: {
        userId: body.userId,
        exposureType: body.exposureType,
        exposureLevel: body.exposureLevel || null,
        monitoringFreq: body.monitoringFreq || null,
        lastTest: body.lastTest ? new Date(body.lastTest) : null,
        nextTest: body.nextTest ? new Date(body.nextTest) : null,
        results: body.results || null,
        restrictions: body.restrictions || null,
        status: body.status,
      },
    })

    return NextResponse.json(surveillance)
  } catch (error) {
    console.error('Error updating health surveillance:', error)
    return NextResponse.json({ error: 'Failed to update health surveillance' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.healthSurveillance.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting health surveillance:', error)
    return NextResponse.json({ error: 'Failed to delete health surveillance' }, { status: 500 })
  }
}

