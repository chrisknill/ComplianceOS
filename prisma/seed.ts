import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.nCAuditLog.deleteMany()
  await prisma.nCAction.deleteMany()
  await prisma.nonConformance.deleteMany()
  await prisma.oHSMetric.deleteMany()
  await prisma.emergencyDrill.deleteMany()
  await prisma.healthSurveillance.deleteMany()
  await prisma.oHSCompetence.deleteMany()
  await prisma.contractor.deleteMany()
  await prisma.permitApproval.deleteMany()
  await prisma.permit.deleteMany()
  await prisma.action.deleteMany()
  await prisma.investigation.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.oHSAudit.deleteMany()
  await prisma.oHSHazard.deleteMany()
  await prisma.registerEntry.deleteMany()
  await prisma.calibration.deleteMany()
  await prisma.equipment.deleteMany()
  await prisma.riskApproval.deleteMany()
  await prisma.risk.deleteMany()
  await prisma.trainingRecord.deleteMany()
  await prisma.course.deleteMany()
  await prisma.documentVersion.deleteMany()
  await prisma.documentApproval.deleteMany()
  await prisma.document.deleteMany()
  await prisma.user.deleteMany()

  // Create users with comprehensive data including groups and departments
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  // Create Chris Knill as CEO first (for n8n testing)
  const chrisKnill = await prisma.user.create({
    data: {
      email: 'christopher.knill@gmail.com',
      password: hashedPassword,
      name: 'Chris Knill',
      role: 'ADMIN',
      jobTitle: 'Chief Executive Officer',
      department: 'Executive',
      phone: '+44 7700 900000',
      startDate: new Date('2020-01-01'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Management', 'Directors', 'Compliance']),
    },
  })

  // Create managers first
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@complianceos.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      jobTitle: 'System Administrator',
      department: 'IT',
      phone: '+44 7700 900001',
      startDate: new Date('2021-03-15'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Admin', 'IT']),
    },
  })

  const johnSmith = await prisma.user.create({
    data: {
      email: 'john.smith@complianceos.com',
      password: hashedPassword,
      name: 'John Smith',
      role: 'USER',
      jobTitle: 'Quality Manager',
      department: 'Quality',
      phone: '+44 7700 900002',
      startDate: new Date('2019-06-01'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Management', 'Quality', 'Compliance']),
      managerId: chrisKnill.id,
    },
  })

  const sarahJones = await prisma.user.create({
    data: {
      email: 'sarah.jones@complianceos.com',
      password: hashedPassword,
      name: 'Sarah Jones',
      role: 'USER',
      jobTitle: 'HSE Manager',
      department: 'HSE',
      phone: '+44 7700 900003',
      startDate: new Date('2018-09-15'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Management', 'HSE', 'Compliance']),
      managerId: chrisKnill.id,
    },
  })

  const mikeBrown = await prisma.user.create({
    data: {
      email: 'mike.brown@complianceos.com',
      password: hashedPassword,
      name: 'Mike Brown',
      role: 'USER',
      jobTitle: 'Operations Manager',
      department: 'Operations',
      phone: '+44 7700 900004',
      startDate: new Date('2020-02-01'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Management', 'Operations']),
      managerId: chrisKnill.id,
    },
  })

  const emmaWilson = await prisma.user.create({
    data: {
      email: 'emma.wilson@complianceos.com',
      password: hashedPassword,
      name: 'Emma Wilson',
      role: 'USER',
      jobTitle: 'HR Manager',
      department: 'HR',
      phone: '+44 7700 900005',
      startDate: new Date('2019-11-01'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Management', 'HR', 'Admin']),
      managerId: chrisKnill.id,
    },
  })

  const davidTaylor = await prisma.user.create({
    data: {
      email: 'david.taylor@complianceos.com',
      password: hashedPassword,
      name: 'David Taylor',
      role: 'USER',
      jobTitle: 'Finance Manager',
      department: 'Accounts',
      phone: '+44 7700 900006',
      startDate: new Date('2021-01-15'),
      location: 'Head Office',
      status: 'ACTIVE',
      groups: JSON.stringify(['Management', 'Accounts']),
      managerId: chrisKnill.id,
    },
  })

  // Now create subordinates
  const users = await Promise.all([
    // Quality Inspector
    prisma.user.create({
      data: {
        email: 'lisa.garcia@complianceos.com',
        password: hashedPassword,
        name: 'Lisa Garcia',
        role: 'USER',
        jobTitle: 'Quality Inspector',
        department: 'Quality',
        phone: '+44 7700 900007',
        startDate: new Date('2022-03-01'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['Quality']),
        managerId: johnSmith.id,
      },
    }),
    // HSE Officer
    prisma.user.create({
      data: {
        email: 'james.miller@complianceos.com',
        password: hashedPassword,
        name: 'James Miller',
        role: 'USER',
        jobTitle: 'HSE Officer',
        department: 'HSE',
        phone: '+44 7700 900008',
        startDate: new Date('2021-08-15'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['HSE']),
        managerId: sarahJones.id,
      },
    }),
    // Operations Supervisor
    prisma.user.create({
      data: {
        email: 'anna.davis@complianceos.com',
        password: hashedPassword,
        name: 'Anna Davis',
        role: 'USER',
        jobTitle: 'Operations Supervisor',
        department: 'Operations',
        phone: '+44 7700 900009',
        startDate: new Date('2020-07-01'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['Operations']),
        managerId: mikeBrown.id,
      },
    }),
    // HR Coordinator
    prisma.user.create({
      data: {
        email: 'robert.clark@complianceos.com',
        password: hashedPassword,
        name: 'Robert Clark',
        role: 'USER',
        jobTitle: 'HR Coordinator',
        department: 'HR',
        phone: '+44 7700 900010',
        startDate: new Date('2022-01-15'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['HR', 'Admin']),
        managerId: emmaWilson.id,
      },
    }),
    // Accounts Assistant
    prisma.user.create({
      data: {
        email: 'sophie.white@complianceos.com',
        password: hashedPassword,
        name: 'Sophie White',
        role: 'USER',
        jobTitle: 'Accounts Assistant',
        department: 'Accounts',
        phone: '+44 7700 900011',
        startDate: new Date('2021-05-01'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['Accounts']),
        managerId: davidTaylor.id,
      },
    }),
    // IT Support Technician
    prisma.user.create({
      data: {
        email: 'alex.moore@complianceos.com',
        password: hashedPassword,
        name: 'Alex Moore',
        role: 'USER',
        jobTitle: 'IT Support Technician',
        department: 'IT',
        phone: '+44 7700 900012',
        startDate: new Date('2022-06-01'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['IT']),
        managerId: adminUser.id,
      },
    }),
    // Compliance Officer
    prisma.user.create({
      data: {
        email: 'jessica.thompson@complianceos.com',
        password: hashedPassword,
        name: 'Jessica Thompson',
        role: 'USER',
        jobTitle: 'Compliance Officer',
        department: 'Compliance',
        phone: '+44 7700 900013',
        startDate: new Date('2021-09-01'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['Compliance', 'Quality']),
        managerId: chrisKnill.id,
      },
    }),
    // Director of Operations
    prisma.user.create({
      data: {
        email: 'michael.anderson@complianceos.com',
        password: hashedPassword,
        name: 'Michael Anderson',
        role: 'USER',
        jobTitle: 'Director of Operations',
        department: 'Operations',
        phone: '+44 7700 900014',
        startDate: new Date('2018-01-01'),
        location: 'Head Office',
        status: 'ACTIVE',
        groups: JSON.stringify(['Directors', 'Management', 'Operations']),
        managerId: chrisKnill.id,
      },
    }),
    // Employee on Leave
    prisma.user.create({
      data: {
        email: 'jennifer.lee@complianceos.com',
        password: hashedPassword,
        name: 'Jennifer Lee',
        role: 'USER',
        jobTitle: 'Quality Analyst',
        department: 'Quality',
        phone: '+44 7700 900015',
        startDate: new Date('2020-04-01'),
        location: 'Head Office',
        status: 'ON_LEAVE',
        groups: JSON.stringify(['Quality']),
        managerId: johnSmith.id,
      },
    }),
  ])

  // Combine all users
  const allUsers = [chrisKnill, adminUser, johnSmith, sarahJones, mikeBrown, emmaWilson, davidTaylor, ...users]

  console.log(`✅ Created ${allUsers.length} users`)

  // Create documents
  const documents = await Promise.all([
    // Policies
    prisma.document.create({
      data: {
        type: 'POLICY',
        title: 'Quality Policy',
        code: 'POL-001',
        version: '2.0',
        status: 'APPROVED',
        owner: 'Admin User',
        nextReview: new Date('2025-12-31'),
        isoClauses: JSON.stringify(['9001:5.2', '9001:5.3']),
        url: '/docs/quality-policy.pdf',
      },
    }),
    prisma.document.create({
      data: {
        type: 'POLICY',
        title: 'Environmental Policy',
        code: 'POL-002',
        version: '1.5',
        status: 'APPROVED',
        owner: 'Admin User',
        nextReview: new Date('2025-11-30'),
        isoClauses: JSON.stringify(['14001:5.2', '14001:5.3']),
        url: '/docs/environmental-policy.pdf',
      },
    }),
    prisma.document.create({
      data: {
        type: 'POLICY',
        title: 'Health & Safety Policy',
        code: 'POL-003',
        version: '1.0',
        status: 'APPROVED',
        owner: 'Sarah Jones',
        nextReview: new Date('2026-01-15'),
        isoClauses: JSON.stringify(['9001:7.1.4']),
      },
    }),
    // Procedures
    prisma.document.create({
      data: {
        type: 'PROCEDURE',
        title: 'Document Control Procedure',
        code: 'PROC-001',
        version: '3.0',
        status: 'APPROVED',
        owner: 'John Smith',
        nextReview: new Date('2025-10-31'),
        isoClauses: JSON.stringify(['9001:7.5', '14001:7.5']),
        url: '/docs/document-control.pdf',
      },
    }),
    prisma.document.create({
      data: {
        type: 'PROCEDURE',
        title: 'Internal Audit Procedure',
        code: 'PROC-002',
        version: '2.1',
        status: 'APPROVED',
        owner: 'Mike Brown',
        nextReview: new Date('2025-09-30'),
        isoClauses: JSON.stringify(['9001:9.2', '14001:9.2']),
        url: '/docs/internal-audit.pdf',
      },
    }),
    prisma.document.create({
      data: {
        type: 'PROCEDURE',
        title: 'Corrective Action Procedure',
        code: 'PROC-003',
        version: '1.8',
        status: 'APPROVED',
        owner: 'Emma Wilson',
        nextReview: new Date('2025-12-15'),
        isoClauses: JSON.stringify(['9001:10.2', '14001:10.2']),
      },
    }),
    // Work Instructions
    prisma.document.create({
      data: {
        type: 'WORK_INSTRUCTION',
        title: 'Calibration Work Instruction',
        code: 'WI-001',
        version: '1.2',
        status: 'APPROVED',
        owner: 'David Taylor',
        nextReview: new Date('2026-03-01'),
        isoClauses: JSON.stringify(['9001:7.1.5']),
      },
    }),
    prisma.document.create({
      data: {
        type: 'WORK_INSTRUCTION',
        title: 'Waste Segregation WI',
        code: 'WI-002',
        version: '1.0',
        status: 'APPROVED',
        owner: 'Sarah Jones',
        nextReview: new Date('2025-11-01'),
        isoClauses: JSON.stringify(['14001:8.1']),
      },
    }),
    // Registers
    prisma.document.create({
      data: {
        type: 'REGISTER',
        title: 'Risk & Opportunity Register',
        code: 'REG-001',
        version: '1.0',
        status: 'APPROVED',
        owner: 'Admin User',
        isoClauses: JSON.stringify(['9001:6.1', '14001:6.1']),
      },
    }),
    prisma.document.create({
      data: {
        type: 'REGISTER',
        title: 'Legal & Compliance Register',
        code: 'REG-002',
        version: '1.0',
        status: 'APPROVED',
        owner: 'Mike Brown',
        isoClauses: JSON.stringify(['14001:6.1.3']),
      },
    }),
  ])

  console.log(`✅ Created ${documents.length} documents`)

  // Create courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        title: 'ISO 9001 Awareness',
        code: 'TRN-001',
        mandatory: true,
        renewalDays: 365,
      },
    }),
    prisma.course.create({
      data: {
        title: 'ISO 14001 Awareness',
        code: 'TRN-002',
        mandatory: true,
        renewalDays: 365,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Internal Auditor Training',
        code: 'TRN-003',
        mandatory: false,
        renewalDays: 730,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Risk Assessment Training',
        code: 'TRN-004',
        mandatory: true,
        renewalDays: 365,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Document Control Training',
        code: 'TRN-005',
        mandatory: false,
        renewalDays: 730,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Environmental Aspects Training',
        code: 'TRN-006',
        mandatory: true,
        renewalDays: 365,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Calibration Training',
        code: 'TRN-007',
        mandatory: false,
        renewalDays: 730,
      },
    }),
    prisma.course.create({
      data: {
        title: 'Health & Safety Induction',
        code: 'TRN-008',
        mandatory: true,
        renewalDays: 365,
      },
    }),
  ])

  console.log(`✅ Created ${courses.length} courses`)

  // Create training records with varied statuses
  const now = new Date()
  const trainingRecords = []
  
  for (const user of users) {
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      const random = Math.random()
      
      let status: 'COMPLETE' | 'EXPIRED' | 'IN_PROGRESS' | 'NOT_STARTED'
      let completed: Date | null = null
      let dueDate: Date | null = null
      
      if (random < 0.6) {
        // 60% complete
        status = 'COMPLETE'
        completed = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000)
        if (course.renewalDays) {
          dueDate = new Date(completed.getTime() + course.renewalDays * 24 * 60 * 60 * 1000)
        }
      } else if (random < 0.75) {
        // 15% in progress
        status = 'IN_PROGRESS'
        dueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      } else if (random < 0.85) {
        // 10% expired
        status = 'EXPIRED'
        completed = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000)
        dueDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      } else {
        // 15% not started
        status = 'NOT_STARTED'
        dueDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000)
      }
      
      trainingRecords.push(
        prisma.trainingRecord.create({
          data: {
            userId: user.id,
            courseId: course.id,
            status,
            completed,
            dueDate,
            score: completed ? Math.floor(Math.random() * 30) + 70 : null,
          },
        })
      )
    }
  }
  
  await Promise.all(trainingRecords)
  console.log(`✅ Created ${trainingRecords.length} training records`)

  // Create risks with varied likelihood/severity
  const risks = await Promise.all([
    prisma.risk.create({
      data: {
        title: 'Supply Chain Disruption',
        context: 'Raw material procurement',
        likelihood: 3,
        severity: 4,
        controls: JSON.stringify(['Multiple suppliers', 'Buffer stock', 'Contracts']),
        owner: 'John Smith',
        reviewDate: new Date('2025-12-31'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['9001:6.1', '9001:8.4']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Equipment Failure',
        context: 'Production machinery',
        likelihood: 2,
        severity: 5,
        controls: JSON.stringify(['Preventive maintenance', 'Spare parts inventory']),
        owner: 'David Taylor',
        reviewDate: new Date('2025-11-30'),
        status: 'OPEN',
        isoRefs: JSON.stringify(['9001:7.1.3']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Data Breach',
        context: 'IT systems and customer data',
        likelihood: 2,
        severity: 5,
        controls: JSON.stringify(['Encryption', 'Access controls', 'Regular backups']),
        owner: 'Mike Brown',
        reviewDate: new Date('2026-01-15'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['9001:7.1.4']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Hazardous Waste Spill',
        context: 'Chemical storage area',
        likelihood: 2,
        severity: 4,
        controls: JSON.stringify(['Containment systems', 'Spill kits', 'Training']),
        owner: 'Sarah Jones',
        reviewDate: new Date('2025-10-31'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['14001:6.1.1', '14001:8.1']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Regulatory Non-Compliance',
        context: 'Environmental permits',
        likelihood: 1,
        severity: 5,
        controls: JSON.stringify(['Compliance calendar', 'Regular audits', 'Legal updates']),
        owner: 'Mike Brown',
        reviewDate: new Date('2025-12-15'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['14001:6.1.3']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Staff Turnover',
        context: 'Key personnel retention',
        likelihood: 3,
        severity: 3,
        controls: JSON.stringify(['Succession planning', 'Training programs', 'Competitive benefits']),
        owner: 'Emma Wilson',
        reviewDate: new Date('2026-02-28'),
        status: 'OPEN',
        isoRefs: JSON.stringify(['9001:7.2']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Customer Complaint Escalation',
        context: 'Product quality issues',
        likelihood: 2,
        severity: 3,
        controls: JSON.stringify(['QC procedures', 'Customer feedback system', 'Corrective actions']),
        owner: 'John Smith',
        reviewDate: new Date('2025-11-15'),
        status: 'OPEN',
        isoRefs: JSON.stringify(['9001:8.2.1', '9001:10.2']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Energy Cost Increase',
        context: 'Operational expenses',
        likelihood: 4,
        severity: 2,
        controls: JSON.stringify(['Energy efficiency measures', 'Alternative suppliers']),
        owner: 'Sarah Jones',
        reviewDate: new Date('2025-12-31'),
        status: 'OPEN',
        isoRefs: JSON.stringify(['14001:8.1']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Calibration Lapse',
        context: 'Measurement equipment',
        likelihood: 1,
        severity: 4,
        controls: JSON.stringify(['Calibration schedule', 'Alerts system', 'Backup equipment']),
        owner: 'David Taylor',
        reviewDate: new Date('2026-01-31'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['9001:7.1.5']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Air Emissions Exceedance',
        context: 'Manufacturing processes',
        likelihood: 1,
        severity: 5,
        controls: JSON.stringify(['Emission monitoring', 'Scrubber maintenance', 'Process controls']),
        owner: 'Sarah Jones',
        reviewDate: new Date('2025-11-30'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['14001:8.1', '14001:9.1']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Document Control Failure',
        context: 'Obsolete documents in use',
        likelihood: 2,
        severity: 2,
        controls: JSON.stringify(['Version control system', 'Regular reviews', 'Training']),
        owner: 'John Smith',
        reviewDate: new Date('2026-03-31'),
        status: 'OPEN',
        isoRefs: JSON.stringify(['9001:7.5', '14001:7.5']),
      },
    }),
    prisma.risk.create({
      data: {
        title: 'Audit Finding Recurrence',
        context: 'Internal audit process',
        likelihood: 3,
        severity: 2,
        controls: JSON.stringify(['Root cause analysis', 'Corrective action tracking', 'Follow-up audits']),
        owner: 'Mike Brown',
        reviewDate: new Date('2025-10-15'),
        status: 'OPEN',
        isoRefs: JSON.stringify(['9001:9.2', '14001:9.2']),
      },
    }),
  ])

  console.log(`✅ Created ${risks.length} risks`)

  // Create equipment
  const equipment = await Promise.all([
    prisma.equipment.create({
      data: {
        name: 'Digital Caliper',
        assetTag: 'CAL-001',
        location: 'QC Lab',
        maintDue: new Date('2025-12-31'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Pressure Gauge',
        assetTag: 'PG-002',
        location: 'Production Floor',
        maintDue: new Date('2025-11-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Temperature Probe',
        assetTag: 'TP-003',
        location: 'Cold Storage',
        maintDue: new Date('2025-10-31'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Weighing Scale',
        assetTag: 'WS-004',
        location: 'Warehouse',
        maintDue: new Date('2026-01-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Torque Wrench',
        assetTag: 'TW-005',
        location: 'Maintenance Shop',
        maintDue: new Date('2025-12-01'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'pH Meter',
        assetTag: 'PH-006',
        location: 'QC Lab',
        maintDue: new Date('2025-11-30'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Micrometer',
        assetTag: 'MIC-007',
        location: 'QC Lab',
        maintDue: new Date('2026-02-28'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Gas Detector',
        assetTag: 'GD-008',
        location: 'Chemical Storage',
        maintDue: new Date('2025-10-15'),
        status: 'ACTIVE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Multimeter',
        assetTag: 'MM-009',
        location: 'Electrical Room',
        maintDue: new Date('2025-09-30'),
        status: 'OUT_OF_SERVICE',
      },
    }),
    prisma.equipment.create({
      data: {
        name: 'Flow Meter',
        assetTag: 'FM-010',
        location: 'Process Line 1',
        maintDue: new Date('2026-01-31'),
        status: 'ACTIVE',
      },
    }),
  ])

  console.log(`✅ Created ${equipment.length} equipment items`)

  // Create calibrations
  const calibrations = []
  for (const equip of equipment) {
    // Past calibration
    calibrations.push(
      prisma.calibration.create({
        data: {
          equipmentId: equip.id,
          dueDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
          performedOn: new Date(now.getTime() - 370 * 24 * 60 * 60 * 1000),
          result: 'PASS',
          certificateUrl: '/certs/cal-cert-2024.pdf',
        },
      })
    )
    
    // Upcoming calibration
    const daysUntilDue = Math.floor(Math.random() * 90) + 30
    calibrations.push(
      prisma.calibration.create({
        data: {
          equipmentId: equip.id,
          dueDate: new Date(now.getTime() + daysUntilDue * 24 * 60 * 60 * 1000),
        },
      })
    )
  }
  
  await Promise.all(calibrations)
  console.log(`✅ Created ${calibrations.length} calibration records`)

  // Create register entries
  const registerEntries = await Promise.all([
    // Incidents
    prisma.registerEntry.create({
      data: {
        type: 'INCIDENT',
        title: 'Minor Chemical Spill',
        details: 'Small solvent spill in production area, cleaned immediately',
        owner: 'Sarah Jones',
        status: 'CLOSED',
        date: new Date('2025-03-15'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'INCIDENT',
        title: 'Near Miss - Forklift',
        details: 'Pedestrian almost struck by forklift in warehouse',
        owner: 'David Taylor',
        status: 'CLOSED',
        date: new Date('2025-04-22'),
      },
    }),
    // Nonconformities
    prisma.registerEntry.create({
      data: {
        type: 'NONCONFORMITY',
        title: 'Product Dimension Out of Spec',
        details: 'Batch #12345 failed dimensional inspection',
        owner: 'John Smith',
        status: 'IN_PROGRESS',
        date: new Date('2025-05-10'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'NONCONFORMITY',
        title: 'Calibration Certificate Missing',
        details: 'Equipment CAL-001 certificate not on file',
        owner: 'David Taylor',
        status: 'CLOSED',
        date: new Date('2025-04-05'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'NONCONFORMITY',
        title: 'Document Not Controlled',
        details: 'Obsolete work instruction found in use',
        owner: 'John Smith',
        status: 'OPEN',
        date: new Date('2025-06-01'),
      },
    }),
    // Compliance Obligations
    prisma.registerEntry.create({
      data: {
        type: 'COMPLIANCE_OBLIGATION',
        title: 'Annual Environmental Report',
        details: 'Due to EPA by December 31st',
        owner: 'Mike Brown',
        status: 'IN_PROGRESS',
        date: new Date('2025-01-01'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'COMPLIANCE_OBLIGATION',
        title: 'ISO 9001 Surveillance Audit',
        details: 'Scheduled for Q4 2025',
        owner: 'Admin User',
        status: 'OPEN',
        date: new Date('2025-01-01'),
      },
    }),
    // Legal
    prisma.registerEntry.create({
      data: {
        type: 'LEGAL',
        title: 'Air Quality Permit Renewal',
        details: 'State air permit expires 2026-03-31',
        owner: 'Sarah Jones',
        status: 'OPEN',
        date: new Date('2025-01-01'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'LEGAL',
        title: 'Hazardous Waste Generator License',
        details: 'Annual renewal required',
        owner: 'Sarah Jones',
        status: 'CLOSED',
        date: new Date('2025-02-01'),
      },
    }),
    // Aspect & Impact
    prisma.registerEntry.create({
      data: {
        type: 'ASPECT_IMPACT',
        title: 'Energy Consumption',
        details: 'Electricity usage - Climate change impact',
        owner: 'Sarah Jones',
        status: 'OPEN',
        date: new Date('2025-01-01'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'ASPECT_IMPACT',
        title: 'Wastewater Discharge',
        details: 'Process water discharge - Water quality impact',
        owner: 'Sarah Jones',
        status: 'OPEN',
        date: new Date('2025-01-01'),
      },
    }),
    prisma.registerEntry.create({
      data: {
        type: 'ASPECT_IMPACT',
        title: 'Packaging Waste',
        details: 'Cardboard and plastic waste - Landfill impact',
        owner: 'Mike Brown',
        status: 'OPEN',
        date: new Date('2025-01-01'),
      },
    }),
  ])

  console.log(`✅ Created ${registerEntries.length} register entries`)

  // ========================================
  // OH&S SEED DATA (ISO 45001)
  // ========================================

  // Hazards
  const hazards = await Promise.all([
    prisma.oHSHazard.create({
      data: {
        title: 'Forklift traffic near pedestrian walkway',
        area: 'Warehouse',
        description: 'Blind corners and shared routes',
        likelihood: 3,
        severity: 4,
        residualL: 2,
        residualS: 3,
        controls: JSON.stringify(['Separation barriers', 'Mirrors at corners', 'Speed limits', 'Pedestrian lanes']),
        owner: 'Warehouse Supervisor',
        reviewDate: new Date('2026-01-01'),
        status: 'TREATED',
        isoRefs: JSON.stringify(['45001:6.1.2.1', '45001:8.1.2']),
      },
    }),
    prisma.oHSHazard.create({
      data: {
        title: 'Manual handling of heavy boxes',
        area: 'Dispatch',
        description: 'Back strain risk during loading',
        likelihood: 3,
        severity: 3,
        residualL: 2,
        residualS: 2,
        controls: JSON.stringify(['Team lifts', 'Trolleys', 'Training', 'Job rotation']),
        owner: 'Dispatch Lead',
        status: 'OPEN',
        isoRefs: JSON.stringify(['45001:6.1.2', '45001:8.1.2']),
      },
    }),
  ])

  console.log(`✅ Created ${hazards.length} OH&S hazards`)

  // Incidents
  const incidents = await Promise.all([
    prisma.incident.create({
      data: {
        ref: 'INC-2025-001',
        type: 'NEAR_MISS',
        date: new Date('2025-10-10'),
        location: 'Warehouse',
        description: 'Forklift reversed close to pedestrian; no contact',
        people: JSON.stringify(['John Smith']),
        severityType: 'FIRST_AID',
        status: 'OPEN',
        isoRefs: JSON.stringify(['45001:10.2']),
      },
    }),
    prisma.incident.create({
      data: {
        ref: 'INC-2025-002',
        type: 'INJURY',
        date: new Date('2025-10-12'),
        location: 'Production Floor',
        description: 'Cut to finger while changing blade',
        people: JSON.stringify(['Sarah Jones']),
        severityType: 'MEDICAL_TREATMENT',
        status: 'UNDER_INVESTIGATION',
        isoRefs: JSON.stringify(['45001:10.2']),
      },
    }),
  ])

  console.log(`✅ Created ${incidents.length} OH&S incidents`)

  // Actions
  const actions = await Promise.all([
    prisma.action.create({
      data: {
        type: 'CORRECTIVE',
        title: 'Install additional convex mirrors at warehouse intersections',
        owner: 'Warehouse Supervisor',
        dueDate: new Date('2025-11-01'),
        status: 'IN_PROGRESS',
      },
    }),
    prisma.action.create({
      data: {
        type: 'PREVENTIVE',
        title: 'Update blade change SOP and toolbox talk',
        owner: 'Production Manager',
        dueDate: new Date('2025-10-25'),
        status: 'OPEN',
      },
    }),
  ])

  console.log(`✅ Created ${actions.length} OH&S actions`)

  // OH&S Audits and Inspections
  const audits = await Promise.all([
    prisma.oHSAudit.create({
      data: {
        type: 'INTERNAL',
        title: 'Q4 2025 Internal OH&S Audit',
        date: new Date('2025-10-15'),
        location: 'Production Area',
        auditor: 'OH&S Manager',
        scope: 'ISO 45001:2018 compliance - Production operations',
        findings: JSON.stringify([
          'PPE compliance excellent',
          'Minor housekeeping issues in tool storage',
          'Emergency exit signage needs updating'
        ]),
        nonConformities: 2,
        observations: 5,
        opportunities: 3,
        status: 'COMPLETED',
        nextAudit: new Date('2026-01-15'),
        isoRefs: JSON.stringify(['45001:9.2']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INSPECTION',
        title: 'Weekly Workplace Inspection - Week 42',
        date: new Date('2025-10-14'),
        location: 'Warehouse',
        auditor: 'Warehouse Supervisor',
        scope: 'General workplace inspection - housekeeping, hazards, PPE',
        findings: JSON.stringify([
          'Loading bay clear and organized',
          'Fire extinguisher inspection up to date',
          'One damaged pallet identified and removed'
        ]),
        nonConformities: 0,
        observations: 3,
        opportunities: 1,
        status: 'COMPLETED',
        nextAudit: new Date('2025-10-21'),
        isoRefs: JSON.stringify(['45001:9.1.1']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'THIRD_PARTY',
        title: '3rd Party OH&S Compliance Audit',
        date: new Date('2025-09-20'),
        location: 'All Sites',
        auditor: 'SafetyFirst Consulting',
        scope: 'Full OH&S management system review',
        findings: JSON.stringify([
          'Management commitment strong',
          'Risk assessment process robust',
          'Training records well maintained',
          'Contractor management needs improvement',
          'Emergency procedures excellent'
        ]),
        nonConformities: 3,
        observations: 8,
        opportunities: 5,
        status: 'COMPLETED',
        nextAudit: new Date('2026-03-20'),
        isoRefs: JSON.stringify(['45001:9.2']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'CERTIFICATION',
        title: 'ISO 45001:2018 Certification Audit - Stage 2',
        date: new Date('2025-08-10'),
        location: 'All Sites',
        auditor: 'ISO Certification Body Ltd',
        scope: 'Full certification audit for ISO 45001:2018',
        findings: JSON.stringify([
          'OH&S policy implemented effectively',
          'Worker participation and consultation strong',
          'Hazard identification systematic',
          'Performance monitoring robust',
          'Minor documentation gaps in legal compliance register'
        ]),
        nonConformities: 1,
        observations: 12,
        opportunities: 7,
        status: 'COMPLETED',
        nextAudit: new Date('2026-08-10'),
        isoRefs: JSON.stringify(['45001:9.2', '45001:9.3']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INSPECTION',
        title: 'Fire Safety Inspection',
        date: new Date('2025-10-05'),
        location: 'Main Building',
        auditor: 'Fire Safety Officer',
        scope: 'Fire detection, suppression, exits, drills',
        findings: JSON.stringify([
          'All fire extinguishers serviced',
          'Smoke detectors tested and functional',
          'One emergency exit partially blocked',
          'Fire drill records current'
        ]),
        nonConformities: 1,
        observations: 3,
        opportunities: 0,
        status: 'COMPLETED',
        nextAudit: new Date('2026-01-05'),
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INSPECTION',
        title: 'Electrical Safety Inspection',
        date: new Date('2025-09-15'),
        location: 'Production Floor',
        auditor: 'Licensed Electrician',
        scope: 'Electrical panels, circuits, portable equipment',
        findings: JSON.stringify([
          'All panels properly labeled',
          'RCD testing up to date',
          '2 damaged extension cords identified',
          'Lockout/tagout procedures being followed'
        ]),
        nonConformities: 2,
        observations: 4,
        opportunities: 1,
        status: 'COMPLETED',
        nextAudit: new Date('2026-03-15'),
        isoRefs: JSON.stringify(['45001:8.1.2']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INTERNAL',
        title: 'Contractor Safety Compliance Review',
        date: new Date('2025-10-20'),
        location: 'Tank Farm',
        auditor: 'Safety Coordinator',
        scope: 'Contractor ABC Welding Services - permit compliance',
        findings: JSON.stringify([
          'All permits current and signed',
          'Hot work procedures followed',
          'PPE compliance 100%',
          'Gas testing records complete'
        ]),
        nonConformities: 0,
        observations: 2,
        opportunities: 1,
        status: 'COMPLETED',
        nextAudit: new Date('2025-11-20'),
        isoRefs: JSON.stringify(['45001:8.1.4.2']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INSPECTION',
        title: 'PPE Compliance Inspection - Warehouse',
        date: new Date('2025-10-08'),
        location: 'Warehouse',
        auditor: 'Warehouse Supervisor',
        scope: 'PPE usage, availability, condition',
        findings: JSON.stringify([
          '95% PPE compliance observed',
          'PPE storage clean and organized',
          '2 employees missing hi-vis vests',
          'Safety boot condition generally good'
        ]),
        nonConformities: 1,
        observations: 3,
        opportunities: 2,
        status: 'COMPLETED',
        nextAudit: new Date('2025-10-22'),
        isoRefs: JSON.stringify(['45001:8.1.2']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INTERNAL',
        title: 'Management Review Meeting',
        date: new Date('2025-11-05'),
        location: 'Boardroom',
        auditor: 'CEO',
        scope: 'OH&S performance review - Q3 2025',
        findings: JSON.stringify([
          'TRIR trending down',
          'Near-miss reporting increased 40%',
          'Training completion at 98%',
          'Budget approved for safety improvements'
        ]),
        nonConformities: 0,
        observations: 0,
        opportunities: 4,
        status: 'PLANNED',
        nextAudit: new Date('2026-02-05'),
        isoRefs: JSON.stringify(['45001:9.3']),
      },
    }),
    prisma.oHSAudit.create({
      data: {
        type: 'INSPECTION',
        title: 'Confined Space Entry Equipment Inspection',
        date: new Date('2025-10-12'),
        location: 'Equipment Room',
        auditor: 'Safety Officer',
        scope: 'Atmospheric monitors, rescue equipment, harnesses',
        findings: JSON.stringify([
          'Gas monitors calibrated and functional',
          'Rescue equipment complete and accessible',
          '1 harness past inspection date',
          'Standby rescue plan up to date'
        ]),
        nonConformities: 1,
        observations: 2,
        opportunities: 0,
        status: 'COMPLETED',
        nextAudit: new Date('2025-11-12'),
        isoRefs: JSON.stringify(['45001:8.1.2']),
      },
    }),
  ])

  console.log(`✅ Created ${audits.length} OH&S audits and inspections`)

  // Permits to Work
  const permits = await Promise.all([
    prisma.permit.create({
      data: {
        title: 'Welding on storage tank T-101',
        type: 'HOT_WORK',
        location: 'Tank Farm',
        contractor: 'ABC Welding Services',
        issuedBy: 'Safety Manager',
        approvedBy: 'Operations Manager',
        validFrom: new Date('2025-10-14'),
        validUntil: new Date('2025-10-14'),
        status: 'ACTIVE',
        hazards: 'Fire risk\nExplosion risk\nFumes\nBurns',
        controlMeasures: 'Fire watch in place\nGas testing completed\nFire extinguishers available\nPPE: welding helmet, gloves, apron',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Vessel cleaning - Reactor R-205',
        type: 'CONFINED_SPACE',
        location: 'Process Area',
        contractor: 'CleanTech Ltd',
        issuedBy: 'Safety Manager',
        approvedBy: 'Operations Manager',
        clientApprover: 'Client Site Manager',
        validFrom: new Date('2025-10-13'),
        validUntil: new Date('2025-10-15'),
        status: 'ACTIVE',
        hazards: 'Oxygen deficiency\nToxic atmosphere\nEngulfment\nRestricted access',
        controlMeasures: 'Atmospheric testing\nContinuous monitoring\nRescue equipment ready\nStandby person assigned\nHarness and retrieval line',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Roof maintenance - Building A',
        type: 'HEIGHT_WORK',
        location: 'Building A',
        contractor: 'Height Safety Co',
        issuedBy: 'Facilities Manager',
        validFrom: new Date('2025-10-16'),
        validUntil: new Date('2025-10-16'),
        status: 'PENDING',
        hazards: 'Falls from height\nFragile roof\nWeather conditions\nTools dropping',
        controlMeasures: 'Fall arrest system\nEdge protection\nWeather monitoring\nTool lanyards\nBarriers below work area',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Electrical panel upgrade - Substation 2',
        type: 'ELECTRICAL',
        location: 'Substation 2',
        issuedBy: 'Electrical Engineer',
        approvedBy: 'Engineering Manager',
        validFrom: new Date('2025-10-17'),
        validUntil: new Date('2025-10-17'),
        status: 'APPROVED',
        hazards: 'Electric shock\nArc flash\nBurns',
        controlMeasures: 'Lockout/Tagout applied\nVoltage testing\nArc flash PPE\nInsulated tools\nQualified electrician',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Excavation for new drainage line',
        type: 'EXCAVATION',
        location: 'South yard',
        contractor: 'Groundworks Ltd',
        issuedBy: 'Site Manager',
        validFrom: new Date('2025-10-18'),
        validUntil: new Date('2025-10-20'),
        status: 'PENDING',
        hazards: 'Underground services\nCollapse\nVehicle traffic\nFalling into excavation',
        controlMeasures: 'Service location survey\nShoring/benching\nBarriers and signage\nExcavation support\nCompetent person supervision',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Crane lifting operation - Equipment installation',
        type: 'LIFTING',
        location: 'Production Hall',
        contractor: 'Heavy Lift Services',
        issuedBy: 'Project Manager',
        approvedBy: 'Operations Director',
        clientApprover: 'Client Project Manager',
        validFrom: new Date('2025-10-15'),
        validUntil: new Date('2025-10-15'),
        status: 'ACTIVE',
        hazards: 'Load drop\nCrane tip over\nStruck by load\nPower line contact',
        controlMeasures: 'Lift plan approved\nCrane inspection current\nExclusion zone established\nBanksman assigned\nLoad calculations verified',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Hot work - Pipe cutting in workshop',
        type: 'HOT_WORK',
        location: 'Maintenance Workshop',
        issuedBy: 'Workshop Supervisor',
        approvedBy: 'Maintenance Manager',
        validFrom: new Date('2025-10-14'),
        validUntil: new Date('2025-10-14'),
        status: 'EXPIRED',
        hazards: 'Fire\nSparks\nFumes\nBurns',
        controlMeasures: 'Combustibles removed\nFire extinguisher present\nVentilation adequate\nPPE worn',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Confined space entry - Sump pit inspection',
        type: 'CONFINED_SPACE',
        location: 'Basement Level',
        issuedBy: 'Facilities Engineer',
        approvedBy: 'Facilities Manager',
        validFrom: new Date('2025-10-19'),
        validUntil: new Date('2025-10-19'),
        status: 'APPROVED',
        hazards: 'Oxygen deficiency\nToxic gases\nDrowning\nLimited egress',
        controlMeasures: 'Gas testing every 30 min\nRescue team on standby\nLifeline attached\nCommunication system\nVentilation fan running',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Electrical isolation - Motor replacement',
        type: 'ELECTRICAL',
        location: 'Production Line 2',
        issuedBy: 'Electrical Supervisor',
        approvedBy: 'Production Manager',
        validFrom: new Date('2025-10-21'),
        validUntil: new Date('2025-10-21'),
        status: 'PENDING',
        hazards: 'Electric shock\nArc flash\nStored energy',
        controlMeasures: 'LOTO procedure applied\nPersonal locks\nZero energy verification\nArc flash PPE\nInsulated tools',
      },
    }),
    prisma.permit.create({
      data: {
        title: 'Excavation - Foundation repair',
        type: 'EXCAVATION',
        location: 'Building B - North Side',
        contractor: 'Foundation Experts Ltd',
        issuedBy: 'Civil Engineer',
        approvedBy: 'Project Manager',
        clientApprover: 'Building Owner Rep',
        validFrom: new Date('2025-10-22'),
        validUntil: new Date('2025-10-25'),
        status: 'APPROVED',
        hazards: 'Cave-in\nUnderground utilities\nWater ingress\nAdjacent structure damage',
        controlMeasures: 'Utility locates complete\nShoring system designed\nDewatering plan\nStructural monitoring\nCompetent person on site',
      },
    }),
  ])

  console.log(`✅ Created ${permits.length} permits to work`)

  // Contractors
  const contractors = await Promise.all([
    prisma.contractor.create({
      data: {
        name: 'ABC Welding Services',
        contact: 'John Wilson',
        email: 'john@abcwelding.com',
        phone: '+1 555 0101',
        services: 'Welding, Fabrication, Hot Work',
        preQualified: true,
        preQualDate: new Date('2024-03-01'),
        preQualExpiry: new Date('2026-03-31'),
        inductionStatus: 'COMPLETED',
        inductionDate: new Date('2024-03-15'),
        safetyRating: 5,
        lastEvaluation: new Date('2025-09-01'),
        permitCount: 15,
        incidentCount: 0,
        status: 'ACTIVE',
        isoRefs: JSON.stringify(['45001:8.1.4.2', '45001:8.1.4.3']),
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'CleanTech Ltd',
        contact: 'Sarah Brown',
        email: 'sarah@cleantech.com',
        phone: '+1 555 0102',
        services: 'Confined Space Cleaning, Tank Cleaning',
        preQualified: true,
        preQualDate: new Date('2024-06-01'),
        preQualExpiry: new Date('2026-06-30'),
        inductionStatus: 'COMPLETED',
        inductionDate: new Date('2024-06-10'),
        safetyRating: 4,
        lastEvaluation: new Date('2025-08-15'),
        permitCount: 8,
        incidentCount: 1,
        status: 'ACTIVE',
        isoRefs: JSON.stringify(['45001:8.1.4.2']),
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'Height Safety Co',
        contact: 'Mike Davis',
        email: 'mike@heightsafety.com',
        phone: '+1 555 0103',
        services: 'Rope Access, Work at Height, Fall Protection',
        preQualified: false,
        inductionStatus: 'PENDING',
        safetyRating: 3,
        permitCount: 0,
        incidentCount: 0,
        status: 'ACTIVE',
        isoRefs: JSON.stringify(['45001:8.1.4.2']),
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'ElectroTech Solutions',
        contact: 'Emma Wilson',
        email: 'emma@electrotech.com',
        phone: '+1 555 0104',
        services: 'Electrical Work, Instrumentation',
        preQualified: true,
        preQualDate: new Date('2024-01-15'),
        preQualExpiry: new Date('2025-12-31'),
        inductionStatus: 'COMPLETED',
        inductionDate: new Date('2024-01-20'),
        safetyRating: 5,
        lastEvaluation: new Date('2025-09-20'),
        permitCount: 12,
        incidentCount: 0,
        status: 'ACTIVE',
        isoRefs: JSON.stringify(['45001:8.1.4.2']),
      },
    }),
    prisma.contractor.create({
      data: {
        name: 'Groundworks Ltd',
        contact: 'Tom Harris',
        email: 'tom@groundworks.com',
        phone: '+1 555 0105',
        services: 'Excavation, Civil Works, Drainage',
        preQualified: true,
        preQualDate: new Date('2024-05-01'),
        preQualExpiry: new Date('2026-05-01'),
        inductionStatus: 'EXPIRED',
        inductionDate: new Date('2023-05-10'),
        safetyRating: 3,
        lastEvaluation: new Date('2025-07-01'),
        permitCount: 5,
        incidentCount: 2,
        status: 'ACTIVE',
        isoRefs: JSON.stringify(['45001:8.1.4.2']),
      },
    }),
  ])

  console.log(`✅ Created ${contractors.length} contractors`)

  // OH&S Competence
  const competences = await Promise.all([
    prisma.oHSCompetence.create({
      data: {
        userId: 'EMP001',
        role: 'Forklift Operator',
        requiredPPE: JSON.stringify(['HEAD', 'FOOT', 'HI_VIS']),
        training: JSON.stringify(['Forklift License', 'Manual Handling', 'H&S Induction']),
        medicalFit: true,
        medicalDate: new Date('2025-04-15'),
        medicalExpiry: new Date('2026-04-15'),
        authorized: JSON.stringify(['Forklift Operation', 'Overhead Crane', 'Pallet Jack']),
        isoRefs: JSON.stringify(['45001:7.2', '45001:7.3']),
      },
    }),
    prisma.oHSCompetence.create({
      data: {
        userId: 'EMP002',
        role: 'Production Operator',
        requiredPPE: JSON.stringify(['EYE', 'HEARING', 'HAND', 'FOOT']),
        training: JSON.stringify(['Machine Operation', 'Lockout/Tagout', 'H&S Induction']),
        medicalFit: true,
        medicalDate: new Date('2024-12-20'),
        medicalExpiry: new Date('2025-12-20'),
        authorized: JSON.stringify(['Production Line 1', 'Production Line 2', 'Packaging Line']),
        isoRefs: JSON.stringify(['45001:7.2']),
      },
    }),
    prisma.oHSCompetence.create({
      data: {
        userId: 'EMP003',
        role: 'Maintenance Technician',
        requiredPPE: JSON.stringify(['HEAD', 'EYE', 'HAND', 'FOOT', 'FALL_ARREST']),
        training: JSON.stringify(['Electrical Safety', 'Work at Height', 'Confined Space', 'H&S Induction']),
        medicalFit: true,
        medicalDate: new Date('2025-08-30'),
        medicalExpiry: new Date('2026-08-30'),
        authorized: JSON.stringify(['Electrical Work', 'Height Work', 'Confined Space Entry', 'Hot Work']),
        isoRefs: JSON.stringify(['45001:7.2', '45001:7.3']),
      },
    }),
    prisma.oHSCompetence.create({
      data: {
        userId: 'EMP004',
        role: 'Warehouse Supervisor',
        requiredPPE: JSON.stringify(['HEAD', 'FOOT', 'HI_VIS']),
        training: JSON.stringify(['Supervisor Training', 'Emergency Response', 'H&S Induction', 'First Aid']),
        medicalFit: true,
        medicalDate: new Date('2025-06-10'),
        medicalExpiry: new Date('2026-06-10'),
        authorized: JSON.stringify(['Forklift Operation', 'Crane Operation', 'Site Access Control']),
        restrictions: 'No heavy lifting due to back injury recovery',
        isoRefs: JSON.stringify(['45001:7.2']),
      },
    }),
  ])

  console.log(`✅ Created ${competences.length} OH&S competence records`)

  // Health Surveillance
  const surveillances = await Promise.all([
    prisma.healthSurveillance.create({
      data: {
        userId: 'EMP001',
        exposureType: 'NOISE',
        exposureLevel: '85 dB(A) TWA',
        monitoringFreq: 'Annual',
        lastTest: new Date('2025-03-15'),
        nextTest: new Date('2026-03-15'),
        results: 'Hearing within normal limits. No significant change from baseline.',
        status: 'COMPLIANT',
        isoRefs: JSON.stringify(['45001:6.1.2.4', '45001:8.1.2']),
      },
    }),
    prisma.healthSurveillance.create({
      data: {
        userId: 'EMP002',
        exposureType: 'DUST',
        exposureLevel: 'Respirable dust <2.4 mg/m³',
        monitoringFreq: 'Bi-annual',
        lastTest: new Date('2025-09-10'),
        nextTest: new Date('2026-03-10'),
        results: 'Lung function test normal. No respiratory issues identified.',
        status: 'COMPLIANT',
        isoRefs: JSON.stringify(['45001:6.1.2.4']),
      },
    }),
    prisma.healthSurveillance.create({
      data: {
        userId: 'EMP003',
        exposureType: 'VIBRATION',
        exposureLevel: 'HAV 2.1 m/s²',
        monitoringFreq: 'Annual',
        lastTest: new Date('2024-11-20'),
        nextTest: new Date('2025-11-20'),
        results: 'No signs of HAVS. Continue monitoring.',
        status: 'DUE_SOON',
        isoRefs: JSON.stringify(['45001:6.1.2.4']),
      },
    }),
    prisma.healthSurveillance.create({
      data: {
        userId: 'EMP004',
        exposureType: 'ERGONOMIC',
        exposureLevel: 'Manual handling risk - moderate',
        monitoringFreq: 'Bi-annual',
        lastTest: new Date('2025-08-05'),
        nextTest: new Date('2026-02-05'),
        results: 'Musculoskeletal assessment completed. Workstation adjustments recommended.',
        restrictions: 'Avoid lifting >15kg without assistance',
        status: 'COMPLIANT',
        isoRefs: JSON.stringify(['45001:6.1.2.4']),
      },
    }),
    prisma.healthSurveillance.create({
      data: {
        userId: 'EMP005',
        exposureType: 'CHEMICAL',
        exposureLevel: 'Solvent exposure - low',
        monitoringFreq: 'Annual',
        lastTest: new Date('2024-10-01'),
        nextTest: new Date('2025-10-01'),
        results: 'Blood test pending. Follow-up required.',
        status: 'OVERDUE',
        isoRefs: JSON.stringify(['45001:6.1.2.4', '45001:8.1.2']),
      },
    }),
  ])

  console.log(`✅ Created ${surveillances.length} health surveillance records`)

  // Emergency Drills
  const drills = await Promise.all([
    prisma.emergencyDrill.create({
      data: {
        type: 'FIRE',
        date: new Date('2025-10-01'),
        location: 'Main Building',
        participants: 45,
        duration: 12,
        scenarioDesc: 'Fire alarm activated in production area. Full building evacuation.',
        observations: 'All staff evacuated within 3 minutes. Assembly point reached safely. Fire wardens performed well.',
        effectiveness: 'GOOD',
        improvements: JSON.stringify(['Update evacuation signage in new wing', 'Train new employees on evacuation routes']),
        nextDrill: new Date('2026-01-01'),
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    }),
    prisma.emergencyDrill.create({
      data: {
        type: 'SPILL',
        date: new Date('2025-09-15'),
        location: 'Chemical Store',
        participants: 8,
        duration: 25,
        scenarioDesc: 'Simulated chemical spill of 20L solvent drum.',
        observations: 'Emergency response team contained spill quickly using spill kit. No environmental impact. PPE used correctly.',
        effectiveness: 'EXCELLENT',
        improvements: JSON.stringify([]),
        nextDrill: new Date('2025-12-15'),
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    }),
    prisma.emergencyDrill.create({
      data: {
        type: 'MEDICAL',
        date: new Date('2025-08-20'),
        location: 'Production Floor',
        participants: 12,
        duration: 15,
        scenarioDesc: 'Simulated workplace injury requiring first aid and ambulance.',
        observations: 'First aiders responded appropriately. Some confusion on emergency contact procedures.',
        effectiveness: 'SATISFACTORY',
        improvements: JSON.stringify(['Update emergency contact list on notice boards', 'Refresh first aid training for new staff']),
        nextDrill: new Date('2025-11-20'),
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    }),
    prisma.emergencyDrill.create({
      data: {
        type: 'EVACUATION',
        date: new Date('2025-07-10'),
        location: 'Warehouse',
        participants: 22,
        duration: 8,
        scenarioDesc: 'Unannounced evacuation drill during shift change.',
        observations: 'Fast evacuation. All personnel accounted for. Some confusion at assembly point during headcount.',
        effectiveness: 'GOOD',
        improvements: JSON.stringify(['Improve assembly point signage', 'Review headcount procedures with supervisors']),
        nextDrill: new Date('2025-10-10'),
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    }),
    prisma.emergencyDrill.create({
      data: {
        type: 'LOCKDOWN',
        date: new Date('2025-06-05'),
        location: 'Office Building',
        participants: 35,
        duration: 30,
        scenarioDesc: 'Security threat scenario requiring lockdown procedures.',
        observations: 'Staff followed lockdown procedures. Communication could be improved. Some doors not secured properly.',
        effectiveness: 'NEEDS_IMPROVEMENT',
        improvements: JSON.stringify(['Install additional door locks', 'Improve PA system coverage', 'Additional lockdown training required']),
        nextDrill: new Date('2025-09-05'),
        isoRefs: JSON.stringify(['45001:8.2']),
      },
    }),
  ])

  console.log(`✅ Created ${drills.length} emergency drills`)

  // Metrics
  await prisma.oHSMetric.create({
    data: {
      period: '2025-10',
      totalHours: 16000,
      incidents: 2,
      nearMisses: 12,
      firstAid: 1,
      medicalTreatment: 1,
      restrictedWork: 0,
      lostTime: 0,
      fatalities: 0,
      lostTimeDays: 0,
    },
  })

  console.log('✅ Created OH&S metrics')

  // Non-Conformances with Actions
  const nc1 = await prisma.nonConformance.create({
    data: {
      refNumber: 'MET-NC-2025-001',
      caseType: 'NC',
      title: 'Incorrect torque specification on assembly line',
      raisedBy: 'John Smith',
      dateRaised: new Date('2025-09-15'),
      process: 'Assembly',
      area: 'Production Line 2',
      department: 'Manufacturing',
      category: 'Product',
      severity: 'HIGH',
      riskImpact: JSON.stringify(['Quality', 'Customer']),
      problemStatement: 'During final inspection, 15 units were found with incorrect torque values on critical fasteners. Specification calls for 45 Nm ±5%, but units measured between 35-40 Nm. This could lead to product failure in the field.',
      detectionPoint: 'Final',
      scrapRework: true,
      containmentNeeded: true,
      status: 'CORRECTIVE_ACTIONS_IN_PROGRESS',
      owner: 'Mike Brown',
      dueDate: new Date('2025-10-30'),
      investigationNotes: 'Root cause identified: Torque wrench calibration drift. Tool was last calibrated 8 months ago, exceeding 6-month requirement. Investigation also revealed inadequate training on torque tool usage.',
      rootCauseTool: '5_WHYS',
      rootCauseOutput: JSON.stringify({
        why1: 'Why were fasteners under-torqued? - Torque wrench not applying correct force',
        why2: 'Why was wrench not applying correct force? - Tool out of calibration',
        why3: 'Why was tool out of calibration? - Exceeded calibration interval',
        why4: 'Why did it exceed interval? - Calibration schedule not monitored',
        why5: 'Why not monitored? - No system in place to track tool calibration due dates',
        rootCause: 'Lack of calibration tracking system and inadequate preventive maintenance schedule'
      }),
      scrapHours: 12,
      reworkHours: 8,
      materialCost: 450,
      iso9001Clause: JSON.stringify(['8.5.1', '8.6']),
      actions: {
        create: [
          {
            actionType: 'CONTAINMENT',
            title: 'Quarantine all units from same production batch',
            description: 'Immediately segregate and inspect all 150 units from the affected batch. Re-torque all fasteners to specification.',
            owner: 'Production Supervisor',
            dueDate: new Date('2025-09-18'),
            priority: 'HIGH',
            status: 'DONE',
            completedDate: new Date('2025-09-17'),
            evidence: JSON.stringify(['Batch inspection report', 'Rework completion certificate']),
          },
          {
            actionType: 'CORRECTIVE',
            title: 'Recalibrate all torque tools and implement tracking system',
            description: 'Send all torque wrenches for immediate calibration. Implement digital calibration tracking system with automated alerts 2 weeks before due date.',
            owner: 'Maintenance Manager',
            dueDate: new Date('2025-10-15'),
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            checklist: JSON.stringify([
              { item: 'Identify all torque tools requiring calibration', done: true },
              { item: 'Send tools to accredited calibration lab', done: true },
              { item: 'Select and purchase calibration tracking software', done: true },
              { item: 'Configure system and import tool database', done: false },
              { item: 'Train maintenance team on new system', done: false },
            ]),
          },
          {
            actionType: 'PREVENTIVE',
            title: 'Develop and deliver torque tool training program',
            description: 'Create comprehensive training module covering proper torque tool selection, usage, and care. Include visual work instructions at workstations.',
            owner: 'Training Coordinator',
            dueDate: new Date('2025-11-01'),
            priority: 'MEDIUM',
            status: 'OPEN',
          },
        ],
      },
    },
  })

  const nc2 = await prisma.nonConformance.create({
    data: {
      refNumber: 'MET-CC-2025-001',
      caseType: 'CC',
      title: 'Customer complaint - Late delivery and incomplete documentation',
      raisedBy: 'Sarah Jones',
      dateRaised: new Date('2025-10-01'),
      process: 'Order Fulfillment',
      area: 'Logistics',
      department: 'Operations',
      category: 'Service',
      severity: 'CRITICAL',
      riskImpact: JSON.stringify(['Customer', 'Cost']),
      problemStatement: 'Major customer (Acme Corp) received order 5 days late with missing certificates of conformance and test reports. Customer has threatened to cancel future orders worth $500K annually.',
      customerName: 'Acme Corporation',
      customerContact: 'Jane Williams - Procurement Manager',
      complaintChannel: 'Email',
      externalRef: 'ACME-COMP-2025-089',
      contractualImpact: true,
      responseDueDate: new Date('2025-10-08'),
      status: 'UNDER_INVESTIGATION',
      owner: 'Emma Wilson',
      dueDate: new Date('2025-10-20'),
      investigationNotes: 'Investigation in progress. Initial findings: Production delay due to material shortage not communicated to customer. Documentation package prepared but not sent with shipment.',
      rootCauseTool: 'ISHIKAWA',
      customerCredit: 2500,
      iso9001Clause: JSON.stringify(['8.2.1', '8.5.6', '8.6']),
      actions: {
        create: [
          {
            actionType: 'CONTAINMENT',
            title: 'Expedite missing documentation to customer',
            description: 'Overnight courier all missing certificates and test reports. Follow up with customer to confirm receipt and acceptability.',
            owner: 'Quality Manager',
            dueDate: new Date('2025-10-03'),
            priority: 'HIGH',
            status: 'DONE',
            completedDate: new Date('2025-10-02'),
            evidence: JSON.stringify(['Courier tracking', 'Customer acknowledgment email']),
          },
          {
            actionType: 'CORRECTIVE',
            title: 'Implement customer communication protocol for delays',
            description: 'Create and implement SOP for proactive customer notification of any order delays >24 hours. Include escalation matrix and communication templates.',
            owner: 'Operations Manager',
            dueDate: new Date('2025-10-25'),
            priority: 'HIGH',
            status: 'IN_PROGRESS',
          },
          {
            actionType: 'CORRECTIVE',
            title: 'Revise shipping checklist to include documentation verification',
            description: 'Update shipping procedure to include mandatory documentation checklist sign-off before dispatch. Implement barcode scanning system to track document inclusion.',
            owner: 'Logistics Supervisor',
            dueDate: new Date('2025-11-05'),
            priority: 'MEDIUM',
            status: 'OPEN',
          },
        ],
      },
    },
  })

  const nc3 = await prisma.nonConformance.create({
    data: {
      refNumber: 'MET-SNC-2025-001',
      caseType: 'SNC',
      title: 'Supplier delivered non-conforming raw material',
      raisedBy: 'Mike Brown',
      dateRaised: new Date('2025-09-25'),
      process: 'Incoming Inspection',
      area: 'Receiving',
      department: 'Quality',
      category: 'Product',
      severity: 'HIGH',
      riskImpact: JSON.stringify(['Quality', 'Cost', 'Delivery']),
      problemStatement: 'Incoming shipment of steel sheet (PO-2025-445) failed dimensional inspection. Thickness measured 2.8mm vs. specified 3.0mm ±0.1mm. Entire batch of 500 sheets affected, causing production delay.',
      supplierName: 'Global Steel Supplies Ltd',
      supplierContact: 'Robert Chen - Quality Director',
      poReference: 'PO-2025-445',
      warrantyClause: 'Section 4.2 - Material Specifications',
      request8D: true,
      status: 'CORRECTIVE_ACTIONS_IN_PROGRESS',
      owner: 'David Taylor',
      dueDate: new Date('2025-11-10'),
      investigationNotes: 'Supplier has acknowledged the issue. 8D report requested and received. Root cause: Rolling mill calibration error at supplier facility.',
      rootCauseTool: '8D',
      materialCost: 8500,
      downtimeHours: 16,
      iso9001Clause: JSON.stringify(['8.4.1', '8.4.3', '8.6']),
      actions: {
        create: [
          {
            actionType: 'CONTAINMENT',
            title: 'Return non-conforming material and expedite replacement',
            description: 'Coordinate return of entire batch to supplier. Expedite replacement shipment with 100% inspection at supplier before dispatch.',
            owner: 'Purchasing Manager',
            dueDate: new Date('2025-09-30'),
            priority: 'HIGH',
            status: 'DONE',
            completedDate: new Date('2025-09-29'),
            evidence: JSON.stringify(['Return authorization', 'Replacement shipment tracking', 'Supplier inspection report']),
          },
          {
            actionType: 'CORRECTIVE',
            title: 'Implement enhanced incoming inspection for this supplier',
            description: 'Increase sampling rate from 10% to 100% for next 3 shipments. Review and update supplier quality agreement.',
            owner: 'Quality Inspector',
            dueDate: new Date('2025-10-15'),
            priority: 'HIGH',
            status: 'IN_PROGRESS',
          },
          {
            actionType: 'PREVENTIVE',
            title: 'Conduct supplier audit and review approved supplier list',
            description: 'Schedule on-site audit of supplier facility. Review supplier performance metrics and consider alternative sources for critical materials.',
            owner: 'Supplier Quality Engineer',
            dueDate: new Date('2025-11-30'),
            priority: 'MEDIUM',
            status: 'OPEN',
          },
        ],
      },
    },
  })

  const nc4 = await prisma.nonConformance.create({
    data: {
      refNumber: 'MET-OFI-2025-001',
      caseType: 'OFI',
      title: 'Opportunity to reduce packaging waste and costs',
      raisedBy: 'Emma Wilson',
      dateRaised: new Date('2025-10-05'),
      process: 'Packaging',
      area: 'Shipping Department',
      department: 'Operations',
      category: 'Environmental',
      severity: 'LOW',
      riskImpact: JSON.stringify(['Cost', 'Environmental']),
      problemStatement: 'Current packaging uses excessive cardboard and plastic wrap. Opportunity identified to switch to reusable containers for regular customers, reducing waste by estimated 60% and saving $15K annually.',
      expectedBenefit: 'Cost',
      effortEstimate: 'M',
      suggestedOwner: 'Logistics Manager',
      status: 'OPEN',
      owner: 'Sarah Jones',
      dueDate: new Date('2025-12-15'),
      iso14001Clause: JSON.stringify(['8.1', '8.2']),
      actions: {
        create: [
          {
            actionType: 'IMPROVEMENT',
            title: 'Conduct cost-benefit analysis for reusable packaging',
            description: 'Research reusable container options, calculate ROI including initial investment, maintenance, and return logistics.',
            owner: 'Financial Analyst',
            dueDate: new Date('2025-10-30'),
            priority: 'LOW',
            status: 'OPEN',
          },
          {
            actionType: 'IMPROVEMENT',
            title: 'Pilot reusable packaging with top 3 customers',
            description: 'Approach top 3 customers (representing 40% of shipments) to pilot reusable container program for 3 months.',
            owner: 'Account Manager',
            dueDate: new Date('2025-11-20'),
            priority: 'LOW',
            status: 'OPEN',
          },
          {
            actionType: 'IMPROVEMENT',
            title: 'Develop implementation plan if pilot successful',
            description: 'Based on pilot results, create full rollout plan including container procurement, logistics, tracking system, and customer agreements.',
            owner: 'Operations Manager',
            dueDate: new Date('2025-12-31'),
            priority: 'LOW',
            status: 'OPEN',
          },
        ],
      },
    },
  })

  const nc5 = await prisma.nonConformance.create({
    data: {
      refNumber: 'MET-NC-2025-002',
      caseType: 'NC',
      title: 'Inadequate work instruction causing assembly errors',
      raisedBy: 'David Taylor',
      dateRaised: new Date('2025-10-10'),
      process: 'Assembly',
      area: 'Production Line 1',
      department: 'Manufacturing',
      category: 'Process',
      severity: 'MEDIUM',
      riskImpact: JSON.stringify(['Quality', 'Safety']),
      problemStatement: 'Multiple assembly errors detected over past 2 weeks on Product Model X-500. 8 units required rework. Investigation revealed work instruction WI-500-A is unclear and missing critical steps for cable routing.',
      detectionPoint: 'In-process',
      scrapRework: true,
      containmentNeeded: false,
      status: 'OPEN',
      owner: 'John Smith',
      dueDate: new Date('2025-11-15'),
      reworkHours: 16,
      materialCost: 120,
      iso9001Clause: JSON.stringify(['7.5.1', '8.5.1']),
      actions: {
        create: [
          {
            actionType: 'CORRECTION',
            title: 'Update work instruction with photos and clarified steps',
            description: 'Revise WI-500-A to include step-by-step photos, clarify cable routing sequence, and add quality checkpoints.',
            owner: 'Process Engineer',
            dueDate: new Date('2025-10-20'),
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            checklist: JSON.stringify([
              { item: 'Take detailed photos of correct assembly', done: true },
              { item: 'Rewrite unclear steps with operator input', done: true },
              { item: 'Add quality checkpoints at critical stages', done: false },
              { item: 'Review and approve updated instruction', done: false },
            ]),
          },
          {
            actionType: 'CORRECTIVE',
            title: 'Train all operators on updated work instruction',
            description: 'Conduct hands-on training session for all Line 1 operators. Verify competence through practical assessment.',
            owner: 'Production Supervisor',
            dueDate: new Date('2025-10-25'),
            priority: 'MEDIUM',
            status: 'OPEN',
          },
          {
            actionType: 'PREVENTIVE',
            title: 'Review all work instructions for clarity and completeness',
            description: 'Conduct systematic review of all work instructions using new template with photos, checkpoints, and operator feedback.',
            owner: 'Quality Manager',
            dueDate: new Date('2025-12-01'),
            priority: 'LOW',
            status: 'OPEN',
          },
        ],
      },
    },
  })

  console.log('✅ Created 5 non-conformances with 15 actions')

  console.log('✨ Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

