// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  ems: ["6.1.2"] 
}

export default function EnvAspectsImpactsPage() {
  const breadcrumbs = [
    { label: 'Planning', href: '/planning' },
    { label: 'Environmental Aspects & Impacts' }
  ]

  const columns = [
    { key: 'aspect', label: 'Environmental Aspect', sortable: true },
    { key: 'impact', label: 'Environmental Impact', sortable: true },
    { key: 'significance', label: 'Significance', sortable: true },
    { key: 'control', label: 'Control Measures', sortable: false }
  ]

  const data = [
    {
      id: '1',
      aspect: 'Energy consumption',
      impact: 'Climate change',
      significance: 'High',
      control: 'Energy efficiency program'
    },
    {
      id: '2',
      aspect: 'Waste generation',
      impact: 'Landfill use',
      significance: 'Medium',
      control: 'Waste reduction and recycling'
    },
    {
      id: '3',
      aspect: 'Water usage',
      impact: 'Water scarcity',
      significance: 'Medium',
      control: 'Water conservation measures'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Environmental Aspects & Impacts" 
        subtitle="Identify and evaluate environmental aspects and their impacts"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search environmental aspects..."
            onAdd={() => console.log('Add new aspect')}
            onEdit={(id) => console.log('Edit aspect', id)}
            onDelete={(id) => console.log('Delete aspect', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Environmental Coordinator"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
