// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["7.2"], 
  ems: ["7.2"], 
  ohsms: ["7.2"] 
}

export default function TrainingRegisterPage() {
  const breadcrumbs = [
    { label: 'Registers', href: '/registers' },
    { label: 'Training Register' }
  ]

  const columns = [
    { key: 'employee', label: 'Employee', sortable: true },
    { key: 'course', label: 'Training Course', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'completion', label: 'Completion Date', sortable: true },
    { key: 'expiry', label: 'Expiry Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      employee: 'John Smith',
      course: 'ISO 9001 Awareness',
      status: 'Completed',
      completion: '2025-01-10',
      expiry: '2026-01-10'
    },
    {
      id: '2',
      employee: 'Sarah Johnson',
      course: 'Safety Training',
      status: 'In Progress',
      completion: 'Pending',
      expiry: '2026-02-15'
    },
    {
      id: '3',
      employee: 'Mike Wilson',
      course: 'Environmental Management',
      status: 'Completed',
      completion: '2024-12-20',
      expiry: '2025-12-20'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Training Register" 
        subtitle="Track employee training and competence records"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search training records..."
            onAdd={() => console.log('Add new training record')}
            onEdit={(id) => console.log('Edit training record', id)}
            onDelete={(id) => console.log('Delete training record', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Training Coordinator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
