import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const testimonialWebhookSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email().optional(),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  projectName: z.string().optional(),
  projectType: z.enum(['COMPLETED', 'ONGOING', 'MAINTENANCE']).optional(),
  testimonialText: z.string().optional(), // Made optional for n8n workflow
  rating: z.number().min(1).max(5),
  status: z.enum(['DRAFT', 'APPROVED', 'PUBLISHED', 'REJECTED']).default('DRAFT'),
  featured: z.boolean().default(false),
  tags: z.string().optional(), // JSON array as string
  projectId: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = testimonialWebhookSchema.parse(body)

    // Prepare data for n8n webhook
    const webhookData = {
      formType: 'testimonial',
      timestamp: new Date().toISOString(),
      customer: {
        name: validatedData.customerName,
        email: validatedData.customerEmail,
        company: validatedData.customerCompany,
        title: validatedData.customerTitle,
      },
      project: {
        name: validatedData.projectName,
        type: validatedData.projectType,
        id: validatedData.projectId,
      },
      testimonial: {
        text: validatedData.testimonialText,
        rating: validatedData.rating,
        status: validatedData.status,
        featured: validatedData.featured,
        tags: validatedData.tags ? JSON.parse(validatedData.tags) : [],
      },
      metadata: {
        source: 'compliance-os',
        version: '1.0',
      }
    }

    // Send to n8n webhook
    const n8nWebhookUrl = 'https://chrisknill.app.n8n.cloud/webhook-test/cursor-testimonial'
    
    const webhookResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    })

    if (!webhookResponse.ok) {
      console.error('N8N webhook failed:', webhookResponse.status, webhookResponse.statusText)
      return NextResponse.json(
        { 
          error: 'Failed to send to n8n workflow',
          details: `Webhook returned ${webhookResponse.status}: ${webhookResponse.statusText}`
        }, 
        { status: 502 }
      )
    }

    const webhookResult = await webhookResponse.json().catch(() => ({}))
    
    console.log('Successfully sent to n8n webhook:', webhookResult)

    return NextResponse.json({
      success: true,
      message: 'Testimonial form submitted successfully',
      webhookResponse: webhookResult,
      submittedData: webhookData
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('Error processing testimonial webhook:', error)
    return NextResponse.json({ 
      error: 'Failed to process testimonial form',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}