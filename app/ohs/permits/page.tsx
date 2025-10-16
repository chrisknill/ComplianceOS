'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { 
  FileCheck, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, Clock, AlertCircle, FileSignature, XCircle
} from 'lucide-react'
import { PermitForm } from '@/components/forms/PermitForm'
import { ApprovalWorkflow } from '@/components/forms/ApprovalWorkflow'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

interface Permit {
  id: string
  title: string
  type: string
  location: string | null
  validFrom: Date
  validUntil: Date
  issuedBy: string | null
  approvedBy: string | null
  clientApprover: string | null
  contractor: string | null
  status: string
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function PermitsPage() {
  const [permits, setPermits] = useState<Permit[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingPermit, setEditingPermit] = useState<Permit | undefined>()
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false)
  const [approvalPermit, setApprovalPermit] = useState<Permit | null>(null)

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('validFrom')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const loadPermits = () => {
    setLoading(true)
    fetch('/api/ohs/permits')
      .then((res) => res.json())
      .then((data) => {
        setPermits(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setPermits([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadPermits()
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
  const filteredAndSortedPermits = permits
    .filter(p => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          p.title.toLowerCase().includes(search) ||
          (p.location?.toLowerCase() || '').includes(search) ||
          (p.contractor?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(p => statusFilter === 'ALL' || p.status === statusFilter)
    .filter(p => typeFilter === 'ALL' || p.type === typeFilter)
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
        case 'validFrom':
          aVal = new Date(a.validFrom).getTime()
          bVal = new Date(b.validFrom).getTime()
          break
        case 'validUntil':
          aVal = new Date(a.validUntil).getTime()
          bVal = new Date(b.validUntil).getTime()
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = new Date(a.validFrom).getTime()
          bVal = new Date(b.validFrom).getTime()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedPermits

  // Calculate statistics
  const stats = {
    total: permits.length,
    active: permits.filter(p => p.status === 'ACTIVE').length,
    pending: permits.filter(p => p.status === 'PENDING').length,
    approved: permits.filter(p => p.status === 'APPROVED').length,
    expired: permits.filter(p => p.status === 'EXPIRED').length,
    cancelled: permits.filter(p => p.status === 'CANCELLED').length,
    expiringToday: permits.filter(p => {
      const until = new Date(p.validUntil)
      const today = new Date()
      return until.toDateString() === today.toDateString()
    }).length,
    expiringSoon: permits.filter(p => {
      const until = new Date(p.validUntil)
      const now = new Date()
      const diff = until.getTime() - now.getTime()
      return diff > 0 && diff <= 7 * 24 * 60 * 60 * 1000 // Next 7 days
    }).length,
  }

  const getPermitRAG = (permit: Permit): 'green' | 'amber' | 'red' => {
    if (permit.status === 'CANCELLED' || permit.status === 'EXPIRED') return 'red'
    if (permit.status === 'PENDING') return 'amber'
    
    // Check expiry
    const until = new Date(permit.validUntil)
    const now = new Date()
    const diff = until.getTime() - now.getTime()
    
    if (diff < 0) return 'red' // Expired
    if (diff <= 24 * 60 * 60 * 1000) return 'red' // Expires within 24 hours
    if (diff <= 7 * 24 * 60 * 60 * 1000) return 'amber' // Expires within 7 days
    return 'green' // Valid
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(p => ({
      'Title': p.title,
      'Type': p.type.replace('_', ' '),
      'Location': p.location || '-',
      'Contractor': p.contractor || '-',
      'Valid From': formatDate(p.validFrom),
      'Valid Until': formatDate(p.validUntil),
      'Issued By': p.issuedBy || '-',
      'Approved By': p.approvedBy || '-',
      'Client Approver': p.clientApprover || '-',
      'Status': p.status,
    })))
    downloadFile(csv, `permits-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Title', 'Type', 'Location', 'Valid From', 'Valid Until', 'Status']
    const rows = filteredData.map(p => [
      p.title,
      p.type.replace('_', ' '),
      p.location || '-',
      formatDate(p.validFrom),
      formatDate(p.validUntil),
      p.status,
    ])
    
    exportTableToPDF('Permits to Work', headers, rows, `permits-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading permits...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Permits to Work</h1>
            <p className="text-slate-600 mt-1">High-risk work authorization and control</p>
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
            <Button onClick={() => { setEditingPermit(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Issue Permit
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
                    <p className="text-sm font-medium text-slate-600">Total Permits</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <FileCheck className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Active</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Currently valid</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pending Approval</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.pending}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Awaiting sign-off</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Expiring Soon</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.expiringSoon}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Next 7 days</p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Permit Status Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-700">Pending Approval</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.pending}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-700">Approved (Not Active)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.approved}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-slate-700">Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.active}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                    <span className="text-slate-700">Expired/Cancelled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-900">{stats.expired + stats.cancelled}</span>
                    <span className="text-sm text-slate-500">
                      ({stats.total > 0 ? Math.round(((stats.expired + stats.cancelled) / stats.total) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Pending Approval</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.pending}</p>
                <p className="text-sm text-amber-700 mb-4">Permits awaiting sign-off</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    setStatusFilter('PENDING')
                    setViewMode('list')
                  }}
                >
                  Review & Approve →
                </Button>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-rose-900">Expiring Soon</h3>
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{stats.expiringSoon}</p>
                <p className="text-sm text-rose-700 mb-4">Permits expiring in next 7 days</p>
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  View Expiring →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, location, or contractor..."
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
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="HOT_WORK">Hot Work</SelectItem>
                    <SelectItem value="CONFINED_SPACE">Confined Space</SelectItem>
                    <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                    <SelectItem value="HEIGHT_WORK">Work at Height</SelectItem>
                    <SelectItem value="EXCAVATION">Excavation</SelectItem>
                    <SelectItem value="LIFTING">Lifting Operations</SelectItem>
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
              Showing {filteredData.length} of {permits.length} permits
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((permit) => {
              const rag = getPermitRAG(permit)
              return (
                <div
                  key={permit.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingPermit(permit); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileCheck className={`h-8 w-8 ${
                      rag === 'green' ? 'text-emerald-500' :
                      rag === 'amber' ? 'text-amber-500' : 'text-rose-500'
                    }`} />
                    <StatusBadge status={rag} label={permit.status.replace('_', ' ')} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{permit.title}</h3>
                  
                  <Badge variant="outline" className="mb-3">{permit.type.replace('_', ' ')}</Badge>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Location:</span> {permit.location || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Contractor:</span> {permit.contractor || 'Internal'}
                    </p>
                    <p>
                      <span className="font-medium">Valid:</span> {formatDate(permit.validFrom)} - {formatDate(permit.validUntil)}
                    </p>
                    {permit.approvedBy && (
                      <p className="text-xs text-emerald-600">
                        ✓ Internal: {permit.approvedBy}
                      </p>
                    )}
                    {permit.clientApprover && (
                      <p className="text-xs text-blue-600">
                        ✓ Client: {permit.clientApprover}
                      </p>
                    )}
                  </div>

                  {/* Approval Button */}
                  {(permit.status === 'PENDING' || permit.status === 'APPROVED') && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          setApprovalPermit(permit)
                          setShowApprovalWorkflow(true)
                        }}
                      >
                        <FileSignature className="h-4 w-4 mr-2" />
                        Approvals
                      </Button>
                    </div>
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
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Contractor
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('validFrom')}
                  >
                    <div className="flex items-center gap-2">
                      Valid From
                      <SortIcon field="validFrom" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('validUntil')}
                  >
                    <div className="flex items-center gap-2">
                      Valid Until
                      <SortIcon field="validUntil" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Approvals
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
                {filteredData.map((permit) => {
                  const rag = getPermitRAG(permit)
                  return (
                    <tr 
                      key={permit.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingPermit(permit); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileCheck className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{permit.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{permit.type.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{permit.location || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{permit.contractor || 'Internal'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(permit.validFrom)}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(permit.validUntil)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          {permit.approvedBy ? (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Internal</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-slate-400">
                              <XCircle className="h-3 w-3" />
                              <span>Internal</span>
                            </div>
                          )}
                          {permit.clientApprover ? (
                            <div className="flex items-center gap-1 text-blue-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Client</span>
                            </div>
                          ) : permit.status !== 'PENDING' ? (
                            <div className="flex items-center gap-1 text-slate-400">
                              <XCircle className="h-3 w-3" />
                              <span>Client</span>
                            </div>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <StatusBadge status={rag} label={permit.status.replace('_', ' ')} />
                          {(permit.status === 'PENDING' || permit.status === 'APPROVED') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setApprovalPermit(permit)
                                setShowApprovalWorkflow(true)
                              }}
                              className="h-7 px-2"
                              title="Manage Approvals"
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

        {filteredData.length === 0 && viewMode !== 'dashboard' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No permits found</p>
          </div>
        )}

        <PermitForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingPermit(undefined); }}
          permit={editingPermit}
          onSave={loadPermits}
        />

        {approvalPermit && (
          <ApprovalWorkflow
            open={showApprovalWorkflow}
            onClose={() => { setShowApprovalWorkflow(false); setApprovalPermit(null); }}
            documentId={approvalPermit.id}
            documentTitle={`Permit: ${approvalPermit.title}`}
            currentApprovals={[]}
          />
        )}
      </div>
    </Shell>
  )
}
