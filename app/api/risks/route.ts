import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const risks = await prisma.risk.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(risks)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const risk = await prisma.risk.create({
    data: {
      title: body.title,
      context: body.context,
      likelihood: body.likelihood,
      severity: body.severity,
      controls: JSON.stringify(body.controls || []),
      owner: body.owner,
      reviewDate: body.reviewDate ? new Date(body.reviewDate) : null,
      status: body.status || 'OPEN',
      isoRefs: JSON.stringify(body.isoRefs || []),
    },
  })

  return NextResponse.json(risk)
}

