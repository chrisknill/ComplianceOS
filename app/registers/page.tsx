'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'
import { 
  ClipboardList, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, AlertTriangle, FileWarning, CheckSquare, Scale, Leaf, Shield, Clock
} from 'lucide-react'
import { RegisterForm } from '@/components/forms/RegisterForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'

interface RegisterEntry {
  id: string
  type: string
  title: string
  details: string | null
  owner: string | null
  status: string | null
  date: Date
  createdAt: Date
  updatedAt: Date
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function RegistersPage() {
  const [entries, setEntries] = useState<RegisterEntry[]>([])
  const [filter, setFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<RegisterEntry | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadEntries = () => {
    setLoading(true)
    fetch('/api/registers')
      .then((res) => res.json())
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load registers:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const tabs = [
    { key: 'ALL', label: 'All Registers', icon: ClipboardList },
    { key: 'RISK', label: 'Risks', icon: AlertTriangle },
    { key: 'INCIDENT', label: 'Incidents', icon: FileWarning },
    { key: 'NONCONFORMITY', label: 'Nonconformities', icon: CheckSquare },
    { key: 'COMPLIANCE_OBLIGATION', label: 'Compliance Obligations', icon: Scale },
    { key: 'LEGAL', label: 'Legal Register', icon: Scale },
    { key: 'ASPECT_IMPACT', label: 'Aspects & Impacts', icon: Leaf },
  ]

  // Filter and sort
  const filteredEntries = entries
    .filter(e => filter === 'ALL' || e.type === filter)
    .filter(e => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          e.title.toLowerCase().includes(search) ||
          (e.details?.toLowerCase() || '').includes(search) ||
          (e.owner?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(e => statusFilter === 'ALL' || e.status === statusFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'type':
          aVal = a.type
          bVal = b.type
          break
        case 'status':
          aVal = a.status || ''
          bVal = b.status || ''
          break
        case 'date':
          aVal = new Date(a.date).getTime()
          bVal = new Date(b.date).getTime()
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

  // Calculate statistics
  const stats = {
    total: entries.length,
    open: entries.filter(e => e.status === 'OPEN').length,
    inProgress: entries.filter(e => e.status === 'IN_PROGRESS').length,
    closed: entries.filter(e => e.status === 'CLOSED').length,
    risks: entries.filter(e => e.type === 'RISK').length,
    incidents: entries.filter(e => e.type === 'INCIDENT').length,
    nonconformities: entries.filter(e => e.type === 'NONCONFORMITY').length,
    compliance: entries.filter(e => e.type === 'COMPLIANCE_OBLIGATION').length,
    legal: entries.filter(e => e.type === 'LEGAL').length,
    aspects: entries.filter(e => e.type === 'ASPECT_IMPACT').length,
  }

  const getStatusRAG = (status: string | null): 'green' | 'amber' | 'red' => {
    if (!status) return 'amber'
    if (status === 'CLOSED') return 'green'
    if (status === 'OPEN') return 'red'
    return 'amber' // IN_PROGRESS
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredEntries.map(e => ({
      'Type': e.type.replace('_', ' '),
      'Title': e.title,
      'Details': e.details || '-',
      'Owner': e.owner || '-',
      'Status': e.status || '-',
      'Date': formatDate(e.date),
    })))
    downloadFile(csv, `registers-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Type', 'Title', 'Owner', 'Status', 'Date']
    const rows = filteredEntries.map(e => [
      e.type.replace('_', ' '),
      e.title,
      e.owner || '-',
      e.status || '-',
      formatDate(e.date),
    ])
    
    exportTableToPDF('Compliance Registers', headers, rows, `registers-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading registers...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Registers</h1>
            <p className="text-slate-600 mt-1">Compliance registers and tracking</p>
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
            <Button onClick={() => { setEditingEntry(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
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
                    <p className="text-sm font-medium text-slate-600">Total Entries</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <ClipboardList className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Closed</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.closed}</p>
                  </div>
                  <CheckSquare className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Resolved items</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Open</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.open}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Requires action</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">In Progress</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Being addressed</p>
              </div>
            </div>

            {/* Register Type Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Register Breakdown by Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => { setFilter('RISK'); setViewMode('list'); }}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                    <p className="text-sm font-medium text-blue-900">Risks</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{stats.risks}</p>
                  <p className="text-xs text-blue-700 mt-1">Click to view →</p>
                </button>

                <button
                  onClick={() => { setFilter('INCIDENT'); setViewMode('list'); }}
                  className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FileWarning className="h-5 w-5 text-rose-600" />
                    <p className="text-sm font-medium text-rose-900">Incidents</p>
                  </div>
                  <p className="text-2xl font-bold text-rose-900">{stats.incidents}</p>
                  <p className="text-xs text-rose-700 mt-1">Click to view →</p>
                </button>

                <button
                  onClick={() => { setFilter('NONCONFORMITY'); setViewMode('list'); }}
                  className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <CheckSquare className="h-5 w-5 text-amber-600" />
                    <p className="text-sm font-medium text-amber-900">Nonconformities</p>
                  </div>
                  <p className="text-2xl font-bold text-amber-900">{stats.nonconformities}</p>
                  <p className="text-xs text-amber-700 mt-1">Click to view →</p>
                </button>

                <button
                  onClick={() => { setFilter('COMPLIANCE_OBLIGATION'); setViewMode('list'); }}
                  className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Scale className="h-5 w-5 text-purple-600" />
                    <p className="text-sm font-medium text-purple-900">Compliance Obligations</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{stats.compliance}</p>
                  <p className="text-xs text-purple-700 mt-1">Click to view →</p>
                </button>

                <button
                  onClick={() => { setFilter('LEGAL'); setViewMode('list'); }}
                  className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-indigo-600" />
                    <p className="text-sm font-medium text-indigo-900">Legal Register</p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-900">{stats.legal}</p>
                  <p className="text-xs text-indigo-700 mt-1">Click to view →</p>
                </button>

                <button
                  onClick={() => { setFilter('ASPECT_IMPACT'); setViewMode('list'); }}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-900">Aspects & Impacts</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-900">{stats.aspects}</p>
                  <p className="text-xs text-emerald-700 mt-1">Click to view →</p>
                </button>
              </div>
            </div>

            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Overview</h3>
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
                    <span className="text-slate-700">In Progress</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%)
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

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Closure Rate</span>
                  <span className="font-semibold">
                    {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${stats.total > 0 ? (stats.closed / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  ISO 9001:10 & ISO 14001:10 & ISO 45001:10 - Improvement
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs (List and Grid views) */}
        {viewMode !== 'dashboard' && (
          <div className="border-b border-slate-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`
                      flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                      ${
                        filter === tab.key
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, details, or owner..."
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
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || statusFilter !== 'ALL') && (
                  <>
                    <Filter className="h-4 w-4 text-slate-500" />
                    {searchTerm && (
                      <Badge variant="secondary" className="gap-1">
                        Search: "{searchTerm}"
                        <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-slate-900">×</button>
                      </Badge>
                    )}
                    {statusFilter !== 'ALL' && (
                      <Badge variant="secondary" className="gap-1">
                        Status: {statusFilter.replace('_', ' ')}
                        <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                      </Badge>
                    )}
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setStatusFilter('ALL')
                      }}
                      className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                    >
                      Clear all
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredEntries.length} of {entries.filter(e => filter === 'ALL' || e.type === filter).length} entries
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => { setEditingEntry(entry); setShowForm(true); }}
              >
                <div className="flex items-start justify-between mb-4">
                  <ClipboardList className="h-8 w-8 text-slate-400" />
                  {entry.status && (
                    <StatusBadge 
                      status={getStatusRAG(entry.status)} 
                      label={entry.status.replace('_', ' ')}
                    />
                  )}
                </div>

                <Badge variant="outline" className="mb-3">{entry.type.replace('_', ' ')}</Badge>

                <h3 className="font-semibold text-slate-900 mb-2">{entry.title}</h3>

                <div className="space-y-2 text-sm text-slate-600">
                  {entry.details && (
                    <p className="line-clamp-2">
                      <span className="font-medium">Details:</span> {entry.details}
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Owner:</span> {entry.owner || 'Unassigned'}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {formatDate(entry.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
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
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      <SortIcon field="title" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Owner
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
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredEntries.map((entry) => (
                  <tr 
                    key={entry.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => { setEditingEntry(entry); setShowForm(true); }}
                  >
                    <td className="px-6 py-4">
                      <Badge variant="outline">{entry.type.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{entry.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                      {entry.details || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{entry.owner || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      {entry.status ? (
                        <StatusBadge 
                          status={getStatusRAG(entry.status)} 
                          label={entry.status.replace('_', ' ')}
                        />
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredEntries.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ClipboardList className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No register entries found</p>
          </div>
        )}

        <RegisterForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingEntry(undefined); }}
          entry={editingEntry}
          onSave={loadEntries}
        />
      </div>
    </Shell>
  )
}
