import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const competence = await prisma.oHSCompetence.update({
      where: { id },
      data: {
        userId: body.userId,
        role: body.role,
        requiredPPE: JSON.stringify(body.requiredPPE || []),
        training: JSON.stringify(body.training || []),
        medicalFit: body.medicalFit,
        medicalDate: body.medicalDate ? new Date(body.medicalDate) : null,
        medicalExpiry: body.medicalExpiry ? new Date(body.medicalExpiry) : null,
        authorized: JSON.stringify(body.authorized || []),
        restrictions: body.restrictions || null,
      },
    })

    return NextResponse.json(competence)
  } catch (error) {
    console.error('Error updating competence:', error)
    return NextResponse.json({ error: 'Failed to update competence' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.oHSCompetence.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting competence:', error)
    return NextResponse.json({ error: 'Failed to delete competence' }, { status: 500 })
  }
}

