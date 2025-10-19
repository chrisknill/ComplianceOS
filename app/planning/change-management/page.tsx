// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["6.3"], 
  ems: ["6.3"], 
  ohsms: ["6.3"] 
}

export default function ChangeManagementPage() {
  const breadcrumbs = [
    { label: 'Planning', href: '/planning' },
    { label: 'Change Management' }
  ]

  const columns = [
    { key: 'change', label: 'Change Description', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'requestedBy', label: 'Requested By', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      change: 'New process implementation',
      type: 'Process',
      status: 'In Progress',
      requestedBy: 'Operations Manager',
      dueDate: '2025-02-15'
    },
    {
      id: '2',
      change: 'Equipment upgrade',
      type: 'Infrastructure',
      status: 'Approved',
      requestedBy: 'Maintenance Manager',
      dueDate: '2025-03-01'
    },
    {
      id: '3',
      change: 'Policy update',
      type: 'Documentation',
      status: 'Draft',
      requestedBy: 'Quality Manager',
      dueDate: '2025-01-30'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Change Management" 
        subtitle="Plan and manage organizational changes"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search changes..."
            onAdd={() => console.log('Add new change')}
            onEdit={(id) => console.log('Edit change', id)}
            onDelete={(id) => console.log('Delete change', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Change Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
