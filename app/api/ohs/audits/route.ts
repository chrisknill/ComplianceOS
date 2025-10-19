import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const audits = await prisma.oHSAudit.findMany({
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(audits)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type, title, auditor, date, location, scope, status, findings } = body

    const audit = await prisma.oHSAudit.create({
      data: {
        type,
        title,
        auditor,
        date: date ? new Date(date) : new Date(),
        location,
        scope,
        status,
        findings,
        isoRefs: '[]', // Default empty JSON array
      },
    })

    return NextResponse.json(audit)
  } catch (error) {
    console.error('Error creating audit:', error)
    return NextResponse.json(
      { error: 'Failed to create audit' },
      { status: 500 }
    )
  }
}

