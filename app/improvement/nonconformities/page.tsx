// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function NonconformitiesPage() {
  const breadcrumbs = [
    { label: 'Improvement', href: '/improvement' },
    { label: 'Non-conformities' }
  ]

  const columns = [
    { key: 'nc', label: 'NC Number', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      nc: 'NC-2025-001',
      description: 'Documentation gap in procedure',
      type: 'Major',
      status: 'Open',
      dueDate: '2025-02-15'
    },
    {
      id: '2',
      nc: 'NC-2025-002',
      description: 'Calibration overdue',
      type: 'Minor',
      status: 'In Progress',
      dueDate: '2025-01-30'
    },
    {
      id: '3',
      nc: 'NC-2025-003',
      description: 'Training record missing',
      type: 'Minor',
      status: 'Closed',
      dueDate: '2025-01-20'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Non-conformities" 
        subtitle="Manage non-conformities and corrective actions"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search non-conformities..."
            onAdd={() => console.log('Add new NC')}
            onEdit={(id) => console.log('Edit NC', id)}
            onDelete={(id) => console.log('Delete NC', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Quality Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
