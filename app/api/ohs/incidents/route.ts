import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const incidents = await prisma.incident.findMany({
    orderBy: { date: 'desc' },
    include: { investigation: true, actions: true },
  })
  return NextResponse.json(incidents)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const created = await prisma.incident.create({
    data: {
      ref: body.ref ?? null,
      type: body.type,
      date: new Date(body.date),
      location: body.location ?? null,
      description: body.description ?? null,
      people: JSON.stringify(body.people ?? []),
      severityType: body.severityType,
      lostTimeDays: body.lostTimeDays ?? null,
      hoursWorked: body.hoursWorked ?? null,
      immediateActions: body.immediateActions ?? null,
      status: body.status ?? 'OPEN',
      isoRefs: JSON.stringify(body.isoRefs ?? []),
    },
  })
  return NextResponse.json(created)
}


