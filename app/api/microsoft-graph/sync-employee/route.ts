import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MicrosoftGraphService } from '@/lib/microsoft-graph'
import { prisma } from '@/lib/prisma'

// POST /api/microsoft-graph/sync-employee - Sync employee groups with Outlook
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { employeeId, groups } = body

    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 })
    }

    // Get employee from database
    const employee = await prisma.user.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Initialize Microsoft Graph service
    const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: 'Microsoft Graph not configured' }, { status: 500 })
    }

    const graphService = new MicrosoftGraphService(accessToken)

    // Sync groups with Outlook
    await graphService.syncEmployeeGroups(employeeId, groups || [])

    // Update employee groups in database
    await prisma.user.update({
      where: { id: employeeId },
      data: { groups: groups || [] }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Employee groups synced successfully' 
    })
  } catch (error) {
    console.error('Error syncing employee groups:', error)
    return NextResponse.json({ error: 'Failed to sync employee groups' }, { status: 500 })
  }
}

// GET /api/microsoft-graph/sync-employee/[id] - Get employee's current groups from Outlook
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Initialize Microsoft Graph service
    const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: 'Microsoft Graph not configured' }, { status: 500 })
    }

    const graphService = new MicrosoftGraphService(accessToken)

    // Get employee's current groups from Outlook
    const groups = await graphService.getGroupMembers(id)

    return NextResponse.json({ groups })
  } catch (error) {
    console.error('Error fetching employee groups:', error)
    return NextResponse.json({ error: 'Failed to fetch employee groups' }, { status: 500 })
  }
}

