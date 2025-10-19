import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTestimonialSchema = z.object({
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
  tags: z.string().optional(), // JSON array as string
  attachments: z.string().optional(), // JSON array as string
  projectId: z.string().optional(),
})

const querySchema = z.object({
  search: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  featured: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  page: z.string().nullable().optional(),
  limit: z.string().nullable().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse({
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      featured: searchParams.get('featured'),
      projectId: searchParams.get('projectId'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (query.search) {
      where.OR = [
        { customerName: { contains: query.search, mode: 'insensitive' } },
        { customerCompany: { contains: query.search, mode: 'insensitive' } },
        { projectName: { contains: query.search, mode: 'insensitive' } },
        { testimonialText: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    
    if (query.status && query.status !== 'ALL') {
      where.status = query.status
    }
    
    if (query.featured && query.featured !== 'ALL') {
      where.featured = query.featured === 'true'
    }
    
    if (query.projectId && query.projectId !== 'ALL') {
      where.projectId = query.projectId
    }

    const [testimonials, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: {
          project: true,
          questionnaire: true,
          responses: {
            orderBy: { responseDate: 'desc' }
          },
          _count: {
            select: {
              responses: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where })
    ])

    return NextResponse.json({
      testimonials,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createTestimonialSchema.parse(body)

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName: validatedData.customerName,
        customerEmail: validatedData.customerEmail || null,
        customerCompany: validatedData.customerCompany || null,
        customerTitle: validatedData.customerTitle || null,
        projectName: validatedData.projectName || null,
        projectType: validatedData.projectType || null,
        testimonialText: validatedData.testimonialText,
        rating: validatedData.rating,
        status: validatedData.status,
        featured: validatedData.featured,
        tags: validatedData.tags || null,
        attachments: validatedData.attachments || null,
        projectId: validatedData.projectId || null,
      },
      include: {
        project: true,
        questionnaire: true,
        responses: true,
      }
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
