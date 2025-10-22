import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { MicrosoftGraphService } from '@/lib/microsoft-graph'

// Test endpoint to verify Microsoft Graph integration
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ 
        error: 'Microsoft Graph not configured',
        message: 'Please set MICROSOFT_GRAPH_ACCESS_TOKEN in your environment variables'
      }, { status: 500 })
    }

    const graphService = new MicrosoftGraphService(accessToken)
    
    // Test basic connectivity
    const groups = await graphService.getDistributionGroups()
    
    return NextResponse.json({
      success: true,
      message: 'Microsoft Graph integration is working',
      groupsCount: groups.length,
      sampleGroups: groups.slice(0, 3).map(g => ({
        id: g.id,
        name: g.displayName,
        email: g.mail
      }))
    })
  } catch (error) {
    console.error('Microsoft Graph test error:', error)
    return NextResponse.json({ 
      error: 'Microsoft Graph test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Test endpoint to create a test group
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { groupName } = body

    if (!groupName) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 })
    }

    const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: 'Microsoft Graph not configured' }, { status: 500 })
    }

    const graphService = new MicrosoftGraphService(accessToken)
    
    const group = await graphService.createDistributionGroup({
      displayName: groupName,
      description: `Test group created by ComplianceOS: ${groupName}`,
      mailNickname: groupName.toLowerCase().replace(/\s+/g, '-'),
      mailEnabled: true,
      securityEnabled: false
    })
    
    return NextResponse.json({
      success: true,
      message: 'Test group created successfully',
      group: {
        id: group.id,
        name: group.displayName,
        email: group.mail
      }
    })
  } catch (error) {
    console.error('Error creating test group:', error)
    return NextResponse.json({ 
      error: 'Failed to create test group',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

