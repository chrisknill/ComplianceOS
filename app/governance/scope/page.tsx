// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, MapPin } from 'lucide-react'

export const isoMeta = { 
  qms: ["4.3"], 
  ems: ["4.3"], 
  ohsms: ["4.3"] 
}

export default function ScopePage() {
  const breadcrumbs = [
    { label: 'Governance', href: '/governance' },
    { label: 'Scope' }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Management System Scope" 
        subtitle="Define the boundaries and applicability of your management system"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Scope</CardTitle>
              <CardDescription>
                Current scope of the integrated management system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Quality Management System (ISO 9001)</h4>
                    <p className="text-sm text-slate-600">Design, development, production, and delivery of products and services</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Environmental Management System (ISO 14001)</h4>
                    <p className="text-sm text-slate-600">Environmental aspects of all operations and facilities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-5 w-5 text-slate-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Occupational Health & Safety (ISO 45001)</h4>
                    <p className="text-sm text-slate-600">Health and safety management for all employees and contractors</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scope Boundaries</CardTitle>
              <CardDescription>
                Physical and organizational boundaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Included</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• All manufacturing facilities</li>
                    <li>• Office locations</li>
                    <li>• Warehouse operations</li>
                    <li>• Product design and development</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Excluded</h4>
                  <ul className="space-y-1 text-sm text-slate-600">
                    <li>• Third-party logistics</li>
                    <li>• Outsourced IT services</li>
                    <li>• Financial management</li>
                    <li>• Legal compliance (other than QMS/EMS/OHS)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Management Representative"
            status="Active"
            nextReviewAt={new Date('2025-06-01')}
          />
        </div>
      </div>
    </div>
  )
}
