'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { CheckSquare, Plus, Download, Search, FileSignature, LayoutDashboard, AlertCircle, Clock, TrendingUp, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { formatDate } from '@/lib/utils'
import { ActionForm } from '@/components/forms/ActionForm'
import { ApprovalWorkflow } from '@/components/forms/ApprovalWorkflow'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportActionsToPDF } from '@/lib/pdf'

type ViewMode = 'dashboard' | 'list' | 'grid' | 'board'

export default function ActionsPage() {
  const [actions, setActions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingAction, setEditingAction] = useState<any>()
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false)
  const [approvalAction, setApprovalAction] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('dueDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadActions = () => {
    setLoading(true)
    fetch('/api/ohs/actions')
      .then((res) => res.json())
      .then((data) => {
        setActions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setActions([])
        setLoading(false)
      })
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  useEffect(() => {
    loadActions()
  }, [])

  const handleExport = () => {
    const csv = convertToCSV(actions.map(a => ({
      Type: a.type,
      Title: a.title,
      Owner: a.owner || '-',
      'Due Date': a.dueDate ? formatDate(a.dueDate) : '-',
      Status: a.status,
    })))
    downloadFile(csv, `actions-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading actions...</p>
        </div>
      </Shell>
    )
  }

  // Use actual data or mock fallback
  const displayActions = actions.length > 0 ? actions : [
    {
      id: '1',
      type: 'CORRECTIVE',
      title: 'Install additional convex mirrors at warehouse intersections',
      owner: 'Warehouse Supervisor',
      dueDate: '2025-11-01',
      status: 'IN_PROGRESS',
      details: 'Response to near-miss INC-2025-001',
    },
    {
      id: '2',
      type: 'PREVENTIVE',
      title: 'Update blade change SOP and conduct toolbox talk',
      owner: 'Production Manager',
      dueDate: '2025-10-25',
      status: 'OPEN',
      details: 'Prevent recurrence of finger cut incident',
    },
    {
      id: '3',
      type: 'IMPROVEMENT',
      title: 'Implement near-miss reporting mobile app',
      owner: 'OH&S Manager',
      dueDate: '2025-12-31',
      status: 'OPEN',
      details: 'Improve worker participation in safety',
    },
  ]

  // Filter and sort actions
  const filteredActions = displayActions
    .filter(a => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return a.title.toLowerCase().includes(search) || (a.owner?.toLowerCase() || '').includes(search)
      }
      return true
    })
    .filter(a => statusFilter === 'ALL' || a.status === statusFilter)
    .filter(a => typeFilter === 'ALL' || a.type === typeFilter)
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
        case 'owner':
          aVal = (a.owner || '').toLowerCase()
          bVal = (b.owner || '').toLowerCase()
          break
        case 'dueDate':
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0
          bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  // Calculate statistics
  const stats = {
    total: displayActions.length,
    open: displayActions.filter(a => a.status === 'OPEN').length,
    inProgress: displayActions.filter(a => a.status === 'IN_PROGRESS').length,
    completed: displayActions.filter(a => a.status === 'COMPLETED').length,
    overdue: displayActions.filter(a => {
      if (!a.dueDate || a.status === 'COMPLETED') return false
      return new Date(a.dueDate) < new Date()
    }).length,
    corrective: displayActions.filter(a => a.type === 'CORRECTIVE').length,
    preventive: displayActions.filter(a => a.type === 'PREVENTIVE').length,
    pendingApproval: displayActions.filter(a => a.status === 'PENDING_APPROVAL').length,
  }

  const getActionRAG = (action: any): 'green' | 'amber' | 'red' => {
    if (action.status === 'COMPLETED') return 'green'
    if (action.status === 'PENDING_APPROVAL') return 'amber'
    if (!action.dueDate) return 'amber'
    
    const dueDate = new Date(action.dueDate)
    const now = new Date()
    const diff = dueDate.getTime() - now.getTime()
    
    if (diff < 0) return 'red' // Overdue
    if (diff <= 7 * 24 * 60 * 60 * 1000) return 'amber' // Due within 7 days
    return 'green'
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Actions (CAPA)</h1>
            <p className="text-slate-600 mt-1">Corrective, Preventive, and Improvement Actions</p>
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
            {viewMode !== 'dashboard' && (
              <>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline" onClick={() => exportActionsToPDF(filteredActions)}>
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </>
            )}
            <Button onClick={() => { setEditingAction(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Action
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
                    <p className="text-sm font-medium text-slate-600">Total Actions</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <CheckSquare className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Currently being worked on</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.completed}</p>
                  </div>
                  <CheckSquare className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
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
                <p className="text-sm text-slate-500 mt-2">Require immediate attention</p>
              </div>
            </div>

            {/* Action Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Action Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Corrective Actions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.corrective}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.corrective / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-700">Preventive Actions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.preventive}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.preventive / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">Containment Actions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">
                        {displayActions.filter(a => a.type === 'CONTAINMENT').length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Improvement Actions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">
                        {displayActions.filter(a => a.type === 'IMPROVEMENT').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Action Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      <span className="text-slate-700">Open</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.open}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-700">In Progress</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.inProgress}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">Pending Approval</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.pendingApproval}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Completed</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.completed}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Overdue</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{stats.overdue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {stats.overdue > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-rose-600" />
                    <h3 className="text-lg font-semibold text-rose-900">Overdue Actions</h3>
                  </div>
                  <p className="text-3xl font-bold text-rose-600 mb-2">{stats.overdue}</p>
                  <p className="text-sm text-rose-700 mb-4">Actions past their due date</p>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setStatusFilter('ALL')
                      setViewMode('list')
                    }}
                  >
                    Review Overdue →
                  </Button>
                </div>
              )}

              {stats.pendingApproval > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-amber-600" />
                    <h3 className="text-lg font-semibold text-amber-900">Pending Approval</h3>
                  </div>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{stats.pendingApproval}</p>
                  <p className="text-sm text-amber-700 mb-4">Actions awaiting approval</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="border-amber-600 text-amber-700 hover:bg-amber-100"
                    onClick={() => {
                      setStatusFilter('PENDING_APPROVAL')
                      setViewMode('list')
                    }}
                  >
                    Review & Approve →
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter Section (List/Grid View Only) */}
        {(viewMode === 'list' || viewMode === 'grid') && (
          <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                <SelectItem value="IMPROVEMENT">Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-slate-500 mt-3">Showing {filteredActions.length} of {displayActions.length} actions</p>
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
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Action
                      <SortIcon field="title" />
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
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('owner')}
                  >
                    <div className="flex items-center gap-2">
                      Owner
                      <SortIcon field="owner" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('dueDate')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Due Date
                      <SortIcon field="dueDate" />
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
                {filteredActions.map((action) => {
                  const rag = getActionRAG(action)
                  return (
                    <tr 
                      key={action.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingAction(action); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <CheckSquare className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-900">{action.title}</p>
                            {action.details && (
                              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{action.details}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          action.type === 'CORRECTIVE' ? 'destructive' :
                          action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                        }>
                          {action.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{action.owner || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">
                        {action.dueDate ? formatDate(action.dueDate) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <StatusBadge status={rag} label={action.status.replace('_', ' ')} />
                          {(action.status === 'PENDING_APPROVAL' || action.status === 'COMPLETED') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setApprovalAction(action)
                                setShowApprovalWorkflow(true)
                              }}
                              className="h-7 px-2"
                              title="View Approvals"
                            >
                              <FileSignature className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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
            {filteredActions.map((action) => {
              const rag = getActionRAG(action)
              return (
                <div
                  key={action.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingAction(action); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant={
                      action.type === 'CORRECTIVE' ? 'destructive' :
                      action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                    }>
                      {action.type}
                    </Badge>
                    <StatusBadge status={rag} label={action.status.replace('_', ' ')} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{action.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{action.details}</p>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Owner:</span>
                      <span className="font-medium">{action.owner || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Due:</span>
                      <span className="font-medium">{action.dueDate ? formatDate(action.dueDate) : 'No date'}</span>
                    </div>
                  </div>

                  {(action.status === 'PENDING_APPROVAL' || action.status === 'COMPLETED') && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          setApprovalAction(action)
                          setShowApprovalWorkflow(true)
                        }}
                      >
                        <FileSignature className="h-4 w-4 mr-2" />
                        View Approvals
                      </Button>
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
                      {filteredActions.filter(a => a.status === 'OPEN').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredActions
                      .filter(a => a.status === 'OPEN')
                      .map(action => {
                        const rag = getActionRAG(action)
                        return (
                          <div
                            key={action.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-slate-400"
                            onClick={() => { setEditingAction(action); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={
                                action.type === 'CORRECTIVE' ? 'destructive' :
                                action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                              } className="text-xs">
                                {action.type}
                              </Badge>
                              <StatusBadge status={rag} label="" />
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{action.title}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{action.owner || 'Unassigned'}</span>
                              {action.dueDate && (
                                <span>{formatDate(action.dueDate)}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* IN PROGRESS Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">In Progress</h3>
                    <Badge variant="secondary">
                      {filteredActions.filter(a => a.status === 'IN_PROGRESS').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredActions
                      .filter(a => a.status === 'IN_PROGRESS')
                      .map(action => {
                        const rag = getActionRAG(action)
                        return (
                          <div
                            key={action.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500"
                            onClick={() => { setEditingAction(action); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={
                                action.type === 'CORRECTIVE' ? 'destructive' :
                                action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                              } className="text-xs">
                                {action.type}
                              </Badge>
                              <StatusBadge status={rag} label="" />
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{action.title}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{action.owner || 'Unassigned'}</span>
                              {action.dueDate && (
                                <span>{formatDate(action.dueDate)}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* BLOCKED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Blocked</h3>
                    <Badge variant="secondary">
                      {filteredActions.filter(a => a.status === 'BLOCKED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredActions
                      .filter(a => a.status === 'BLOCKED')
                      .map(action => {
                        const rag = getActionRAG(action)
                        return (
                          <div
                            key={action.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-rose-500"
                            onClick={() => { setEditingAction(action); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={
                                action.type === 'CORRECTIVE' ? 'destructive' :
                                action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                              } className="text-xs">
                                {action.type}
                              </Badge>
                              <StatusBadge status={rag} label="" />
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{action.title}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{action.owner || 'Unassigned'}</span>
                              {action.dueDate && (
                                <span>{formatDate(action.dueDate)}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* PENDING APPROVAL Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Pending Approval</h3>
                    <Badge variant="secondary">
                      {filteredActions.filter(a => a.status === 'PENDING_APPROVAL').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredActions
                      .filter(a => a.status === 'PENDING_APPROVAL')
                      .map(action => {
                        const rag = getActionRAG(action)
                        return (
                          <div
                            key={action.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-amber-500"
                            onClick={() => { setEditingAction(action); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={
                                action.type === 'CORRECTIVE' ? 'destructive' :
                                action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                              } className="text-xs">
                                {action.type}
                              </Badge>
                              <StatusBadge status={rag} label="" />
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{action.title}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{action.owner || 'Unassigned'}</span>
                              {action.dueDate && (
                                <span>{formatDate(action.dueDate)}</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>

              {/* COMPLETED Column */}
              <div className="flex-shrink-0 w-80">
                <div className="bg-slate-100 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Completed</h3>
                    <Badge variant="secondary">
                      {filteredActions.filter(a => a.status === 'COMPLETED').length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {filteredActions
                      .filter(a => a.status === 'COMPLETED')
                      .map(action => {
                        const rag = getActionRAG(action)
                        return (
                          <div
                            key={action.id}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-emerald-500 opacity-75"
                            onClick={() => { setEditingAction(action); setShowForm(true); }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant={
                                action.type === 'CORRECTIVE' ? 'destructive' :
                                action.type === 'PREVENTIVE' ? 'default' : 'secondary'
                              } className="text-xs">
                                {action.type}
                              </Badge>
                              <StatusBadge status={rag} label="" />
                            </div>
                            <h4 className="font-medium text-slate-900 text-sm mb-2 line-clamp-2">{action.title}</h4>
                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <span>{action.owner || 'Unassigned'}</span>
                              {action.dueDate && (
                                <span>{formatDate(action.dueDate)}</span>
                              )}
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

        <ActionForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingAction(undefined); }}
          action={editingAction}
          onSave={loadActions}
        />

        {approvalAction && (
          <ApprovalWorkflow
            open={showApprovalWorkflow}
            onClose={() => { setShowApprovalWorkflow(false); setApprovalAction(null); }}
            documentId={approvalAction.id}
            documentTitle={`Action: ${approvalAction.title}`}
            currentApprovals={[]}
          />
        )}
      </div>
    </Shell>
  )
}

