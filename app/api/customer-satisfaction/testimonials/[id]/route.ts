import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateTestimonialSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').optional(),
  customerEmail: z.string().email().optional(),
  customerCompany: z.string().optional(),
  customerTitle: z.string().optional(),
  projectName: z.string().optional(),
  projectType: z.enum(['COMPLETED', 'ONGOING', 'MAINTENANCE']).optional(),
  testimonialText: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  status: z.enum(['DRAFT', 'APPROVED', 'PUBLISHED', 'REJECTED']).optional(),
  featured: z.boolean().optional(),
  tags: z.string().optional(),
  attachments: z.string().optional(),
  approvedByName: z.string().optional(),
})

const sendQuestionnaireSchema = z.object({
  questionnaireType: z.enum(['STANDARD', 'CUSTOM', 'COMPLAINT']).default('STANDARD'),
  emailSubject: z.string().optional(),
  emailBody: z.string().optional(),
  expiresAt: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: {
        project: true,
        questionnaire: {
          include: {
            responses: {
              orderBy: { responseDate: 'desc' }
            }
          }
        },
        responses: {
          orderBy: { responseDate: 'desc' }
        },
        _count: {
          select: {
            responses: true
          }
        }
      }
    })

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const validatedData = updateTestimonialSchema.parse(body)

    const updateData: any = { ...validatedData }
    
    // Keep tags and attachments as strings (they're stored as JSON strings in the database)
    // Don't parse them as JSON since Prisma expects strings
    
    // Handle status changes
    if (validatedData.status === 'APPROVED') {
      updateData.approvedAt = new Date()
    }
    if (validatedData.status === 'PUBLISHED') {
      updateData.publishedAt = new Date()
    }

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: updateData,
      include: {
        project: true,
        questionnaire: true,
        responses: true,
      }
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating testimonial:', error)
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.testimonial.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Testimonial deleted successfully' })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}

// Send questionnaire endpoint
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const validatedData = sendQuestionnaireSchema.parse(body)

    // Get testimonial details
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      include: { project: true }
    })

    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
    }

    // Create or update questionnaire
    const questionnaire = await prisma.testimonialQuestionnaire.upsert({
      where: { testimonialId: id },
      update: {
        questionnaireType: validatedData.questionnaireType,
        emailSubject: validatedData.emailSubject,
        emailBody: validatedData.emailBody,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        status: 'SENT',
        sentDate: new Date(),
      },
      create: {
        testimonialId: id,
        questionnaireType: validatedData.questionnaireType,
        emailSubject: validatedData.emailSubject,
        emailBody: validatedData.emailBody,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
        status: 'SENT',
        sentDate: new Date(),
        // Add default prompting statements and questions
        promptingStatements: JSON.stringify([
          "We would love to hear about your experience working with us.",
          "Your feedback helps us improve our services and helps other customers make informed decisions.",
          "Please take a few minutes to share your thoughts about our recent project."
        ]),
        questions: JSON.stringify([
          {
            id: 'overall_satisfaction',
            question: 'How satisfied are you with our overall service?',
            type: 'RATING',
            required: true,
            order: 1
          },
          {
            id: 'recommendation',
            question: 'How likely are you to recommend us to others?',
            type: 'NPS',
            required: true,
            order: 2
          },
          {
            id: 'testimonial_text',
            question: 'Please share your experience in your own words:',
            type: 'TEXT',
            required: true,
            order: 3
          },
          {
            id: 'project_highlights',
            question: 'What were the highlights of working with us?',
            type: 'TEXT',
            required: false,
            order: 4
          },
          {
            id: 'improvement_suggestions',
            question: 'How could we improve our service?',
            type: 'TEXT',
            required: false,
            order: 5
          }
        ])
      }
    })

    // TODO: Send actual email here
    // For now, we'll just log the action
    console.log(`Questionnaire sent to ${testimonial.customerEmail} for testimonial ${testimonial.id}`)

    return NextResponse.json({ 
      message: 'Questionnaire sent successfully',
      questionnaire 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error sending questionnaire:', error)
    return NextResponse.json({ error: 'Failed to send questionnaire' }, { status: 500 })
  }
}
