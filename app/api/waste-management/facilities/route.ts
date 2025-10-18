import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createFacilitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  facilityType: z.enum(['LANDFILL', 'INCINERATION', 'RECYCLING', 'TREATMENT', 'COMPOSTING']),
  address: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().datetime().optional(),
  acceptedWasteTypes: z.string().optional(), // JSON array
})

const updateFacilitySchema = createFacilitySchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const facilityType = searchParams.get('facilityType')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (facilityType) where.facilityType = facilityType
    if (isActive !== null) where.isActive = isActive === 'true'

    const facilities = await prisma.wasteDisposalFacility.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(facilities)
  } catch (error) {
    console.error('Error fetching facilities:', error)
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
    const validatedData = createFacilitySchema.parse(body)

    const facility = await prisma.wasteDisposalFacility.create({
      data: {
        ...validatedData,
        licenseExpiry: validatedData.licenseExpiry ? new Date(validatedData.licenseExpiry) : null,
      },
    })

    return NextResponse.json(facility, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating facility:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
