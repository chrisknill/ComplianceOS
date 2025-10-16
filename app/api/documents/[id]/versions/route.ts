import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch version history for a document
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const versions = await prisma.documentVersion.findMany({
      where: { documentId: params.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(versions)
  } catch (error) {
    console.error('Error fetching versions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    )
  }
}

// POST - Create a new version record
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { version, changes, changedBy, approvedBy } = body

    const versionRecord = await prisma.documentVersion.create({
      data: {
        documentId: params.id,
        version,
        changes,
        changedBy,
        approvedBy,
        approvedAt: approvedBy ? new Date() : null,
      },
    })

    return NextResponse.json(versionRecord)
  } catch (error) {
    console.error('Error creating version:', error)
    return NextResponse.json(
      { error: 'Failed to create version record' },
      { status: 500 }
    )
  }
}

