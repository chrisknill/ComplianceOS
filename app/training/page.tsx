'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { getTrainingRAG } from '@/lib/rag'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, Users, BookOpen, LayoutDashboard, CheckCircle, Clock, AlertCircle, GraduationCap, FileText } from 'lucide-react'
import { convertToCSV, downloadFile } from '@/lib/export'
import { TrainingForm } from '@/components/forms/TrainingForm'

interface User {
  id: string
  name: string | null
  email: string
}

interface Course {
  id: string
  title: string
  code: string | null
  mandatory: boolean
}

interface TrainingRecord {
  id: string
  userId: string
  courseId: string
  status: string
  dueDate: Date | null
  completed: Date | null
  score: number | null
}

type ViewMode = 'dashboard' | 'matrix' | 'list'

export default function TrainingPage() {
  const [users, setUsers] = useState<User[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [records, setRecords] = useState<TrainingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>()
  
  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [mandatoryFilter, setMandatoryFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('user')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadData = () => {
    setLoading(true)
    fetch('/api/training')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users)
        setCourses(data.courses)
        setRecords(data.records)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load training data:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  const getRecord = (userId: string, courseId: string) => {
    return records.find((r) => r.userId === userId && r.courseId === courseId)
  }

  // Flatten data for list view with filtering and sorting
  const getFlattenedRecords = () => {
    const flat = users.flatMap(user =>
      courses.map(course => {
        const record = getRecord(user.id, course.id)
        const rag = record ? getTrainingRAG(record.status, record.dueDate, record.completed) : 'none'
        
        return {
          userId: user.id,
          userName: user.name || 'Unknown',
          userEmail: user.email,
          courseId: course.id,
          courseTitle: course.title,
          courseCode: course.code,
          mandatory: course.mandatory,
          status: record?.status || 'NOT_STARTED',
          dueDate: record?.dueDate,
          completed: record?.completed,
          score: record?.score,
          rag,
          recordId: record?.id,
        }
      })
    )

    // Filter
    const filtered = flat
      .filter(item => {
        // Search
        if (searchTerm) {
          const search = searchTerm.toLowerCase()
          return (
            item.userName.toLowerCase().includes(search) ||
            item.userEmail.toLowerCase().includes(search) ||
            item.courseTitle.toLowerCase().includes(search) ||
            (item.courseCode?.toLowerCase() || '').includes(search)
          )
        }
        return true
      })
      .filter(item => {
        // Status filter
        if (statusFilter === 'ALL') return true
        if (statusFilter === 'COMPLETE') return item.status === 'COMPLETE'
        if (statusFilter === 'IN_PROGRESS') return item.status === 'IN_PROGRESS'
        if (statusFilter === 'NOT_STARTED') return item.status === 'NOT_STARTED'
        if (statusFilter === 'EXPIRED') return item.status === 'EXPIRED'
        if (statusFilter === 'OVERDUE') return item.rag === 'red'
        if (statusFilter === 'DUE_SOON') return item.rag === 'amber'
        return true
      })
      .filter(item => {
        // Mandatory filter
        if (mandatoryFilter === 'ALL') return true
        if (mandatoryFilter === 'MANDATORY') return item.mandatory
        if (mandatoryFilter === 'OPTIONAL') return !item.mandatory
        return true
      })

    // Sort
    const sorted = filtered.sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'user':
          aVal = a.userName.toLowerCase()
          bVal = b.userName.toLowerCase()
          break
        case 'course':
          aVal = a.courseTitle.toLowerCase()
          bVal = b.courseTitle.toLowerCase()
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'dueDate':
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999
          break
        case 'completed':
          aVal = a.completed ? new Date(a.completed).getTime() : 0
          bVal = b.completed ? new Date(b.completed).getTime() : 0
          break
        default:
          aVal = a.userName.toLowerCase()
          bVal = b.userName.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return sorted
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExportCSV = () => {
    const data = getFlattenedRecords()
    const csv = convertToCSV(data.map(item => ({
      'Employee': item.userName,
      'Email': item.userEmail,
      'Course': item.courseTitle,
      'Course Code': item.courseCode || '-',
      'Mandatory': item.mandatory ? 'Yes' : 'No',
      'Status': item.status.replace('_', ' '),
      'Due Date': item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-',
      'Completed': item.completed ? new Date(item.completed).toLocaleDateString() : '-',
      'Score': item.score || '-',
      'RAG': item.rag,
    })))
    downloadFile(csv, `training-matrix-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = async () => {
    const { exportTableToPDF } = await import('@/lib/pdf')
    const data = getFlattenedRecords()
    
    const headers = ['Employee', 'Course', 'Status', 'Due Date', 'Completed', 'Score']
    const rows = data.map(item => [
      item.userName,
      item.courseTitle,
      item.status.replace('_', ' '),
      item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-',
      item.completed ? new Date(item.completed).toLocaleDateString() : '-',
      item.score?.toString() || '-',
    ])
    
    exportTableToPDF('Training Matrix', headers, rows, `training-matrix-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Calculate statistics
  const allFlattened = getFlattenedRecords()
  const stats = {
    totalRecords: records.length,
    complete: records.filter(r => r.status === 'COMPLETE').length,
    inProgress: records.filter(r => r.status === 'IN_PROGRESS').length,
    notStarted: records.filter(r => r.status === 'NOT_STARTED').length,
    expired: records.filter(r => r.status === 'EXPIRED').length,
    overdue: allFlattened.filter(r => r.rag === 'red').length,
    dueSoon: allFlattened.filter(r => r.rag === 'amber').length,
    totalUsers: users.length,
    totalCourses: courses.length,
    mandatory: courses.filter(c => c.mandatory).length,
    optional: courses.filter(c => !c.mandatory).length,
    complianceRate: records.length > 0 ? Math.round((records.filter(r => r.status === 'COMPLETE').length / records.length) * 100) : 0,
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading training matrix...</p>
        </div>
      </Shell>
    )
  }

  const flattenedRecords = getFlattenedRecords()

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Training Matrix</h1>
            <p className="text-slate-600 mt-1">Employee training status and compliance</p>
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
                onClick={() => setViewMode('matrix')}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'matrix'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Matrix
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
            <Button onClick={() => { setEditingRecord(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Record
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
                    <p className="text-sm font-medium text-slate-600">Total Records</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalRecords}</p>
                  </div>
                  <BookOpen className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Complete</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.complete}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">{stats.complianceRate}% compliance</p>
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

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Training Status Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.complete}</span>
                      <span className="text-sm text-slate-500">
                        ({Math.round((stats.complete / stats.totalRecords) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-700">In Progress</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
                      <span className="text-sm text-slate-500">
                        ({Math.round((stats.inProgress / stats.totalRecords) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <span className="text-slate-700">Not Started</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.notStarted}</span>
                      <span className="text-sm text-slate-500">
                        ({Math.round((stats.notStarted / stats.totalRecords) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Expired</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.expired}</span>
                      <span className="text-sm text-slate-500">
                        ({Math.round((stats.expired / stats.totalRecords) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Training Compliance</span>
                    <span className="font-semibold">{stats.complianceRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${stats.complianceRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    ISO 9001:7.2 & ISO 14001:7.2 & ISO 45001:7.2 - Competence
                  </p>
                </div>
              </div>

              {/* Course Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Course Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Total Courses</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.totalCourses}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700">Mandatory</span>
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    </div>
                    <span className="text-2xl font-bold text-rose-600">{stats.mandatory}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700">Optional</span>
                      <Badge variant="outline" className="text-xs">Recommended</Badge>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{stats.optional}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <span className="text-slate-700">Total Employees</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.totalUsers}</span>
                  </div>
                </div>

                {/* Course Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setViewMode('matrix')}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <p className="text-sm font-medium text-blue-900">View Matrix</p>
                    <p className="text-xs text-blue-700 mt-1">Visual overview →</p>
                  </button>

                  <button
                    onClick={() => setViewMode('list')}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <p className="text-sm font-medium text-purple-900">View List</p>
                    <p className="text-xs text-purple-700 mt-1">Detailed view →</p>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Training Activities */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Recently Completed Training</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {records
                    .filter(r => r.status === 'COMPLETE' && r.completed)
                    .sort((a, b) => new Date(b.completed!).getTime() - new Date(a.completed!).getTime())
                    .slice(0, 5)
                    .map((record) => {
                      const user = users.find(u => u.id === record.userId)
                      const course = courses.find(c => c.id === record.courseId)
                      return (
                        <div
                          key={record.id}
                          className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <GraduationCap className="h-5 w-5 text-emerald-500" />
                            <div>
                              <p className="font-medium text-slate-900">{user?.name || 'Unknown'}</p>
                              <p className="text-sm text-slate-500">{course?.title || 'Unknown Course'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600">
                              {record.completed ? new Date(record.completed).toLocaleDateString() : '-'}
                            </p>
                            <StatusBadge status="green" label="Complete" />
                          </div>
                        </div>
                      )
                    })}
                  {records.filter(r => r.status === 'COMPLETE').length === 0 && (
                    <p className="text-center text-slate-500 py-4">No completed training yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overdue Training */}
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-rose-900">Overdue Training</h3>
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{stats.overdue}</p>
                <p className="text-sm text-rose-700 mb-4">Records require immediate attention</p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setViewMode('list')
                    setStatusFilter('OVERDUE')
                  }}
                >
                  View Overdue →
                </Button>
              </div>

              {/* Due Soon */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Due Soon</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.dueSoon}</p>
                <p className="text-sm text-amber-700 mb-4">Training due within 30 days</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    setViewMode('list')
                    setStatusFilter('DUE_SOON')
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
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search employee, course, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="COMPLETE">Complete</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="OVERDUE">Overdue (Red)</SelectItem>
                    <SelectItem value="DUE_SOON">Due Soon (Amber)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mandatory Filter */}
              <div>
                <Select value={mandatoryFilter} onValueChange={setMandatoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Courses</SelectItem>
                    <SelectItem value="MANDATORY">Mandatory Only</SelectItem>
                    <SelectItem value="OPTIONAL">Optional Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || statusFilter !== 'ALL' || mandatoryFilter !== 'ALL') && (
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
                {mandatoryFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    {mandatoryFilter}
                    <button onClick={() => setMandatoryFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('ALL')
                    setMandatoryFilter('ALL')
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Showing {flattenedRecords.length} of {users.length * courses.length} records
            </p>
          </div>
        )}

        {/* Matrix View */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase sticky left-0 bg-slate-50 z-10">
                    Employee
                  </th>
                  {courses.map((course) => (
                    <th key={course.id} className="px-4 py-3 text-center text-xs font-medium text-slate-700 uppercase min-w-[120px]">
                      <div>{course.title}</div>
                      {course.code && <div className="text-slate-500 text-[10px] mt-0.5">{course.code}</div>}
                      {course.mandatory && (
                        <div className="text-rose-600 text-[10px] mt-1">MANDATORY</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900 sticky left-0 bg-white z-10">
                      <div>{user.name || 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    {courses.map((course) => {
                      const record = getRecord(user.id, course.id)
                      if (!record) {
                        return (
                          <td 
                            key={course.id} 
                            className="px-4 py-4 text-center cursor-pointer hover:bg-slate-100"
                            onClick={() => {
                              setEditingRecord({ userId: user.id, courseId: course.id })
                              setShowForm(true)
                            }}
                          >
                            <span className="text-slate-400 text-xs">Add</span>
                          </td>
                        )
                      }
                      const rag = getTrainingRAG(record.status, record.dueDate, record.completed)
                      return (
                        <td 
                          key={course.id} 
                          className="px-4 py-4 text-center cursor-pointer hover:bg-slate-100"
                          onClick={() => {
                            setEditingRecord({ ...record, userId: user.id, courseId: course.id })
                            setShowForm(true)
                          }}
                        >
                          <StatusBadge status={rag} label={record.status.replace('_', ' ')} />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center gap-2">
                      Employee
                      <SortIcon field="user" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('course')}
                  >
                    <div className="flex items-center gap-2">
                      Course
                      <SortIcon field="course" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Mandatory
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
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center gap-2">
                      Due Date
                      <SortIcon field="dueDate" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('completed')}
                  >
                    <div className="flex items-center gap-2">
                      Completed
                      <SortIcon field="completed" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Evidence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {flattenedRecords.map((item, idx) => (
                  <tr 
                    key={idx} 
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => {
                      setEditingRecord({ ...item, id: item.recordId })
                      setShowForm(true)
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.userName}</div>
                      <div className="text-xs text-slate-500">{item.userEmail}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.courseTitle}</div>
                      {item.courseCode && <div className="text-xs text-slate-500">{item.courseCode}</div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.mandatory ? (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={item.rag} label={item.status.replace('_', ' ')} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.completed ? new Date(item.completed).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.documentUrl ? (
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-xs">View</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {flattenedRecords.length === 0 && viewMode === 'list' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No training records found</p>
          </div>
        )}

        {/* Legend (Matrix and List views only) */}
        {viewMode !== 'dashboard' && (
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Status Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <StatusBadge status="green" label="Complete" />
                <span className="text-sm text-slate-600">Training current</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="amber" label="Due Soon" />
                <span className="text-sm text-slate-600">Due within 30 days</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="red" label="Overdue" />
                <span className="text-sm text-slate-600">Expired or overdue</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              ISO 9001:7.2 & ISO 14001:7.2 - Competence  | ISO 45001:7.2 - OH&S Competence
            </p>
          </div>
        )}

        <TrainingForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingRecord(undefined); }}
          record={editingRecord}
          users={users}
          courses={courses}
          onSave={loadData}
        />
      </div>
    </Shell>
  )
}
