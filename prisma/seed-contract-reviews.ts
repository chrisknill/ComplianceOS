import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedContractReviews() {
  console.log('🌱 Seeding Contract Reviews...')

  try {
    // Create sample contract reviews
    const contracts = [
      {
        contractNumber: 'CON-2024-001',
        contractTitle: 'IT Services Agreement',
        contractType: 'SERVICE',
        supplierName: 'TechCorp Solutions',
        supplierContact: 'John Smith',
        supplierEmail: 'john.smith@techcorp.com',
        value: 50000,
        currency: 'USD',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        renewalDate: new Date('2024-11-01'),
        status: 'APPROVED',
        priority: 'HIGH',
        riskLevel: 'MEDIUM',
        reviewerName: 'Sarah Johnson',
        reviewDate: new Date('2024-01-15'),
        approvalDate: new Date('2024-01-20'),
        approverName: 'Mike Wilson',
        comments: 'Comprehensive IT support agreement with good SLA terms.',
        terms: '24/7 support, 4-hour response time, monthly reporting',
        complianceNotes: 'Meets ISO 27001 requirements for data security',
        nextReviewDate: new Date('2024-06-01'),
      },
      {
        contractNumber: 'CON-2024-002',
        contractTitle: 'Office Supplies Contract',
        contractType: 'SUPPLY',
        supplierName: 'OfficeMax Supplies',
        supplierContact: 'Lisa Brown',
        supplierEmail: 'lisa.brown@officemax.com',
        value: 15000,
        currency: 'USD',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-07-31'),
        status: 'UNDER_REVIEW',
        priority: 'MEDIUM',
        riskLevel: 'LOW',
        reviewerName: 'David Lee',
        comments: 'Standard office supplies contract with volume discounts.',
        terms: 'Monthly delivery, 5% volume discount, 30-day payment terms',
        nextReviewDate: new Date('2024-05-01'),
      },
      {
        contractNumber: 'CON-2024-003',
        contractTitle: 'Consulting Services Agreement',
        contractType: 'CONSULTING',
        supplierName: 'Strategic Advisors Inc',
        supplierContact: 'Robert Davis',
        supplierEmail: 'robert.davis@strategic.com',
        value: 75000,
        currency: 'USD',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-08-31'),
        status: 'DRAFT',
        priority: 'CRITICAL',
        riskLevel: 'HIGH',
        reviewerName: 'Jennifer Taylor',
        comments: 'Strategic consulting for digital transformation project.',
        terms: 'Fixed price engagement, weekly progress reports, milestone payments',
        complianceNotes: 'Requires NDA and confidentiality agreements',
        nextReviewDate: new Date('2024-06-15'),
      },
      {
        contractNumber: 'CON-2024-004',
        contractTitle: 'Equipment Maintenance Contract',
        contractType: 'MAINTENANCE',
        supplierName: 'Maintenance Pro Ltd',
        supplierContact: 'Tom Wilson',
        supplierEmail: 'tom.wilson@maintenancepro.com',
        value: 25000,
        currency: 'USD',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-12-15'),
        renewalDate: new Date('2024-11-15'),
        status: 'APPROVED',
        priority: 'MEDIUM',
        riskLevel: 'MEDIUM',
        reviewerName: 'Mark Anderson',
        reviewDate: new Date('2024-01-20'),
        approvalDate: new Date('2024-01-25'),
        approverName: 'Susan Clark',
        comments: 'Comprehensive maintenance for all production equipment.',
        terms: 'Preventive maintenance monthly, emergency response within 2 hours',
        complianceNotes: 'Includes safety compliance checks',
        nextReviewDate: new Date('2024-07-15'),
      },
      {
        contractNumber: 'CON-2024-005',
        contractTitle: 'Software License Agreement',
        contractType: 'OTHER',
        supplierName: 'Software Solutions Co',
        supplierContact: 'Amy Rodriguez',
        supplierEmail: 'amy.rodriguez@softwareco.com',
        value: 30000,
        currency: 'USD',
        startDate: new Date('2024-02-15'),
        endDate: new Date('2025-02-14'),
        renewalDate: new Date('2025-01-14'),
        status: 'EXPIRED',
        priority: 'HIGH',
        riskLevel: 'HIGH',
        reviewerName: 'Kevin Martinez',
        reviewDate: new Date('2024-02-20'),
        comments: 'Enterprise software license with annual renewal.',
        terms: 'Annual license fee, unlimited users, 24/7 support',
        complianceNotes: 'Requires data processing agreement for GDPR compliance',
        nextReviewDate: new Date('2024-08-15'),
      },
    ]

    for (const contractData of contracts) {
      const contract = await prisma.contractReview.create({
        data: contractData,
      })

      // Create initial review log
      await prisma.contractReviewLog.create({
        data: {
          contractId: contract.id,
          action: 'CREATED',
          performedBy: contractData.reviewerName,
          comments: 'Contract review created',
        },
      })

      // Create additional review logs for approved contracts
      if (contractData.status === 'APPROVED') {
        await prisma.contractReviewLog.create({
          data: {
            contractId: contract.id,
            action: 'REVIEWED',
            performedBy: contractData.reviewerName,
            comments: 'Contract reviewed and approved',
          },
        })

        await prisma.contractReviewLog.create({
          data: {
            contractId: contract.id,
            action: 'APPROVED',
            performedBy: contractData.approverName,
            comments: 'Contract approved for execution',
          },
        })
      }
    }

    console.log('✅ Contract Reviews seeded successfully!')
    console.log(`📊 Created ${contracts.length} contract reviews`)
  } catch (error) {
    console.error('❌ Error seeding contract reviews:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedContractReviews()
