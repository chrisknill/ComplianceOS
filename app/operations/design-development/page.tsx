// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["8.3"], 
  ems: ["8.3"], 
  ohsms: ["8.3"] 
}

export default function DesignDevelopmentPage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'Design & Development' }
  ]

  const columns = [
    { key: 'project', label: 'Project Name', sortable: true },
    { key: 'phase', label: 'Phase', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'responsible', label: 'Responsible', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      project: 'New Product Line A',
      phase: 'Design',
      status: 'In Progress',
      responsible: 'Design Team',
      dueDate: '2025-03-15'
    },
    {
      id: '2',
      project: 'Process Improvement B',
      phase: 'Development',
      status: 'Planning',
      responsible: 'Engineering',
      dueDate: '2025-04-01'
    },
    {
      id: '3',
      project: 'Quality Enhancement C',
      phase: 'Testing',
      status: 'Completed',
      responsible: 'Quality Team',
      dueDate: '2025-01-10'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Design & Development" 
        subtitle="Manage product and process design activities"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search design projects..."
            onAdd={() => console.log('Add new project')}
            onEdit={(id) => console.log('Edit project', id)}
            onDelete={(id) => console.log('Delete project', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Design Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
