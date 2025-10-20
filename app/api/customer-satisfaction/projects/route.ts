import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createProjectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  projectNumber: z.string().min(1, 'Project number is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email().optional(),
  customerCompany: z.string().optional(),
  projectType: z.enum(['CONSTRUCTION', 'MAINTENANCE', 'CONSULTING', 'OTHER']),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('PLANNING'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  completionDate: z.string().optional(),
  projectManagerName: z.string().optional(),
  value: z.number().optional(),
  currency: z.string().default('USD'),
  description: z.string().optional(),
  location: z.string().optional(),
  autoTestimonial: z.boolean().default(true),
})

const querySchema = z.object({
  search: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  projectType: z.string().nullable().optional(),
  customerName: z.string().nullable().optional(),
  page: z.string().nullable().optional(),
  limit: z.string().nullable().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse({
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      projectType: searchParams.get('projectType'),
      customerName: searchParams.get('customerName'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (query.search) {
      where.OR = [
        { projectName: { contains: query.search, mode: 'insensitive' } },
        { projectNumber: { contains: query.search, mode: 'insensitive' } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerCompany: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    
    if (query.status && query.status !== 'ALL') {
      where.status = query.status
    }
    
    if (query.projectType && query.projectType !== 'ALL') {
      where.projectType = query.projectType
    }
    
    if (query.customerName && query.customerName !== 'ALL') {
      where.customerName = { contains: query.customerName, mode: 'insensitive' }
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          testimonials: {
            orderBy: { createdAt: 'desc' }
          },
          complaints: {
            orderBy: { receivedDate: 'desc' }
          },
          _count: {
            select: {
              testimonials: true,
              complaints: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createProjectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        completionDate: validatedData.completionDate ? new Date(validatedData.completionDate) : null,
      },
      include: {
        testimonials: true,
        complaints: true,
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

// Auto-send testimonial when project is completed
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { projectId, status } = body

    if (!projectId || !status) {
      return NextResponse.json({ error: 'Project ID and status are required' }, { status: 400 })
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { testimonials: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const updateData: any = { status }

    // If project is being completed and auto-testimonial is enabled
    if (status === 'COMPLETED' && project.autoTestimonial && !project.testimonialSent) {
      updateData.completionDate = new Date()
      updateData.testimonialSent = true
      updateData.testimonialSentDate = new Date()

      // Create testimonial questionnaire
      const testimonial = await prisma.testimonial.create({
        data: {
          customerName: project.customerName,
          customerEmail: project.customerEmail,
          customerCompany: project.customerCompany,
          projectName: project.projectName,
          projectType: 'COMPLETED',
          testimonialText: '', // Will be filled by customer response
          rating: 0, // Will be filled by customer response
          status: 'DRAFT',
          projectId: project.id,
        }
      })

      // Create questionnaire
      await prisma.testimonialQuestionnaire.create({
        data: {
          testimonialId: testimonial.id,
          questionnaireType: 'STANDARD',
          status: 'SENT',
          sentDate: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          emailSubject: `Testimonial Request - ${project.projectName}`,
          emailBody: `Dear ${project.customerName},\n\nThank you for choosing us for your ${project.projectName} project. We hope you're satisfied with our work.\n\nWe would greatly appreciate it if you could take a few minutes to share your experience with us. Your feedback helps us improve our services and helps other customers make informed decisions.\n\nPlease click the link below to provide your testimonial:\n[Testimonial Link]\n\nThank you for your time and continued trust in our services.\n\nBest regards,\n${project.projectManagerName || 'Project Team'}`,
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
      console.log(`Auto-testimonial questionnaire created for project ${project.projectNumber}`)
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      include: {
        testimonials: true,
        complaints: true,
      }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}
