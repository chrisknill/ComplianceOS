import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const webhookTestimonialSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email().optional(),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  projectName: z.string().optional(),
  projectType: z.enum(['COMPLETED', 'ONGOING', 'MAINTENANCE']).optional(),
  testimonialText: z.string().min(1, 'Testimonial text is required'),
  rating: z.number().min(1).max(5),
  status: z.enum(['DRAFT', 'APPROVED', 'PUBLISHED', 'REJECTED']).default('DRAFT'),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  projectId: z.string().optional(),
  // n8n webhook specific fields
  webhookUrl: z.string().url().optional(),
  source: z.string().default('n8n'),
  metadata: z.record(z.any()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = webhookTestimonialSchema.parse(body)

    // Create testimonial in database
    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail,
        customerCompany: validatedData.customerCompany,
        customerTitle: validatedData.customerTitle,
        projectName: validatedData.projectName,
        projectType: validatedData.projectType,
        testimonialText: validatedData.testimonialText,
        rating: validatedData.rating,
        status: validatedData.status,
        featured: validatedData.featured,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
        projectId: validatedData.projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        project: true,
      }
    })

    // Prepare response data for n8n
    const responseData = {
      success: true,
      message: 'Testimonial created successfully',
      testimonial: {
        id: testimonial.id,
        customerName: testimonial.customerName,
        customerEmail: testimonial.customerEmail,
        customerCompany: testimonial.customerCompany,
        customerTitle: testimonial.customerTitle,
        projectName: testimonial.projectName,
        projectType: testimonial.projectType,
        testimonialText: testimonial.testimonialText,
        rating: testimonial.rating,
        status: testimonial.status,
        featured: testimonial.featured,
        tags: testimonial.tags,
        createdAt: testimonial.createdAt,
        updatedAt: testimonial.updatedAt,
      },
      // Include metadata for n8n processing
      metadata: {
        source: validatedData.source,
        webhookUrl: validatedData.webhookUrl,
        timestamp: new Date().toISOString(),
        ...validatedData.metadata,
      } as any
    }

    // Always try to trigger n8n webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || validatedData.webhookUrl || 'https://chrisknill.app.n8n.cloud/webhook/cursor-testimonial'
    
    if (n8nWebhookUrl) {
      try {
        const webhookResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Essential fields for n8n email creation
            customerName: responseData.testimonial.customerName,
            customerEmail: responseData.testimonial.customerEmail,
            customerCompany: responseData.testimonial.customerCompany,
            customerTitle: responseData.testimonial.customerTitle,
            projectName: responseData.testimonial.projectName,
            testimonialText: responseData.testimonial.testimonialText,
            rating: responseData.testimonial.rating,
            status: responseData.testimonial.status,
            featured: responseData.testimonial.featured,
            
            // Additional context for n8n
            event: 'testimonial.created',
            testimonialId: responseData.testimonial.id,
            createdAt: responseData.testimonial.createdAt,
            tags: responseData.testimonial.tags,
            metadata: responseData.metadata,
            timestamp: new Date().toISOString(),
          }),
        })

        if (webhookResponse.ok) {
          console.log('Successfully triggered n8n webhook')
          responseData.metadata.n8nTriggered = true
          responseData.metadata.n8nResponse = await webhookResponse.text()
        } else {
          console.error('Failed to trigger n8n webhook:', webhookResponse.status)
          responseData.metadata.n8nError = `HTTP ${webhookResponse.status}`
        }
      } catch (webhookError) {
        console.error('Error triggering n8n webhook:', webhookError)
        responseData.metadata.n8nError = webhookError instanceof Error ? webhookError.message : 'Unknown error'
      }
    }

    return NextResponse.json(responseData, { status: 201 })
  } catch (error) {
    console.error('Webhook testimonial creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false,
        error: 'Validation error', 
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create testimonial',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
