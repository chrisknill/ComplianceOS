'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { AlertOctagon, Plus, Download, Search, Filter, CheckCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { HazardForm } from '@/components/forms/HazardForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportHazardsToPDF } from '@/lib/pdf'

interface Hazard {
  id: string
  title: string
  area: string | null
  description: string | null
  likelihood: number
  severity: number
  residualL: number | null
  residualS: number | null
  controls: string
  owner: string | null
  reviewDate: string | null
  status: string
}

type ViewMode = 'dashboard' | 'list' | 'grid' | 'board'

export default function OHSHazardsPage() {
  const [hazards, setHazards] = useState<Hazard[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHazard, setEditingHazard] = useState<Hazard | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const loadHazards = () => {
    setLoading(true)
    fetch('/api/ohs/hazards')
      .then((res) => res.json())
      .then((data) => {
        setHazards(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setHazards([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadHazards()
  }, [])

  // Filter hazards
  const filteredHazards = hazards
    .filter(h => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return h.title.toLowerCase().includes(search) || (h.area?.toLowerCase() || '').includes(search)
      }
      return true
    })
    .filter(h => statusFilter === 'ALL' || h.status === statusFilter)

  // Calculate statistics
  const stats = {
    total: hazards.length,
    open: hazards.filter(h => h.status === 'OPEN').length,
    treated: hazards.filter(h => h.status === 'TREATED').length,
    closed: hazards.filter(h => h.status === 'CLOSED').length,
    highRisk: hazards.filter(h => (h.likelihood * h.severity) >= 15).length,
    mediumRisk: hazards.filter(h => {
      const score = h.likelihood * h.severity
      return score >= 8 && score < 15
    }).length,
    lowRisk: hazards.filter(h => (h.likelihood * h.severity) < 8).length,
    reviewDue: hazards.filter(h => {
      if (!h.reviewDate) return false
      const review = new Date(h.reviewDate)
      const now = new Date()
      const diff = review.getTime() - now.getTime()
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
    }).length,
  }

  const getScoreColor = (score: number): string => {
    if (score >= 15) return 'bg-rose-100 text-rose-700 border-rose-300' // High risk
    if (score >= 8) return 'bg-amber-100 text-amber-700 border-amber-300' // Medium risk
    return 'bg-emerald-100 text-emerald-700 border-emerald-300' // Low risk
  }

  const getScoreRAG = (score: number): 'green' | 'amber' | 'red' => {
    if (score >= 15) return 'red'
    if (score >= 8) return 'amber'
    return 'green'
  }

  const handleExport = () => {
    const csv = convertToCSV(filteredHazards.map(h => ({
      Title: h.title,
      Area: h.area || '-',
      'Pre-Control (LxS)': `${h.likelihood}x${h.severity}`,
      'Pre-Score': h.likelihood * h.severity,
      'Residual (LxS)': h.residualL && h.residualS ? `${h.residualL}x${h.residualS}` : '-',
      'Residual Score': h.residualL && h.residualS ? h.residualL * h.residualS : '-',
      Owner: h.owner || '-',
      Status: h.status,
    })))
    downloadFile(csv, `hazards-register-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading hazards...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Hazard & Risk Register</h1>
            <p className="text-slate-600 mt-1">OH&S hazards with pre/post-control risk levels</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'dashboard'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'board'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Board
              </button>
            </div>
            {viewMode !== 'dashboard' && viewMode !== 'board' && (
              <>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={() => exportHazardsToPDF(filteredHazards)}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button onClick={() => { setEditingHazard(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Hazard
            </Button>
          </div>
        </div>

        {/* Dashboard View */}
        {viewMode === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Hazards</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <AlertOctagon className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">High Risk</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.highRisk}</p>
                  </div>
                  <AlertOctagon className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Score ≥ 15</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Medium Risk</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.mediumRisk}</p>
                  </div>
                  <AlertOctagon className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Score 8-14</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Low Risk</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.lowRisk}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Score &lt; 8</p>
              </div>
            </div>

            {/* Risk Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Hazard Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Open</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.open}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.open / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">Treated</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.treated}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.treated / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Closed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.closed}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Level Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">High Risk (15-25)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.highRisk}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">Medium Risk (8-14)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.mediumRisk}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Low Risk (1-7)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.lowRisk}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats.highRisk > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertOctagon className="h-6 w-6 text-rose-600" />
                    <h3 className="text-lg font-semibold text-rose-900">High Risk Hazards</h3>
                  </div>
                  <p className="text-3xl font-bold text-rose-600 mb-2">{stats.highRisk}</p>
                  <p className="text-sm text-rose-700 mb-4">Require immediate attention and control</p>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('OPEN')
                      setViewMode('list')
                    }}
                  >
                    Review High Risk →
                  </Button>
                </div>
              )}

              {stats.reviewDue > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-900">Review Due Soon</h3>
                  </div>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{stats.reviewDue}</p>
                  <p className="text-sm text-amber-700 mb-4">Hazards requiring review in 30 days</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-amber-600 text-amber-700 hover:bg-amber-100"
                    onClick={() => setViewMode('list')}
                  >
                    Schedule Reviews →
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filters (List/Grid View Only) */}
        {viewMode !== 'dashboard' && (
          <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="TREATED">Treated</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {(searchTerm || statusFilter !== 'ALL') && (
                <>
                  {searchTerm && (
                    <Badge variant="secondary" className="gap-1">
                      Search: &quot;{searchTerm}&quot;
                      <button onClick={() => setSearchTerm('')} className="ml-1">×</button>
                    </Badge>
                  )}
                  {statusFilter !== 'ALL' && (
                    <Badge variant="secondary" className="gap-1">
                      {statusFilter}
                      <button onClick={() => setStatusFilter('ALL')} className="ml-1">×</button>
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Showing {filteredHazards.length} of {hazards.length} hazards
          </p>
          </div>
        )}

        {viewMode === 'list' ? (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Area</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Pre (L×S)</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Residual (L×S)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Owner</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredHazards.map((h) => {
                const preScore = h.likelihood * h.severity
                const resScore = (h.residualL ?? 0) * (h.residualS ?? 0)
                const rag = (score: number) => (score >= 16 ? 'red' : score >= 11 ? 'amber' : score >= 6 ? 'amber' : 'green')
                return (
                  <tr 
                    key={h.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => { setEditingHazard(h); setShowForm(true); }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AlertOctagon className="h-5 w-5 text-slate-400" />
                        <span className="font-medium text-slate-900">{h.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{h.area || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1.5 rounded-md font-semibold border ${getScoreColor(preScore)}`}>
                        {h.likelihood}×{h.severity} = {preScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {h.residualL && h.residualS ? (
                        <span className={`px-3 py-1.5 rounded-md font-semibold border ${getScoreColor(resScore)}`}>
                          {h.residualL}×{h.residualS} = {resScore}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{h.owner || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={rag(h.residualL && h.residualS ? resScore : preScore) as any} label={h.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHazards.map((h) => {
              const preScore = h.likelihood * h.severity
              const resScore = (h.residualL ?? 0) * (h.residualS ?? 0)
              const rag = (score: number) => (score >= 16 ? 'red' : score >= 11 ? 'amber' : score >= 6 ? 'amber' : 'green')
              const currentScore = h.residualL && h.residualS ? resScore : preScore
              
              return (
                <div
                  key={h.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingHazard(h); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <AlertOctagon className={`h-8 w-8 ${
                      currentScore >= 16 ? 'text-rose-500' :
                      currentScore >= 11 ? 'text-orange-500' :
                      currentScore >= 6 ? 'text-amber-500' : 'text-emerald-500'
                    }`} />
                    <StatusBadge status={rag(currentScore) as any} label={h.status} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{h.title}</h3>

                  <div className="space-y-3 mb-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Area:</span> {h.area || 'N/A'}
                    </p>
                    
                    <div>
                      <p className="text-xs font-medium text-slate-500 mb-1">Pre-Control Risk:</p>
                      <div className={`inline-block px-3 py-1.5 rounded-md font-semibold text-sm border ${getScoreColor(preScore)}`}>
                        {h.likelihood}×{h.severity} = {preScore}
                      </div>
                    </div>

                    {h.residualL && h.residualS && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Residual Risk:</p>
                        <div className={`inline-block px-3 py-1.5 rounded-md font-semibold text-sm border ${getScoreColor(resScore)}`}>
                          {h.residualL}×{h.residualS} = {resScore}
                        </div>
                        <p className="text-xs text-emerald-600 mt-1">
                          ↓ {Math.round((1 - resScore/preScore) * 100)}% reduction
                        </p>
                      </div>
                    )}

                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Owner:</span> {h.owner || 'Unassigned'}
                    </p>
                  </div>

                  {h.residualL && h.residualS && (
                    <div className="text-xs text-emerald-600 bg-emerald-50 rounded px-2 py-1">
                      {Math.round((1 - resScore/preScore) * 100)}% risk reduction
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Board View (Kanban) */}
        {viewMode === 'board' && (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {/* OPEN Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Open</h3>
                    <Badge variant="secondary">
                      {filteredHazards.filter(h => h.status === 'OPEN').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredHazards
                      .filter(h => h.status === 'OPEN')
                      .map(hazard => {
                        const preScore = hazard.likelihood * hazard.severity
                        const resScore = (hazard.residualL ?? 0) * (hazard.residualS ?? 0)
                        const currentScore = hazard.residualL && hazard.residualS ? resScore : preScore
                        const rag = getScoreRAG(currentScore)
                        
                        return (
                          <div
                            key={hazard.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-rose-500"
                            onClick={() => { setEditingHazard(hazard); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <StatusBadge status={rag} label="" />
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(preScore)}`}>
                                {preScore}
                              </span>
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{hazard.title}</h4>
                            <div className="text-xs text-slate-600 space-y-1">
                              <p><span className="font-medium">Area:</span> {hazard.area || 'N/A'}</p>
                              <p><span className="font-medium">Owner:</span> {hazard.owner || 'Unassigned'}</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* TREATED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Treated</h3>
                    <Badge variant="secondary">
                      {filteredHazards.filter(h => h.status === 'TREATED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredHazards
                      .filter(h => h.status === 'TREATED')
                      .map(hazard => {
                        const preScore = hazard.likelihood * hazard.severity
                        const resScore = (hazard.residualL ?? 0) * (hazard.residualS ?? 0)
                        const currentScore = hazard.residualL && hazard.residualS ? resScore : preScore
                        const rag = getScoreRAG(currentScore)
                        
                        return (
                          <div
                            key={hazard.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-amber-500"
                            onClick={() => { setEditingHazard(hazard); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <StatusBadge status={rag} label="" />
                              <div className="flex gap-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(preScore)}`}>
                                  {preScore}
                                </span>
                                {hazard.residualL && hazard.residualS && (
                                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(resScore)}`}>
                                    →{resScore}
                                  </span>
                                )}
                              </div>
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{hazard.title}</h4>
                            <div className="text-xs text-slate-600 space-y-1">
                              <p><span className="font-medium">Area:</span> {hazard.area || 'N/A'}</p>
                              <p><span className="font-medium">Owner:</span> {hazard.owner || 'Unassigned'}</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* CLOSED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Closed</h3>
                    <Badge variant="secondary">
                      {filteredHazards.filter(h => h.status === 'CLOSED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredHazards
                      .filter(h => h.status === 'CLOSED')
                      .map(hazard => {
                        const preScore = hazard.likelihood * hazard.severity
                        const resScore = (hazard.residualL ?? 0) * (hazard.residualS ?? 0)
                        const currentScore = hazard.residualL && hazard.residualS ? resScore : preScore
                        const rag = getScoreRAG(currentScore)
                        
                        return (
                          <div
                            key={hazard.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-emerald-500 opacity-75"
                            onClick={() => { setEditingHazard(hazard); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <StatusBadge status={rag} label="" />
                              <span className={`px-2 py-1 rounded text-xs font-medium border ${getScoreColor(resScore || preScore)}`}>
                                {resScore || preScore}
                              </span>
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{hazard.title}</h4>
                            <div className="text-xs text-slate-600 space-y-1">
                              <p><span className="font-medium">Area:</span> {hazard.area || 'N/A'}</p>
                              <p><span className="font-medium">Owner:</span> {hazard.owner || 'Unassigned'}</p>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <HazardForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingHazard(undefined); }}
          hazard={editingHazard}
          onSave={loadHazards}
        />
      </div>
    </Shell>
  )
}


