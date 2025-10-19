import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateWasteTypeSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.enum(['HAZARDOUS', 'NON_HAZARDOUS', 'RECYCLABLE', 'ORGANIC', 'ELECTRONIC']).optional(),
  hazardClass: z.string().optional(),
  disposalMethod: z.enum(['LANDFILL', 'INCINERATION', 'RECYCLING', 'COMPOSTING', 'TREATMENT']).optional(),
  regulatoryCode: z.string().optional(),
  isActive: z.boolean().optional(),
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
    const wasteType = await prisma.wasteType.findUnique({
      where: { id },
      include: {
        wasteRecords: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!wasteType) {
      return NextResponse.json({ error: 'Waste type not found' }, { status: 404 })
    }

    return NextResponse.json(wasteType)
  } catch (error) {
    console.error('Error fetching waste type:', error)
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
    const validatedData = updateWasteTypeSchema.parse(body)

    const wasteType = await prisma.wasteType.update({
      where: { id },
      data: validatedData,
    })

    return NextResponse.json(wasteType)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating waste type:', error)
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
    // Check if waste type has associated records
    const wasteRecords = await prisma.wasteRecord.count({
      where: { wasteTypeId: id },
    })

    if (wasteRecords > 0) {
      return NextResponse.json(
        { error: 'Cannot delete waste type with associated records' },
        { status: 400 }
      )
    }

    await prisma.wasteType.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting waste type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
