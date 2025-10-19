// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["4.2"], 
  ems: ["4.2"], 
  ohsms: ["4.2"] 
}

export default function InterestedPartiesPage() {
  const breadcrumbs = [
    { label: 'Governance', href: '/governance' },
    { label: 'Interested Parties' }
  ]

  const columns = [
    { key: 'name', label: 'Party Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'requirements', label: 'Requirements', sortable: false },
    { key: 'lastReview', label: 'Last Review', sortable: true }
  ]

  const data = [
    {
      id: '1',
      name: 'Customers',
      type: 'External',
      requirements: 'Quality products, timely delivery',
      lastReview: '2025-01-10'
    },
    {
      id: '2',
      name: 'Employees',
      type: 'Internal',
      requirements: 'Safe working conditions, fair treatment',
      lastReview: '2025-01-08'
    },
    {
      id: '3',
      name: 'Regulators',
      type: 'External',
      requirements: 'Compliance with standards',
      lastReview: '2025-01-05'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Interested Parties" 
        subtitle="Manage stakeholder requirements and expectations"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search interested parties..."
            onAdd={() => console.log('Add new party')}
            onEdit={(id) => console.log('Edit party', id)}
            onDelete={(id) => console.log('Delete party', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Stakeholder Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
