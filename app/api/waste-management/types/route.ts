import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createWasteTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['HAZARDOUS', 'NON_HAZARDOUS', 'RECYCLABLE', 'ORGANIC', 'ELECTRONIC']),
  hazardClass: z.string().optional(),
  disposalMethod: z.enum(['LANDFILL', 'INCINERATION', 'RECYCLING', 'COMPOSTING', 'TREATMENT']).optional(),
  regulatoryCode: z.string().optional(),
})

const updateWasteTypeSchema = createWasteTypeSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (category) where.category = category
    if (isActive !== null) where.isActive = isActive === 'true'

    const wasteTypes = await prisma.wasteType.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(wasteTypes)
  } catch (error) {
    console.error('Error fetching waste types:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createWasteTypeSchema.parse(body)

    const wasteType = await prisma.wasteType.create({
      data: validatedData,
    })

    return NextResponse.json(wasteType, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating waste type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
