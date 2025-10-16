import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { loadTemplateSchema } from '@/lib/validation/management-review'

// Standards templates for Management Review inputs and outputs
const STANDARDS_TEMPLATES = {
  ISO9001: {
    inputs: [
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 a)',
        title: 'Status of previous actions',
        description: 'Review of actions from previous management review meetings and their implementation status',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 b)',
        title: 'Changes in external and internal issues',
        description: 'Changes in the external and internal issues that are relevant to the quality management system',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 c)',
        title: 'Customer satisfaction and feedback',
        description: 'Information on customer satisfaction and feedback from relevant interested parties',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 d)',
        title: 'Extent of achievement of quality objectives',
        description: 'Degree of achievement of the quality objectives',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 e)',
        title: 'Process performance and conformity',
        description: 'Process performance and conformity of products and services',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 f)',
        title: 'Nonconformities and corrective actions',
        description: 'Nonconformities and corrective actions',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 g)',
        title: 'Monitoring and measurement results',
        description: 'Results of monitoring and measurement',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 h)',
        title: 'Audit results',
        description: 'Results of internal and external audits',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 i)',
        title: 'Adequacy of resources',
        description: 'Adequacy of resources',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 j)',
        title: 'Actions on risks and opportunities',
        description: 'The effectiveness of actions taken to address risks and opportunities',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.2 k)',
        title: 'Opportunities for improvement',
        description: 'Opportunities for improvement',
      },
    ],
    outputs: [
      {
        standard: 'ISO9001',
        clauseRef: '9.3.3 a)',
        title: 'Opportunities for improvement',
        decision: 'Decisions and actions related to opportunities for improvement',
        type: 'Improvement Opportunity',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.3 b)',
        title: 'Need for changes to the QMS',
        decision: 'Decisions and actions related to changes needed to the quality management system',
        type: 'Change Needed',
      },
      {
        standard: 'ISO9001',
        clauseRef: '9.3.3 c)',
        title: 'Resource needs',
        decision: 'Decisions and actions related to resource needs',
        type: 'Resource Need',
      },
    ],
  },
  ISO14001: {
    inputs: [
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 a)',
        title: 'Status of actions from previous reviews',
        description: 'Status of actions from previous management reviews',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 b)',
        title: 'Changes in external and internal issues',
        description: 'Changes in external and internal issues that are relevant to the environmental management system',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 c)',
        title: 'Needs and expectations of interested parties',
        description: 'Needs and expectations of interested parties including compliance obligations',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 d)',
        title: 'Environmental performance',
        description: 'Environmental performance including trends in nonconformities, corrective actions, monitoring and measurement results',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 e)',
        title: 'Compliance evaluation',
        description: 'Results of the evaluation of compliance with legal and other requirements',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 f)',
        title: 'Audit results',
        description: 'Results of internal and external audits',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 g)',
        title: 'Adequacy of resources',
        description: 'Adequacy of resources',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 h)',
        title: 'Risks and opportunities',
        description: 'The effectiveness of actions taken to address risks and opportunities',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 i)',
        title: 'Continual improvement opportunities',
        description: 'Opportunities for continual improvement',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.2 j)',
        title: 'Environmental objectives progress',
        description: 'Progress toward environmental objectives',
      },
    ],
    outputs: [
      {
        standard: 'ISO14001',
        clauseRef: '9.3.3 a)',
        title: 'Conclusions on suitability, adequacy and effectiveness',
        decision: 'Conclusions on the suitability, adequacy and effectiveness of the environmental management system',
        type: 'System Assessment',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.3 b)',
        title: 'Decisions on continual improvement',
        decision: 'Decisions related to continual improvement opportunities',
        type: 'Improvement Opportunity',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.3 c)',
        title: 'Need for changes to the EMS',
        decision: 'Decisions and actions related to changes needed to the environmental management system',
        type: 'Change Needed',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.3 d)',
        title: 'Resource needs',
        decision: 'Decisions and actions related to resource needs',
        type: 'Resource Need',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.3 e)',
        title: 'Actions if objectives not achieved',
        decision: 'Actions if environmental objectives have not been achieved',
        type: 'Corrective Action',
      },
      {
        standard: 'ISO14001',
        clauseRef: '9.3.3 f)',
        title: 'Strategic direction implications',
        decision: 'Opportunities to improve integration of the environmental management system into the organization\'s business processes',
        type: 'Strategy Impact',
      },
    ],
  },
  ISO45001: {
    inputs: [
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 a)',
        title: 'Status of actions from previous reviews',
        description: 'Status of actions from previous management reviews',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 b)',
        title: 'Changes in external and internal issues',
        description: 'Changes in external and internal issues that are relevant to the OH&S management system',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 c)',
        title: 'Consultation and participation results',
        description: 'Adequacy of resources for consultation and participation of workers',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 d)',
        title: 'OH&S performance',
        description: 'OH&S performance including trends in incidents, nonconformities, corrective actions, monitoring and measurement results',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 e)',
        title: 'Compliance evaluation',
        description: 'Results of the evaluation of compliance with legal and other requirements',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 f)',
        title: 'Audit results',
        description: 'Results of internal and external audits',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 g)',
        title: 'Adequacy of resources',
        description: 'Adequacy of resources',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 h)',
        title: 'Risks and opportunities',
        description: 'The effectiveness of actions taken to address risks and opportunities',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.2 i)',
        title: 'Improvement opportunities',
        description: 'Opportunities for improvement',
      },
    ],
    outputs: [
      {
        standard: 'ISO45001',
        clauseRef: '9.3.3 a)',
        title: 'Improvement opportunities',
        decision: 'Decisions and actions related to opportunities for improvement',
        type: 'Improvement Opportunity',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.3 b)',
        title: 'Need for changes to the OH&S MS',
        decision: 'Decisions and actions related to changes needed to the OH&S management system',
        type: 'Change Needed',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.3 c)',
        title: 'Resource needs',
        decision: 'Decisions and actions related to resource needs',
        type: 'Resource Need',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.3 d)',
        title: 'Business process integration',
        decision: 'Opportunities to improve integration of the OH&S management system into the organization\'s business processes',
        type: 'Strategy Impact',
      },
      {
        standard: 'ISO45001',
        clauseRef: '9.3.3 e)',
        title: 'Strategic direction implications',
        decision: 'Implications for the strategic direction of the organization',
        type: 'Strategy Impact',
      },
    ],
  },
}

