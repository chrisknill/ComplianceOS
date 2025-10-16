'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { getCalibrationRAG } from '@/lib/rag'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Calendar, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, AlertCircle, Clock, FileCheck
} from 'lucide-react'
import { CalibrationForm } from '@/components/forms/CalibrationForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'

interface Calibration {
  id: string
  dueDate: Date
  performedOn: Date | null
  certificateUrl: string | null
  result: string | null
  equipment: {
    id: string
    name: string
    assetTag: string | null
  }
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function CalibrationPage() {
  const [calibrations, setCalibrations] = useState<Calibration[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingCalibration, setEditingCalibration] = useState<Calibration | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [resultFilter, setResultFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('dueDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadCalibrations = () => {
    setLoading(true)
    fetch('/api/calibrations')
      .then((res) => res.json())
      .then((data) => {
        setCalibrations(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load calibrations:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadCalibrations()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Filter and sort
  const filteredAndSortedCalibrations = calibrations
    .filter(c => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          c.equipment.name.toLowerCase().includes(search) ||
          (c.equipment.assetTag?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(c => {
      if (statusFilter === 'ALL') return true
      const rag = getCalibrationRAG(c.dueDate, c.performedOn)
      if (statusFilter === 'OVERDUE') return rag === 'red'
      if (statusFilter === 'DUE_SOON') return rag === 'amber'
      if (statusFilter === 'COMPLETE') return rag === 'green'
      return true
    })
    .filter(c => {
      if (resultFilter === 'ALL') return true
      return c.result === resultFilter
    })
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'equipment':
          aVal = a.equipment.name.toLowerCase()
          bVal = b.equipment.name.toLowerCase()
          break
        case 'assetTag':
          aVal = (a.equipment.assetTag || '').toLowerCase()
          bVal = (b.equipment.assetTag || '').toLowerCase()
          break
        case 'dueDate':
          aVal = new Date(a.dueDate).getTime()
          bVal = new Date(b.dueDate).getTime()
          break
        case 'performedOn':
          aVal = a.performedOn ? new Date(a.performedOn).getTime() : 0
          bVal = b.performedOn ? new Date(b.performedOn).getTime() : 0
          break
        case 'result':
          aVal = a.result || ''
          bVal = b.result || ''
          break
        default:
          aVal = new Date(a.dueDate).getTime()
          bVal = new Date(b.dueDate).getTime()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedCalibrations

  // Calculate statistics
  const stats = {
    total: calibrations.length,
    completed: calibrations.filter(c => c.performedOn).length,
    pending: calibrations.filter(c => !c.performedOn).length,
    overdue: calibrations.filter(c => {
      const rag = getCalibrationRAG(c.dueDate, c.performedOn)
      return rag === 'red'
    }).length,
    dueSoon: calibrations.filter(c => {
      const rag = getCalibrationRAG(c.dueDate, c.performedOn)
      return rag === 'amber'
    }).length,
    passed: calibrations.filter(c => c.result === 'PASS').length,
    failed: calibrations.filter(c => c.result === 'FAIL').length,
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(c => ({
      'Equipment': c.equipment.name,
      'Asset Tag': c.equipment.assetTag || '-',
      'Due Date': formatDate(c.dueDate),
      'Performed': formatDate(c.performedOn),
      'Result': c.result || '-',
      'Status': getCalibrationRAG(c.dueDate, c.performedOn),
      'Certificate': c.certificateUrl || '-',
    })))
    downloadFile(csv, `calibrations-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Equipment', 'Asset Tag', 'Due Date', 'Performed', 'Result', 'Status']
    const rows = filteredData.map(c => [
      c.equipment.name,
      c.equipment.assetTag || '-',
      formatDate(c.dueDate),
      formatDate(c.performedOn),
      c.result || '-',
      getCalibrationRAG(c.dueDate, c.performedOn),
    ])
    
    exportTableToPDF('Calibration Schedule', headers, rows, `calibrations-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading calibrations...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Calibration Schedule</h1>
            <p className="text-slate-600 mt-1">Equipment calibration tracking and certificates</p>
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
            <Button onClick={() => { setEditingCalibration(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Calibration
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
                    <p className="text-sm font-medium text-slate-600">Total Calibrations</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% complete
                </p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Overdue</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.overdue}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Action required</p>
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
            </div>

            {/* Results Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Calibration Results</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">Passed</span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">{stats.passed}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-sm text-slate-700">Failed</span>
                  </div>
                  <p className="text-3xl font-bold text-rose-600">{stats.failed}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.failed / stats.total) * 100) : 0}%
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-sm text-slate-700">Pending</span>
                  </div>
                  <p className="text-3xl font-bold text-slate-600">{stats.pending}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-rose-900">Overdue Calibrations</h3>
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{stats.overdue}</p>
                <p className="text-sm text-rose-700 mb-4">Past due date - immediate action required</p>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('OVERDUE')
                    setViewMode('list')
                  }}
                >
                  View Overdue →
                </Button>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Due Soon</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.dueSoon}</p>
                <p className="text-sm text-amber-700 mb-4">Due within next 30 days</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    setStatusFilter('DUE_SOON')
                    setViewMode('list')
                  }}
                >
                  View Due Soon →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by equipment name or asset tag..."
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
                    <SelectItem value="COMPLETE">Complete</SelectItem>
                    <SelectItem value="DUE_SOON">Due Soon</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Results</SelectItem>
                    <SelectItem value="PASS">Pass</SelectItem>
                    <SelectItem value="FAIL">Fail</SelectItem>
                    <SelectItem value="AS FOUND">As Found</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(searchTerm || statusFilter !== 'ALL' || resultFilter !== 'ALL') && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Active filters:</span>
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
                {resultFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Result: {resultFilter}
                    <button onClick={() => setResultFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setResultFilter('ALL')
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredData.length} of {calibrations.length} calibrations
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((cal) => {
              const rag = getCalibrationRAG(cal.dueDate, cal.performedOn)
              return (
                <div
                  key={cal.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingCalibration(cal); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Calendar className="h-8 w-8 text-slate-400" />
                    <StatusBadge status={rag} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{cal.equipment.name}</h3>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Asset Tag:</span> {cal.equipment.assetTag || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span> {formatDate(cal.dueDate)}
                    </p>
                    <p>
                      <span className="font-medium">Performed:</span> {formatDate(cal.performedOn)}
                    </p>
                    {cal.result && (
                      <p>
                        <span className="font-medium">Result:</span>{' '}
                        <Badge variant={cal.result === 'PASS' ? 'default' : cal.result === 'FAIL' ? 'destructive' : 'outline'}>
                          {cal.result}
                        </Badge>
                      </p>
                    )}
                  </div>

                  {cal.certificateUrl && (
                    <a
                      href={cal.certificateUrl}
                      className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FileCheck className="h-4 w-4" />
                      View Certificate →
                    </a>
                  )}
                </div>
              )
            })}
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
                    onClick={() => handleSort('equipment')}
                  >
                    <div className="flex items-center gap-2">
                      Equipment
                      <SortIcon field="equipment" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('assetTag')}
                  >
                    <div className="flex items-center gap-2">
                      Asset Tag
                      <SortIcon field="assetTag" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center gap-2">
                      Due Date
                      <SortIcon field="dueDate" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('performedOn')}
                  >
                    <div className="flex items-center gap-2">
                      Performed
                      <SortIcon field="performedOn" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('result')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Result
                      <SortIcon field="result" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Certificate
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((cal) => {
                  const rag = getCalibrationRAG(cal.dueDate, cal.performedOn)
                  return (
                    <tr 
                      key={cal.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingCalibration(cal); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{cal.equipment.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-900">{cal.equipment.assetTag || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(cal.dueDate)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(cal.performedOn)}</td>
                      <td className="px-6 py-4 text-center">
                        {cal.result ? (
                          <Badge 
                            variant={
                              cal.result === 'PASS' ? 'default' : 
                              cal.result === 'FAIL' ? 'destructive' : 
                              'outline'
                            }
                          >
                            {cal.result}
                          </Badge>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={rag} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {cal.certificateUrl ? (
                          <a 
                            href={cal.certificateUrl} 
                            className="text-blue-600 hover:underline inline-flex items-center gap-1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileCheck className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredData.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No calibrations found</p>
          </div>
        )}

        <CalibrationForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingCalibration(undefined); }}
          calibration={editingCalibration}
          onSave={loadCalibrations}
        />
      </div>
    </Shell>
  )
}
