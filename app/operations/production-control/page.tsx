// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export const isoMeta = { 
  qms: ["8.5"], 
  ems: ["8.5"], 
  ohsms: ["8.5"] 
}

export default function ProductionControlPage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'Production Control' }
  ]

  const columns = [
    { key: 'order', label: 'Production Order', sortable: true },
    { key: 'product', label: 'Product', sortable: true },
    { key: 'quantity', label: 'Quantity', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true }
  ]

  const data = [
    {
      id: '1',
      order: 'PO-2025-001',
      product: 'Widget A',
      quantity: '1000',
      status: 'In Production',
      dueDate: '2025-02-15'
    },
    {
      id: '2',
      order: 'PO-2025-002',
      product: 'Widget B',
      quantity: '500',
      status: 'Planned',
      dueDate: '2025-02-20'
    },
    {
      id: '3',
      order: 'PO-2025-003',
      product: 'Widget C',
      quantity: '750',
      status: 'Completed',
      dueDate: '2025-01-30'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Production Control" 
        subtitle="Monitor and control production activities"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search production orders..."
            onAdd={() => console.log('Add new order')}
            onEdit={(id) => console.log('Edit order', id)}
            onDelete={(id) => console.log('Delete order', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Production Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
