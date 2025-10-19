// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function LessonsLearnedPage() {
  const breadcrumbs = [
    { label: 'Improvement', href: '/improvement' },
    { label: 'Lessons Learned' }
  ]

  const columns = [
    { key: 'lesson', label: 'Lesson Learned', sortable: true },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      lesson: 'Improved communication reduces errors',
      source: 'Audit Finding',
      category: 'Process',
      status: 'Implemented',
      date: '2025-01-10'
    },
    {
      id: '2',
      lesson: 'Regular training prevents incidents',
      source: 'Incident Investigation',
      category: 'Safety',
      status: 'In Progress',
      date: '2025-01-15'
    },
    {
      id: '3',
      lesson: 'Early supplier engagement improves quality',
      source: 'Project Review',
      category: 'Quality',
      status: 'Planned',
      date: '2025-01-18'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Lessons Learned" 
        subtitle="Capture and share organizational learning"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search lessons learned..."
            onAdd={() => console.log('Add new lesson')}
            onEdit={(id) => console.log('Edit lesson', id)}
            onDelete={(id) => console.log('Delete lesson', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Knowledge Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
