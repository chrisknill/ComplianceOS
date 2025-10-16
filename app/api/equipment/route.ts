import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const equipment = await prisma.equipment.findMany({
    include: {
      calibrations: {
        orderBy: { dueDate: 'desc' },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(equipment)
}

