// CREATED: 2025-01-18 by Cursor – non-destructive scaffold
'use client'

import { PageHeader } from '@/components/PageHeader'
import { ActionsPanel } from '@/components/ActionsPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Palette, Upload, Save } from 'lucide-react'

export default function BrandingPage() {
  const breadcrumbs = [
    { label: 'Admin', href: '/admin' },
    { label: 'Branding' }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Branding & Customization" 
        subtitle="Customize the appearance and branding of your system"
        breadcrumbs={breadcrumbs}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Brand Settings</span>
              </CardTitle>
              <CardDescription>
                Configure your organization&apos;s branding elements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Company Logo</label>
                  <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600">Upload company logo</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Color Scheme</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded"></div>
                      <span className="text-sm">Primary Color</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-slate-600 rounded"></div>
                      <span className="text-sm">Secondary Color</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>
                Configure system-wide preferences and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-slate-600">Enable dark theme</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-slate-600">Send email alerts</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ActionsPanel 
            owner="Brand Manager"
            status="Active"
            nextReviewAt={new Date('2025-06-01')}
          />
        </div>
      </div>
    </div>
  )
}
