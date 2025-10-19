// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  ohsms: ["6.1.2"] 
}

export default function OhsHazardsRisksPage() {
  const breadcrumbs = [
    { label: 'Planning', href: '/planning' },
    { label: 'OHS Hazards & Risks' }
  ]

  const columns = [
    { key: 'hazard', label: 'Hazard Description', sortable: true },
    { key: 'risk', label: 'Risk Description', sortable: true },
    { key: 'likelihood', label: 'Likelihood', sortable: true },
    { key: 'severity', label: 'Severity', sortable: true },
    { key: 'rating', label: 'Risk Rating', sortable: true }
  ]

  const data = [
    {
      id: '1',
      hazard: 'Working at height',
      risk: 'Fall from height',
      likelihood: 'Medium',
      severity: 'High',
      rating: 'High'
    },
    {
      id: '2',
      hazard: 'Machinery operation',
      risk: 'Crush injury',
      likelihood: 'Low',
      severity: 'High',
      rating: 'Medium'
    },
    {
      id: '3',
      hazard: 'Chemical exposure',
      risk: 'Health effects',
      likelihood: 'Low',
      severity: 'Medium',
      rating: 'Low'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="OHS Hazards & Risks" 
        subtitle="Identify and assess occupational health and safety hazards"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search hazards and risks..."
            onAdd={() => console.log('Add new hazard')}
            onEdit={(id) => console.log('Edit hazard', id)}
            onDelete={(id) => console.log('Delete hazard', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Safety Officer"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
