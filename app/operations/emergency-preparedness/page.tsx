// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["8.2"], 
  ems: ["8.2"], 
  ohsms: ["8.2"] 
}

export default function EmergencyPreparednessPage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'Emergency Preparedness' }
  ]

  const columns = [
    { key: 'scenario', label: 'Emergency Scenario', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastDrill', label: 'Last Drill', sortable: true },
    { key: 'nextDrill', label: 'Next Drill', sortable: true }
  ]

  const data = [
    {
      id: '1',
      scenario: 'Fire Emergency',
      type: 'Safety',
      status: 'Active',
      lastDrill: '2024-12-15',
      nextDrill: '2025-03-15'
    },
    {
      id: '2',
      scenario: 'Chemical Spill',
      type: 'Environmental',
      status: 'Active',
      lastDrill: '2024-11-20',
      nextDrill: '2025-02-20'
    },
    {
      id: '3',
      scenario: 'Power Outage',
      type: 'Infrastructure',
      status: 'Under Review',
      lastDrill: '2024-10-10',
      nextDrill: '2025-01-30'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Emergency Preparedness" 
        subtitle="Manage emergency response plans and procedures"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search emergency scenarios..."
            onAdd={() => console.log('Add new scenario')}
            onEdit={(id) => console.log('Edit scenario', id)}
            onDelete={(id) => console.log('Delete scenario', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Emergency Coordinator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
