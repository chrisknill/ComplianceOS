import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Standards templates for Management Review inputs and outputs
const ISO_9001_INPUTS = [
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
]

const ISO_9001_OUTPUTS = [
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
]

const ISO_14001_INPUTS = [
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
]

const ISO_14001_OUTPUTS = [
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
]

const ISO_45001_INPUTS = [
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
]

const ISO_45001_OUTPUTS = [
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
]

async function seedManagementReviewTemplates() {
  console.log('🌱 Seeding Management Review templates...')

  try {
    // Create a sample management review with all three standards
    const sampleReview = await prisma.managementReview.create({
      data: {
        orgId: 'sample-org',
        title: 'Q1 2024 Management Review',
        scheduledAt: new Date('2024-03-31T10:00:00Z'),
        meetingType: 'Quarterly',
        standards: JSON.stringify(['ISO9001', 'ISO14001', 'ISO45001']),
        status: 'COMPLETED',
        createdById: 'admin-user',
        discussionNotes: 'Comprehensive review of all three management systems covering quality, environmental, and OH&S performance. Key decisions made on resource allocation and improvement initiatives.',
      },
    })

    // Add sample attendees
    const attendees = [
      {
        reviewId: sampleReview.id,
        name: 'John Smith',
        role: 'Managing Director',
        required: true,
        present: true,
        signedOffAt: new Date('2024-03-31T12:00:00Z'),
      },
      {
        reviewId: sampleReview.id,
        name: 'Sarah Johnson',
        role: 'Quality Manager',
        required: true,
        present: true,
        signedOffAt: new Date('2024-03-31T12:05:00Z'),
      },
      {
        reviewId: sampleReview.id,
        name: 'Mike Brown',
        role: 'HSE Manager',
        required: true,
        present: true,
        signedOffAt: new Date('2024-03-31T12:10:00Z'),
      },
      {
        reviewId: sampleReview.id,
        name: 'Lisa Davis',
        role: 'Operations Manager',
        required: false,
        present: true,
      },
    ]

    for (const attendee of attendees) {
      await prisma.managementReviewAttendee.create({ data: attendee })
    }

    // Add sample inputs for all standards
    const allInputs = [...ISO_9001_INPUTS, ...ISO_14001_INPUTS, ...ISO_45001_INPUTS]
    
    for (const input of allInputs) {
      await prisma.managementReviewInput.create({
        data: {
          reviewId: sampleReview.id,
          standard: input.standard,
          clauseRef: input.clauseRef,
          title: input.title,
          description: input.description,
          status: 'PROVIDED',
          remarks: 'Data provided from relevant modules and reports',
        },
      })
    }

    // Add sample outputs for all standards
    const allOutputs = [...ISO_9001_OUTPUTS, ...ISO_14001_OUTPUTS, ...ISO_45001_OUTPUTS]
    
    for (const output of allOutputs) {
      await prisma.managementReviewOutput.create({
        data: {
          reviewId: sampleReview.id,
          standard: output.standard,
          clauseRef: output.clauseRef,
          decision: output.decision,
          type: output.type,
        },
      })
    }

    // Add sample actions
    const actions = [
      {
        reviewId: sampleReview.id,
        title: 'Implement new quality training program',
        ownerId: 'sarah-johnson',
        dueDate: new Date('2024-06-30'),
        status: 'OPEN',
        linkage: 'Linked to ISO 9001 training competency gap',
      },
      {
        reviewId: sampleReview.id,
        title: 'Conduct environmental impact assessment',
        ownerId: 'mike-brown',
        dueDate: new Date('2024-05-15'),
        status: 'IN_PROGRESS',
        linkage: 'Linked to ISO 14001 environmental performance review',
      },
      {
        reviewId: sampleReview.id,
        title: 'Upgrade safety equipment',
        ownerId: 'mike-brown',
        dueDate: new Date('2024-04-30'),
        status: 'DONE',
        linkage: 'Linked to ISO 45001 resource adequacy review',
      },
    ]

    for (const action of actions) {
      await prisma.managementReviewAction.create({ data: action })
    }

    // Add sample evidence
    const evidence = [
      {
        reviewId: sampleReview.id,
        label: 'Q1 Quality Performance Report',
        url: '/documents/reports/q1-quality-2024.pdf',
        uploadedBy: 'sarah-johnson',
      },
      {
        reviewId: sampleReview.id,
        label: 'Environmental Monitoring Data',
        url: '/documents/reports/env-monitoring-q1-2024.xlsx',
        uploadedBy: 'mike-brown',
      },
      {
        reviewId: sampleReview.id,
        label: 'Safety Incident Analysis',
        url: '/documents/reports/safety-incidents-q1-2024.pdf',
        uploadedBy: 'mike-brown',
      },
    ]

    for (const item of evidence) {
      await prisma.managementReviewEvidence.create({ data: item })
    }

    // Add audit log entries
    const auditLogs = [
      {
        reviewId: sampleReview.id,
        actorId: 'admin-user',
        event: 'CREATED',
        details: 'Management review created',
      },
      {
        reviewId: sampleReview.id,
        actorId: 'admin-user',
        event: 'STATUS_CHANGE',
        details: 'Status changed from DRAFT to SCHEDULED',
      },
      {
        reviewId: sampleReview.id,
        actorId: 'admin-user',
        event: 'STATUS_CHANGE',
        details: 'Status changed from SCHEDULED to IN_PROGRESS',
      },
      {
        reviewId: sampleReview.id,
        actorId: 'admin-user',
        event: 'STATUS_CHANGE',
        details: 'Status changed from IN_PROGRESS to COMPLETED',
      },
    ]

    for (const log of auditLogs) {
      await prisma.managementReviewAudit.create({ data: log })
    }

    console.log('✅ Management Review templates seeded successfully!')
    console.log(`📊 Created sample review: ${sampleReview.title}`)
    console.log(`👥 Added ${attendees.length} attendees`)
    console.log(`📝 Added ${allInputs.length} input items`)
    console.log(`🎯 Added ${allOutputs.length} output decisions`)
    console.log(`✅ Added ${actions.length} actions`)
    console.log(`📎 Added ${evidence.length} evidence items`)
    console.log(`📋 Added ${auditLogs.length} audit log entries`)

  } catch (error) {
    console.error('❌ Error seeding Management Review templates:', error)
    throw error
  }
}

// Export the seed functions for use in main seed file
export { seedManagementReviewTemplates }

// Run if called directly
if (require.main === module) {
  seedManagementReviewTemplates()
    .catch((e) => {
      console.error(e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