// POST /api/management-review/[id]/load-template - Load standards template
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = loadTemplateSchema.parse(body)

    // Check if review exists
    const review = await prisma.managementReview.findUnique({
      where: { id: params.id },
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    const createdInputs = []
    const createdOutputs = []

    // Load templates for each selected standard
    for (const standard of validatedData.standards) {
      const template = STANDARDS_TEMPLATES[standard as keyof typeof STANDARDS_TEMPLATES]
      
      if (template) {
        // Create inputs
        for (const inputTemplate of template.inputs) {
          // Check if input already exists (if not including existing)
          const existingInput = await prisma.managementReviewInput.findFirst({
            where: {
              reviewId: params.id,
              standard: inputTemplate.standard,
              clauseRef: inputTemplate.clauseRef,
            },
          })

          if (!existingInput || validatedData.includeExisting) {
            const input = await prisma.managementReviewInput.create({
              data: {
                reviewId: params.id,
                standard: inputTemplate.standard,
                clauseRef: inputTemplate.clauseRef,
                title: inputTemplate.title,
                description: inputTemplate.description,
                status: 'PENDING',
              },
            })
            createdInputs.push(input)
          }
        }

        // Create outputs
        for (const outputTemplate of template.outputs) {
          // Check if output already exists (if not including existing)
          const existingOutput = await prisma.managementReviewOutput.findFirst({
            where: {
              reviewId: params.id,
              standard: outputTemplate.standard,
              clauseRef: outputTemplate.clauseRef,
            },
          })

          if (!existingOutput || validatedData.includeExisting) {
            const output = await prisma.managementReviewOutput.create({
              data: {
                reviewId: params.id,
                standard: outputTemplate.standard,
                clauseRef: outputTemplate.clauseRef,
                decision: outputTemplate.decision,
                type: outputTemplate.type,
              },
            })
            createdOutputs.push(output)
          }
        }
      }
    }

    // Create audit log entry
    await prisma.managementReviewAudit.create({
      data: {
        reviewId: params.id,
        actorId: session.user.id,
        event: 'UPDATED',
        details: `Template loaded for standards: ${validatedData.standards.join(', ')}`,
      },
    })

    return NextResponse.json({
      message: 'Template loaded successfully',
      inputs: createdInputs,
      outputs: createdOutputs,
      summary: {
        standards: validatedData.standards,
        inputsCreated: createdInputs.length,
        outputsCreated: createdOutputs.length,
      },
    })

  } catch (error) {
    console.error('Error loading template:', error)
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to load template' },
      { status: 500 }
    )
  }
}
