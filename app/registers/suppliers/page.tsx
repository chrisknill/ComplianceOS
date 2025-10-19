// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'

export default function SuppliersRegisterPage() {
  const breadcrumbs = [
    { label: 'Registers', href: '/registers' },
    { label: 'Suppliers Register' }
  ]

  const columns = [
    { key: 'supplier', label: 'Supplier Name', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastAudit', label: 'Last Audit', sortable: true }
  ]

  const data = [
    {
      id: '1',
      supplier: 'ABC Materials Ltd',
      category: 'Raw Materials',
      rating: 'A',
      status: 'Approved',
      lastAudit: '2024-11-15'
    },
    {
      id: '2',
      supplier: 'XYZ Services Inc',
      category: 'Services',
      rating: 'B',
      status: 'Approved',
      lastAudit: '2024-10-20'
    },
    {
      id: '3',
      supplier: 'DEF Equipment Co',
      category: 'Equipment',
      rating: 'A',
      status: 'Under Review',
      lastAudit: '2024-12-01'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Suppliers Register" 
        subtitle="Manage supplier relationships and performance"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search suppliers..."
            onAdd={() => console.log('Add new supplier')}
            onEdit={(id) => console.log('Edit supplier', id)}
            onDelete={(id) => console.log('Delete supplier', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Procurement Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
