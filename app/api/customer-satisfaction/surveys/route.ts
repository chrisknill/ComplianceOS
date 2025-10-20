import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSurveySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  surveyType: z.enum(['GENERAL', 'PRODUCT', 'SERVICE', 'SUPPORT', 'PROJECT']).default('GENERAL'),
  targetAudience: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  createdByName: z.string().optional(),
})

const querySchema = z.object({
  search: z.string().nullable().optional(),
  surveyType: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  page: z.string().nullable().optional(),
  limit: z.string().nullable().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = querySchema.parse({
      search: searchParams.get('search'),
      surveyType: searchParams.get('surveyType'),
      status: searchParams.get('status'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const page = parseInt(query.page || '1')
    const limit = parseInt(query.limit || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ]
    }
    
    if (query.surveyType && query.surveyType !== 'ALL') {
      where.surveyType = query.surveyType
    }
    
    if (query.status && query.status !== 'ALL') {
      where.status = query.status
    }

    const [surveys, total] = await Promise.all([
      prisma.customerSatisfactionSurvey.findMany({
        where,
        include: {
          questions: {
            orderBy: { order: 'asc' }
          },
          responses: {
            include: {
              answers: true
            }
          },
          _count: {
            select: {
              questions: true,
              responses: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.customerSatisfactionSurvey.count({ where })
    ])

    return NextResponse.json({
      surveys,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching surveys:', error)
    return NextResponse.json({ error: 'Failed to fetch surveys' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validatedData = createSurveySchema.parse(body)

    const survey = await prisma.customerSatisfactionSurvey.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
      include: {
        questions: true,
        responses: true,
      }
    })

    return NextResponse.json(survey, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error creating survey:', error)
    return NextResponse.json({ error: 'Failed to create survey' }, { status: 500 })
  }
}
