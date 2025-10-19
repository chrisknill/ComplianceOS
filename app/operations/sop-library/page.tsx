// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["8.1"], 
  ems: ["8.1"], 
  ohsms: ["8.1"] 
}

export default function SopLibraryPage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'SOP Library' }
  ]

  const columns = [
    { key: 'title', label: 'SOP Title', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'version', label: 'Version', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastReview', label: 'Last Review', sortable: true }
  ]

  const data = [
    {
      id: '1',
      title: 'Production Line Setup',
      department: 'Manufacturing',
      version: '2.1',
      status: 'Active',
      lastReview: '2025-01-10'
    },
    {
      id: '2',
      title: 'Quality Control Procedures',
      department: 'Quality',
      version: '1.8',
      status: 'Under Review',
      lastReview: '2024-12-15'
    },
    {
      id: '3',
      title: 'Safety Protocols',
      department: 'Safety',
      version: '3.0',
      status: 'Active',
      lastReview: '2025-01-05'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Standard Operating Procedures" 
        subtitle="Library of operational procedures and work instructions"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search SOPs..."
            onAdd={() => console.log('Add new SOP')}
            onEdit={(id) => console.log('Edit SOP', id)}
            onDelete={(id) => console.log('Delete SOP', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Operations Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
