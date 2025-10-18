import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding testimonial and project data...')

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      projectName: 'Office Building Renovation',
      projectNumber: 'PRJ-2024-001',
      customerName: 'Alice Johnson',
      customerEmail: 'alice.johnson@techcorp.com',
      customerCompany: 'TechCorp Inc.',
      projectType: 'CONSTRUCTION',
      status: 'COMPLETED',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      completionDate: new Date('2024-06-28'),
      projectManagerName: 'John Smith',
      value: 250000,
      currency: 'USD',
      description: 'Complete renovation of 3-story office building',
      location: 'Downtown Business District',
      autoTestimonial: true,
      testimonialSent: true,
      testimonialSentDate: new Date('2024-07-01'),
      testimonialReceived: true,
      testimonialReceivedDate: new Date('2024-07-15'),
    }
  })

  const project2 = await prisma.project.create({
    data: {
      projectName: 'HVAC System Maintenance',
      projectNumber: 'PRJ-2024-002',
      customerName: 'Bob Wilson',
      customerEmail: 'bob.wilson@manufacturing.com',
      customerCompany: 'Manufacturing Co.',
      projectType: 'MAINTENANCE',
      status: 'IN_PROGRESS',
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-12-31'),
      projectManagerName: 'Sarah Johnson',
      value: 75000,
      currency: 'USD',
      description: 'Quarterly HVAC maintenance and optimization',
      location: 'Industrial Zone',
      autoTestimonial: true,
      testimonialSent: false,
    }
  })

  const project3 = await prisma.project.create({
    data: {
      projectName: 'Safety Consulting Services',
      projectNumber: 'PRJ-2024-003',
      customerName: 'Carol Davis',
      customerEmail: 'carol.davis@business.org',
      customerCompany: 'Business Solutions',
      projectType: 'CONSULTING',
      status: 'COMPLETED',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-05-31'),
      completionDate: new Date('2024-05-30'),
      projectManagerName: 'Mike Wilson',
      value: 45000,
      currency: 'USD',
      description: 'Comprehensive safety audit and recommendations',
      location: 'Corporate Headquarters',
      autoTestimonial: true,
      testimonialSent: true,
      testimonialSentDate: new Date('2024-06-01'),
      testimonialReceived: false,
    }
  })

  // Create sample testimonials
  const testimonial1 = await prisma.testimonial.create({
    data: {
      customerName: 'Alice Johnson',
      customerEmail: 'alice.johnson@techcorp.com',
      customerCompany: 'TechCorp Inc.',
      customerTitle: 'Facilities Manager',
      projectName: 'Office Building Renovation',
      projectType: 'COMPLETED',
      testimonialText: 'Outstanding work on our office renovation! The team was professional, punctual, and delivered exceptional quality. The project was completed ahead of schedule and within budget. I would highly recommend their services to anyone looking for reliable construction work.',
      rating: 5,
      status: 'PUBLISHED',
      approvedByName: 'John Smith',
      approvedAt: new Date('2024-07-20'),
      publishedAt: new Date('2024-07-20'),
      featured: true,
      tags: JSON.stringify(['construction', 'renovation', 'professional', 'on-time']),
      projectId: project1.id,
    }
  })

  const testimonial2 = await prisma.testimonial.create({
    data: {
      customerName: 'David Brown',
      customerEmail: 'david.brown@retail.com',
      customerCompany: 'Retail Solutions',
      customerTitle: 'Operations Director',
      projectName: 'Store Fit-out Project',
      projectType: 'COMPLETED',
      testimonialText: 'Excellent service from start to finish. The team understood our requirements perfectly and delivered exactly what we needed. Communication was clear throughout the project, and any issues were resolved quickly.',
      rating: 4,
      status: 'APPROVED',
      approvedByName: 'Sarah Johnson',
      approvedAt: new Date('2024-08-15'),
      featured: false,
      tags: JSON.stringify(['retail', 'fit-out', 'communication', 'quality']),
    }
  })

  const testimonial3 = await prisma.testimonial.create({
    data: {
      customerName: 'Emma Thompson',
      customerEmail: 'emma.thompson@healthcare.com',
      customerCompany: 'Healthcare Systems',
      customerTitle: 'Project Manager',
      projectName: 'Medical Facility Upgrade',
      projectType: 'COMPLETED',
      testimonialText: 'Working with this team was a pleasure. They demonstrated deep expertise in healthcare construction requirements and maintained strict compliance with all regulations. The project was delivered on time and exceeded our expectations.',
      rating: 5,
      status: 'DRAFT',
      featured: true,
      tags: JSON.stringify(['healthcare', 'compliance', 'expertise', 'regulations']),
    }
  })

  // Create testimonial questionnaires
  await prisma.testimonialQuestionnaire.create({
    data: {
      testimonialId: testimonial1.id,
      questionnaireType: 'STANDARD',
      status: 'COMPLETED',
      sentDate: new Date('2024-07-01'),
      completedDate: new Date('2024-07-15'),
      expiresAt: new Date('2024-07-31'),
      emailSubject: 'Testimonial Request - Office Building Renovation',
      emailBody: 'Dear Alice,\n\nThank you for choosing us for your Office Building Renovation project. We hope you\'re satisfied with our work.\n\nWe would greatly appreciate it if you could take a few minutes to share your experience with us. Your feedback helps us improve our services and helps other customers make informed decisions.\n\nPlease click the link below to provide your testimonial:\n[Testimonial Link]\n\nThank you for your time and continued trust in our services.\n\nBest regards,\nJohn Smith',
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

  await prisma.testimonialQuestionnaire.create({
    data: {
      testimonialId: testimonial3.id,
      questionnaireType: 'STANDARD',
      status: 'SENT',
      sentDate: new Date('2024-08-01'),
      expiresAt: new Date('2024-08-31'),
      emailSubject: 'Testimonial Request - Medical Facility Upgrade',
      emailBody: 'Dear Emma,\n\nThank you for choosing us for your Medical Facility Upgrade project. We hope you\'re satisfied with our work.\n\nWe would greatly appreciate it if you could take a few minutes to share your experience with us. Your feedback helps us improve our services and helps other customers make informed decisions.\n\nPlease click the link below to provide your testimonial:\n[Testimonial Link]\n\nThank you for your time and continued trust in our services.\n\nBest regards,\nMike Wilson',
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

  // Create testimonial responses
  await prisma.testimonialResponse.create({
    data: {
      testimonialId: testimonial1.id,
      customerName: 'Alice Johnson',
      customerEmail: 'alice.johnson@techcorp.com',
      customerCompany: 'TechCorp Inc.',
      responseDate: new Date('2024-07-15'),
      overallRating: 5,
      npsScore: 10,
      responses: JSON.stringify({
        overall_satisfaction: 5,
        recommendation: 10,
        testimonial_text: 'Outstanding work on our office renovation! The team was professional, punctual, and delivered exceptional quality.',
        project_highlights: 'Professional team, on-time delivery, quality workmanship',
        improvement_suggestions: 'None - everything was perfect!'
      }),
      comments: 'Excellent service throughout the project',
      completed: true,
    }
  })

  // Update existing complaints to link to projects
  const complaint1 = await prisma.customerComplaint.findFirst({
    where: { complaintNumber: 'CC-2024-0001' }
  })

  if (complaint1) {
    await prisma.customerComplaint.update({
      where: { id: complaint1.id },
      data: { projectId: project2.id }
    })
  }

  console.log('Testimonial and project data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
