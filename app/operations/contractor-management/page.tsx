// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function ContractorManagementPage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'Contractor Management' }
  ]

  const columns = [
    { key: 'contractor', label: 'Contractor Name', sortable: true },
    { key: 'service', label: 'Service Type', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'certification', label: 'Certification', sortable: true },
    { key: 'expiry', label: 'Cert Expiry', sortable: true }
  ]

  const data = [
    {
      id: '1',
      contractor: 'ABC Construction Ltd',
      service: 'Building Maintenance',
      status: 'Active',
      certification: 'Valid',
      expiry: '2025-06-15'
    },
    {
      id: '2',
      contractor: 'XYZ Cleaning Services',
      service: 'Facility Cleaning',
      status: 'Active',
      certification: 'Valid',
      expiry: '2025-08-20'
    },
    {
      id: '3',
      contractor: 'DEF Security Inc',
      service: 'Security Services',
      status: 'Under Review',
      certification: 'Expiring Soon',
      expiry: '2025-02-28'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contractor Management" 
        subtitle="Manage contractor relationships and performance"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search contractors..."
            onAdd={() => console.log('Add new contractor')}
            onEdit={(id) => console.log('Edit contractor', id)}
            onDelete={(id) => console.log('Delete contractor', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Contractor Manager"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
