import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createAuditTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.enum(['INTERNAL', 'EXTERNAL', 'SUPPLIER', 'CUSTOMER', 'REGULATORY']),
  frequency: z.enum(['ANNUAL', 'BI_ANNUAL', 'QUARTERLY', 'MONTHLY', 'AD_HOC']),
  standard: z.string().optional(),
})

const updateAuditTypeSchema = createAuditTypeSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const frequency = searchParams.get('frequency')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (category) where.category = category
    if (frequency) where.frequency = frequency
    if (isActive !== null) where.isActive = isActive === 'true'

    const auditTypes = await prisma.auditType.findMany({
      where,
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(auditTypes)
  } catch (error) {
    console.error('Error fetching audit types:', error)
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
    const validatedData = createAuditTypeSchema.parse(body)

    const auditType = await prisma.auditType.create({
      data: validatedData,
    })

    return NextResponse.json(auditType, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating audit type:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
