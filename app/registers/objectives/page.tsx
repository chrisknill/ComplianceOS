// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function ObjectivesRegisterPage() {
  const breadcrumbs = [
    { label: 'Registers', href: '/registers' },
    { label: 'Objectives Register' }
  ]

  const columns = [
    { key: 'objective', label: 'Objective', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'target', label: 'Target', sortable: true },
    { key: 'progress', label: 'Progress', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      objective: 'Reduce waste by 20%',
      type: 'Environmental',
      target: '20% reduction',
      progress: '75%',
      dueDate: '2025-12-31'
    },
    {
      id: '2',
      objective: 'Achieve zero lost time incidents',
      type: 'Safety',
      target: '0 LTI',
      progress: '100%',
      dueDate: '2025-12-31'
    },
    {
      id: '3',
      objective: 'Improve customer satisfaction',
      type: 'Quality',
      target: '4.5/5 rating',
      progress: '60%',
      dueDate: '2025-06-30'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Objectives Register" 
        subtitle="Track management system objectives and targets"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search objectives..."
            onAdd={() => console.log('Add new objective')}
            onEdit={(id) => console.log('Edit objective', id)}
            onDelete={(id) => console.log('Delete objective', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Management Team"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
