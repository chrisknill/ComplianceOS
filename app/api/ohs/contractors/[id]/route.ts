import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const contractor = await prisma.contractor.update({
      where: { id },
      data: {
        name: body.name,
        contact: body.contact || null,
        email: body.email || null,
        phone: body.phone || null,
        services: body.services || null,
        preQualified: body.preQualified,
        preQualDate: body.preQualDate ? new Date(body.preQualDate) : null,
        preQualExpiry: body.preQualExpiry ? new Date(body.preQualExpiry) : null,
        inductionStatus: body.inductionStatus,
        inductionDate: body.inductionDate ? new Date(body.inductionDate) : null,
        safetyRating: body.safetyRating || null,
        lastEvaluation: body.lastEvaluation ? new Date(body.lastEvaluation) : null,
        status: body.status,
      },
    })

    return NextResponse.json(contractor)
  } catch (error) {
    console.error('Error updating contractor:', error)
    return NextResponse.json({ error: 'Failed to update contractor' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.contractor.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contractor:', error)
    return NextResponse.json({ error: 'Failed to delete contractor' }, { status: 500 })
  }
}

