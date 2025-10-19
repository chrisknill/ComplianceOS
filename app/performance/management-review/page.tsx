// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["9.3"], 
  ems: ["9.3"], 
  ohsms: ["9.3"] 
}

export default function ManagementReviewPage() {
  const breadcrumbs = [
    { label: 'Performance', href: '/performance' },
    { label: 'Management Review' }
  ]

  const columns = [
    { key: 'review', label: 'Review Type', sortable: true },
    { key: 'period', label: 'Period', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'chair', label: 'Chair', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      review: 'QMS Management Review',
      period: 'Q4 2024',
      status: 'Completed',
      chair: 'CEO',
      date: '2025-01-15'
    },
    {
      id: '2',
      review: 'EMS Management Review',
      period: 'Q4 2024',
      status: 'Completed',
      chair: 'Environmental Manager',
      date: '2025-01-10'
    },
    {
      id: '3',
      review: 'OHS Management Review',
      period: 'Q1 2025',
      status: 'Planned',
      chair: 'Safety Manager',
      date: '2025-03-15'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Management Review" 
        subtitle="Track management review activities and outcomes"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search management reviews..."
            onAdd={() => console.log('Add new review')}
            onEdit={(id) => console.log('Edit review', id)}
            onDelete={(id) => console.log('Delete review', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Management Representative"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
