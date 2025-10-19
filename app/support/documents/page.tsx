// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function DocumentsPage() {
  const breadcrumbs = [
    { label: 'Support', href: '/support' },
    { label: 'Documents' }
  ]

  const columns = [
    { key: 'title', label: 'Document Title', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'version', label: 'Version', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastReview', label: 'Last Review', sortable: true }
  ]

  const data = [
    {
      id: '1',
      title: 'Quality Manual',
      type: 'Manual',
      version: '3.1',
      status: 'Active',
      lastReview: '2025-01-10'
    },
    {
      id: '2',
      title: 'Environmental Policy',
      type: 'Policy',
      version: '2.0',
      status: 'Under Review',
      lastReview: '2024-12-15'
    },
    {
      id: '3',
      title: 'Safety Procedures',
      type: 'Procedure',
      version: '1.5',
      status: 'Active',
      lastReview: '2025-01-05'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Document Management" 
        subtitle="Manage organizational documents and records"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search documents..."
            onAdd={() => console.log('Add new document')}
            onEdit={(id) => console.log('Edit document', id)}
            onDelete={(id) => console.log('Delete document', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Document Controller"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
