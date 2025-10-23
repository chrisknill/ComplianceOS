import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { triggerType = 'manual', reportType = 'dashboard' } = body

    // Webhook URL for the n8n workflow
    const webhookUrl = 'https://chrisknill.app.n8n.cloud/webhook/dashboard-report'
    
    // Prepare the payload
    const payload = {
      triggerType,
      reportType,
      timestamp: new Date().toISOString(),
      source: 'ComplianceOS API',
      requestedBy: 'System'
    }

    // Send request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      message: 'Dashboard report generation triggered successfully',
      webhookResponse: result,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error triggering dashboard report:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to trigger dashboard report generation',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Dashboard Report Trigger API',
    description: 'POST to this endpoint to trigger dashboard report generation',
    webhookUrl: 'https://chrisknill.app.n8n.cloud/webhook/dashboard-report',
    usage: {
      method: 'POST',
      body: {
        triggerType: 'manual | scheduled | automated',
        reportType: 'dashboard | summary | detailed'
      }
    }
  })
}
