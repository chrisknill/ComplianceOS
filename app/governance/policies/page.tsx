// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["5.2"], 
  ems: ["5.2"], 
  ohsms: ["5.2"] 
}

export default function PoliciesPage() {
  const breadcrumbs = [
    { label: 'Governance', href: '/governance' },
    { label: 'Policies' }
  ]

  const columns = [
    { key: 'title', label: 'Policy Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastReview', label: 'Last Review', sortable: true }
  ]

  const data = [
    {
      id: '1',
      title: 'Quality Policy',
      type: 'QMS',
      status: 'Active',
      lastReview: '2025-01-15'
    },
    {
      id: '2',
      title: 'Environmental Policy',
      type: 'EMS',
      status: 'Active',
      lastReview: '2025-01-10'
    },
    {
      id: '3',
      title: 'Health & Safety Policy',
      type: 'OHS',
      status: 'Under Review',
      lastReview: '2024-12-01'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Policies" 
        subtitle="Manage organizational policies and commitments"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search policies..."
            onAdd={() => console.log('Add new policy')}
            onEdit={(id) => console.log('Edit policy', id)}
            onDelete={(id) => console.log('Delete policy', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Policy Manager"
            status="Active"
            nextReviewAt={new Date('2025-06-01')}
          />
        </div>
      </div>
    </div>
  )
}
