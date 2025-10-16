'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { 
  ClipboardCheck, Plus, Download, Search, Filter, Calendar as CalendarIcon,
  LayoutDashboard, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react'
import { AuditForm } from '@/components/forms/AuditForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'

interface Audit {
  id: string
  type: string
  title: string
  auditor: string | null
  date: Date
  findings: string | null
  status: string
  area: string | null
  duration: number | null
  outcome: string | null
  actionItems: number | null
}

type ViewMode = 'dashboard' | 'list' | 'calendar'
type CalendarView = 'day' | 'week' | 'month'

export default function AuditsInspectionsPage() {
  const [audits, setAudits] = useState<Audit[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [calendarView, setCalendarView] = useState<CalendarView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [filter, setFilter] = useState<string>('ALL')
  const [showForm, setShowForm] = useState(false)
  const [editingAudit, setEditingAudit] = useState<Audit | undefined>()

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const loadAudits = () => {
    setLoading(true)
    fetch('/api/ohs/audits')
      .then((res) => res.json())
      .then((data) => {
        setAudits(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadAudits()
  }, [])

  const tabs = [
    { key: 'ALL', label: 'All' },
    { key: 'INTERNAL_AUDIT', label: 'Internal Audits' },
    { key: 'THIRD_PARTY_AUDIT', label: '3rd Party Audits' },
    { key: 'CERTIFICATION_AUDIT', label: 'Certification Audits' },
    { key: 'INSPECTION', label: 'Inspections' },
  ]

  // Filter audits
  const filteredAudits = audits
    .filter(a => filter === 'ALL' || a.type === filter)
    .filter(a => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return a.title.toLowerCase().includes(search) || (a.auditor?.toLowerCase() || '').includes(search)
      }
      return true
    })
    .filter(a => statusFilter === 'ALL' || a.status === statusFilter)

  // Statistics
  const stats = {
    total: audits.length,
    scheduled: audits.filter(a => a.status === 'SCHEDULED').length,
    inProgress: audits.filter(a => a.status === 'IN_PROGRESS').length,
    completed: audits.filter(a => a.status === 'COMPLETED').length,
    internal: audits.filter(a => a.type === 'INTERNAL_AUDIT').length,
    thirdParty: audits.filter(a => a.type === 'THIRD_PARTY_AUDIT').length,
    certification: audits.filter(a => a.type === 'CERTIFICATION_AUDIT').length,
    inspections: audits.filter(a => a.type === 'INSPECTION').length,
    thisMonth: audits.filter(a => {
      const auditDate = new Date(a.date)
      return auditDate.getMonth() === currentDate.getMonth() && 
             auditDate.getFullYear() === currentDate.getFullYear()
    }).length,
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredAudits.map(a => ({
      'Type': a.type.replace('_', ' '),
      'Title': a.title,
      'Auditor': a.auditor || '-',
      'Date': new Date(a.date).toLocaleDateString(),
      'Area': a.area || '-',
      'Status': a.status,
      'Outcome': a.outcome || '-',
      'Action Items': a.actionItems || 0,
    })))
    downloadFile(csv, `audits-inspections-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Type', 'Title', 'Auditor', 'Date', 'Status', 'Outcome']
    const rows = filteredAudits.map(a => [
      a.type.replace('_', ' '),
      a.title,
      a.auditor || '-',
      new Date(a.date).toLocaleDateString(),
      a.status,
      a.outcome || '-',
    ])
    
    exportTableToPDF('Audits & Inspections', headers, rows, `audits-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Calendar helpers
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getAuditsForDate = (date: Date) => {
    return filteredAudits.filter(a => {
      const auditDate = new Date(a.date)
      return auditDate.toDateString() === date.toDateString()
    })
  }

  const getStatusRAG = (status: string): 'green' | 'amber' | 'red' => {
    if (status === 'COMPLETED') return 'green'
    if (status === 'IN_PROGRESS') return 'amber'
    return 'red' // SCHEDULED
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading audits...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Audits & Inspections</h1>
            <p className="text-slate-600 mt-1">Schedule and track audits and safety inspections</p>
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
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'calendar' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List
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
            <Button onClick={() => { setEditingAudit(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Audit/Inspection
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
                    <p className="text-sm font-medium text-slate-600">Total Audits</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <ClipboardCheck className="h-10 w-10 text-blue-500" />
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
                <p className="text-sm text-slate-500 mt-2">Finished audits</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">This Month</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.thisMonth}</p>
                  </div>
                  <CalendarIcon className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Scheduled</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">In Progress</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Ongoing</p>
              </div>
            </div>

            {/* Type Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => { setFilter('INTERNAL_AUDIT'); setViewMode('list'); }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-blue-900">Internal Audits</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.internal}</p>
                <p className="text-xs text-blue-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => { setFilter('THIRD_PARTY_AUDIT'); setViewMode('list'); }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-purple-900">3rd Party Audits</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.thirdParty}</p>
                <p className="text-xs text-purple-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => { setFilter('CERTIFICATION_AUDIT'); setViewMode('list'); }}
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-emerald-900">Certification Audits</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.certification}</p>
                <p className="text-xs text-emerald-700 mt-1">Click to view →</p>
              </button>

              <button
                onClick={() => { setFilter('INSPECTION'); setViewMode('list'); }}
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
              >
                <p className="text-sm font-medium text-amber-900">Inspections</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{stats.inspections}</p>
                <p className="text-xs text-amber-700 mt-1">Click to view →</p>
              </button>
            </div>

            {/* Quick Action */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">View Calendar</h3>
                  <p className="text-sm text-blue-700 mt-1">See audits and inspections in calendar view</p>
                </div>
                <Button onClick={() => setViewMode('calendar')}>
                  View Calendar →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs (List & Calendar views) */}
        {viewMode !== 'dashboard' && (
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="space-y-4">
            {/* Calendar Controls */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setCalendarView('day')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      calendarView === 'day' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      calendarView === 'week' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      calendarView === 'month' ? 'bg-white text-slate-900 shadow' : 'text-slate-600'
                    }`}
                  >
                    Month
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (calendarView === 'day') navigateDay('prev')
                      else if (calendarView === 'week') navigateWeek('prev')
                      else navigateMonth('prev')
                    }}
                    className="p-2 hover:bg-slate-100 rounded"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
                    {calendarView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    {calendarView === 'week' && `Week of ${currentDate.toLocaleDateString()}`}
                    {calendarView === 'day' && currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>

                  <button 
                    onClick={() => {
                      if (calendarView === 'day') navigateDay('next')
                      else if (calendarView === 'week') navigateWeek('next')
                      else navigateMonth('next')
                    }}
                    className="p-2 hover:bg-slate-100 rounded"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <Button size="sm" variant="outline" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid - Month View */}
            {calendarView === 'month' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-slate-700 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {(() => {
                    const year = currentDate.getFullYear()
                    const month = currentDate.getMonth()
                    const firstDay = new Date(year, month, 1).getDay()
                    const daysInMonth = new Date(year, month + 1, 0).getDate()
                    const days = []

                    // Empty cells for days before month starts
                    for (let i = 0; i < firstDay; i++) {
                      days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-slate-50 rounded" />)
                    }

                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day)
                      const dayAudits = getAuditsForDate(date)
                      const isToday = date.toDateString() === new Date().toDateString()

                      days.push(
                        <div
                          key={day}
                          className={`min-h-[100px] border rounded p-2 ${
                            isToday ? 'bg-blue-50 border-blue-300' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-blue-900' : 'text-slate-900'}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayAudits.map((audit) => (
                              <div
                                key={audit.id}
                                onClick={() => { setEditingAudit(audit); setShowForm(true); }}
                                className="text-xs p-1.5 rounded cursor-pointer hover:shadow-md transition-shadow bg-slate-100 hover:bg-slate-200"
                              >
                                <div className="font-medium truncate">{audit.title}</div>
                                <div className="flex items-center justify-between mt-0.5">
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                                    {audit.type.replace('_', ' ').split(' ')[0]}
                                  </Badge>
                                  <StatusBadge status={getStatusRAG(audit.status)} label="" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }

                    return days
                  })()}
                </div>
              </div>
            )}

            {/* Week View */}
            {calendarView === 'week' && (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <div className="grid grid-cols-7 divide-x divide-slate-200">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const date = new Date(currentDate)
                    date.setDate(currentDate.getDate() - currentDate.getDay() + offset)
                    const dayAudits = getAuditsForDate(date)
                    const isToday = date.toDateString() === new Date().toDateString()

                    return (
                      <div key={offset} className={`min-h-[400px] p-4 ${isToday ? 'bg-blue-50' : ''}`}>
                        <div className={`text-center mb-4 ${isToday ? 'text-blue-900 font-bold' : 'text-slate-900'}`}>
                          <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="text-2xl font-bold">{date.getDate()}</div>
                        </div>
                        <div className="space-y-2">
                          {dayAudits.map((audit) => (
                            <div
                              key={audit.id}
                              onClick={() => { setEditingAudit(audit); setShowForm(true); }}
                              className="text-xs p-2 rounded cursor-pointer bg-slate-100 hover:bg-slate-200"
                            >
                              <div className="font-medium">{audit.title}</div>
                              <div className="text-[10px] text-slate-600 mt-1">{audit.auditor || 'TBD'}</div>
                              <StatusBadge status={getStatusRAG(audit.status)} label={audit.status} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Day View */}
            {calendarView === 'day' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Schedule for {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>
                <div className="space-y-3">
                  {getAuditsForDate(currentDate).length > 0 ? (
                    getAuditsForDate(currentDate).map((audit) => (
                      <div
                        key={audit.id}
                        onClick={() => { setEditingAudit(audit); setShowForm(true); }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{audit.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {audit.auditor || 'Auditor TBD'} • {audit.area || 'Area TBD'}
                            </p>
                            {audit.duration && (
                              <p className="text-xs text-slate-500 mt-1">{audit.duration} hours</p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline">{audit.type.replace('_', ' ')}</Badge>
                            <StatusBadge status={getStatusRAG(audit.status)} label={audit.status.replace('_', ' ')} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No audits or inspections scheduled for this day</p>
                  )}
                </div>
              </div>
            )}
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
                  placeholder="Search by title or auditor..."
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
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || statusFilter !== 'ALL') && (
                  <button onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }} className="text-xs text-slate-600 hover:text-slate-900 underline">
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredAudits.length} of {audits.filter(a => filter === 'ALL' || a.type === filter).length} items
            </p>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Auditor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Area</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Outcome</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAudits.map((audit) => (
                  <tr 
                    key={audit.id} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => { setEditingAudit(audit); setShowForm(true); }}
                  >
                    <td className="px-6 py-4">
                      <Badge variant="outline">{audit.type.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{audit.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{audit.auditor || 'TBD'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(audit.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{audit.area || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={getStatusRAG(audit.status)} label={audit.status.replace('_', ' ')} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {audit.outcome ? (
                        <Badge variant={audit.outcome === 'PASS' ? 'default' : audit.outcome === 'FAIL' ? 'destructive' : 'secondary'}>
                          {audit.outcome}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {audit.actionItems || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAudits.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <ClipboardCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No audits or inspections found</p>
          </div>
        )}

        <AuditForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingAudit(undefined); }}
          audit={editingAudit}
          onSave={loadAudits}
        />
      </div>
    </Shell>
  )
}
