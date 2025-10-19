// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["6.1.3"], 
  ems: ["6.1.3"], 
  ohsms: ["6.1.3"] 
}

export default function ComplianceRegisterPage() {
  const breadcrumbs = [
    { label: 'Governance', href: '/governance' },
    { label: 'Compliance Register' }
  ]

  const columns = [
    { key: 'requirement', label: 'Requirement', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'nextReview', label: 'Next Review', sortable: true }
  ]

  const data = [
    {
      id: '1',
      requirement: 'ISO 9001:2015 Certification',
      source: 'ISO Standard',
      status: 'Compliant',
      nextReview: '2025-06-15'
    },
    {
      id: '2',
      requirement: 'Environmental Permits',
      source: 'EPA Regulations',
      status: 'Compliant',
      nextReview: '2025-03-01'
    },
    {
      id: '3',
      requirement: 'Workplace Safety Standards',
      source: 'OSHA Regulations',
      status: 'Under Review',
      nextReview: '2025-02-15'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Compliance Register" 
        subtitle="Track legal and regulatory compliance requirements"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search compliance requirements..."
            onAdd={() => console.log('Add new requirement')}
            onEdit={(id) => console.log('Edit requirement', id)}
            onDelete={(id) => console.log('Delete requirement', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Compliance Officer"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
