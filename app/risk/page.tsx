'use client'

import { useEffect, useState } from 'react'
import { Shell } from '@/components/layout/Shell'
import { RiskMatrix } from '@/components/risk/RiskMatrix'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { getRiskRAG } from '@/lib/rag'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, Plus, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown, 
  LayoutDashboard, AlertTriangle, CheckCircle, Clock, Shield,
  FileSignature, TrendingUp
} from 'lucide-react'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { RiskForm } from '@/components/forms/RiskForm'
import { ApprovalWorkflow } from '@/components/forms/ApprovalWorkflow'

interface Risk {
  id: string
  title: string
  category: string
  context: string | null
  likelihood: number
  severity: number
  controls: string
  owner: string | null
  reviewDate: Date | null
  status: string
  isoRefs: string
  createdAt: Date
  updatedAt: Date
}

type ViewMode = 'dashboard' | 'matrix' | 'list'

export default function RiskPage() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editingRisk, setEditingRisk] = useState<Risk | undefined>()
  const [showApprovalWorkflow, setShowApprovalWorkflow] = useState(false)
  const [approvalRisk, setApprovalRisk] = useState<Risk | null>(null)
  
  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [riskLevelFilter, setRiskLevelFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('title')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Matrix cell selection
  const [selectedCell, setSelectedCell] = useState<{ l: number; s: number } | null>(null)

  const loadRisks = () => {
    setLoading(true)
    fetch('/api/risks')
      .then((res) => res.json())
      .then((data) => {
        setRisks(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load risks:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadRisks()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleCellClick = (likelihood: number, severity: number) => {
    if (selectedCell?.l === likelihood && selectedCell?.s === severity) {
      setSelectedCell(null)
    } else {
      setSelectedCell({ l: likelihood, s: severity })
      setViewMode('list')
    }
  }

  // Filter and sort risks
  const filteredAndSortedRisks = risks
    .filter(r => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          r.title.toLowerCase().includes(search) ||
          (r.context?.toLowerCase() || '').includes(search) ||
          (r.owner?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(r => categoryFilter === 'ALL' || r.category === categoryFilter)
    .filter(r => statusFilter === 'ALL' || r.status === statusFilter)
    .filter(r => {
      if (riskLevelFilter === 'ALL') return true
      const score = r.likelihood * r.severity
      if (riskLevelFilter === 'CRITICAL') return score >= 16
      if (riskLevelFilter === 'HIGH') return score >= 11 && score < 16
      if (riskLevelFilter === 'MEDIUM') return score >= 6 && score < 11
      if (riskLevelFilter === 'LOW') return score < 6
      return true
    })
    .filter(r => {
      if (selectedCell) {
        return r.likelihood === selectedCell.l && r.severity === selectedCell.s
      }
      return true
    })
    .sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortField) {
        case 'title':
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case 'category':
          aVal = a.category
          bVal = b.category
          break
        case 'score':
          aVal = a.likelihood * a.severity
          bVal = b.likelihood * b.severity
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'reviewDate':
          aVal = a.reviewDate ? new Date(a.reviewDate).getTime() : 9999999999999
          bVal = b.reviewDate ? new Date(b.reviewDate).getTime() : 9999999999999
          break
        default:
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  // Calculate statistics
  const stats = {
    total: risks.length,
    open: risks.filter(r => r.status === 'OPEN').length,
    treated: risks.filter(r => r.status === 'TREATED').length,
    closed: risks.filter(r => r.status === 'CLOSED').length,
    critical: risks.filter(r => (r.likelihood * r.severity) >= 16).length,
    high: risks.filter(r => {
      const score = r.likelihood * r.severity
      return score >= 11 && score < 16
    }).length,
    medium: risks.filter(r => {
      const score = r.likelihood * r.severity
      return score >= 6 && score < 11
    }).length,
    low: risks.filter(r => (r.likelihood * r.severity) < 6).length,
    quality: risks.filter(r => r.category === 'QUALITY').length,
    environmental: risks.filter(r => r.category === 'ENVIRONMENTAL').length,
    hse: risks.filter(r => r.category === 'HSE').length,
    dueReview: risks.filter(r => {
      if (!r.reviewDate) return false
      const due = new Date(r.reviewDate)
      const now = new Date()
      const diff = due.getTime() - now.getTime()
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
    }).length,
  }

  const handleExportCSV = () => {
    const csv = convertToCSV(filteredAndSortedRisks.map(r => ({
      'Title': r.title,
      'Category': r.category,
      'Context': r.context || '-',
      'Likelihood': r.likelihood,
      'Severity': r.severity,
      'Score': r.likelihood * r.severity,
      'Risk Level': getRiskRAG(r.likelihood * r.severity),
      'Owner': r.owner || '-',
      'Status': r.status,
      'Review Date': r.reviewDate ? formatDate(r.reviewDate) : '-',
    })))
    downloadFile(csv, `risk-register-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  const getScoreColor = (score: number): string => {
    if (score >= 16) return 'bg-rose-100 text-rose-700 border-rose-300' // Critical
    if (score >= 11) return 'bg-orange-100 text-orange-700 border-orange-300' // High
    if (score >= 6) return 'bg-amber-100 text-amber-700 border-amber-300' // Medium
    return 'bg-emerald-100 text-emerald-700 border-emerald-300' // Low
  }

  const handleExportPDF = () => {
    const headers = ['Title', 'Category', 'L×S', 'Score', 'Level', 'Owner', 'Status']
    const rows = filteredAndSortedRisks.map(r => [
      r.title,
      r.category,
      `${r.likelihood}×${r.severity}`,
      (r.likelihood * r.severity).toString(),
      getRiskRAG(r.likelihood * r.severity),
      r.owner || '-',
      r.status,
    ])
    
    exportTableToPDF('Risk Register', headers, rows, `risk-register-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 text-slate-400" />
    return sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading risks...</p>
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
            <h1 className="text-3xl font-bold text-slate-900">Risk Assessments</h1>
            <p className="text-slate-600 mt-1">Risk register and assessment matrix</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => { setViewMode('dashboard'); setSelectedCell(null); }}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === 'dashboard'
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => { setViewMode('matrix'); setSelectedCell(null); }}
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
            <Button onClick={() => { setEditingRisk(undefined); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Risk
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
                    <p className="text-sm font-medium text-slate-600">Total Risks</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.total}</p>
                  </div>
                  <Shield className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Critical</p>
                    <p className="text-3xl font-bold text-rose-600 mt-2">{stats.critical}</p>
                  </div>
                  <AlertTriangle className="h-10 w-10 text-rose-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Score ≥ 16</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">High Risk</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{stats.high}</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-orange-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Score 11-15</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Due Review</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.dueReview}</p>
                  </div>
                  <Clock className="h-10 w-10 text-amber-500" />
                </div>
                <p className="text-sm text-slate-500 mt-2">Next 30 days</p>
              </div>
            </div>

            {/* Risk Level Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Level Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                      <span className="text-slate-700">Critical (16-25)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.critical}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.critical / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-slate-700">High (11-15)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.high}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                      <span className="text-slate-700">Medium (6-10)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.medium}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.medium / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      <span className="text-slate-700">Low (1-5)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-slate-900">{stats.low}</span>
                      <span className="text-sm text-slate-500">
                        ({stats.total > 0 ? Math.round((stats.low / stats.total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Acceptable Risk Level</span>
                    <span className="font-semibold">
                      {stats.total > 0 ? Math.round(((stats.low + stats.medium) / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all"
                      style={{ width: `${stats.total > 0 ? ((stats.low + stats.medium) / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    ISO 9001:6.1 & ISO 14001:6.1 & ISO 45001:6.1 - Risk Management
                  </p>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Categories</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => { setCategoryFilter('QUALITY'); setViewMode('list'); }}
                    className="w-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Quality Risks</p>
                        <p className="text-xs text-blue-700 mt-1">ISO 9001 related</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-900">{stats.quality}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setCategoryFilter('ENVIRONMENTAL'); setViewMode('list'); }}
                    className="w-full bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-emerald-900">Environmental Risks</p>
                        <p className="text-xs text-emerald-700 mt-1">ISO 14001 related</p>
                      </div>
                      <p className="text-3xl font-bold text-emerald-900">{stats.environmental}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setCategoryFilter('HSE'); setViewMode('list'); }}
                    className="w-full bg-gradient-to-br from-rose-50 to-rose-100 rounded-lg p-4 text-left hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-rose-900">HSE Risks</p>
                        <p className="text-xs text-rose-700 mt-1">ISO 45001 related</p>
                      </div>
                      <p className="text-3xl font-bold text-rose-900">{stats.hse}</p>
                    </div>
                  </button>
                </div>

                {/* Status Overview */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Status Overview</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">Open</span>
                      <span className="font-semibold text-slate-900">{stats.open}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">Treated</span>
                      <span className="font-semibold text-slate-900">{stats.treated}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">Closed</span>
                      <span className="font-semibold text-slate-900">{stats.closed}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Risk Matrix */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Risk Matrix (5×5)</h3>
              <p className="text-sm text-slate-600 mb-4">Click any cell to filter risks by that level</p>
              <RiskMatrix risks={risks} onCellClick={handleCellClick} />
            </div>

            {/* Action Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Critical Risks */}
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                  <h3 className="text-lg font-semibold text-rose-900">Critical Risks</h3>
                </div>
                <p className="text-3xl font-bold text-rose-600 mb-2">{stats.critical}</p>
                <p className="text-sm text-rose-700 mb-4">Require immediate treatment</p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    setViewMode('list')
                    setRiskLevelFilter('CRITICAL')
                  }}
                >
                  View Critical Risks →
                </Button>
              </div>

              {/* Due for Review */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                  <h3 className="text-lg font-semibold text-amber-900">Due for Review</h3>
                </div>
                <p className="text-3xl font-bold text-amber-600 mb-2">{stats.dueReview}</p>
                <p className="text-sm text-amber-700 mb-4">Risks due for review soon</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-amber-600 text-amber-700 hover:bg-amber-100"
                  onClick={() => {
                    setViewMode('list')
                    // Could add a due review filter here
                  }}
                >
                  View Due Reviews →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Matrix View */}
        {viewMode === 'matrix' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Risk Matrix (5×5)</h2>
              {selectedCell && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCell(null)}
                >
                  Clear Filter
                </Button>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-4">Click any cell to filter risks and view in list mode</p>
            <RiskMatrix risks={risks} onCellClick={handleCellClick} />
            {selectedCell && (
              <div className="mt-4 text-center text-sm text-slate-600">
                Showing {filteredAndSortedRisks.length} risks with Likelihood={selectedCell.l}, Severity={selectedCell.s}
              </div>
            )}
          </div>
        )}

        {/* Filters (List View Only) */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by title, context, or owner..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="QUALITY">Quality</SelectItem>
                    <SelectItem value="ENVIRONMENTAL">Environmental</SelectItem>
                    <SelectItem value="HSE">HSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="TREATED">Treated</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Risk Level Filter */}
              <div>
                <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Levels</SelectItem>
                    <SelectItem value="CRITICAL">Critical (16-25)</SelectItem>
                    <SelectItem value="HIGH">High (11-15)</SelectItem>
                    <SelectItem value="MEDIUM">Medium (6-10)</SelectItem>
                    <SelectItem value="LOW">Low (1-5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || riskLevelFilter !== 'ALL' || selectedCell) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {categoryFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {statusFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {riskLevelFilter !== 'ALL' && (
                  <Badge variant="secondary" className="gap-1">
                    Level: {riskLevelFilter}
                    <button onClick={() => setRiskLevelFilter('ALL')} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                {selectedCell && (
                  <Badge variant="secondary" className="gap-1">
                    Matrix: {selectedCell.l}×{selectedCell.s}
                    <button onClick={() => setSelectedCell(null)} className="ml-1 hover:text-slate-900">×</button>
                  </Badge>
                )}
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setCategoryFilter('ALL')
                    setStatusFilter('ALL')
                    setRiskLevelFilter('ALL')
                    setSelectedCell(null)
                  }}
                  className="ml-auto text-xs text-slate-600 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <p className="text-xs text-slate-500 mt-3">
              Showing {filteredAndSortedRisks.length} of {risks.length} risks
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
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center gap-2">
                      Title
                      <SortIcon field="title" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category
                      <SortIcon field="category" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                    Context
                  </th>
                  <th 
                    className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('score')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      L×S (Score)
                      <SortIcon field="score" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">
                    Level
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
                    onClick={() => handleSort('reviewDate')}
                  >
                    <div className="flex items-center gap-2">
                      Review
                      <SortIcon field="reviewDate" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAndSortedRisks.map((risk) => {
                  const score = risk.likelihood * risk.severity
                  const rag = getRiskRAG(score)
                  return (
                    <tr 
                      key={risk.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => { setEditingRisk(risk); setShowForm(true); }}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{risk.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant={
                            risk.category === 'QUALITY' ? 'default' : 
                            risk.category === 'ENVIRONMENTAL' ? 'outline' : 
                            'destructive'
                          }
                          className="text-xs"
                        >
                          {risk.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                        {risk.context || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={`inline-block px-3 py-2 rounded-md border ${getScoreColor(score)}`}>
                          <div className="text-xs font-medium">{risk.likelihood}×{risk.severity}</div>
                          <div className="font-bold text-lg">{score}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={rag} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{risk.owner || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant={risk.status === 'OPEN' ? 'destructive' : risk.status === 'TREATED' ? 'secondary' : 'outline'}>
                            {risk.status}
                          </Badge>
                          {risk.status === 'TREATED' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setApprovalRisk(risk)
                                setShowApprovalWorkflow(true)
                              }}
                              className="h-7 px-2"
                            >
                              <FileSignature className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(risk.reviewDate)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredAndSortedRisks.length === 0 && viewMode === 'list' && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No risks found</p>
          </div>
        )}

        <RiskForm
          open={showForm}
          onClose={() => { setShowForm(false); setEditingRisk(undefined); }}
          risk={editingRisk}
          onSave={loadRisks}
        />

        {approvalRisk && (
          <ApprovalWorkflow
            open={showApprovalWorkflow}
            onClose={() => { setShowApprovalWorkflow(false); setApprovalRisk(null); }}
            documentId={approvalRisk.id}
            documentTitle={`Risk: ${approvalRisk.title}`}
            currentApprovals={[]}
          />
        )}
      </div>
    </Shell>
  )
}
