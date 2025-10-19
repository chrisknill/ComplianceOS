// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Globe, FileText } from 'lucide-react'

export const isoMeta = { 
  qms: ["4.1"], 
  ems: ["4.1"], 
  ohsms: ["4.1"] 
}

export default function ContextPage() {
  const breadcrumbs = [
    { label: 'Governance', href: '/governance' },
    { label: 'Context' }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Organizational Context" 
        subtitle="Understanding your organization's context and external factors"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Context Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Internal Context</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">• Organizational culture and values</p>
                  <p className="text-sm">• Internal capabilities and resources</p>
                  <p className="text-sm">• Performance and knowledge</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">External Context</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">• Legal and regulatory requirements</p>
                  <p className="text-sm">• Market conditions and competition</p>
                  <p className="text-sm">• Technological developments</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interested Parties */}
          <Card>
            <CardHeader>
              <CardTitle>Interested Parties</CardTitle>
              <CardDescription>
                Key stakeholders and their requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Internal Parties</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Employees</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Board of Directors</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">External Parties</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Customers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Suppliers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">Regulators</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Management Team"
            status="Active"
            nextReviewAt={new Date('2025-06-01')}
          />
        </div>
      </div>
    </div>
  )
}
