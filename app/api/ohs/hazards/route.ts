import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const hazards = await prisma.oHSHazard.findMany({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json(hazards)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const created = await prisma.oHSHazard.create({
    data: {
      title: body.title,
      area: body.area,
      description: body.description,
      likelihood: body.likelihood,
      severity: body.severity,
      residualL: body.residualL ?? null,
      residualS: body.residualS ?? null,
      controls: JSON.stringify(body.controls ?? []),
      owner: body.owner ?? null,
      reviewDate: body.reviewDate ? new Date(body.reviewDate) : null,
      status: body.status ?? 'OPEN',
      isoRefs: JSON.stringify(body.isoRefs ?? []),
    },
  })
  return NextResponse.json(created)
}


