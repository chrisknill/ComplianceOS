// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["9.1.2"], 
  ems: ["9.1.2"], 
  ohsms: ["9.1.2"] 
}

export default function CustomerSatisfactionPage() {
  const breadcrumbs = [
    { label: 'Performance', href: '/performance' },
    { label: 'Customer Satisfaction' }
  ]

  const columns = [
    { key: 'customer', label: 'Customer', sortable: true },
    { key: 'survey', label: 'Survey Type', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      customer: 'ABC Corp',
      survey: 'Product Quality',
      rating: '4.5/5',
      status: 'Completed',
      date: '2025-01-15'
    },
    {
      id: '2',
      customer: 'XYZ Ltd',
      survey: 'Service Delivery',
      rating: '4.2/5',
      status: 'Completed',
      date: '2025-01-12'
    },
    {
      id: '3',
      customer: 'DEF Inc',
      survey: 'Overall Satisfaction',
      rating: 'Pending',
      status: 'In Progress',
      date: '2025-01-18'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Customer Satisfaction" 
        subtitle="Monitor and track customer satisfaction metrics"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search customer surveys..."
            onAdd={() => console.log('Add new survey')}
            onEdit={(id) => console.log('Edit survey', id)}
            onDelete={(id) => console.log('Delete survey', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Customer Relations Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
