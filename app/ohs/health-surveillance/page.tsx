'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { 
  Activity, Plus, Download, Search, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, AlertCircle, Clock
} from 'lucide-react'
import { HealthSurveillanceForm } from '@/components/forms/HealthSurveillanceForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

interface HealthSurveillance {
  id: string
  userId: string
  exposureType: string
  exposureLevel: string | null
  monitoringFreq: string | null
  lastTest: Date | null
  nextTest: Date | null
  results: string | null
  restrictions: string | null
  status: string
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function HealthSurveillancePage() {
  const [surveillances, setSurveillances] = useState<HealthSurveillance[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingSurveillance, setEditingSurveillance] = useState<HealthSurveillance | undefined>()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [exposureFilter, setExposureFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('userId')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadSurveillances = () => {
    setLoading(true)
    fetch('/api/ohs/health-surveillance')
      .then((res) => res.json())
      .then((data) => {
        setSurveillances(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setSurveillances([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadSurveillances()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedSurveillances = surveillances
    .filter(s => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return s.userId.toLowerCase().includes(search) || s.exposureType.toLowerCase().includes(search)
      }
      return true
    })
    .filter(s => statusFilter === 'ALL' || s.status === statusFilter)
    .filter(s => exposureFilter === 'ALL' || s.exposureType === exposureFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'userId':
          aVal = a.userId.toLowerCase()
          bVal = b.userId.toLowerCase()
          break
        case 'exposureType':
          aVal = a.exposureType
          bVal = b.exposureType
          break
        case 'nextTest':
          aVal = a.nextTest ? new Date(a.nextTest).getTime() : 0
          bVal = b.nextTest ? new Date(b.nextTest).getTime() : 0
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = a.userId.toLowerCase()
          bVal = b.userId.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedSurveillances

  const stats = {
    total: surveillances.length,
    compliant: surveillances.filter(s => s.status === 'COMPLIANT').length,
    dueSoon: surveillances.filter(s => s.status === 'DUE_SOON').length,
    overdue: surveillances.filter(s => s.status === 'OVERDUE').length,
    actionRequired: surveillances.filter(s => s.status === 'ACTION_REQUIRED').length,
  }

  const getSurveillanceRAG = (surveillance: HealthSurveillance): 'green' | 'amber' | 'red' => {
    if (surveillance.status === 'OVERDUE' || surveillance.status === 'ACTION_REQUIRED') return 'red'
    if (surveillance.status === 'DUE_SOON') return 'amber'
    return 'green'
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(s => ({
      'Worker ID': s.userId,
      'Exposure Type': s.exposureType.replace('_', ' '),
      'Exposure Level': s.exposureLevel || '-',
      'Monitoring Frequency': s.monitoringFreq || '-',
      'Last Test': s.lastTest ? formatDate(s.lastTest) : '-',
      'Next Test': s.nextTest ? formatDate(s.nextTest) : '-',
      'Status': s.status,
    })))
    downloadFile(csv, `health-surveillance-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Worker ID', 'Exposure Type', 'Last Test', 'Next Test', 'Status']
    const rows = filteredData.map(s => [
      s.userId,
      s.exposureType.replace('_', ' '),
      s.lastTest ? formatDate(s.lastTest) : '-',
      s.nextTest ? formatDate(s.nextTest) : '-',
      s.status,
    ])
    
    exportTableToPDF('Health Surveillance', headers, rows, `health-surveillance-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading health surveillance...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Health Surveillance</h1>
            <p className="text-slate-600 mt-1">Occupational health monitoring and exposure tracking</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'dashboard' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Grid
              </button>
            </div>
            {viewMode !== 'dashboard' && (
              <>
                <Button variant="outline" onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button onClick={() => { setEditingSurveillance(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Surveillance
            </Button>
          </div>
        </div>

        {viewMode === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Workers</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Activity className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Compliant</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.compliant}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {stats.total > 0 ? Math.round((stats.compliant / stats.total) * 100) : 0}% of workforce
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Due Soon</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.dueSoon}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Next 30 days</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Overdue</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.overdue}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Require immediate action</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Surveillance Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">Compliant</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.compliant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">Due Soon</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.dueSoon}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-slate-700">Overdue</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.overdue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-rose-700 rounded-full"></div>
                    <span className="text-slate-700">Action Required</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{stats.actionRequired}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by worker ID or exposure..."
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
                      <SelectItem value="COMPLIANT">Compliant</SelectItem>
                      <SelectItem value="DUE_SOON">Due Soon</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                      <SelectItem value="ACTION_REQUIRED">Action Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={exposureFilter} onValueChange={setExposureFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Exposures" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Exposures</SelectItem>
                      <SelectItem value="NOISE">Noise</SelectItem>
                      <SelectItem value="DUST">Dust</SelectItem>
                      <SelectItem value="FUMES">Fumes</SelectItem>
                      <SelectItem value="VIBRATION">Vibration</SelectItem>
                      <SelectItem value="CHEMICAL">Chemical</SelectItem>
                      <SelectItem value="BIOLOGICAL">Biological</SelectItem>
                      <SelectItem value="ERGONOMIC">Ergonomic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {(searchTerm || statusFilter !== 'ALL' || exposureFilter !== 'ALL') && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('ALL')
                        setExposureFilter('ALL')
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-3">
                Showing {filteredData.length} of {surveillances.length} records
              </p>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('userId')}
                    >
                      <div className="flex items-center gap-2">
                        Worker ID
                        <SortIcon field="userId" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('exposureType')}
                    >
                      <div className="flex items-center gap-2">
                        Exposure Type
                        <SortIcon field="exposureType" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      Exposure Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      Monitoring Freq
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                      Last Test
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('nextTest')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Next Test
                        <SortIcon field="nextTest" />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Status
                        <SortIcon field="status" />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredData.map((surveillance) => {
                    const rag = getSurveillanceRAG(surveillance)
                    return (
                      <tr 
                        key={surveillance.id} 
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => { setEditingSurveillance(surveillance); setShowForm(true); }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Activity className="h-5 w-5 text-slate-400" />
                            <span className="font-medium text-slate-900">{surveillance.userId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">{surveillance.exposureType.replace('_', ' ')}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{surveillance.exposureLevel || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{surveillance.monitoringFreq || '-'}</td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {surveillance.lastTest ? formatDate(surveillance.lastTest) : '-'}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-slate-600">
                          {surveillance.nextTest ? formatDate(surveillance.nextTest) : '-'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <StatusBadge status={rag} label={surveillance.status.replace('_', ' ')} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((surveillance) => {
              const rag = getSurveillanceRAG(surveillance)
              return (
                <div
                  key={surveillance.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingSurveillance(surveillance); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Activity className={`h-8 w-8 ${
                      rag === 'green' ? 'text-emerald-500' :
                      rag === 'amber' ? 'text-amber-500' : 'text-rose-500'
                    }`} />
                    <StatusBadge status={rag} label={surveillance.status.replace('_', ' ')} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{surveillance.userId}</h3>
                  <Badge variant="outline" className="mb-3">{surveillance.exposureType.replace('_', ' ')}</Badge>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Exposure Level:</span> {surveillance.exposureLevel || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Monitoring:</span> {surveillance.monitoringFreq || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Last Test:</span> {surveillance.lastTest ? formatDate(surveillance.lastTest) : 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Next Test:</span> {surveillance.nextTest ? formatDate(surveillance.nextTest) : 'N/A'}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {filteredData.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No surveillance records found</p>
          </div>
        )}

        <HealthSurveillanceForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingSurveillance(undefined); }}
          surveillance={editingSurveillance}
          onSave={loadSurveillances}
        />
      </div>
    </Shell>
  )
}
