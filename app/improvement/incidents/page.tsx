// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function IncidentsPage() {
  const breadcrumbs = [
    { label: 'Improvement', href: '/improvement' },
    { label: 'Incidents' }
  ]

  const columns = [
    { key: 'incident', label: 'Incident Number', sortable: true },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      incident: 'INC-2025-001',
      description: 'Minor cut on hand',
      severity: 'Minor',
      status: 'Investigated',
      date: '2025-01-15'
    },
    {
      id: '2',
      incident: 'INC-2025-002',
      description: 'Near miss - falling object',
      severity: 'Near Miss',
      status: 'Under Investigation',
      date: '2025-01-18'
    },
    {
      id: '3',
      incident: 'INC-2025-003',
      description: 'Equipment malfunction',
      severity: 'Minor',
      status: 'Closed',
      date: '2025-01-10'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Incidents" 
        subtitle="Manage safety incidents and investigations"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search incidents..."
            onAdd={() => console.log('Add new incident')}
            onEdit={(id) => console.log('Edit incident', id)}
            onDelete={(id) => console.log('Delete incident', id)}
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
