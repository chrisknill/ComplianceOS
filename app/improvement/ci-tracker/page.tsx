// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function CiTrackerPage() {
  const breadcrumbs = [
    { label: 'Improvement', href: '/improvement' },
    { label: 'Continuous Improvement Tracker' }
  ]

  const columns = [
    { key: 'improvement', label: 'Improvement Initiative', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'impact', label: 'Impact', sortable: true },
    { key: 'completion', label: 'Completion', sortable: true }
  ]

  const data = [
    {
      id: '1',
      improvement: 'Lean Manufacturing Implementation',
      type: 'Process',
      status: 'In Progress',
      impact: 'High',
      completion: '60%'
    },
    {
      id: '2',
      improvement: 'Digital Document Management',
      type: 'Technology',
      status: 'Planned',
      impact: 'Medium',
      completion: '0%'
    },
    {
      id: '3',
      improvement: 'Employee Engagement Program',
      type: 'People',
      status: 'Completed',
      impact: 'High',
      completion: '100%'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Continuous Improvement Tracker" 
        subtitle="Track and monitor continuous improvement initiatives"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search CI initiatives..."
            onAdd={() => console.log('Add new initiative')}
            onEdit={(id) => console.log('Edit initiative', id)}
            onDelete={(id) => console.log('Delete initiative', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="CI Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
