// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function RiskRegisterPage() {
  const breadcrumbs = [
    { label: 'Registers', href: '/registers' },
    { label: 'Risk Register' }
  ]

  const columns = [
    { key: 'risk', label: 'Risk Description', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'likelihood', label: 'Likelihood', sortable: true },
    { key: 'impact', label: 'Impact', sortable: true },
    { key: 'rating', label: 'Risk Rating', sortable: true }
  ]

  const data = [
    {
      id: '1',
      risk: 'Supply chain disruption',
      category: 'Operational',
      likelihood: 'Medium',
      impact: 'High',
      rating: 'High'
    },
    {
      id: '2',
      risk: 'Regulatory changes',
      category: 'Compliance',
      likelihood: 'Low',
      impact: 'Medium',
      rating: 'Low'
    },
    {
      id: '3',
      risk: 'Technology failure',
      category: 'Technical',
      likelihood: 'Medium',
      impact: 'Medium',
      rating: 'Medium'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Risk Register" 
        subtitle="Comprehensive risk assessment and management"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search risks..."
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
