// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function TrainingPage() {
  const breadcrumbs = [
    { label: 'Support', href: '/support' },
    { label: 'Training' }
  ]

  const columns = [
    { key: 'course', label: 'Training Course', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'participants', label: 'Participants', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'nextSession', label: 'Next Session', sortable: true }
  ]

  const data = [
    {
      id: '1',
      course: 'ISO 9001 Awareness',
      type: 'Quality',
      participants: '25',
      status: 'Scheduled',
      nextSession: '2025-02-15'
    },
    {
      id: '2',
      course: 'Safety Training',
      type: 'OHS',
      participants: '15',
      status: 'Completed',
      nextSession: '2025-03-01'
    },
    {
      id: '3',
      course: 'Environmental Management',
      type: 'EMS',
      participants: '20',
      status: 'In Progress',
      nextSession: '2025-01-25'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Training Management" 
        subtitle="Plan and track employee training and competence"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search training courses..."
            onAdd={() => console.log('Add new training')}
            onEdit={(id) => console.log('Edit training', id)}
            onDelete={(id) => console.log('Delete training', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Training Coordinator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
