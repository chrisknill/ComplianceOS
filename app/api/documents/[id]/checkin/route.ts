import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Check in document (unlock and save)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { comment } = body

    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // In production, call Microsoft Graph API to check in the document
    // const token = await getMicrosoftGraphToken(config)
    // await checkInDocument(token, document.driveId!, document.sharepointId!, comment)

    // Create version record
    await prisma.documentVersion.create({
      data: {
        documentId: id,
        version: document.version,
        changes: comment || 'Document updated',
        changedBy: session.user?.email || 'Unknown',
      },
    })

    // Update document
    await prisma.document.update({
      where: { id },
      data: {
        lastEditedBy: session.user?.email || 'Unknown',
        lastEditedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Document checked in',
      comment 
    })
  } catch (error) {
    console.error('Error checking in document:', error)
    return NextResponse.json(
      { error: 'Failed to check in document' },
      { status: 500 }
    )
  }
}

