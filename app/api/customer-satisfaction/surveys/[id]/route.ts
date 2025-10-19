import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSurveySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  surveyType: z.enum(['GENERAL', 'PRODUCT', 'SERVICE', 'SUPPORT', 'PROJECT']).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'ARCHIVED']).optional(),
  targetAudience: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const survey = await prisma.customerSatisfactionSurvey.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        responses: {
          include: {
            answers: {
              include: {
                question: true
              }
            }
          },
          orderBy: { responseDate: 'desc' }
        },
        _count: {
          select: {
            questions: true,
            responses: true
          }
        }
      }
    })

    if (!survey) {
      return NextResponse.json({ error: 'Survey not found' }, { status: 404 })
    }

    return NextResponse.json(survey)
  } catch (error) {
    console.error('Error fetching survey:', error)
    return NextResponse.json({ error: 'Failed to fetch survey' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const validatedData = updateSurveySchema.parse(body)

    const survey = await prisma.customerSatisfactionSurvey.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
      include: {
        questions: true,
        responses: true,
      }
    })

    return NextResponse.json(survey)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 })
    }
    console.error('Error updating survey:', error)
    return NextResponse.json({ error: 'Failed to update survey' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.customerSatisfactionSurvey.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Survey deleted successfully' })
  } catch (error) {
    console.error('Error deleting survey:', error)
    return NextResponse.json({ error: 'Failed to delete survey' }, { status: 500 })
  }
}
