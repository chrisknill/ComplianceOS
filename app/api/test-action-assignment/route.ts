import { NextRequest, NextResponse } from 'next/server'
import { ActionNotificationService } from '@/lib/action-notifications'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate required fields
    if (!body.actionId || !body.title || !body.assigneeEmail || !body.assigneeName) {
      return NextResponse.json({ 
        error: 'Missing required fields: actionId, title, assigneeEmail, assigneeName' 
      }, { status: 400 })
    }

    const service = new ActionNotificationService()
    
    const actionData = {
      source: body.source || 'TEST/Manual',
      actionId: body.actionId,
      title: body.title,
      description: body.description || 'Test action assignment',
      priority: body.priority || 'Medium',
      dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      assignee: {
        name: body.assigneeName,
        email: body.assigneeEmail,
        teamsUserId: body.teamsUserId || null
      },
      createdBy: {
        name: body.createdByName || 'Test User',
        email: body.createdByEmail || 'test@company.com'
      },
      links: body.links || {},
      idempotencyKey: `${body.actionId.toLowerCase()}-v1`
    }

    const result = await service.assignAction(actionData)
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      webhookResponse: result.webhookResponse
    })

  } catch (error) {
    console.error('Test action assignment error:', error)
    return NextResponse.json({ 
      error: 'Failed to send test action assignment' 
    }, { status: 500 })
  }
}
