'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  AlertCircle, Plus, Download, Search, LayoutDashboard, 
  TrendingUp, Clock, CheckCircle, AlertTriangle, ArrowUpDown, ArrowUp, ArrowDown,
  Calendar as CalendarIcon, ChevronLeft, ChevronRight
} from 'lucide-react'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { NCIntakeForm } from '@/components/forms/NCIntakeForm'
import { NCDetailView } from '@/components/forms/NCDetailView'
import { formatDate } from '@/lib/utils'
import { convertToCSV, downloadFile } from '@/lib/export'

interface NonConformance {
  id: string
  refNumber: string
  caseType: string
  title: string
  raisedBy: string
  dateRaised: Date
  category: string
  severity: string
  status: string
  owner: string | null
  dueDate: Date | null
}

type ViewMode = 'dashboard' | 'list' | 'grid' | 'calendar' | 'board'
type CalendarView = 'day' | 'week' | 'month'

export default function NonConformancePage() {
  const [records, setRecords] = useState<NonConformance[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [calendarView, setCalendarView] = useState<CalendarView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [severityFilter, setSeverityFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('dateRaised')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadRecords = () => {
    setLoading(true)
    fetch('/api/nonconformance')
      .then((res) => res.json())
      .then((data) => {
        setRecords(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setRecords([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadRecords()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAndSortedRecords = records
    .filter(r => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          r.refNumber.toLowerCase().includes(search) ||
          r.title.toLowerCase().includes(search) ||
          (r.owner?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(r => caseTypeFilter === 'ALL' || r.caseType === caseTypeFilter)
    .filter(r => statusFilter === 'ALL' || r.status === statusFilter)
    .filter(r => severityFilter === 'ALL' || r.severity === severityFilter)
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'refNumber':
          aVal = a.refNumber.toLowerCase()
          bVal = b.refNumber.toLowerCase()
          break
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'dateRaised':
          aVal = new Date(a.dateRaised).getTime()
          bVal = new Date(b.dateRaised).getTime()
          break
        case 'severity':
          aVal = a.severity
          bVal = b.severity
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = new Date(a.dateRaised).getTime()
          bVal = new Date(b.dateRaised).getTime()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedRecords

  const stats = {
    total: records.length,
    ofi: records.filter(r => r.caseType === 'OFI').length,
    nc: records.filter(r => r.caseType === 'NC').length,
    cc: records.filter(r => r.caseType === 'CC').length,
    snc: records.filter(r => r.caseType === 'SNC').length,
    open: records.filter(r => r.status === 'OPEN').length,
    underInvestigation: records.filter(r => r.status === 'UNDER_INVESTIGATION').length,
    inProgress: records.filter(r => r.status === 'CORRECTIVE_ACTIONS_IN_PROGRESS').length,
    pendingVerification: records.filter(r => r.status === 'PENDING_VERIFICATION').length,
    closed: records.filter(r => r.status === 'CLOSED').length,
    critical: records.filter(r => r.severity === 'CRITICAL' && r.status !== 'CLOSED').length,
    high: records.filter(r => r.severity === 'HIGH' && r.status !== 'CLOSED').length,
    overdue: records.filter(r => {
      if (!r.dueDate || r.status === 'CLOSED') return false
      return new Date(r.dueDate) < new Date()
    }).length,
  }

  const getStatusRAG = (status: string): 'green' | 'amber' | 'red' => {
    if (status === 'CLOSED') return 'green'
    if (status === 'PENDING_VERIFICATION' || status === 'CORRECTIVE_ACTIONS_IN_PROGRESS') return 'amber'
    return 'red'
  }

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'CRITICAL': return 'bg-rose-600 text-white'
      case 'HIGH': return 'bg-orange-500 text-white'
      case 'MEDIUM': return 'bg-amber-500 text-white'
      case 'LOW': return 'bg-blue-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const getCaseTypeColor = (type: string): string => {
    switch (type) {
      case 'OFI': return 'bg-emerald-100 text-emerald-700 border-emerald-300'
      case 'NC': return 'bg-rose-100 text-rose-700 border-rose-300'
      case 'CC': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'SNC': return 'bg-purple-100 text-purple-700 border-purple-300'
      default: return 'bg-slate-100 text-slate-700 border-slate-300'
    }
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(r => ({
      'Ref': r.refNumber,
      'Type': r.caseType,
      'Title': r.title,
      'Raised By': r.raisedBy,
      'Date Raised': formatDate(r.dateRaised),
      'Category': r.category,
      'Severity': r.severity,
      'Owner': r.owner || '-',
      'Status': r.status.replace(/_/g, ' '),
      'Due Date': r.dueDate ? formatDate(r.dueDate) : '-',
    })))
    downloadFile(csv, `nc-improvements-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  // Calendar helpers
  const getRecordsForDate = (date: Date) => {
    return records.filter(r => {
      const raisedDate = new Date(r.dateRaised)
      return raisedDate.toDateString() === date.toDateString()
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, firstDay, lastDay }
  }

  const navigateCalendar = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    
    if (calendarView === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    } else if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    }
    
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading records...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Non-Conformance & Improvements</h1>
            <p className="text-slate-600 mt-1">OFI, NC, Customer Complaints, Supplier Non-Conformances</p>
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
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'calendar'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Calendar
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
            {viewMode !== 'dashboard' && viewMode !== 'calendar' && viewMode !== 'board' && (
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            )}
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Case
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
                    <p className="text-sm font-medium text-slate-600">Total Cases</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Open</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.open + stats.underInvestigation}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Require attention</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">In Progress</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Actions underway</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Closed</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.closed}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0}% resolved
                </p>
              </div>
            </div>

            {/* Case Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Opportunities for Improvement (OFI)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.ofi}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Internal Non-Conformance (NC)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.nc}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-slate-700">Customer Complaint (CC)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.cc}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-700">Supplier Non-Conformance (SNC)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.snc}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Open / Under Investigation</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.open + stats.underInvestigation}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Corrective Actions In Progress</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Pending Verification</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.pendingVerification}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Closed</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.closed}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats.critical > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-rose-600" />
                    <h3 className="text-lg font-semibold text-rose-900">Critical Cases</h3>
                  </div>
                  <p className="text-3xl font-bold text-rose-600 mb-2">{stats.critical}</p>
                  <p className="text-sm text-rose-700 mb-4">Require immediate attention</p>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSeverityFilter('CRITICAL')
                      setViewMode('list')
                    }}
                  >
                    Review Critical →
                  </Button>
                </div>
              )}

              {stats.overdue > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-900">Overdue</h3>
                  </div>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{stats.overdue}</p>
                  <p className="text-sm text-amber-700 mb-4">Past due date</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-amber-600 text-amber-700 hover:bg-amber-100"
                    onClick={() => setViewMode('list')}
                  >
                    View Overdue →
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filters (List/Grid View) */}
        {(viewMode === 'list' || viewMode === 'grid') && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div>
                <Select value={caseTypeFilter} onValueChange={setCaseTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="OFI">OFI - Improvement</SelectItem>
                    <SelectItem value="NC">NC - Internal</SelectItem>
                    <SelectItem value="CC">CC - Customer</SelectItem>
                    <SelectItem value="SNC">SNC - Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="UNDER_INVESTIGATION">Under Investigation</SelectItem>
                    <SelectItem value="CORRECTIVE_ACTIONS_IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Severities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Severities</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || caseTypeFilter !== 'ALL' || statusFilter !== 'ALL' || severityFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setCaseTypeFilter('ALL')
                      setStatusFilter('ALL')
                      setSeverityFilter('ALL')
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 underline whitespace-nowrap"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredData.length} of {records.length} cases
            </p>
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
                    onClick={() => handleSort('refNumber')}
                  >
                    <div className="flex items-center gap-2">
                      Ref
                      <SortIcon field="refNumber" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Type
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
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('dateRaised')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Date Raised
                      <SortIcon field="dateRaised" />
                    </div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.map((record) => {
                  const rag = getStatusRAG(record.status)
                  return (
                    <tr 
                      key={record.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setSelectedRecordId(record.id)
                        setShowDetailView(true)
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{record.refNumber}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCaseTypeColor(record.caseType)}`}>
                          {record.caseType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">{record.title}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">{formatDate(record.dateRaised)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(record.severity)}`}>
                          {record.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{record.owner || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={rag} label={record.status.replace(/_/g, ' ')} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((record) => {
              const rag = getStatusRAG(record.status)
              const daysOpen = Math.floor((new Date().getTime() - new Date(record.dateRaised).getTime()) / (1000 * 60 * 60 * 24))
              
              return (
                <div
                  key={record.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedRecordId(record.id)
                    setShowDetailView(true)
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCaseTypeColor(record.caseType)}`}>
                        {record.caseType}
                      </span>
                      <p className="text-xs text-slate-500 mt-2">{record.refNumber}</p>
                    </div>
                    <StatusBadge status={rag} label={record.status.replace(/_/g, ' ')} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{record.title}</h3>

                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Raised:</span>
                      <span className="font-medium">{formatDate(record.dateRaised)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Severity:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                        {record.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Owner:</span>
                      <span className="font-medium">{record.owner || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Days Open:</span>
                      <span className={`font-medium ${daysOpen > 30 ? 'text-rose-600' : daysOpen > 15 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {daysOpen}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow">
            {/* Calendar Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {calendarView === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  {calendarView === 'week' && `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                  {calendarView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setCalendarView('day')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        calendarView === 'day' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                      }`}
                    >
                      Day
                    </button>
                    <button
                      onClick={() => setCalendarView('week')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        calendarView === 'week' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                      }`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setCalendarView('month')}
                      className={`px-3 py-1 text-sm font-medium rounded ${
                        calendarView === 'month' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                      }`}
                    >
                      Month
                    </button>
                  </div>
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => navigateCalendar('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateCalendar('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid - Month View */}
            {calendarView === 'month' && (
              <div className="p-6">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-slate-600 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {(() => {
                    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
                    const days = []
                    
                    // Empty cells before first day
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="min-h-24 bg-slate-50 rounded"></div>)
                    }
                    
                    // Days of month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                      const dayRecords = getRecordsForDate(date)
                      const isToday = date.toDateString() === new Date().toDateString()
                      
                      days.push(
                        <div
                          key={day}
                          className={`min-h-24 border rounded-lg p-2 ${
                            isToday ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-900 mb-1">{day}</div>
                          <div className="space-y-1">
                            {dayRecords.slice(0, 3).map(record => (
                              <div
                                key={record.id}
                                className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${getCaseTypeColor(record.caseType)}`}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedRecordId(record.id)
                                  setShowDetailView(true)
                                }}
                              >
                                {record.refNumber}
                              </div>
                            ))}
                            {dayRecords.length > 3 && (
                              <div className="text-xs text-slate-500">+{dayRecords.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      )
                    }
                    
                    return days
                  })()}
                </div>
              </div>
            )}

            {/* Calendar - Week View */}
            {calendarView === 'week' && (
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4">
                  {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                    const date = new Date(currentDate)
                    date.setDate(date.getDate() - date.getDay() + offset)
                    const dayRecords = getRecordsForDate(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    
                    return (
                      <div key={offset} className={`border rounded-lg p-3 ${isToday ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                        <div className="text-center mb-3">
                          <div className="text-xs text-slate-600">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="text-lg font-semibold text-slate-900">{date.getDate()}</div>
                        </div>
                        <div className="space-y-2">
                          {dayRecords.map(record => (
                            <div
                              key={record.id}
                              className={`text-xs p-2 rounded cursor-pointer hover:opacity-80 ${getCaseTypeColor(record.caseType)}`}
                              onClick={() => {
                                setSelectedRecordId(record.id)
                                setShowDetailView(true)
                              }}
                            >
                              <div className="font-medium">{record.refNumber}</div>
                              <div className="truncate mt-1">{record.title}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Calendar - Day View */}
            {calendarView === 'day' && (
              <div className="p-6">
                <div className="space-y-3">
                  {getRecordsForDate(currentDate).map(record => {
                    const rag = getStatusRAG(record.status)
                    return (
                    <div
                      key={record.id}
                      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedRecordId(record.id)
                        setShowDetailView(true)
                      }}
                    >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getCaseTypeColor(record.caseType)}`}>
                              {record.caseType}
                            </span>
                            <span className="font-medium text-slate-900">{record.refNumber}</span>
                          </div>
                          <StatusBadge status={rag} label={record.status.replace(/_/g, ' ')} />
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{record.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Owner: {record.owner || 'Unassigned'}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                            {record.severity}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  {getRecordsForDate(currentDate).length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      No cases raised on this date
                    </div>
                  )}
                </div>
              </div>
            )}
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
                      {filteredData.filter(r => r.status === 'OPEN').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredData
                      .filter(r => r.status === 'OPEN')
                      .map(record => (
                        <div
                          key={record.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
                          style={{ borderLeftColor: 
                            record.caseType === 'OFI' ? '#10b981' :
                            record.caseType === 'NC' ? '#ef4444' :
                            record.caseType === 'CC' ? '#f97316' : '#a855f7'
                          }}
                          onClick={() => {
                            setSelectedRecordId(record.id)
                            setShowDetailView(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCaseTypeColor(record.caseType)}`}>
                              {record.caseType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                              {record.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{record.refNumber}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{record.title}</h4>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{record.owner || 'Unassigned'}</span>
                            {record.dueDate && (
                              <span>{formatDate(record.dueDate)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* UNDER INVESTIGATION Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Under Investigation</h3>
                    <Badge variant="secondary">
                      {filteredData.filter(r => r.status === 'UNDER_INVESTIGATION').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredData
                      .filter(r => r.status === 'UNDER_INVESTIGATION')
                      .map(record => (
                        <div
                          key={record.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
                          style={{ borderLeftColor: 
                            record.caseType === 'OFI' ? '#10b981' :
                            record.caseType === 'NC' ? '#ef4444' :
                            record.caseType === 'CC' ? '#f97316' : '#a855f7'
                          }}
                          onClick={() => {
                            setSelectedRecordId(record.id)
                            setShowDetailView(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCaseTypeColor(record.caseType)}`}>
                              {record.caseType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                              {record.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{record.refNumber}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{record.title}</h4>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{record.owner || 'Unassigned'}</span>
                            {record.dueDate && (
                              <span>{formatDate(record.dueDate)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">In Progress</h3>
                    <Badge variant="secondary">
                      {filteredData.filter(r => r.status === 'CORRECTIVE_ACTIONS_IN_PROGRESS' || r.status === 'CONTAINMENT_IN_PLACE').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredData
                      .filter(r => r.status === 'CORRECTIVE_ACTIONS_IN_PROGRESS' || r.status === 'CONTAINMENT_IN_PLACE')
                      .map(record => (
                        <div
                          key={record.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
                          style={{ borderLeftColor: 
                            record.caseType === 'OFI' ? '#10b981' :
                            record.caseType === 'NC' ? '#ef4444' :
                            record.caseType === 'CC' ? '#f97316' : '#a855f7'
                          }}
                          onClick={() => {
                            setSelectedRecordId(record.id)
                            setShowDetailView(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCaseTypeColor(record.caseType)}`}>
                              {record.caseType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                              {record.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{record.refNumber}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{record.title}</h4>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{record.owner || 'Unassigned'}</span>
                            {record.dueDate && (
                              <span>{formatDate(record.dueDate)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* PENDING VERIFICATION Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Pending Verification</h3>
                    <Badge variant="secondary">
                      {filteredData.filter(r => r.status === 'PENDING_VERIFICATION').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredData
                      .filter(r => r.status === 'PENDING_VERIFICATION')
                      .map(record => (
                        <div
                          key={record.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4"
                          style={{ borderLeftColor: 
                            record.caseType === 'OFI' ? '#10b981' :
                            record.caseType === 'NC' ? '#ef4444' :
                            record.caseType === 'CC' ? '#f97316' : '#a855f7'
                          }}
                          onClick={() => {
                            setSelectedRecordId(record.id)
                            setShowDetailView(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCaseTypeColor(record.caseType)}`}>
                              {record.caseType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                              {record.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{record.refNumber}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{record.title}</h4>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{record.owner || 'Unassigned'}</span>
                            {record.dueDate && (
                              <span>{formatDate(record.dueDate)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* CLOSED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Closed</h3>
                    <Badge variant="secondary">
                      {filteredData.filter(r => r.status === 'CLOSED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredData
                      .filter(r => r.status === 'CLOSED')
                      .map(record => (
                        <div
                          key={record.id}
                          className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 opacity-75"
                          style={{ borderLeftColor: 
                            record.caseType === 'OFI' ? '#10b981' :
                            record.caseType === 'NC' ? '#ef4444' :
                            record.caseType === 'CC' ? '#f97316' : '#a855f7'
                          }}
                          onClick={() => {
                            setSelectedRecordId(record.id)
                            setShowDetailView(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCaseTypeColor(record.caseType)}`}>
                              {record.caseType}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(record.severity)}`}>
                              {record.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{record.refNumber}</p>
                          <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{record.title}</h4>
                          <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>{record.owner || 'Unassigned'}</span>
                            {record.dueDate && (
                              <span>{formatDate(record.dueDate)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredData.length === 0 && viewMode !== 'dashboard' && viewMode !== 'calendar' && viewMode !== 'board' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No cases found</p>
            <p className="text-sm text-slate-400 mt-2">Click "New Case" to create your first record</p>
          </div>
        )}

        <NCIntakeForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSave={loadRecords}
        />

        {selectedRecordId && (
          <NCDetailView
            open={showDetailView}
            onClose={() => {
              setShowDetailView(false)
              setSelectedRecordId(null)
            }}
            recordId={selectedRecordId}
            onUpdate={loadRecords}
          />
        )}
      </div>
    </Shell>
  )
}
