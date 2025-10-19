// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function ImprovementOpportunitiesPage() {
  const breadcrumbs = [
    { label: 'Improvement', href: '/improvement' },
    { label: 'Improvement Opportunities' }
  ]

  const columns = [
    { key: 'opportunity', label: 'Opportunity', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'assignedTo', label: 'Assigned To', sortable: true }
  ]

  const data = [
    {
      id: '1',
      opportunity: 'Process automation',
      type: 'Efficiency',
      priority: 'High',
      status: 'In Progress',
      assignedTo: 'Operations Team'
    },
    {
      id: '2',
      opportunity: 'Energy reduction',
      type: 'Environmental',
      priority: 'Medium',
      status: 'Planned',
      assignedTo: 'Environmental Team'
    },
    {
      id: '3',
      opportunity: 'Training enhancement',
      type: 'Quality',
      priority: 'Low',
      status: 'Completed',
      assignedTo: 'HR Team'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Improvement Opportunities" 
        subtitle="Identify and track improvement opportunities"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search opportunities..."
            onAdd={() => console.log('Add new opportunity')}
            onEdit={(id) => console.log('Edit opportunity', id)}
            onDelete={(id) => console.log('Delete opportunity', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Improvement Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
