// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["10.2"], 
  ems: ["10.2"], 
  ohsms: ["10.2"] 
}

export default function ActionsRegisterPage() {
  const breadcrumbs = [
    { label: 'Registers', href: '/registers' },
    { label: 'Actions Register' }
  ]

  const columns = [
    { key: 'action', label: 'Action Number', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      action: 'ACT-2025-001',
      description: 'Update procedure documentation',
      type: 'Corrective',
      status: 'In Progress',
      dueDate: '2025-02-15'
    },
    {
      id: '2',
      action: 'ACT-2025-002',
      description: 'Implement new safety measures',
      type: 'Preventive',
      status: 'Planned',
      dueDate: '2025-03-01'
    },
    {
      id: '3',
      action: 'ACT-2025-003',
      description: 'Enhance training program',
      type: 'Improvement',
      status: 'Completed',
      dueDate: '2025-01-20'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Actions Register" 
        subtitle="Track corrective, preventive, and improvement actions"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search actions..."
            onAdd={() => console.log('Add new action')}
            onEdit={(id) => console.log('Edit action', id)}
            onDelete={(id) => console.log('Delete action', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Actions Coordinator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
