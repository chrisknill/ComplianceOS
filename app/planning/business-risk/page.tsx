// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["6.1"], 
  ems: ["6.1"], 
  ohsms: ["6.1"] 
}

export default function BusinessRiskPage() {
  const breadcrumbs = [
    { label: 'Planning', href: '/planning' },
    { label: 'Business Risk' }
  ]

  const columns = [
    { key: 'risk', label: 'Risk Description', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'likelihood', label: 'Likelihood', sortable: true },
    { key: 'impact', label: 'Impact', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const data = [
    {
      id: '1',
      risk: 'Supply chain disruption',
      category: 'Operational',
      likelihood: 'Medium',
      impact: 'High',
      status: 'Active'
    },
    {
      id: '2',
      risk: 'Economic downturn',
      category: 'Financial',
      likelihood: 'Low',
      impact: 'High',
      status: 'Monitored'
    },
    {
      id: '3',
      risk: 'Technology failure',
      category: 'Technical',
      likelihood: 'Medium',
      impact: 'Medium',
      status: 'Mitigated'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Business Risk Assessment" 
        subtitle="Identify and manage business risks and opportunities"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search business risks..."
            onAdd={() => console.log('Add new risk')}
            onEdit={(id) => console.log('Edit risk', id)}
            onDelete={(id) => console.log('Delete risk', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Risk Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
