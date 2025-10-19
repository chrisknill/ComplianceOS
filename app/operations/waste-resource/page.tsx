// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function WasteResourcePage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'Waste & Resource Management' }
  ]

  const columns = [
    { key: 'type', label: 'Waste Type', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'disposal', label: 'Disposal Method', sortable: true },
    { key: 'cost', label: 'Cost', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      type: 'Hazardous Waste',
      quantity: '50 kg',
      disposal: 'Licensed Facility',
      cost: '$500',
      date: '2025-01-15'
    },
    {
      id: '2',
      type: 'Recyclable Materials',
      quantity: '200 kg',
      disposal: 'Recycling Center',
      cost: '$100',
      date: '2025-01-14'
    },
    {
      id: '3',
      type: 'General Waste',
      quantity: '150 kg',
      disposal: 'Landfill',
      cost: '$75',
      date: '2025-01-13'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Waste & Resource Management" 
        subtitle="Track waste generation and resource utilization"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search waste records..."
            onAdd={() => console.log('Add new waste record')}
            onEdit={(id) => console.log('Edit waste record', id)}
            onDelete={(id) => console.log('Delete waste record', id)}
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
