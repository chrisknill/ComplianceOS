// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Workflow, ArrowRight } from 'lucide-react'

export const isoMeta = { 
  qms: ["4.4"], 
  ems: ["4.4"], 
  ohsms: ["4.4"] 
}

export default function ProcessMapPage() {
  const breadcrumbs = [
    { label: 'Operations', href: '/operations' },
    { label: 'Process Map' }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Process Map" 
        subtitle="Visual representation of organizational processes and their interactions"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Core Business Processes</CardTitle>
              <CardDescription>
                High-level view of key organizational processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Workflow className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Management Processes</h4>
                    <p className="text-sm text-slate-600">Strategic planning, policy development, management review</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-4" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Workflow className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Core Processes</h4>
                    <p className="text-sm text-slate-600">Product development, production, delivery, customer service</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ArrowRight className="h-4 w-4 text-slate-400 ml-4" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Workflow className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Support Processes</h4>
                    <p className="text-sm text-slate-600">HR, IT, finance, procurement, maintenance</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Interactions</CardTitle>
              <CardDescription>
                How processes interact and support each other
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Workflow className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Interactive process map visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Process Owner"
            status="Active"
            nextReviewAt={new Date('2025-06-01')}
          />
        </div>
      </div>
    </div>
  )
}
