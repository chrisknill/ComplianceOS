// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { DataTable } from '@/components/DataTable'


export default function CalibrationPage() {
  const breadcrumbs = [
    { label: 'Support', href: '/support' },
    { label: 'Calibration' }
  ]

  const columns = [
    { key: 'equipment', label: 'Equipment', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'lastCalibration', label: 'Last Calibration', sortable: true },
    { key: 'nextDue', label: 'Next Due', sortable: true },
    { key: 'status', label: 'Status', sortable: true }
  ]

  const data = [
    {
      id: '1',
      equipment: 'Pressure Gauge PG-001',
      type: 'Measurement',
      lastCalibration: '2024-12-15',
      nextDue: '2025-02-15',
      status: 'Valid'
    },
    {
      id: '2',
      equipment: 'Temperature Sensor TS-002',
      type: 'Measurement',
      lastCalibration: '2024-11-20',
      nextDue: '2025-01-20',
      status: 'Due Soon'
    },
    {
      id: '3',
      equipment: 'Scale SC-003',
      type: 'Weighing',
      lastCalibration: '2025-01-10',
      nextDue: '2025-07-10',
      status: 'Valid'
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calibration Management" 
        subtitle="Track equipment calibration and measurement traceability"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <DataTable
            columns={columns}
            data={data}
            searchPlaceholder="Search calibration records..."
            onAdd={() => console.log('Add new calibration')}
            onEdit={(id) => console.log('Edit calibration', id)}
            onDelete={(id) => console.log('Delete calibration', id)}
          />
        </div>
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Calibration Technician"
            status="Active"
            nextReviewAt={new Date('2025-03-01')}
          />
        </div>
      </div>
    </div>
  )
}
