import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateWasteRecordSchema = z.object({
  wasteTypeId: z.string().min(1).optional(),
  quantity: z.number().positive().optional(),
  unit: z.enum(['KG', 'LITERS', 'CUBIC_METERS', 'PIECES']).optional(),
  location: z.string().min(1).optional(),
  generatedBy: z.string().min(1).optional(),
  generatedDate: z.string().datetime().optional(),
  storedDate: z.string().datetime().optional(),
  disposalDate: z.string().datetime().optional(),
  disposalMethod: z.enum(['LANDFILL', 'INCINERATION', 'RECYCLING', 'COMPOSTING', 'TREATMENT']).optional(),
  disposalFacility: z.string().optional(),
  transporter: z.string().optional(),
  manifestNumber: z.string().optional(),
  cost: z.number().positive().optional(),
  status: z.enum(['GENERATED', 'STORED', 'IN_TRANSIT', 'DISPOSED']).optional(),
  notes: z.string().optional(),
  attachments: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const wasteRecord = await prisma.wasteRecord.findUnique({
      where: { id },
      include: {
        wasteType: true,
        logs: {
          orderBy: { timestamp: 'desc' },
        },
      },
    })

    if (!wasteRecord) {
      return NextResponse.json({ error: 'Waste record not found' }, { status: 404 })
    }

    return NextResponse.json(wasteRecord)
  } catch (error) {
    console.error('Error fetching waste record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = updateWasteRecordSchema.parse(body)

    // Get current record to compare status changes
    const currentRecord = await prisma.wasteRecord.findUnique({
      where: { id },
    })

    if (!currentRecord) {
      return NextResponse.json({ error: 'Waste record not found' }, { status: 404 })
    }

    const wasteRecord = await prisma.wasteRecord.update({
      where: { id },
      data: {
        ...validatedData,
        generatedDate: validatedData.generatedDate ? new Date(validatedData.generatedDate) : undefined,
        storedDate: validatedData.storedDate ? new Date(validatedData.storedDate) : undefined,
        disposalDate: validatedData.disposalDate ? new Date(validatedData.disposalDate) : undefined,
      },
      include: {
        wasteType: true,
      },
    })

    // Log status changes
    if (validatedData.status && validatedData.status !== currentRecord.status) {
      await prisma.wasteRecordLog.create({
        data: {
          wasteRecordId: id,
          action: validatedData.status,
          performedBy: session.user.id,
          comments: `Status changed from ${currentRecord.status} to ${validatedData.status}`,
        },
      })
    }

    return NextResponse.json(wasteRecord)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating waste record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.wasteRecord.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting waste record:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
