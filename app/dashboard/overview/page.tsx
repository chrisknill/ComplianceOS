'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, Users, AlertTriangle, CheckCircle, Target, 
  FileText, Calendar, BarChart3, Shield, Activity, Clock
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { NCIntakeForm } from '@/components/forms/NCIntakeForm'
import { CalendarEventForm } from '@/components/forms/CalendarEventForm'

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [showNCForm, setShowNCForm] = useState(false)
  const [showCalendarForm, setShowCalendarForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading overview...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
            <p className="text-slate-600 mt-1">Comprehensive view of your ISO management system performance</p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarEventForm 
              trigger={
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Review
                </Button>
              }
              defaultTitle="Management Review Meeting"
              defaultDescription="ISO Management Review Meeting"
              defaultAttendees={[
                { email: "christopher.knill@gmail.com", name: "Chris Knill" }
              ]}
              onSuccess={() => {
                console.log('Management review meeting scheduled!')
              }}
            />
            <Button onClick={() => router.push('/audits')}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Objectives</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
                <p className="text-sm text-slate-500 mt-1">+2 from last month</p>
              </div>
              <Target className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Audits</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
                <p className="text-sm text-slate-500 mt-1">3 due this month</p>
              </div>
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Open Actions</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
                <p className="text-sm text-slate-500 mt-1">2 overdue</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-rose-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Compliance Score</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">94%</p>
                <p className="text-sm text-slate-500 mt-1">+3% from last quarter</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700">Quality Management System</span>
                </div>
                <StatusBadge status="green" label="Certified" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700">Environmental Management</span>
                </div>
                <StatusBadge status="green" label="Certified" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-700">Occupational Health & Safety</span>
                </div>
                <StatusBadge status="amber" label="In Progress" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Management Review completed</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New non-conformity reported</p>
                  <p className="text-xs text-slate-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Training session scheduled</p>
                  <p className="text-xs text-slate-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/documentation?openForm=true')}
            >
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm">New Document</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => setShowNCForm(true)}
            >
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span className="text-sm">Report Issue</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/audits?view=matrix')}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="text-sm">Audit Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/reports')}
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </div>

        {/* Forms */}
        <NCIntakeForm
          open={showNCForm}
          onClose={() => setShowNCForm(false)}
          onSave={() => {
            setShowNCForm(false)
            console.log('Non-conformance case created successfully!')
          }}
        />

        <CalendarEventForm
          open={showCalendarForm}
          onClose={() => setShowCalendarForm(false)}
          defaultTitle="Audit Schedule"
          defaultDescription="ISO Audit Scheduling"
          defaultAttendees={[
            { email: "christopher.knill@gmail.com", name: "Chris Knill" }
          ]}
          onSuccess={() => {
            setShowCalendarForm(false)
            console.log('Audit scheduled successfully!')
          }}
        />
      </div>
    </Shell>
  )
}
