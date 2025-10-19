import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Check out document (lock for editing)
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
    const document = await prisma.document.findUnique({
      where: { id },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // In production, call Microsoft Graph API to check out the document
    // const token = await getMicrosoftGraphToken(config)
    // await checkOutDocument(token, document.driveId!, document.sharepointId!)

    // Update document with checkout info
    await prisma.document.update({
      where: { id },
      data: {
        lastEditedBy: session.user?.email || 'Unknown',
        lastEditedAt: new Date(),
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Document checked out',
      checkedOutBy: session.user?.email 
    })
  } catch (error) {
    console.error('Error checking out document:', error)
    return NextResponse.json(
      { error: 'Failed to check out document' },
      { status: 500 }
    )
  }
}

