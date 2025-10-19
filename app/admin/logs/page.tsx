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

export default function LogsPage() {
  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'System Logs' }
  ]

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'level', label: 'Level', sortable: true },
    { key: 'module', label: 'Module', sortable: true },
    { key: 'message', label: 'Message', sortable: true },
    { key: 'user', label: 'User', sortable: true }
  ]

  const data = [
    {
      id: '1',
      timestamp: '2025-01-18 10:30:15',
      level: 'INFO',
      module: 'Authentication',
      message: 'User login successful',
      user: 'john.smith@company.com'
    },
    {
      id: '2',
      timestamp: '2025-01-18 10:25:42',
      level: 'WARNING',
      module: 'Database',
      message: 'Connection timeout detected',
      user: 'system'
    },
    {
      id: '3',
      timestamp: '2025-01-18 10:20:18',
      level: 'ERROR',
      module: 'API',
      message: 'Failed to sync with external system',
      user: 'system'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Logs" 
        subtitle="Monitor system activity and troubleshoot issues"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search logs..."
            onAdd={() => console.log('Export logs')}
            onEdit={(id) => console.log('View log details', id)}
            onDelete={(id) => console.log('Delete log', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="System Administrator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
