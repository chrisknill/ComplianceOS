import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTransporterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  licenseNumber: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  address: z.string().optional(),
  licenseExpiry: z.string().datetime().optional(),
})

const updateTransporterSchema = createTransporterSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (isActive !== null) where.isActive = isActive === 'true'

    const transporters = await prisma.wasteTransporter.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(transporters)
  } catch (error) {
    console.error('Error fetching transporters:', error)
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
    const validatedData = createTransporterSchema.parse(body)

    const transporter = await prisma.wasteTransporter.create({
      data: {
        ...validatedData,
        licenseExpiry: validatedData.licenseExpiry ? new Date(validatedData.licenseExpiry) : null,
      },
    })

    return NextResponse.json(transporter, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating transporter:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
