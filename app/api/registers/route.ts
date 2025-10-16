import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await prisma.registerEntry.findMany({
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(entries)
}

// POST - Create new register entry
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, title, details, owner, status, date } = body

    const entry = await prisma.registerEntry.create({
      data: {
        type,
        title,
        details,
        owner,
        status,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('Error creating register entry:', error)
    return NextResponse.json(
      { error: 'Failed to create register entry' },
      { status: 500 }
    )
  }
}

