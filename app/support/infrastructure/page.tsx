// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["7.1.3"], 
  ems: ["7.1.3"], 
  ohsms: ["7.1.3"] 
}

export default function InfrastructurePage() {
  const breadcrumbs = [
    { label: 'Support', href: '/support' },
    { label: 'Infrastructure' }
  ]

  const columns = [
    { key: 'asset', label: 'Infrastructure Asset', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'nextMaintenance', label: 'Next Maintenance', sortable: true }
  ]

  const data = [
    {
      id: '1',
      asset: 'Production Line A',
      type: 'Manufacturing',
      location: 'Plant Floor',
      status: 'Operational',
      nextMaintenance: '2025-02-15'
    },
    {
      id: '2',
      asset: 'HVAC System',
      type: 'Facilities',
      location: 'Main Building',
      status: 'Operational',
      nextMaintenance: '2025-03-01'
    },
    {
      id: '3',
      asset: 'IT Server Room',
      type: 'IT Infrastructure',
      location: 'Data Center',
      status: 'Under Maintenance',
      nextMaintenance: '2025-01-25'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Infrastructure Management" 
        subtitle="Manage organizational infrastructure and facilities"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search infrastructure..."
            onAdd={() => console.log('Add new asset')}
            onEdit={(id) => console.log('Edit asset', id)}
            onDelete={(id) => console.log('Delete asset', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Facilities Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
