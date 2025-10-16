import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const documents = await prisma.document.findMany({
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(documents)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  
  const document = await prisma.document.create({
    data: {
      type: body.type,
      title: body.title,
      code: body.code,
      version: body.version || '1.0',
      status: body.status || 'DRAFT',
      owner: body.owner,
      nextReview: body.nextReview ? new Date(body.nextReview) : null,
      isoClauses: JSON.stringify(body.isoClauses || []),
      url: body.url,
    },
  })

  return NextResponse.json(document)
}

