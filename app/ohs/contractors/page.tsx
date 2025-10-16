'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { 
  Users, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, Clock, AlertCircle, Star, TrendingUp
} from 'lucide-react'
import { ContractorForm } from '@/components/forms/ContractorForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { formatDate } from '@/lib/utils'

interface Contractor {
  id: string
  name: string
  contact: string | null
  email: string | null
  phone: string | null
  services: string | null
  preQualified: boolean
  preQualDate: Date | null
  preQualExpiry: Date | null
  inductionStatus: string
  inductionDate: Date | null
  safetyRating: number | null
  lastEvaluation: Date | null
  permitCount: number
  incidentCount: number
  status: string
}

type ViewMode = 'dashboard' | 'list' | 'grid'

export default function ContractorsPage() {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)
  const [editingContractor, setEditingContractor] = useState<Contractor | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE')
  const [inductionFilter, setInductionFilter] = useState<string>('ALL')
  const [servicesFilter, setServicesFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const loadContractors = () => {
    setLoading(true)
    fetch('/api/ohs/contractors')
      .then((res) => res.json())
      .then((data) => {
        setContractors(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setContractors([])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadContractors()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Get unique services for filter
  const uniqueServices = Array.from(new Set(
    contractors
      .map(c => c.services)
      .filter(s => s)
      .flatMap(s => s!.split(',').map(srv => srv.trim()))
  )).sort()

  // Filter and sort
  const filteredAndSortedContractors = contractors
    .filter(c => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          c.name.toLowerCase().includes(search) ||
          (c.contact?.toLowerCase() || '').includes(search) ||
          (c.services?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(c => statusFilter === 'ALL' || c.status === statusFilter)
    .filter(c => inductionFilter === 'ALL' || c.inductionStatus === inductionFilter)
    .filter(c => {
      if (servicesFilter === 'ALL') return true
      return c.services?.toLowerCase().includes(servicesFilter.toLowerCase())
    })
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
          break
        case 'safetyRating':
          aVal = a.safetyRating || 0
          bVal = b.safetyRating || 0
          break
        case 'permitCount':
          aVal = a.permitCount
          bVal = b.permitCount
          break
        case 'incidentCount':
          aVal = a.incidentCount
          bVal = b.incidentCount
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        default:
          aVal = a.name.toLowerCase()
          bVal = b.name.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredData = filteredAndSortedContractors

  // Calculate statistics
  const stats = {
    total: contractors.length,
    active: contractors.filter(c => c.status === 'ACTIVE').length,
    preQualified: contractors.filter(c => c.preQualified).length,
    inducted: contractors.filter(c => c.inductionStatus === 'COMPLETED').length,
    avgRating: contractors.length > 0 
      ? (contractors.reduce((sum, c) => sum + (c.safetyRating || 0), 0) / contractors.length).toFixed(1)
      : '0.0',
    totalPermits: contractors.reduce((sum, c) => sum + c.permitCount, 0),
    totalIncidents: contractors.reduce((sum, c) => sum + c.incidentCount, 0),
    expiringPreQual: contractors.filter(c => {
      if (!c.preQualExpiry) return false
      const expiry = new Date(c.preQualExpiry)
      const now = new Date()
      const diff = expiry.getTime() - now.getTime()
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000 // Next 30 days
    }).length,
  }

  const getContractorRAG = (contractor: Contractor): 'green' | 'amber' | 'red' => {
    if (contractor.status !== 'ACTIVE') return 'red'
    if (!contractor.preQualified) return 'red'
    if (contractor.inductionStatus !== 'COMPLETED') return 'amber'
    
    // Check pre-qual expiry
    if (contractor.preQualExpiry) {
      const expiry = new Date(contractor.preQualExpiry)
      const now = new Date()
      const diff = expiry.getTime() - now.getTime()
      
      if (diff < 0) return 'red' // Expired
      if (diff <= 30 * 24 * 60 * 60 * 1000) return 'amber' // Expires within 30 days
    }
    
    // Check safety rating
    if ((contractor.safetyRating || 0) < 3) return 'red'
    if ((contractor.safetyRating || 0) < 4) return 'amber'
    
    return 'green'
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredData.map(c => ({
      'Name': c.name,
      'Contact': c.contact || '-',
      'Services': c.services || '-',
      'Pre-Qualified': c.preQualified ? 'Yes' : 'No',
      'Pre-Qual Expiry': c.preQualExpiry ? formatDate(c.preQualExpiry) : '-',
      'Induction Status': c.inductionStatus,
      'Safety Rating': c.safetyRating || '-',
      'Permits': c.permitCount,
      'Incidents': c.incidentCount,
      'Status': c.status,
    })))
    downloadFile(csv, `contractors-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const handleExportPDF = () => {
    const headers = ['Name', 'Services', 'Pre-Qual', 'Induction', 'Rating', 'Permits', 'Incidents', 'Status']
    const rows = filteredData.map(c => [
      c.name,
      c.services || '-',
      c.preQualified ? 'Yes' : 'No',
      c.inductionStatus,
      c.safetyRating?.toString() || '-',
      c.permitCount.toString(),
      c.incidentCount.toString(),
      c.status,
    ])
    
    exportTableToPDF('Contractor Management', headers, rows, `contractors-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading contractors...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Contractor Management</h1>
            <p className="text-slate-600 mt-1">Pre-qualification, inductions, and safety performance</p>
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
            <Button onClick={() => { setEditingContractor(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
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
                    <p className="text-sm font-medium text-slate-600">Total Contractors</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Pre-Qualified</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.preQualified}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Out of {stats.active} active</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Inducted</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inducted}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Site induction completed</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Avg Safety Rating</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.avgRating}</p>
                  </div>
                  <Star className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Out of 5.0</p>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Work Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Total Permits Issued</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.totalPermits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Total Incidents</span>
                    <span className={`text-2xl font-bold ${stats.totalIncidents > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {stats.totalIncidents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Incident Rate</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {stats.totalPermits > 0 ? ((stats.totalIncidents / stats.totalPermits) * 100).toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Compliance Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700">Fully Compliant</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">
                      {contractors.filter(c => getContractorRAG(c) === 'green').length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <span className="text-slate-700">Action Required</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">
                      {contractors.filter(c => getContractorRAG(c) === 'amber').length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Non-Compliant</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">
                      {contractors.filter(c => getContractorRAG(c) === 'red').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Pre-Qual Expiring Soon</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.expiringPreQual}</p>
                <p className="text-sm text-amber-700 mb-4">Contractors expiring in next 30 days</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => setViewMode('list')}
                >
                  Review Expiring →
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Pending Inductions</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {contractors.filter(c => c.inductionStatus === 'PENDING').length}
                </p>
                <p className="text-sm text-blue-700 mb-4">Contractors awaiting site induction</p>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-700 hover:bg-blue-100"
                  onClick={() => {
                    setInductionFilter('PENDING')
                    setViewMode('list')
                  }}
                >
                  Schedule Inductions →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name, contact, or services..."
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
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    <SelectItem value="TERMINATED">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={inductionFilter} onValueChange={setInductionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Inductions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Inductions</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="EXPIRED">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={servicesFilter} onValueChange={setServicesFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Services</SelectItem>
                    {uniqueServices.map(service => (
                      <SelectItem key={service} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                {(searchTerm || statusFilter !== 'ALL' || inductionFilter !== 'ALL' || servicesFilter !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('ALL')
                      setInductionFilter('ALL')
                      setServicesFilter('ALL')
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 underline whitespace-nowrap"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredData.length} of {contractors.length} contractors
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((contractor) => {
              const rag = getContractorRAG(contractor)
              return (
                <div
                  key={contractor.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => { setEditingContractor(contractor); setShowForm(true); }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Users className={`h-8 w-8 ${
                      rag === 'green' ? 'text-emerald-500' :
                      rag === 'amber' ? 'text-amber-500' : 'text-rose-500'
                    }`} />
                    <StatusBadge status={rag} label={contractor.status} />
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{contractor.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{contractor.contact || 'No contact'}</p>

                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <p>
                      <span className="font-medium">Services:</span> {contractor.services || 'N/A'}
                    </p>
                    <p>
                      <span className="font-medium">Pre-Qualified:</span>{' '}
                      {contractor.preQualified ? (
                        <span className="text-emerald-600">Yes</span>
                      ) : (
                        <span className="text-rose-600">No</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Induction:</span>{' '}
                      <Badge variant={contractor.inductionStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                        {contractor.inductionStatus}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Safety Rating:</span>{' '}
                      <span className="text-amber-500">
                        {'★'.repeat(contractor.safetyRating || 0)}
                        <span className="text-slate-300">{'★'.repeat(5 - (contractor.safetyRating || 0))}</span>
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 pt-4 border-t border-slate-200">
                    <span>{contractor.permitCount} permits</span>
                    <span className={contractor.incidentCount > 0 ? 'text-rose-600 font-semibold' : ''}>
                      {contractor.incidentCount} incidents
                    </span>
                  </div>
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Contractor
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Services
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Pre-Qual
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Pre-Qual Expiry
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Induction
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('safetyRating')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Rating
                      <SortIcon field="safetyRating" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('permitCount')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Permits
                      <SortIcon field="permitCount" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('incidentCount')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Incidents
                      <SortIcon field="incidentCount" />
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
                {filteredData.map((contractor) => {
                  const rag = getContractorRAG(contractor)
                  return (
                    <tr 
                      key={contractor.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingContractor(contractor); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">{contractor.name}</p>
                            <p className="text-sm text-slate-500">{contractor.contact || 'No contact'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{contractor.services || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        {contractor.preQualified ? (
                          <Badge variant="default">Qualified</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">
                        {contractor.preQualExpiry ? formatDate(contractor.preQualExpiry) : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={contractor.inductionStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                          {contractor.inductionStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-amber-500">{'★'.repeat(contractor.safetyRating || 0)}</span>
                          <span className="text-slate-300">{'★'.repeat(5 - (contractor.safetyRating || 0))}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">{contractor.permitCount}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={contractor.incidentCount > 0 ? 'text-rose-600 font-semibold' : 'text-slate-400'}>
                          {contractor.incidentCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={rag} label={contractor.status} />
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
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No contractors found</p>
          </div>
        )}

        <ContractorForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingContractor(undefined); }}
          contractor={editingContractor}
          onSave={loadContractors}
        />
      </div>
    </Shell>
  )
}
