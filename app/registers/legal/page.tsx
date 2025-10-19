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

export default function LegalRegisterPage() {
  const breadcrumbs = [
    { label: 'Registers', href: '/registers' },
    { label: 'Legal Register' }
  ]

  const columns = [
    { key: 'requirement', label: 'Legal Requirement', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'applicable', label: 'Applicable', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'nextReview', label: 'Next Review', sortable: true }
  ]

  const data = [
    {
      id: '1',
      requirement: 'Environmental Protection Act',
      source: 'Federal Law',
      applicable: 'Yes',
      status: 'Compliant',
      nextReview: '2025-06-01'
    },
    {
      id: '2',
      requirement: 'Occupational Health & Safety Act',
      source: 'Provincial Law',
      applicable: 'Yes',
      status: 'Compliant',
      nextReview: '2025-03-01'
    },
    {
      id: '3',
      requirement: 'Consumer Protection Act',
      source: 'Federal Law',
      applicable: 'Yes',
      status: 'Under Review',
      nextReview: '2025-02-15'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Legal Register" 
        subtitle="Track legal and regulatory requirements"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search legal requirements..."
            onAdd={() => console.log('Add new requirement')}
            onEdit={(id) => console.log('Edit requirement', id)}
            onDelete={(id) => console.log('Delete requirement', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Legal Counsel"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
