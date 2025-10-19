// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  ohsms: ["9.1"] 
}

export default function OhsPerformancePage() {
  const breadcrumbs = [
    { label: 'Performance', href: '/performance' },
    { label: 'OHS Performance' }
  ]

  const columns = [
    { key: 'metric', label: 'Performance Metric', sortable: true },
    { key: 'target', label: 'Target', sortable: true },
    { key: 'actual', label: 'Actual', sortable: true },
    { key: 'trend', label: 'Trend', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const data = [
    {
      id: '1',
      metric: 'Lost Time Incidents',
      target: '0',
      actual: '0',
      trend: 'Stable',
      status: 'On Target'
    },
    {
      id: '2',
      metric: 'Near Miss Reports',
      target: '10/month',
      actual: '8',
      trend: 'Improving',
      status: 'Below Target'
    },
    {
      id: '3',
      metric: 'Training Completion',
      target: '100%',
      actual: '98%',
      trend: 'Improving',
      status: 'Near Target'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="OHS Performance" 
        subtitle="Monitor occupational health and safety performance"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search OHS metrics..."
            onAdd={() => console.log('Add new metric')}
            onEdit={(id) => console.log('Edit metric', id)}
            onDelete={(id) => console.log('Delete metric', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Safety Officer"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
