// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function CommunicationPage() {
  const breadcrumbs = [
    { label: 'Support', href: '/support' },
    { label: 'Communication' }
  ]

  const columns = [
    { key: 'message', label: 'Communication', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'audience', label: 'Audience', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      message: 'Safety Alert - New Procedure',
      type: 'Safety',
      audience: 'All Employees',
      status: 'Sent',
      date: '2025-01-15'
    },
    {
      id: '2',
      message: 'Environmental Policy Update',
      type: 'Environmental',
      audience: 'Management',
      status: 'Draft',
      date: '2025-01-18'
    },
    {
      id: '3',
      message: 'Quality Objectives Review',
      type: 'Quality',
      audience: 'Quality Team',
      status: 'Scheduled',
      date: '2025-01-20'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Communication Management" 
        subtitle="Manage internal and external communications"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search communications..."
            onAdd={() => console.log('Add new communication')}
            onEdit={(id) => console.log('Edit communication', id)}
            onDelete={(id) => console.log('Delete communication', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Communications Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
