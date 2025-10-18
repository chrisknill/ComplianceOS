import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding waste management data...')

  // Create waste types
  const wasteTypes = await Promise.all([
    prisma.wasteType.create({
      data: {
        name: 'Used Oil',
        description: 'Used motor oil and hydraulic fluids',
        category: 'HAZARDOUS',
        hazardClass: 'Class 3 - Flammable Liquids',
        disposalMethod: 'RECYCLING',
        regulatoryCode: 'EPA Code D001',
      },
    }),
    prisma.wasteType.create({
      data: {
        name: 'Paper Waste',
        description: 'Office paper, cardboard, and packaging materials',
        category: 'RECYCLABLE',
        disposalMethod: 'RECYCLING',
      },
    }),
    prisma.wasteType.create({
      data: {
        name: 'Electronic Waste',
        description: 'Computers, monitors, and electronic equipment',
        category: 'ELECTRONIC',
        disposalMethod: 'RECYCLING',
        regulatoryCode: 'EPA Code D001',
      },
    }),
    prisma.wasteType.create({
      data: {
        name: 'Food Waste',
        description: 'Organic food scraps and kitchen waste',
        category: 'ORGANIC',
        disposalMethod: 'COMPOSTING',
      },
    }),
    prisma.wasteType.create({
      data: {
        name: 'Paint Waste',
        description: 'Used paint, solvents, and thinners',
        category: 'HAZARDOUS',
        hazardClass: 'Class 3 - Flammable Liquids',
        disposalMethod: 'TREATMENT',
        regulatoryCode: 'EPA Code D001',
      },
    }),
  ])

  // Create disposal facilities
  const facilities = await Promise.all([
    prisma.wasteDisposalFacility.create({
      data: {
        name: 'Green Valley Landfill',
        facilityType: 'LANDFILL',
        address: '123 Green Valley Road, Eco City, EC 12345',
        contactPerson: 'John Smith',
        contactPhone: '(555) 123-4567',
        contactEmail: 'john@greenvalley.com',
        licenseNumber: 'LV-2024-001',
        licenseExpiry: new Date('2025-12-31'),
        acceptedWasteTypes: JSON.stringify(['NON_HAZARDOUS', 'ORGANIC']),
      },
    }),
    prisma.wasteDisposalFacility.create({
      data: {
        name: 'EcoRecycle Center',
        facilityType: 'RECYCLING',
        address: '456 Recycle Lane, Green Town, GT 67890',
        contactPerson: 'Sarah Johnson',
        contactPhone: '(555) 987-6543',
        contactEmail: 'sarah@ecorecycle.com',
        licenseNumber: 'RC-2024-002',
        licenseExpiry: new Date('2025-06-30'),
        acceptedWasteTypes: JSON.stringify(['RECYCLABLE', 'ELECTRONIC']),
      },
    }),
    prisma.wasteDisposalFacility.create({
      data: {
        name: 'SafeHaz Treatment Plant',
        facilityType: 'TREATMENT',
        address: '789 Safety Street, Hazard City, HC 54321',
        contactPerson: 'Mike Wilson',
        contactPhone: '(555) 456-7890',
        contactEmail: 'mike@safehaz.com',
        licenseNumber: 'HT-2024-003',
        licenseExpiry: new Date('2025-09-15'),
        acceptedWasteTypes: JSON.stringify(['HAZARDOUS']),
      },
    }),
  ])

  // Create transporters
  const transporters = await Promise.all([
    prisma.wasteTransporter.create({
      data: {
        name: 'ABC Waste Transport',
        licenseNumber: 'WT-2024-001',
        contactPerson: 'Robert Brown',
        contactPhone: '(555) 234-5678',
        contactEmail: 'robert@abcwaste.com',
        address: '321 Transport Ave, Logistics City, LC 13579',
        licenseExpiry: new Date('2025-03-31'),
      },
    }),
    prisma.wasteTransporter.create({
      data: {
        name: 'EcoLogistics Solutions',
        licenseNumber: 'WT-2024-002',
        contactPerson: 'Lisa Davis',
        contactPhone: '(555) 345-6789',
        contactEmail: 'lisa@ecologistics.com',
        address: '654 Logistics Blvd, Transport Town, TT 24680',
        licenseExpiry: new Date('2025-08-20'),
      },
    }),
  ])

  // Create waste records
  const wasteRecords = await Promise.all([
    prisma.wasteRecord.create({
      data: {
        recordNumber: 'WM-2024-0001',
        wasteTypeId: wasteTypes[0].id, // Used Oil
        quantity: 50.5,
        unit: 'LITERS',
        location: 'Maintenance Shop',
        generatedBy: 'Maintenance Department',
        generatedDate: new Date('2024-01-15'),
        storedDate: new Date('2024-01-16'),
        disposalDate: new Date('2024-01-20'),
        disposalMethod: 'RECYCLING',
        disposalFacility: 'EcoRecycle Center',
        transporter: 'ABC Waste Transport',
        manifestNumber: 'WM-2024-001',
        cost: 125.50,
        status: 'DISPOSED',
        notes: 'Regular oil change waste from fleet vehicles',
      },
    }),
    prisma.wasteRecord.create({
      data: {
        recordNumber: 'WM-2024-0002',
        wasteTypeId: wasteTypes[1].id, // Paper Waste
        quantity: 200.0,
        unit: 'KG',
        location: 'Office Building A',
        generatedBy: 'Administrative Staff',
        generatedDate: new Date('2024-01-20'),
        storedDate: new Date('2024-01-21'),
        disposalDate: new Date('2024-01-25'),
        disposalMethod: 'RECYCLING',
        disposalFacility: 'EcoRecycle Center',
        transporter: 'EcoLogistics Solutions',
        manifestNumber: 'WM-2024-002',
        cost: 45.00,
        status: 'DISPOSED',
        notes: 'Monthly paper collection from office',
      },
    }),
    prisma.wasteRecord.create({
      data: {
        recordNumber: 'WM-2024-0003',
        wasteTypeId: wasteTypes[2].id, // Electronic Waste
        quantity: 15.0,
        unit: 'PIECES',
        location: 'IT Department',
        generatedBy: 'IT Support Team',
        generatedDate: new Date('2024-02-01'),
        storedDate: new Date('2024-02-02'),
        disposalMethod: 'RECYCLING',
        disposalFacility: 'EcoRecycle Center',
        transporter: 'ABC Waste Transport',
        manifestNumber: 'WM-2024-003',
        cost: 300.00,
        status: 'IN_TRANSIT',
        notes: 'Old computers and monitors for recycling',
      },
    }),
    prisma.wasteRecord.create({
      data: {
        recordNumber: 'WM-2024-0004',
        wasteTypeId: wasteTypes[3].id, // Food Waste
        quantity: 75.0,
        unit: 'KG',
        location: 'Cafeteria',
        generatedBy: 'Kitchen Staff',
        generatedDate: new Date('2024-02-05'),
        storedDate: new Date('2024-02-06'),
        disposalMethod: 'COMPOSTING',
        disposalFacility: 'Green Valley Landfill',
        transporter: 'EcoLogistics Solutions',
        cost: 25.00,
        status: 'STORED',
        notes: 'Daily food waste from employee cafeteria',
      },
    }),
    prisma.wasteRecord.create({
      data: {
        recordNumber: 'WM-2024-0005',
        wasteTypeId: wasteTypes[4].id, // Paint Waste
        quantity: 25.0,
        unit: 'LITERS',
        location: 'Paint Shop',
        generatedBy: 'Maintenance Department',
        generatedDate: new Date('2024-02-10'),
        storedDate: new Date('2024-02-11'),
        disposalMethod: 'TREATMENT',
        disposalFacility: 'SafeHaz Treatment Plant',
        transporter: 'ABC Waste Transport',
        manifestNumber: 'WM-2024-005',
        cost: 150.00,
        status: 'GENERATED',
        notes: 'Leftover paint from facility maintenance',
      },
    }),
  ])

  // Create log entries for waste records
  for (const record of wasteRecords) {
    await prisma.wasteRecordLog.create({
      data: {
        wasteRecordId: record.id,
        action: 'GENERATED',
        performedBy: 'system',
        comments: 'Waste record created',
      },
    })

    if (record.storedDate) {
      await prisma.wasteRecordLog.create({
        data: {
          wasteRecordId: record.id,
          action: 'STORED',
          performedBy: 'system',
          comments: 'Waste stored for disposal',
        },
      })
    }

    if (record.status === 'IN_TRANSIT') {
      await prisma.wasteRecordLog.create({
        data: {
          wasteRecordId: record.id,
          action: 'IN_TRANSIT',
          performedBy: 'system',
          comments: 'Waste picked up for transport',
        },
      })
    }

    if (record.status === 'DISPOSED') {
      await prisma.wasteRecordLog.create({
        data: {
          wasteRecordId: record.id,
          action: 'DISPOSED',
          performedBy: 'system',
          comments: 'Waste successfully disposed',
        },
      })
    }
  }

  console.log('Waste management data seeded successfully!')
  console.log(`Created ${wasteTypes.length} waste types`)
  console.log(`Created ${facilities.length} disposal facilities`)
  console.log(`Created ${transporters.length} transporters`)
  console.log(`Created ${wasteRecords.length} waste records`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
