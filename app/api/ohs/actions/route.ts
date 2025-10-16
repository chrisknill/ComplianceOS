import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const actions = await prisma.action.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(actions)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const created = await prisma.action.create({
    data: {
      type: body.type,
      title: body.title,
      details: body.details ?? null,
      owner: body.owner ?? null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      status: body.status ?? 'OPEN',
    },
  })
  return NextResponse.json(created)
}

