'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { 
  FileWarning, Plus, Download, Search, Filter, AlertTriangle, CheckCircle, 
  Clock, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown, Users, Activity
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { IncidentForm } from '@/components/forms/IncidentForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportIncidentsToPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

interface Incident {
  id: string
  ref: string | null
  type: string
  date: string
  location: string | null
  description: string | null
  severityType: string
  status: string
  people: string
  lostTimeDays: number | null
}

type ViewMode = 'dashboard' | 'list' | 'grid' | 'board'

export default function OHSIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | undefined>()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadIncidents = () => {
    setLoading(true)
    fetch('/api/ohs/incidents')
      .then((res) => res.json())
      .then((data) => {
        setIncidents(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setIncidents([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort incidents
  const filteredAndSortedIncidents = incidents
    .filter(i => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          (i.ref?.toLowerCase() || '').includes(search) || 
          (i.location?.toLowerCase() || '').includes(search) ||
          (i.description?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(i => statusFilter === 'ALL' || i.status === statusFilter)
    .filter(i => typeFilter === 'ALL' || i.type === typeFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'ref':
          aVal = (a.ref || '').toLowerCase()
          bVal = (b.ref || '').toLowerCase()
          break
        case 'type':
          aVal = a.type
          bVal = b.type
          break
        case 'date':
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
          break
        case 'severity':
          aVal = a.severityType
          bVal = b.severityType
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredIncidents = filteredAndSortedIncidents

  // Calculate statistics
  const stats = {
    total: incidents.length,
    nearMiss: incidents.filter(i => i.type === 'NEAR_MISS').length,
    injuries: incidents.filter(i => 
      i.type === 'INJURY' || i.severityType === 'FIRST_AID' || 
      i.severityType === 'MEDICAL_TREATMENT' || i.severityType === 'LOST_TIME'
    ).length,
    lostTime: incidents.filter(i => i.severityType === 'LOST_TIME').length,
    open: incidents.filter(i => i.status === 'OPEN').length,
    underInvestigation: incidents.filter(i => i.status === 'UNDER_INVESTIGATION').length,
    closed: incidents.filter(i => i.status === 'CLOSED').length,
    thisMonth: incidents.filter(i => {
      const incidentDate = new Date(i.date)
      const now = new Date()
      return incidentDate.getMonth() === now.getMonth() && incidentDate.getFullYear() === now.getFullYear()
    }).length,
    totalLostDays: incidents.reduce((sum, i) => sum + (i.lostTimeDays || 0), 0),
  }

  const statusToRag = (s: string): 'green' | 'amber' | 'red' => {
    if (s === 'CLOSED') return 'green'
    if (s === 'UNDER_INVESTIGATION') return 'amber'
    return 'red'
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'FATALITY':
        return 'bg-rose-600 text-white'
      case 'LOST_TIME':
        return 'bg-rose-500 text-white'
      case 'RESTRICTED_WORK':
        return 'bg-orange-500 text-white'
      case 'MEDICAL_TREATMENT':
        return 'bg-amber-500 text-white'
      case 'FIRST_AID':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-slate-500 text-white'
    }
  }

  const handleExport = () => {
    const csv = convertToCSV(filteredIncidents.map(i => ({
      Ref: i.ref || '-',
      Type: i.type.replace('_', ' '),
      Date: formatDate(i.date),
      Location: i.location || '-',
      Severity: i.severityType.replace('_', ' '),
      Status: i.status.replace('_', ' '),
    })))
    downloadFile(csv, `incidents-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading incidents...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Incidents & Near-Misses</h1>
            <p className="text-slate-600 mt-1">Report, investigate, and track OH&S incidents</p>
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
                <Button variant="outline" onClick={() => exportIncidentsToPDF(filteredIncidents)}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button onClick={() => { setEditingIncident(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Report Incident
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
                    <p className="text-sm font-medium text-slate-600">Total Incidents</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <FileWarning className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">{stats.thisMonth} this month</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Near Misses</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.nearMiss}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Preventive opportunities</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Injuries</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.injuries}</p>
                  </div>
                  <Activity className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Including {stats.lostTime} lost time</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Lost Time Days</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.totalLostDays}</p>
                  </div>
                  <Clock className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Total days lost</p>
              </div>
            </div>

            {/* Incident Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Incident Status</h3>
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
                      <span className="text-slate-700">Under Investigation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.underInvestigation}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.underInvestigation / stats.total) * 100) : 0}%)
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
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Incident Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">Near Miss</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.nearMiss}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Injuries</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.injuries}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                      <span className="text-slate-700">Other</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">
                      {incidents.filter(i => 
                        i.type !== 'NEAR_MISS' && i.type !== 'INJURY'
                      ).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats.open > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-rose-600" />
                    <h3 className="text-lg font-semibold text-rose-900">Open Incidents</h3>
                  </div>
                  <p className="text-3xl font-bold text-rose-600 mb-2">{stats.open}</p>
                  <p className="text-sm text-rose-700 mb-4">Require immediate attention</p>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('OPEN')
                      setViewMode('list')
                    }}
                  >
                    Review Open →
                  </Button>
                </div>
              )}

              {stats.underInvestigation > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-900">Under Investigation</h3>
                  </div>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{stats.underInvestigation}</p>
                  <p className="text-sm text-amber-700 mb-4">Investigations in progress</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-amber-600 text-amber-700 hover:bg-amber-100"
                    onClick={() => {
                      setStatusFilter('UNDER_INVESTIGATION')
                      setViewMode('list')
                    }}
                  >
                    View Investigations →
                  </Button>
                </div>
              )}
            </div>

            {/* Near Miss Ratio */}
            {stats.total > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Near-Miss to Incident Ratio</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-blue-700 mb-1">Near Misses</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.nearMiss}</p>
                  </div>
                  <div className="text-4xl text-blue-400">:</div>
                  <div>
                    <p className="text-sm text-blue-700 mb-1">Incidents</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.total - stats.nearMiss}</p>
                  </div>
                  <div className="ml-auto">
                    <p className="text-sm text-blue-700 mb-1">Ratio</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.total - stats.nearMiss > 0 
                        ? (stats.nearMiss / (stats.total - stats.nearMiss)).toFixed(1)
                        : '-'
                      }:1
                    </p>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-4">
                  ISO 45001:10.2 - Higher near-miss reporting indicates strong safety culture
                </p>
              </div>
            )}
          </div>
        )}

        {/* Filters (List/Grid View Only) */}
        {(viewMode === 'list' || viewMode === 'grid') && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by ref, location, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="UNDER_INVESTIGATION">Under Investigation</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="NEAR_MISS">Near Miss</SelectItem>
                    <SelectItem value="UNSAFE_ACT">Unsafe Act</SelectItem>
                    <SelectItem value="UNSAFE_CONDITION">Unsafe Condition</SelectItem>
                    <SelectItem value="INJURY">Injury</SelectItem>
                    <SelectItem value="ILL_HEALTH">Ill Health</SelectItem>
                    <SelectItem value="PROPERTY_DAMAGE">Property Damage</SelectItem>
                    <SelectItem value="ENVIRONMENTAL">Environmental</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL') && (
                  <button 
                    onClick={() => { 
                      setSearchTerm('')
                      setStatusFilter('ALL')
                      setTypeFilter('ALL')
                    }} 
                    className="text-xs text-slate-600 hover:text-slate-900 underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </p>
          </div>
        )}

        {/* List View (Table) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('ref')}
                  >
                    <div className="flex items-center gap-2">
                      Ref
                      <SortIcon field="ref" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      <SortIcon field="type" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Location
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('severity')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Severity
                      <SortIcon field="severity" />
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
                {filteredIncidents.map((i) => {
                  const rag = statusToRag(i.status)
                  return (
                    <tr 
                      key={i.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingIncident(i); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileWarning className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{i.ref || i.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={i.type === 'NEAR_MISS' ? 'secondary' : 'destructive'}>
                          {i.type.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">{formatDate(i.date)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{i.location || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(i.severityType)}`}>
                          {i.severityType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={rag} label={i.status.replace('_', ' ')} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View (Cards) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIncidents.map((i) => {
              const rag = statusToRag(i.status)
              return (
                <div
                  key={i.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingIncident(i); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileWarning className={`h-8 w-8 ${
                      rag === 'green' ? 'text-emerald-500' :
                      rag === 'amber' ? 'text-amber-500' : 'text-rose-500'
                    }`} />
                    <StatusBadge status={rag} label={i.status.replace('_', ' ')} />
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-slate-500 mb-1">Ref: {i.ref || i.id.slice(0, 8).toUpperCase()}</p>
                    <Badge variant={i.type === 'NEAR_MISS' ? 'secondary' : 'destructive'} className="mb-2">
                      {i.type.replace('_', ' ')}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{i.description || 'No description'}</p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Date:</span> {formatDate(i.date)}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {i.location || 'N/A'}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Severity:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(i.severityType)}`}>
                        {i.severityType.replace('_', ' ')}
                      </span>
                    </p>
                    {i.lostTimeDays && i.lostTimeDays > 0 && (
                      <p className="text-rose-600 font-semibold">
                        {i.lostTimeDays} days lost
                      </p>
                    )}
                  </div>
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
                      {filteredIncidents.filter(i => i.status === 'OPEN').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredIncidents
                      .filter(i => i.status === 'OPEN')
                      .map(incident => {
                        const rag = statusToRag(incident.status)
                        return (
                          <div
                            key={incident.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-rose-500"
                            onClick={() => { setEditingIncident(incident); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={incident.type === 'NEAR_MISS' ? 'secondary' : 'destructive'} className="text-xs">
                                {incident.type.replace('_', ' ')}
                              </Badge>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(incident.severityType)}`}>
                                {incident.severityType.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{incident.ref || incident.id.slice(0, 8)}</p>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">
                              {incident.description || 'No description'}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{incident.location || 'N/A'}</span>
                              <span>{formatDate(incident.date)}</span>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* UNDER INVESTIGATION Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Under Investigation</h3>
                    <Badge variant="secondary">
                      {filteredIncidents.filter(i => i.status === 'UNDER_INVESTIGATION').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredIncidents
                      .filter(i => i.status === 'UNDER_INVESTIGATION')
                      .map(incident => {
                        const rag = statusToRag(incident.status)
                        return (
                          <div
                            key={incident.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-amber-500"
                            onClick={() => { setEditingIncident(incident); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={incident.type === 'NEAR_MISS' ? 'secondary' : 'destructive'} className="text-xs">
                                {incident.type.replace('_', ' ')}
                              </Badge>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(incident.severityType)}`}>
                                {incident.severityType.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{incident.ref || incident.id.slice(0, 8)}</p>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">
                              {incident.description || 'No description'}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{incident.location || 'N/A'}</span>
                              <span>{formatDate(incident.date)}</span>
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
                      {filteredIncidents.filter(i => i.status === 'CLOSED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredIncidents
                      .filter(i => i.status === 'CLOSED')
                      .map(incident => {
                        const rag = statusToRag(incident.status)
                        return (
                          <div
                            key={incident.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-emerald-500 opacity-75"
                            onClick={() => { setEditingIncident(incident); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={incident.type === 'NEAR_MISS' ? 'secondary' : 'destructive'} className="text-xs">
                                {incident.type.replace('_', ' ')}
                              </Badge>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(incident.severityType)}`}>
                                {incident.severityType.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1">{incident.ref || incident.id.slice(0, 8)}</p>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">
                              {incident.description || 'No description'}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{incident.location || 'N/A'}</span>
                              <span>{formatDate(incident.date)}</span>
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

        {filteredIncidents.length === 0 && viewMode !== 'dashboard' && viewMode !== 'board' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileWarning className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No incidents found</p>
          </div>
        )}

        <IncidentForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingIncident(undefined); }}
          incident={editingIncident}
          onSave={loadIncidents}
        />
      </div>
    </Shell>
  )
}
