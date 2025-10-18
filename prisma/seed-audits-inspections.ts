import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding audits and inspections data...')

  // Clear existing data first
  console.log('Clearing existing audit data...')
  await prisma.auditLog.deleteMany()
  await prisma.auditFinding.deleteMany()
  await prisma.audit.deleteMany()
  await prisma.auditType.deleteMany()
  await prisma.inspectionLog.deleteMany()
  await prisma.inspectionFinding.deleteMany()
  await prisma.inspection.deleteMany()
  await prisma.inspectionType.deleteMany()

  // Create audit types
  const auditTypes = await Promise.all([
    prisma.auditType.create({
      data: {
        name: 'Internal Quality Audit',
        description: 'Internal audit of quality management system processes',
        category: 'INTERNAL',
        frequency: 'ANNUAL',
        standard: 'ISO 9001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Internal Environmental Audit',
        description: 'Internal audit of environmental management system',
        category: 'INTERNAL',
        frequency: 'ANNUAL',
        standard: 'ISO 14001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Internal OH&S Audit',
        description: 'Internal audit of occupational health and safety management system',
        category: 'INTERNAL',
        frequency: 'ANNUAL',
        standard: 'ISO 45001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Process Audit',
        description: 'Focused audit on specific processes',
        category: 'INTERNAL',
        frequency: 'QUARTERLY',
        standard: 'ISO 9001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Compliance Audit',
        description: 'Audit to verify compliance with regulations and standards',
        category: 'INTERNAL',
        frequency: 'BI_ANNUAL',
        standard: 'CUSTOM',
      },
    }),
    // External Audit Types
    prisma.auditType.create({
      data: {
        name: 'Certification Audit',
        description: 'Third-party certification audit',
        category: 'EXTERNAL',
        frequency: 'ANNUAL',
        standard: 'ISO 9001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Surveillance Audit',
        description: 'Annual surveillance audit by certification body',
        category: 'EXTERNAL',
        frequency: 'ANNUAL',
        standard: 'ISO 14001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Recertification Audit',
        description: 'Three-year recertification audit',
        category: 'EXTERNAL',
        frequency: 'TRI_ANNUAL',
        standard: 'ISO 45001',
      },
    }),
    // Supplier Audit Types
    prisma.auditType.create({
      data: {
        name: 'Supplier Quality Audit',
        description: 'Audit of supplier quality management system',
        category: 'SUPPLIER',
        frequency: 'ANNUAL',
        standard: 'ISO 9001',
      },
    }),
    prisma.auditType.create({
      data: {
        name: 'Supplier Environmental Audit',
        description: 'Audit of supplier environmental practices',
        category: 'SUPPLIER',
        frequency: 'BI_ANNUAL',
        standard: 'ISO 14001',
      },
    }),
  ])

  // Create inspection types
  const inspectionTypes = await Promise.all([
    prisma.inspectionType.create({
      data: {
        name: 'Safety Inspection',
        description: 'General safety inspection of facilities and equipment',
        category: 'SAFETY',
        frequency: 'MONTHLY',
        checklist: JSON.stringify([
          'Emergency exits clear',
          'Fire extinguishers in place',
          'Safety equipment functional',
          'Work areas clean and organized',
          'PPE available and in good condition'
        ]),
      },
    }),
    prisma.inspectionType.create({
      data: {
        name: 'Environmental Inspection',
        description: 'Environmental compliance inspection',
        category: 'ENVIRONMENTAL',
        frequency: 'QUARTERLY',
        checklist: JSON.stringify([
          'Waste management procedures followed',
          'Spill containment measures in place',
          'Environmental permits current',
          'Emission controls functioning',
          'Water management systems operational'
        ]),
      },
    }),
    prisma.inspectionType.create({
      data: {
        name: 'Equipment Inspection',
        description: 'Regular inspection of production equipment',
        category: 'EQUIPMENT',
        frequency: 'WEEKLY',
        checklist: JSON.stringify([
          'Equipment functioning properly',
          'Maintenance records up to date',
          'Safety guards in place',
          'Calibration certificates current',
          'No visible damage or wear'
        ]),
      },
    }),
    prisma.inspectionType.create({
      data: {
        name: 'Facility Inspection',
        description: 'General facility condition inspection',
        category: 'FACILITY',
        frequency: 'MONTHLY',
        checklist: JSON.stringify([
          'Building structure sound',
          'HVAC systems operational',
          'Lighting adequate',
          'Security systems functional',
          'Accessibility compliance'
        ]),
      },
    }),
    prisma.inspectionType.create({
      data: {
        name: 'Quality Inspection',
        description: 'Product and process quality inspection',
        category: 'QUALITY',
        frequency: 'DAILY',
        checklist: JSON.stringify([
          'Product specifications met',
          'Process parameters within limits',
          'Quality records complete',
          'Calibration current',
          'Non-conforming material controlled'
        ]),
      },
    }),
  ])

  // Generate 25 detailed internal audits for different processes
  const internalAuditData = [
    {
      process: 'Document Control',
      title: 'Internal Audit - Document Control System',
      description: 'Comprehensive audit of document control processes including creation, approval, distribution, and archival procedures.',
      scope: 'Document control system including procedures, records, and personnel',
      objectives: 'Verify compliance with ISO 9001 requirements, assess process effectiveness, and identify improvement opportunities',
      auditee: 'Quality Manager',
      location: 'Main Office',
      auditor: 'John Smith',
      plannedMonth: 0, // January
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 2,
      nonConformities: 0,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Management Review',
      title: 'Internal Audit - Management Review Process',
      description: 'Audit of management review meetings, inputs, outputs, and follow-up actions to ensure effective management oversight.',
      scope: 'Management review process including meetings, records, and follow-up actions',
      objectives: 'Verify compliance with ISO 9001 clause 9.3 and assess management commitment',
      auditee: 'Operations Manager',
      location: 'Main Office',
      auditor: 'Sarah Johnson',
      plannedMonth: 1, // February
      status: 'IN_PROGRESS',
      ragStatus: 'AMBER',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 0
    },
    {
      process: 'Internal Audit',
      title: 'Internal Audit - Internal Audit Program',
      description: 'Audit of the internal audit program including planning, execution, reporting, and follow-up processes.',
      scope: 'Internal audit program including procedures, schedules, and auditor competence',
      objectives: 'Verify compliance with ISO 9001 clause 9.2 and assess program effectiveness',
      auditee: 'Quality Manager',
      location: 'Main Office',
      auditor: 'Mike Wilson',
      plannedMonth: 2, // March
      status: 'PLANNED',
      ragStatus: 'GREEN',
      findings: 0,
      nonConformities: 0,
      observations: 0,
      opportunities: 0
    },
    {
      process: 'Corrective Action',
      title: 'Internal Audit - Corrective Action Process',
      description: 'Audit of corrective action processes including non-conformity handling, root cause analysis, and effectiveness verification.',
      scope: 'Corrective action process including procedures, records, and personnel',
      objectives: 'Verify compliance with ISO 9001 clause 10.2 and assess process effectiveness',
      auditee: 'Operations Manager',
      location: 'Production Floor',
      auditor: 'Lisa Davis',
      plannedMonth: 3, // April
      status: 'COMPLETED',
      ragStatus: 'RED',
      findings: 5,
      nonConformities: 2,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Training',
      title: 'Internal Audit - Training and Competence',
      description: 'Audit of training processes including needs identification, delivery, evaluation, and competence assessment.',
      scope: 'Training process including procedures, records, and personnel competence',
      objectives: 'Verify compliance with ISO 9001 clause 7.2 and assess training effectiveness',
      auditee: 'HR Manager',
      location: 'Training Room',
      auditor: 'Robert Brown',
      plannedMonth: 4, // May
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 2
    },
    {
      process: 'Risk Management',
      title: 'Internal Audit - Risk Management Process',
      description: 'Audit of risk management processes including identification, assessment, treatment, and monitoring of risks.',
      scope: 'Risk management process including procedures, records, and risk register',
      objectives: 'Verify compliance with ISO 9001 clause 6.1 and assess risk management effectiveness',
      auditee: 'Operations Manager',
      location: 'Main Office',
      auditor: 'Jennifer Taylor',
      plannedMonth: 5, // June
      status: 'IN_PROGRESS',
      ragStatus: 'AMBER',
      findings: 3,
      nonConformities: 1,
      observations: 2,
      opportunities: 0
    },
    {
      process: 'Supplier Management',
      title: 'Internal Audit - Supplier Management Process',
      description: 'Audit of supplier management processes including evaluation, selection, monitoring, and performance assessment.',
      scope: 'Supplier management process including procedures, records, and supplier evaluations',
      objectives: 'Verify compliance with ISO 9001 clause 8.4 and assess supplier performance',
      auditee: 'Purchasing Manager',
      location: 'Main Office',
      auditor: 'David Anderson',
      plannedMonth: 6, // July
      status: 'PLANNED',
      ragStatus: 'GREEN',
      findings: 0,
      nonConformities: 0,
      observations: 0,
      opportunities: 0
    },
    {
      process: 'Customer Satisfaction',
      title: 'Internal Audit - Customer Satisfaction Process',
      description: 'Audit of customer satisfaction processes including feedback collection, analysis, and improvement actions.',
      scope: 'Customer satisfaction process including procedures, records, and feedback analysis',
      objectives: 'Verify compliance with ISO 9001 clause 9.1.2 and assess customer satisfaction',
      auditee: 'Customer Service Manager',
      location: 'Main Office',
      auditor: 'Maria Garcia',
      plannedMonth: 7, // August
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 2,
      nonConformities: 0,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Quality Planning',
      title: 'Internal Audit - Quality Planning Process',
      description: 'Audit of quality planning processes including objectives setting, planning, and resource allocation.',
      scope: 'Quality planning process including procedures, records, and quality objectives',
      objectives: 'Verify compliance with ISO 9001 clause 6.2 and assess planning effectiveness',
      auditee: 'Quality Manager',
      location: 'Main Office',
      auditor: 'James Miller',
      plannedMonth: 8, // September
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 1
    },
    {
      process: 'Process Control',
      title: 'Internal Audit - Process Control System',
      description: 'Audit of process control systems including monitoring, measurement, and control of production processes.',
      scope: 'Process control system including procedures, records, and control parameters',
      objectives: 'Verify compliance with ISO 9001 clause 8.5.1 and assess process control effectiveness',
      auditee: 'Production Supervisor',
      location: 'Production Floor',
      auditor: 'Susan White',
      plannedMonth: 9, // October
      status: 'IN_PROGRESS',
      ragStatus: 'AMBER',
      findings: 4,
      nonConformities: 1,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Product Realization',
      title: 'Internal Audit - Product Realization Process',
      description: 'Audit of product realization processes including design, development, production, and delivery.',
      scope: 'Product realization process including procedures, records, and production activities',
      objectives: 'Verify compliance with ISO 9001 clause 8 and assess product realization effectiveness',
      auditee: 'Production Manager',
      location: 'Production Floor',
      auditor: 'John Smith',
      plannedMonth: 10, // November
      status: 'PLANNED',
      ragStatus: 'GREEN',
      findings: 0,
      nonConformities: 0,
      observations: 0,
      opportunities: 0
    },
    {
      process: 'Measurement & Analysis',
      title: 'Internal Audit - Measurement and Analysis Process',
      description: 'Audit of measurement and analysis processes including data collection, analysis, and reporting.',
      scope: 'Measurement and analysis process including procedures, records, and analytical methods',
      objectives: 'Verify compliance with ISO 9001 clause 9.1 and assess measurement effectiveness',
      auditee: 'Quality Manager',
      location: 'Quality Control Lab',
      auditor: 'Sarah Johnson',
      plannedMonth: 11, // December
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 2,
      nonConformities: 0,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Continual Improvement',
      title: 'Internal Audit - Continual Improvement Process',
      description: 'Audit of continual improvement processes including improvement identification, implementation, and monitoring.',
      scope: 'Continual improvement process including procedures, records, and improvement projects',
      objectives: 'Verify compliance with ISO 9001 clause 10.3 and assess improvement effectiveness',
      auditee: 'Operations Manager',
      location: 'Main Office',
      auditor: 'Mike Wilson',
      plannedMonth: 0, // January (next year)
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 2
    },
    {
      process: 'Environmental Management',
      title: 'Internal Audit - Environmental Management System',
      description: 'Audit of environmental management processes including environmental aspects, objectives, and programs.',
      scope: 'Environmental management system including procedures, records, and environmental programs',
      objectives: 'Verify compliance with ISO 14001 requirements and assess environmental performance',
      auditee: 'Environmental Coordinator',
      location: 'Main Office',
      auditor: 'Lisa Davis',
      plannedMonth: 1, // February
      status: 'IN_PROGRESS',
      ragStatus: 'AMBER',
      findings: 3,
      nonConformities: 1,
      observations: 2,
      opportunities: 0
    },
    {
      process: 'Health & Safety',
      title: 'Internal Audit - Health and Safety Management',
      description: 'Audit of health and safety processes including hazard identification, risk assessment, and control measures.',
      scope: 'Health and safety management system including procedures, records, and safety programs',
      objectives: 'Verify compliance with ISO 45001 requirements and assess safety performance',
      auditee: 'Safety Officer',
      location: 'Production Floor',
      auditor: 'Robert Brown',
      plannedMonth: 2, // March
      status: 'COMPLETED',
      ragStatus: 'RED',
      findings: 6,
      nonConformities: 3,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Emergency Preparedness',
      title: 'Internal Audit - Emergency Preparedness and Response',
      description: 'Audit of emergency preparedness processes including emergency plans, procedures, and response capabilities.',
      scope: 'Emergency preparedness system including procedures, records, and emergency equipment',
      objectives: 'Verify compliance with ISO 45001 clause 8.2 and assess emergency preparedness',
      auditee: 'Safety Officer',
      location: 'Production Floor',
      auditor: 'Jennifer Taylor',
      plannedMonth: 3, // April
      status: 'PLANNED',
      ragStatus: 'GREEN',
      findings: 0,
      nonConformities: 0,
      observations: 0,
      opportunities: 0
    },
    {
      process: 'Waste Management',
      title: 'Internal Audit - Waste Management Process',
      description: 'Audit of waste management processes including waste identification, handling, storage, and disposal.',
      scope: 'Waste management process including procedures, records, and waste handling facilities',
      objectives: 'Verify compliance with environmental requirements and assess waste management effectiveness',
      auditee: 'Environmental Coordinator',
      location: 'Warehouse',
      auditor: 'David Anderson',
      plannedMonth: 4, // May
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 2,
      nonConformities: 0,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Energy Management',
      title: 'Internal Audit - Energy Management Process',
      description: 'Audit of energy management processes including energy consumption monitoring and efficiency improvements.',
      scope: 'Energy management process including procedures, records, and energy monitoring systems',
      objectives: 'Verify compliance with energy management requirements and assess energy efficiency',
      auditee: 'Facilities Manager',
      location: 'Main Office',
      auditor: 'Maria Garcia',
      plannedMonth: 5, // June
      status: 'IN_PROGRESS',
      ragStatus: 'AMBER',
      findings: 2,
      nonConformities: 0,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Incident Management',
      title: 'Internal Audit - Incident Management Process',
      description: 'Audit of incident management processes including incident reporting, investigation, and corrective actions.',
      scope: 'Incident management process including procedures, records, and incident investigation reports',
      objectives: 'Verify compliance with safety requirements and assess incident management effectiveness',
      auditee: 'Safety Officer',
      location: 'Production Floor',
      auditor: 'James Miller',
      plannedMonth: 6, // July
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 1
    },
    {
      process: 'Compliance Monitoring',
      title: 'Internal Audit - Compliance Monitoring Process',
      description: 'Audit of compliance monitoring processes including regulatory compliance tracking and reporting.',
      scope: 'Compliance monitoring process including procedures, records, and compliance tracking systems',
      objectives: 'Verify compliance with applicable regulations and assess compliance monitoring effectiveness',
      auditee: 'Compliance Officer',
      location: 'Main Office',
      auditor: 'Susan White',
      plannedMonth: 7, // August
      status: 'PLANNED',
      ragStatus: 'GREEN',
      findings: 0,
      nonConformities: 0,
      observations: 0,
      opportunities: 0
    },
    {
      process: 'Design & Development',
      title: 'Internal Audit - Design and Development Process',
      description: 'Audit of design and development processes including design planning, review, verification, and validation.',
      scope: 'Design and development process including procedures, records, and design activities',
      objectives: 'Verify compliance with ISO 9001 clause 8.3 and assess design process effectiveness',
      auditee: 'Design Manager',
      location: 'Design Office',
      auditor: 'John Smith',
      plannedMonth: 8, // September
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 2,
      nonConformities: 0,
      observations: 2,
      opportunities: 1
    },
    {
      process: 'Purchasing',
      title: 'Internal Audit - Purchasing Process',
      description: 'Audit of purchasing processes including supplier evaluation, purchase order management, and receiving.',
      scope: 'Purchasing process including procedures, records, and purchasing activities',
      objectives: 'Verify compliance with ISO 9001 clause 8.4 and assess purchasing effectiveness',
      auditee: 'Purchasing Manager',
      location: 'Main Office',
      auditor: 'Sarah Johnson',
      plannedMonth: 9, // October
      status: 'IN_PROGRESS',
      ragStatus: 'AMBER',
      findings: 3,
      nonConformities: 1,
      observations: 2,
      opportunities: 0
    },
    {
      process: 'Production Control',
      title: 'Internal Audit - Production Control Process',
      description: 'Audit of production control processes including production planning, scheduling, and monitoring.',
      scope: 'Production control process including procedures, records, and production activities',
      objectives: 'Verify compliance with ISO 9001 clause 8.5 and assess production control effectiveness',
      auditee: 'Production Manager',
      location: 'Production Floor',
      auditor: 'Mike Wilson',
      plannedMonth: 10, // November
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 1
    },
    {
      process: 'Service Delivery',
      title: 'Internal Audit - Service Delivery Process',
      description: 'Audit of service delivery processes including service planning, execution, and customer feedback.',
      scope: 'Service delivery process including procedures, records, and service activities',
      objectives: 'Verify compliance with ISO 9001 clause 8.5 and assess service delivery effectiveness',
      auditee: 'Service Manager',
      location: 'Service Center',
      auditor: 'Lisa Davis',
      plannedMonth: 11, // December
      status: 'PLANNED',
      ragStatus: 'GREEN',
      findings: 0,
      nonConformities: 0,
      observations: 0,
      opportunities: 0
    },
    {
      process: 'Customer Communication',
      title: 'Internal Audit - Customer Communication Process',
      description: 'Audit of customer communication processes including inquiry handling, complaint management, and feedback collection.',
      scope: 'Customer communication process including procedures, records, and communication activities',
      objectives: 'Verify compliance with ISO 9001 clause 8.2.1 and assess communication effectiveness',
      auditee: 'Customer Service Manager',
      location: 'Customer Service Center',
      auditor: 'Robert Brown',
      plannedMonth: 0, // January (next year)
      status: 'COMPLETED',
      ragStatus: 'GREEN',
      findings: 1,
      nonConformities: 0,
      observations: 1,
      opportunities: 1
    }
  ]

  const auditors = [
    'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Davis', 'Robert Brown',
    'Jennifer Taylor', 'David Anderson', 'Maria Garcia', 'James Miller', 'Susan White'
  ]

  const auditees = [
    'Quality Manager', 'Operations Manager', 'HR Manager', 'Finance Manager', 'IT Manager',
    'Production Supervisor', 'Maintenance Manager', 'Environmental Coordinator', 'Safety Officer', 'Training Coordinator'
  ]

  const locations = [
    'Main Office', 'Production Floor', 'Warehouse', 'Laboratory', 'Administrative Building',
    'Maintenance Shop', 'Quality Control Lab', 'Shipping Department', 'Receiving Area', 'Training Room'
  ]

  const audits = []
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < internalAuditData.length; i++) {
    const auditData = internalAuditData[i]
    const internalAuditType = auditTypes.find(type => type.category === 'INTERNAL')
    
    if (!internalAuditType) continue

    const plannedStartDate = new Date(currentYear, auditData.plannedMonth, 1)
    const plannedEndDate = new Date(currentYear, auditData.plannedMonth, 15)
    
    // Calculate actual dates based on status
    let actualStartDate = null
    let actualEndDate = null
    
    if (auditData.status === 'COMPLETED' || auditData.status === 'IN_PROGRESS') {
      actualStartDate = new Date(plannedStartDate)
      if (auditData.status === 'COMPLETED') {
        actualEndDate = new Date(plannedEndDate)
      }
    }

    const audit = await prisma.audit.create({
      data: {
        auditNumber: `AUD-${currentYear}-${String(i + 1).padStart(4, '0')}`,
        auditTypeId: internalAuditType.id,
        title: auditData.title,
        description: auditData.description,
        scope: auditData.scope,
        objectives: auditData.objectives,
        auditStandard: 'ISO 9001',
        auditCriteria: 'Internal audit criteria and procedures',
        plannedStartDate,
        plannedEndDate,
        actualStartDate,
        actualEndDate,
        status: auditData.status,
        ragStatus: auditData.ragStatus,
        leadAuditor: `AUD-${Math.floor(Math.random() * 1000)}`,
        leadAuditorName: auditData.auditor,
        auditTeam: JSON.stringify([auditData.auditor]),
        auditee: `DEPT-${Math.floor(Math.random() * 100)}`,
        auditeeName: auditData.auditee,
        location: auditData.location,
        auditMethod: 'ON_SITE',
        findings: auditData.findings,
        nonConformities: auditData.nonConformities,
        observations: auditData.observations,
        opportunities: auditData.opportunities,
        effectiveness: auditData.status === 'COMPLETED' ? Math.floor(Math.random() * 3) + 3 : null,
        notes: auditData.status === 'COMPLETED' ? `Audit completed successfully. ${auditData.findings} findings identified requiring corrective action.` : null,
      },
    })

    audits.push(audit)

    // Create audit log entries
    await prisma.auditLog.create({
      data: {
        auditId: audit.id,
        action: 'CREATED',
        performedBy: 'system',
        comments: 'Audit created and scheduled',
      },
    })

    if (actualStartDate) {
      await prisma.auditLog.create({
        data: {
          auditId: audit.id,
          action: 'STARTED',
          performedBy: auditData.auditor,
          comments: 'Audit commenced',
        },
      })
    }

    if (actualEndDate) {
      await prisma.auditLog.create({
        data: {
          auditId: audit.id,
          action: 'COMPLETED',
          performedBy: auditData.auditor,
          comments: 'Audit completed successfully',
        },
      })
    }

    // Create some audit findings for completed audits
    if (auditData.status === 'COMPLETED' && auditData.findings > 0) {
      const findingTypes = ['NON_CONFORMITY', 'OBSERVATION', 'OPPORTUNITY_FOR_IMPROVEMENT']
      const severities = ['MAJOR', 'MINOR', 'OBSERVATION', 'OFI']
      
      for (let j = 0; j < auditData.findings; j++) {
        const findingType = findingTypes[Math.floor(Math.random() * findingTypes.length)]
        const severity = severities[Math.floor(Math.random() * severities.length)]
        
        await prisma.auditFinding.create({
          data: {
            auditId: audit.id,
            findingNumber: `${audit.auditNumber}-F${String(j + 1).padStart(3, '0')}`,
            type: findingType,
            severity,
            clause: `ISO 9001 7.${Math.floor(Math.random() * 5) + 1}`,
            description: `Finding related to ${auditData.process} process implementation`,
            evidence: 'Document review and interviews conducted',
            rootCause: 'Process not fully implemented as per procedure',
            correctiveAction: 'Update procedure and provide training',
            responsible: auditData.auditee,
            dueDate: new Date(actualEndDate!.getTime() + 30 * 24 * 60 * 60 * 1000),
            status: Math.random() > 0.5 ? 'OPEN' : 'IN_PROGRESS',
          },
        })
      }
    }
  }

  // Generate 10 external audits
  const externalAuditTypes = auditTypes.filter(type => type.category === 'EXTERNAL')
  const externalAudits = []
  
  for (let i = 0; i < 10; i++) {
    const auditType = externalAuditTypes[Math.floor(Math.random() * externalAuditTypes.length)]
    const month = Math.floor(Math.random() * 12)
    const day = Math.floor(Math.random() * 28) + 1
    const plannedStartDate = new Date(currentYear, month, day)
    const plannedEndDate = new Date(plannedStartDate.getTime() + (Math.random() * 3 + 2) * 24 * 60 * 60 * 1000)
    
    let status = 'PLANNED'
    let ragStatus = 'GREEN'
    let actualStartDate = null
    let actualEndDate = null
    
    if (plannedStartDate < new Date()) {
      status = Math.random() > 0.1 ? 'COMPLETED' : 'IN_PROGRESS'
      if (status === 'COMPLETED') {
        actualStartDate = new Date(plannedStartDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
        actualEndDate = new Date(actualStartDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000)
      } else {
        actualStartDate = new Date(plannedStartDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
      }
    }

    const audit = await prisma.audit.create({
      data: {
        auditNumber: `EXT-${currentYear}-${String(i + 1).padStart(4, '0')}`,
        auditTypeId: auditType.id,
        title: `${auditType.name} - ${auditType.standard}`,
        description: `Third-party ${auditType.name.toLowerCase()} to verify compliance with ${auditType.standard} requirements`,
        scope: `Complete management system audit for ${auditType.standard} certification`,
        objectives: `Verify compliance with ${auditType.standard} requirements and maintain certification`,
        auditStandard: auditType.standard || 'ISO 9001',
        auditCriteria: `${auditType.standard} clauses 4-10 and applicable regulations`,
        plannedStartDate,
        plannedEndDate,
        actualStartDate,
        actualEndDate,
        status,
        ragStatus,
        leadAuditor: `EXT-AUD-${Math.floor(Math.random() * 1000)}`,
        leadAuditorName: `External Auditor ${i + 1}`,
        auditTeam: JSON.stringify([`External Auditor ${i + 1}`, `Certification Body Representative`]),
        auditee: 'MANAGEMENT',
        auditeeName: 'Management Team',
        location: 'Main Facility',
        auditMethod: 'ON_SITE',
        findings: Math.floor(Math.random() * 5),
        nonConformities: Math.floor(Math.random() * 2),
        observations: Math.floor(Math.random() * 3),
        opportunities: Math.floor(Math.random() * 2),
        effectiveness: status === 'COMPLETED' ? Math.floor(Math.random() * 2) + 4 : null,
        notes: status === 'COMPLETED' ? `External audit completed successfully. Certification maintained.` : null,
        createdBy: 'system',
      },
    })

    externalAudits.push(audit)
  }

  // Generate 8 supplier audits
  const supplierAuditTypes = auditTypes.filter(type => type.category === 'SUPPLIER')
  const supplierAudits = []
  
  const suppliers = [
    'ABC Manufacturing Ltd',
    'XYZ Components Inc',
    'Global Materials Co',
    'Tech Solutions Ltd',
    'Quality Parts Inc',
    'Reliable Suppliers Co',
    'Premium Materials Ltd',
    'Standard Components Inc'
  ]
  
  for (let i = 0; i < 8; i++) {
    const auditType = supplierAuditTypes[Math.floor(Math.random() * supplierAuditTypes.length)]
    const supplier = suppliers[i]
    const month = Math.floor(Math.random() * 12)
    const day = Math.floor(Math.random() * 28) + 1
    const plannedStartDate = new Date(currentYear, month, day)
    const plannedEndDate = new Date(plannedStartDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000)
    
    let status = 'PLANNED'
    let ragStatus = 'GREEN'
    let actualStartDate = null
    let actualEndDate = null
    
    if (plannedStartDate < new Date()) {
      status = Math.random() > 0.2 ? 'COMPLETED' : 'IN_PROGRESS'
      if (status === 'COMPLETED') {
        actualStartDate = new Date(plannedStartDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
        actualEndDate = new Date(actualStartDate.getTime() + (Math.random() * 2 + 1) * 24 * 60 * 60 * 1000)
      } else {
        actualStartDate = new Date(plannedStartDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
      }
    }

    const audit = await prisma.audit.create({
      data: {
        auditNumber: `SUP-${currentYear}-${String(i + 1).padStart(4, '0')}`,
        auditTypeId: auditType.id,
        title: `${auditType.name} - ${supplier}`,
        description: `Supplier audit of ${supplier} to verify compliance with quality and environmental requirements`,
        scope: `${supplier} quality management system and environmental practices`,
        objectives: `Verify supplier compliance with requirements and assess capability`,
        auditStandard: auditType.standard || 'ISO 9001',
        auditCriteria: `${auditType.standard} requirements and supplier agreement terms`,
        plannedStartDate,
        plannedEndDate,
        actualStartDate,
        actualEndDate,
        status,
        ragStatus,
        leadAuditor: `SUP-AUD-${Math.floor(Math.random() * 1000)}`,
        leadAuditorName: `Supplier Auditor ${i + 1}`,
        auditTeam: JSON.stringify([`Supplier Auditor ${i + 1}`]),
        auditee: 'SUPPLIER',
        auditeeName: supplier,
        location: `${supplier} Facility`,
        auditMethod: 'ON_SITE',
        findings: Math.floor(Math.random() * 4),
        nonConformities: Math.floor(Math.random() * 2),
        observations: Math.floor(Math.random() * 2),
        opportunities: Math.floor(Math.random() * 2),
        effectiveness: status === 'COMPLETED' ? Math.floor(Math.random() * 2) + 3 : null,
        notes: status === 'COMPLETED' ? `Supplier audit completed. ${supplier} meets requirements.` : null,
        createdBy: 'system',
      },
    })

    supplierAudits.push(audit)
  }

  // Create some inspections
  const inspections = []
  for (let i = 0; i < 15; i++) {
    const inspectionType = inspectionTypes[i % inspectionTypes.length]
    const inspector = auditors[Math.floor(Math.random() * auditors.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    
    const month = Math.floor(Math.random() * 12)
    const day = Math.floor(Math.random() * 28) + 1
    const plannedDate = new Date(currentYear, month, day)
    
    let status = 'PLANNED'
    let ragStatus = 'GREEN'
    let actualDate = null
    
    if (plannedDate < new Date()) {
      status = Math.random() > 0.1 ? 'COMPLETED' : 'CANCELLED'
      if (status === 'COMPLETED') {
        actualDate = new Date(plannedDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
      }
    }

    const inspection = await prisma.inspection.create({
      data: {
        inspectionNumber: `INS-${currentYear}-${String(i + 1).padStart(4, '0')}`,
        inspectionTypeId: inspectionType.id,
        title: `${inspectionType.name} - ${location}`,
        description: `Regular ${inspectionType.name.toLowerCase()} of ${location}`,
        location,
        inspector: `INS-${Math.floor(Math.random() * 1000)}`,
        inspectorName: inspector,
        plannedDate,
        actualDate,
        status,
        ragStatus,
        findings: Math.floor(Math.random() * 5),
        criticalIssues: Math.floor(Math.random() * 2),
        minorIssues: Math.floor(Math.random() * 4),
        observations: Math.floor(Math.random() * 3),
        score: status === 'COMPLETED' ? Math.floor(Math.random() * 20) + 80 : null,
        maxScore: 100,
        notes: status === 'COMPLETED' ? 'Inspection completed with minor issues identified' : null,
      },
    })

    inspections.push(inspection)

    // Create inspection log
    await prisma.inspectionLog.create({
      data: {
        inspectionId: inspection.id,
        action: 'CREATED',
        performedBy: 'system',
        comments: 'Inspection scheduled',
      },
    })

    if (actualDate) {
      await prisma.inspectionLog.create({
        data: {
          inspectionId: inspection.id,
          action: 'COMPLETED',
          performedBy: inspector,
          comments: 'Inspection completed',
        },
      })
    }
  }

  console.log('Audits and inspections data seeded successfully!')
  console.log(`Created ${auditTypes.length} audit types`)
  console.log(`Created ${inspectionTypes.length} inspection types`)
  console.log(`Created ${audits.length} internal audits`)
  console.log(`Created ${externalAudits.length} external audits`)
  console.log(`Created ${supplierAudits.length} supplier audits`)
  console.log(`Created ${inspections.length} inspections`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
