import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MicrosoftGraphService, MicrosoftAuthProvider, DEFAULT_GROUPS, GROUP_DESCRIPTIONS } from '@/lib/microsoft-graph'

// Initialize Microsoft Graph service
let graphService: MicrosoftGraphService | null = null

// Get Microsoft Graph service instance
async function getGraphService(): Promise<MicrosoftGraphService> {
  if (!graphService) {
    const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
    if (!accessToken) {
      throw new Error('Microsoft Graph access token not configured')
    }
    graphService = new MicrosoftGraphService(accessToken)
  }
  return graphService
}

// Get Microsoft Auth Provider
function getAuthProvider(): MicrosoftAuthProvider {
  return new MicrosoftAuthProvider({
    clientId: process.env.MICROSOFT_CLIENT_ID!,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    tenantId: process.env.MICROSOFT_TENANT_ID!,
    redirectUri: process.env.MICROSOFT_REDIRECT_URI!
  })
}

// GET /api/microsoft-graph/groups - Get all groups from Outlook
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const graphService = await getGraphService()
    const groups = await graphService.getDistributionGroups()
    
    return NextResponse.json({ groups })
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 })
  }
}

// POST /api/microsoft-graph/groups - Create a new group
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, type } = body

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
    }

    const graphService = await getGraphService()
    
    const groupData = {
      displayName: name,
      description: description || GROUP_DESCRIPTIONS[name as keyof typeof GROUP_DESCRIPTIONS] || '',
      mailNickname: name.toLowerCase().replace(/\s+/g, '-'),
      mailEnabled: true,
      securityEnabled: type === 'security'
    }

    const group = await graphService.createDistributionGroup(groupData)
    
    return NextResponse.json({ group })
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 })
  }
}

// PUT /api/microsoft-graph/groups/[id] - Update group
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const graphService = await getGraphService()
    const group = await graphService.updateGroup(id, body)
    
    return NextResponse.json({ group })
  } catch (error) {
    console.error('Error updating group:', error)
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 })
  }
}

// DELETE /api/microsoft-graph/groups/[id] - Delete group
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const graphService = await getGraphService()
    await graphService.deleteGroup(id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting group:', error)
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 })
  }
}

