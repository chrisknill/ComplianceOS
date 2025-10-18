import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding customer satisfaction data...')

  // Create sample surveys
  const survey1 = await prisma.customerSatisfactionSurvey.create({
    data: {
      title: 'Q4 2024 Customer Satisfaction Survey',
      description: 'General customer satisfaction survey for Q4 2024',
      surveyType: 'GENERAL',
      status: 'ACTIVE',
      targetAudience: 'All customers',
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-12-31'),
      createdByName: 'John Smith',
      totalResponses: 45,
      averageRating: 4.2,
      responseRate: 0.75,
    }
  })

  const survey2 = await prisma.customerSatisfactionSurvey.create({
    data: {
      title: 'Product Quality Assessment',
      description: 'Survey focused on product quality and features',
      surveyType: 'PRODUCT',
      status: 'CLOSED',
      targetAudience: 'Product users',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
      createdByName: 'Sarah Johnson',
      totalResponses: 32,
      averageRating: 4.5,
      responseRate: 0.68,
    }
  })

  const survey3 = await prisma.customerSatisfactionSurvey.create({
    data: {
      title: 'Service Support Experience',
      description: 'Customer support and service quality survey',
      surveyType: 'SUPPORT',
      status: 'DRAFT',
      targetAudience: 'Support ticket users',
      createdByName: 'Mike Wilson',
      totalResponses: 0,
      averageRating: null,
      responseRate: null,
    }
  })

  // Create sample questions for survey1
  await prisma.customerSatisfactionQuestion.createMany({
    data: [
      {
        surveyId: survey1.id,
        questionText: 'How satisfied are you with our overall service?',
        questionType: 'RATING',
        required: true,
        order: 1,
        weight: 1.0,
      },
      {
        surveyId: survey1.id,
        questionText: 'How likely are you to recommend us to others?',
        questionType: 'NPS',
        required: true,
        order: 2,
        weight: 1.5,
      },
      {
        surveyId: survey1.id,
        questionText: 'What is your primary reason for using our service?',
        questionType: 'MULTIPLE_CHOICE',
        options: JSON.stringify(['Quality', 'Price', 'Convenience', 'Support', 'Other']),
        required: true,
        order: 3,
        weight: 1.0,
      },
      {
        surveyId: survey1.id,
        questionText: 'Any additional comments or suggestions?',
        questionType: 'TEXT',
        required: false,
        order: 4,
        weight: 0.5,
      },
    ]
  })

  // Create sample questions for survey2
  await prisma.customerSatisfactionQuestion.createMany({
    data: [
      {
        surveyId: survey2.id,
        questionText: 'How would you rate the quality of our products?',
        questionType: 'RATING',
        required: true,
        order: 1,
        weight: 1.0,
      },
      {
        surveyId: survey2.id,
        questionText: 'Are you satisfied with the product features?',
        questionType: 'YES_NO',
        required: true,
        order: 2,
        weight: 1.0,
      },
    ]
  })

  // Create sample complaints
  const complaint1 = await prisma.customerComplaint.create({
    data: {
      complaintNumber: 'CC-2024-0001',
      customerName: 'Alice Johnson',
      customerEmail: 'alice.johnson@example.com',
      customerPhone: '+1-555-0123',
      customerCompany: 'TechCorp Inc.',
      complaintType: 'SERVICE',
      priority: 'HIGH',
      status: 'INVESTIGATING',
      subject: 'Delayed response to support ticket',
      description: 'Submitted a support ticket 3 days ago but have not received any response. This is affecting our production system.',
      receivedDate: new Date('2024-10-15'),
      dueDate: new Date('2024-10-18'),
      assignedToName: 'Support Team Lead',
      tags: JSON.stringify(['urgent', 'support', 'response-time']),
    }
  })

  const complaint2 = await prisma.customerComplaint.create({
    data: {
      complaintNumber: 'CC-2024-0002',
      customerName: 'Bob Smith',
      customerEmail: 'bob.smith@company.com',
      customerPhone: '+1-555-0456',
      customerCompany: 'Manufacturing Co.',
      complaintType: 'PRODUCT',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      subject: 'Product defect in latest shipment',
      description: 'Received defective products in our latest order. Several items were damaged during shipping.',
      receivedDate: new Date('2024-10-10'),
      dueDate: new Date('2024-10-17'),
      assignedToName: 'Quality Manager',
      resolution: 'Replacement products shipped and additional quality checks implemented',
      resolutionDate: new Date('2024-10-16'),
      customerSatisfied: true,
      followUpRequired: false,
      tags: JSON.stringify(['product', 'quality', 'shipping']),
    }
  })

  const complaint3 = await prisma.customerComplaint.create({
    data: {
      complaintNumber: 'CC-2024-0003',
      customerName: 'Carol Davis',
      customerEmail: 'carol.davis@business.org',
      customerPhone: '+1-555-0789',
      customerCompany: 'Business Solutions',
      complaintType: 'BILLING',
      priority: 'LOW',
      status: 'OPEN',
      subject: 'Incorrect billing amount',
      description: 'Received an invoice with incorrect charges. Need clarification on the billing.',
      receivedDate: new Date('2024-10-17'),
      dueDate: new Date('2024-10-31'),
      assignedToName: 'Billing Department',
      tags: JSON.stringify(['billing', 'invoice', 'charges']),
    }
  })

  const complaint4 = await prisma.customerComplaint.create({
    data: {
      complaintNumber: 'CC-2024-0004',
      customerName: 'David Wilson',
      customerEmail: 'david.wilson@enterprise.com',
      customerPhone: '+1-555-0321',
      customerCompany: 'Enterprise Systems',
      complaintType: 'DELIVERY',
      priority: 'CRITICAL',
      status: 'ESCALATED',
      subject: 'Critical delivery failure',
      description: 'Critical equipment delivery failed. This is blocking our major project timeline.',
      receivedDate: new Date('2024-10-16'),
      dueDate: new Date('2024-10-17'),
      assignedToName: 'Operations Manager',
      tags: JSON.stringify(['critical', 'delivery', 'equipment', 'project-blocker']),
    }
  })

  // Create complaint actions
  await prisma.customerComplaintAction.createMany({
    data: [
      {
        complaintId: complaint1.id,
        actionType: 'INVESTIGATION',
        description: 'Review support ticket queue and response times',
        assignedToName: 'Support Team Lead',
        dueDate: new Date('2024-10-18'),
        status: 'IN_PROGRESS',
      },
      {
        complaintId: complaint2.id,
        actionType: 'CORRECTIVE',
        description: 'Ship replacement products',
        assignedToName: 'Logistics Manager',
        completedDate: new Date('2024-10-16'),
        status: 'COMPLETED',
        effectiveness: 'EFFECTIVE',
      },
      {
        complaintId: complaint2.id,
        actionType: 'PREVENTIVE',
        description: 'Implement additional quality checks for shipping',
        assignedToName: 'Quality Manager',
        completedDate: new Date('2024-10-16'),
        status: 'COMPLETED',
        effectiveness: 'EFFECTIVE',
      },
      {
        complaintId: complaint4.id,
        actionType: 'INVESTIGATION',
        description: 'Investigate delivery failure and find alternative solution',
        assignedToName: 'Operations Manager',
        dueDate: new Date('2024-10-17'),
        status: 'IN_PROGRESS',
      },
    ]
  })

  // Create complaint logs
  await prisma.customerComplaintLog.createMany({
    data: [
      {
        complaintId: complaint1.id,
        action: 'CREATED',
        performedByName: 'System',
        comments: 'Complaint created automatically',
      },
      {
        complaintId: complaint1.id,
        action: 'ASSIGNED',
        performedByName: 'Manager',
        comments: 'Assigned to Support Team Lead',
      },
      {
        complaintId: complaint2.id,
        action: 'CREATED',
        performedByName: 'System',
        comments: 'Complaint created automatically',
      },
      {
        complaintId: complaint2.id,
        action: 'RESOLVED',
        performedByName: 'Quality Manager',
        comments: 'Issue resolved with replacement shipment',
      },
      {
        complaintId: complaint3.id,
        action: 'CREATED',
        performedByName: 'System',
        comments: 'Complaint created automatically',
      },
      {
        complaintId: complaint4.id,
        action: 'CREATED',
        performedByName: 'System',
        comments: 'Complaint created automatically',
      },
      {
        complaintId: complaint4.id,
        action: 'ESCALATED',
        performedByName: 'Operations Manager',
        comments: 'Escalated due to critical nature and project impact',
      },
    ]
  })

  console.log('Customer satisfaction data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
