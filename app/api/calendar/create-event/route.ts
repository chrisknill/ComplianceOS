import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, startDate, endDate' },
        { status: 400 }
      )
    }

    // Validate date format
    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (startDate >= endDate) {
      return NextResponse.json(
        { success: false, error: 'Start date must be before end date' },
        { status: 400 }
      )
    }

    // Prepare payload for n8n webhook
    const webhookPayload = {
      event: 'calendar.create',
      title: body.title,
      description: body.description || '',
      startDate: body.startDate,
      endDate: body.endDate,
      attendees: body.attendees || [],
      resources: body.resources || [],
      location: body.location || '',
      reminderMinutes: body.reminderMinutes || [15],
      calendarId: body.calendarId || 'primary',
      isTeamsMeeting: body.isTeamsMeeting || false,
      meetingType: body.meetingType || 'in-person',
      source: 'ComplianceOS',
      createdBy: {
        name: session.user?.name || 'Unknown User',
        email: session.user?.email || 'unknown@complianceos.com'
      },
      metadata: {
        ...body.metadata,
        timestamp: new Date().toISOString()
      }
    }

    // Send to n8n webhook
    const webhookUrl = process.env.N8N_CALENDAR_WEBHOOK_URL || 'https://chrisknill.app.n8n.cloud/webhook/calendar-event'
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Calendar webhook failed:', response.status, errorText)
      console.error('Webhook URL:', webhookUrl)
      console.error('Payload sent:', JSON.stringify(webhookPayload, null, 2))
      return NextResponse.json(
        { success: false, error: `Failed to create calendar event: ${response.status} ${errorText}` },
        { status: 500 }
      )
    }

    const result = await response.json()
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        eventId: result.eventId,
        calendarLink: result.calendarLink,
        message: 'Calendar event created successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Unknown error' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Calendar event creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
