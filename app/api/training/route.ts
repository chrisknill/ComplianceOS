import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [users, courses, records] = await Promise.all([
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
    prisma.course.findMany({ orderBy: { code: 'asc' } }),
    prisma.trainingRecord.findMany({
      include: { user: true, course: true },
    }),
  ])

  return NextResponse.json({ users, courses, records })
}

// POST - Create new training record
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { userId, courseId, status, dueDate, completed, score, documentUrl, documentName, notes } = body

    // Check if record already exists
    const existing = await prisma.trainingRecord.findFirst({
      where: {
        userId,
        courseId,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Training record already exists for this user and course' },
        { status: 400 }
      )
    }

    const record = await prisma.trainingRecord.create({
      data: {
        userId,
        courseId,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: completed ? new Date(completed) : null,
        score: score ? parseInt(score) : null,
        documentUrl: documentUrl || null,
        documentName: documentName || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('Error creating training record:', error)
    return NextResponse.json(
      { error: 'Failed to create training record' },
      { status: 500 }
    )
  }
}

