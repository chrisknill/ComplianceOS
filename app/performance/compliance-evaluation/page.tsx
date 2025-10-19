// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["9.1.3"], 
  ems: ["9.1.3"], 
  ohsms: ["9.1.3"] 
}

export default function ComplianceEvaluationPage() {
  const breadcrumbs = [
    { label: 'Performance', href: '/performance' },
    { label: 'Compliance Evaluation' }
  ]

  const columns = [
    { key: 'requirement', label: 'Requirement', sortable: true },
    { key: 'standard', label: 'Standard', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastCheck', label: 'Last Check', sortable: true },
    { key: 'nextCheck', label: 'Next Check', sortable: true }
  ]

  const data = [
    {
      id: '1',
      requirement: 'Document Control',
      standard: 'ISO 9001',
      status: 'Compliant',
      lastCheck: '2025-01-10',
      nextCheck: '2025-04-10'
    },
    {
      id: '2',
      requirement: 'Environmental Permits',
      standard: 'ISO 14001',
      status: 'Compliant',
      lastCheck: '2025-01-05',
      nextCheck: '2025-07-05'
    },
    {
      id: '3',
      requirement: 'Safety Training',
      standard: 'ISO 45001',
      status: 'Non-Compliant',
      lastCheck: '2025-01-15',
      nextCheck: '2025-02-15'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Compliance Evaluation" 
        subtitle="Evaluate compliance with legal and regulatory requirements"
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
