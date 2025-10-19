// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export default function IntegrationsPage() {
  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Integrations' }
  ]

  const columns = [
    { key: 'integration', label: 'Integration Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastSync', label: 'Last Sync', sortable: true },
    { key: 'nextSync', label: 'Next Sync', sortable: true }
  ]

  const data = [
    {
      id: '1',
      integration: 'SharePoint',
      type: 'Document Management',
      status: 'Active',
      lastSync: '2025-01-18 10:30',
      nextSync: '2025-01-18 11:30'
    },
    {
      id: '2',
      integration: 'Microsoft Teams',
      type: 'Communication',
      status: 'Active',
      lastSync: '2025-01-18 09:15',
      nextSync: '2025-01-18 10:15'
    },
    {
      id: '3',
      integration: 'ERP System',
      type: 'Business System',
      status: 'Inactive',
      lastSync: '2025-01-15 16:45',
      nextSync: 'Manual'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Integrations" 
        subtitle="Manage external system integrations and APIs"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search integrations..."
            onAdd={() => console.log('Add new integration')}
            onEdit={(id) => console.log('Edit integration', id)}
            onDelete={(id) => console.log('Delete integration', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="IT Administrator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
