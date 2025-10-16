'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import Link from 'next/link'
import { 
  Shield, AlertOctagon, FileWarning, CheckSquare, FileCheck, TrendingUp, 
  Users, Activity, Siren, Clock, AlertTriangle 
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { Badge } from '@/components/ui/badge'

export default function OHSDashboardPage() {
  const [data, setData] = useState<any>({
    hazards: [],
    incidents: [],
    actions: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/ohs/hazards').then(r => r.json()),
      fetch('/api/ohs/incidents').then(r => r.json()),
      fetch('/api/ohs/actions').then(r => r.json()),
    ])
      .then(([hazards, incidents, actions]) => {
        setData({ hazards, incidents, actions })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading OH&S dashboard...</p>
        </div>
      </Shell>
    )
  }

  // Calculate metrics
  const metrics = {
    openIncidents: data.incidents.filter((i: any) => i.status === 'OPEN').length,
    totalIncidents: data.incidents.length,
    criticalHazards: data.hazards.filter((h: any) => (h.likelihood * h.severity) >= 16).length,
    totalHazards: data.hazards.length,
    overdueActions: data.actions.filter((a: any) => {
      if (!a.dueDate || a.status === 'COMPLETED') return false
      return new Date(a.dueDate) < new Date()
    }).length,
    totalActions: data.actions.length,
    closedActions: data.actions.filter((a: any) => a.status === 'COMPLETED').length,
  }

  const recentIncidents = data.incidents
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const criticalHazards = data.hazards
    .filter((h: any) => (h.likelihood * h.severity) >= 11)
    .sort((a: any, b: any) => (b.likelihood * b.severity) - (a.likelihood * a.severity))
    .slice(0, 5)

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">OH&S Dashboard</h1>
          <p className="text-slate-600 mt-1">Occupational Health & Safety Overview (ISO 45001)</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/ohs/hazards">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Hazards</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.totalHazards}</p>
                </div>
                <AlertOctagon className="h-10 w-10 text-amber-500" />
              </div>
              <p className="text-sm text-rose-600 mt-4">{metrics.criticalHazards} critical</p>
            </div>
          </Link>

          <Link href="/ohs/incidents">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Incidents</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.totalIncidents}</p>
                </div>
                <FileWarning className="h-10 w-10 text-rose-500" />
              </div>
              <p className="text-sm text-rose-600 mt-4">{metrics.openIncidents} open</p>
            </div>
          </Link>

          <Link href="/ohs/actions">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Actions (CAPA)</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{metrics.totalActions}</p>
                </div>
                <CheckSquare className="h-10 w-10 text-blue-500" />
              </div>
              <p className="text-sm text-amber-600 mt-4">{metrics.overdueActions} overdue</p>
            </div>
          </Link>

          <Link href="/ohs/kpis">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Closure Rate</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">
                    {metrics.totalActions > 0 ? Math.round((metrics.closedActions / metrics.totalActions) * 100) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 mt-4">Action completion</p>
            </div>
          </Link>
        </div>

        {/* Quick Access Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/ohs/permits">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <FileCheck className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Permits to Work</p>
                  <p className="text-xs text-blue-700">Manage work permits →</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ohs/contractors">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-900">Contractors</p>
                  <p className="text-xs text-purple-700">Contractor management →</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ohs/audits-inspections">
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <CheckSquare className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Audits & Inspections</p>
                  <p className="text-xs text-emerald-700">View schedule →</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ohs/health-surveillance">
            <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-rose-600" />
                <div>
                  <p className="text-sm font-medium text-rose-900">Health Surveillance</p>
                  <p className="text-xs text-rose-700">Health monitoring →</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ohs/emergency">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Siren className="h-6 w-6 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Emergency Prep</p>
                  <p className="text-xs text-amber-700">Emergency planning →</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/ohs/competence">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-indigo-900">OH&S Competence</p>
                  <p className="text-xs text-indigo-700">Training records →</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Incidents */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Recent Incidents</h2>
              <Link href="/ohs/incidents">
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                  View All →
                </Badge>
              </Link>
            </div>
            <div className="p-6">
              {recentIncidents.length > 0 ? (
                <div className="space-y-4">
                  {recentIncidents.map((incident: any) => (
                    <div key={incident.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{incident.ref || `INC-${incident.id.slice(0, 8)}`}</p>
                        <p className="text-sm text-slate-500">
                          {incident.type?.replace('_', ' ')} • {incident.location || 'Unknown'}
                        </p>
                        <p className="text-xs text-slate-400">{new Date(incident.date).toLocaleDateString()}</p>
                      </div>
                      <StatusBadge 
                        status={incident.status === 'CLOSED' ? 'green' : incident.status === 'UNDER_INVESTIGATION' ? 'amber' : 'red'} 
                        label={incident.status?.replace('_', ' ') || 'Open'}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-4">No recent incidents</p>
              )}
            </div>
          </div>

          {/* Critical Hazards */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Critical Hazards</h2>
              <Link href="/ohs/hazards">
                <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
                  View All →
                </Badge>
              </Link>
            </div>
            <div className="p-6">
              {criticalHazards.length > 0 ? (
                <div className="space-y-4">
                  {criticalHazards.map((hazard: any) => {
                    const riskScore = hazard.likelihood * hazard.severity
                    return (
                      <div key={hazard.id} className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">{hazard.title}</p>
                          <p className="text-sm text-slate-500">{hazard.area || 'Unknown area'} • Score: {riskScore}</p>
                        </div>
                        <StatusBadge 
                          status={riskScore >= 16 ? 'red' : riskScore >= 11 ? 'amber' : 'green'} 
                          label={hazard.status}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-4">No critical hazards</p>
              )}
            </div>
          </div>
        </div>

        {/* ISO 45001 Compliance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">ISO 45001:2018 Compliance Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {metrics.totalHazards > 0 
                  ? Math.round((data.hazards.filter((h: any) => h.status === 'TREATED').length / metrics.totalHazards) * 100) 
                  : 0}%
              </div>
              <div className="text-xs text-slate-600 mt-1">Hazards Controlled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.totalIncidents > 0
                  ? Math.round(((metrics.totalIncidents - metrics.openIncidents) / metrics.totalIncidents) * 100)
                  : 100}%
              </div>
              <div className="text-xs text-slate-600 mt-1">Incidents Closed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.totalActions > 0
                  ? Math.round((metrics.closedActions / metrics.totalActions) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-slate-600 mt-1">Actions Closed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {metrics.overdueActions}
              </div>
              <div className="text-xs text-slate-600 mt-1">Overdue Actions</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}
