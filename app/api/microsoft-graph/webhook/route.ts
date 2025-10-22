import { NextRequest, NextResponse } from 'next/server'
import { OutlookWebhookHandler } from '@/lib/microsoft-graph'
import { prisma } from '@/lib/prisma'

// POST /api/microsoft-graph/webhook - Handle Outlook webhook notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature if needed
    const validationToken = request.headers.get('validation-token')
    if (validationToken) {
      return new NextResponse(validationToken, { status: 200 })
    }

    // Handle group changes
    const handleGroupChange = async (groupId: string, changeType: string) => {
      try {
        console.log(`Group ${groupId} changed: ${changeType}`)
        
        // Get group details from Microsoft Graph
        const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
        if (!accessToken) return

        const response = await fetch(`https://graph.microsoft.com/v1.0/groups/${groupId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) return

        const group = await response.json()

        // Update or create group in database
        await prisma.group.upsert({
          where: { microsoftId: groupId },
          update: {
            name: group.displayName,
            description: group.description,
            email: group.mail,
            type: group.securityEnabled ? 'security' : 'distribution'
          },
          create: {
            microsoftId: groupId,
            name: group.displayName,
            description: group.description,
            email: group.mail,
            type: group.securityEnabled ? 'security' : 'distribution'
          }
        })

        // If group was deleted, remove from database
        if (changeType === 'deleted') {
          await prisma.group.delete({
            where: { microsoftId: groupId }
          })
        }
      } catch (error) {
        console.error('Error handling group change:', error)
      }
    }

    // Handle user changes
    const handleUserChange = async (userId: string, changeType: string) => {
      try {
        console.log(`User ${userId} changed: ${changeType}`)
        
        // Get user details from Microsoft Graph
        const accessToken = process.env.MICROSOFT_GRAPH_ACCESS_TOKEN
        if (!accessToken) return

        const response = await fetch(`https://graph.microsoft.com/v1.0/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) return

        const user = await response.json()

        // Update user in database
        await prisma.user.upsert({
          where: { microsoftId: userId },
          update: {
            name: user.displayName,
            email: user.mail || user.userPrincipalName,
            jobTitle: user.jobTitle,
            department: user.department,
            phone: user.businessPhones?.[0],
            location: user.officeLocation
          },
          create: {
            microsoftId: userId,
            name: user.displayName,
            email: user.mail || user.userPrincipalName,
            jobTitle: user.jobTitle,
            department: user.department,
            phone: user.businessPhones?.[0],
            location: user.officeLocation,
            status: 'ACTIVE',
            role: 'USER'
          }
        })

        // If user was deleted, deactivate in database
        if (changeType === 'deleted') {
          await prisma.user.update({
            where: { microsoftId: userId },
            data: { status: 'INACTIVE' }
          })
        }
      } catch (error) {
        console.error('Error handling user change:', error)
      }
    }

    // Process webhook notifications
    const webhookHandler = new OutlookWebhookHandler(handleGroupChange, handleUserChange)
    await webhookHandler.handleWebhook(body)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 })
  }
}

