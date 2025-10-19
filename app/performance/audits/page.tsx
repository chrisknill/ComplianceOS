// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function AuditsPage() {
  const breadcrumbs = [
    { label: 'Performance', href: '/performance' },
    { label: 'Audits' }
  ]

  const columns = [
    { key: 'audit', label: 'Audit Type', sortable: true },
    { key: 'scope', label: 'Scope', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'auditor', label: 'Auditor', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      audit: 'Internal QMS Audit',
      scope: 'Quality Management',
      status: 'Completed',
      auditor: 'John Smith',
      date: '2025-01-10'
    },
    {
      id: '2',
      audit: 'External EMS Audit',
      scope: 'Environmental Management',
      status: 'In Progress',
      auditor: 'External Auditor',
      date: '2025-01-20'
    },
    {
      id: '3',
      audit: 'OHS Audit',
      scope: 'Health & Safety',
      status: 'Planned',
      auditor: 'Sarah Johnson',
      date: '2025-02-15'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Audits" 
        subtitle="Manage internal and external audit activities"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search audits..."
            onAdd={() => console.log('Add new audit')}
            onEdit={(id) => console.log('Edit audit', id)}
            onDelete={(id) => console.log('Delete audit', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Audit Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
