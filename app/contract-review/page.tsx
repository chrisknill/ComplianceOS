'use client'

import { useState, useCallback, useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, Download, Search, ArrowUpDown, ArrowUp, ArrowDown,
  FileText, DollarSign, Clock, CheckCircle, AlertTriangle,
  RefreshCw, Filter, X, AlertCircle, List, Grid3X3, 
  Calendar, BarChart3, Eye, EyeOff, ChevronLeft, ChevronRight
} from 'lucide-react'
import { ContractReviewForm } from '@/components/forms/ContractReviewForm'
import { ContractReviewDetailView } from '@/components/forms/ContractReviewDetailView'
import { formatDate } from '@/lib/utils'
import { convertToCSV, downloadFile } from '@/lib/export'
import { useContractReviews } from '@/hooks/useContractReviews'
import { 
  ContractReview, ContractReviewFilters, ContractReviewSort
} from '@/types/contract-review'

type ViewMode = 'dashboard' | 'list' | 'grid' | 'calendar' | 'board'
type CalendarView = 'day' | 'week' | 'month'
import { 
  getStatusBadge, getPriorityBadge, getRiskBadge, formatCurrency,
  getContractTypeOptions, getStatusOptions, getPriorityOptions, getRiskLevelOptions
} from '@/lib/contract-review-utils'
import { toast } from 'sonner'

export default function ContractReviewPage() {
  const [showForm, setShowForm] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [calendarView, setCalendarView] = useState<CalendarView>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [filters, setFilters] = useState<ContractReviewFilters>({
    search: '',
    contractType: 'ALL',
    status: 'ALL',
    priority: 'ALL',
    riskLevel: 'ALL'
  })
  
  const [sort, setSort] = useState<ContractReviewSort>({
    field: 'createdAt',
    direction: 'desc'
  })

  const {
    contracts,
    loading,
    error,
    stats,
    sortedContracts,
    refreshContracts
  } = useContractReviews(filters, sort)

  const handleFilterChange = useCallback((key: keyof ContractReviewFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      contractType: 'ALL',
      status: 'ALL',
      priority: 'ALL',
      riskLevel: 'ALL'
    })
  }, [])

  const handleSort = useCallback((field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])


  const handleExportCSV = useCallback(() => {
    try {
      const csvData = convertToCSV(sortedContracts, [
        { key: 'contractNumber', label: 'Contract Number' },
        { key: 'contractTitle', label: 'Contract Title' },
        { key: 'contractType', label: 'Type' },
        { key: 'supplierName', label: 'Supplier' },
        { key: 'value', label: 'Value' },
        { key: 'currency', label: 'Currency' },
        { key: 'status', label: 'Status' },
        { key: 'priority', label: 'Priority' },
        { key: 'riskLevel', label: 'Risk Level' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'createdAt', label: 'Created' },
      ])
      downloadFile(csvData, 'contract-reviews.csv', 'text/csv')
      toast.success('Contract data exported successfully')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export contract data')
    }
  }, [sortedContracts])

  const handleExportPDF = useCallback(() => {
    try {
      // For now, we'll create a simple PDF export using the browser's print functionality
      // In a real implementation, you'd use a library like jsPDF or Puppeteer
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        const htmlContent = `
          <html>
            <head>
              <title>Contract Reviews Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                h1 { color: #333; }
              </style>
            </head>
            <body>
              <h1>Contract Reviews Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <table>
                <thead>
                  <tr>
                    <th>Contract Number</th>
                    <th>Title</th>
                    <th>Supplier</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedContracts.map(contract => `
                    <tr>
                      <td>${contract.contractNumber}</td>
                      <td>${contract.contractTitle}</td>
                      <td>${contract.supplierName}</td>
                      <td>${contract.value ? formatCurrency(contract.value, contract.currency) : 'N/A'}</td>
                      <td>${contract.status}</td>
                      <td>${contract.priority}</td>
                      <td>${contract.riskLevel}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `
        printWindow.document.write(htmlContent)
        printWindow.document.close()
        printWindow.print()
        toast.success('PDF report generated successfully')
      }
    } catch (error) {
      console.error('PDF export error:', error)
      toast.error('Failed to generate PDF report')
    }
  }, [sortedContracts])

  const handleContractSelect = useCallback((contractId: string) => {
    setSelectedContractId(contractId)
    setShowDetailView(true)
  }, [])

  const handleFormSubmit = useCallback(() => {
    setShowForm(false)
    refreshContracts()
  }, [refreshContracts])

  const handleDetailClose = useCallback(() => {
    setShowDetailView(false)
    setSelectedContractId(null)
    refreshContracts()
  }, [refreshContracts])

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== 'ALL' && value !== '').length
  }, [filters])

  // Board view component
  const BoardView = () => {
    const statusColumns = [
      { status: 'DRAFT', title: 'Draft', color: 'bg-gray-100' },
      { status: 'UNDER_REVIEW', title: 'Under Review', color: 'bg-yellow-100' },
      { status: 'APPROVED', title: 'Approved', color: 'bg-green-100' },
      { status: 'REJECTED', title: 'Rejected', color: 'bg-red-100' },
      { status: 'EXPIRED', title: 'Expired', color: 'bg-orange-100' },
      { status: 'TERMINATED', title: 'Terminated', color: 'bg-gray-100' },
    ]

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statusColumns.map((column) => {
          const columnContracts = sortedContracts.filter(contract => contract.status === column.status)
          return (
            <div key={column.status} className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{column.title}</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {columnContracts.length}
                </span>
              </div>
              <div className="space-y-3">
                {columnContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="p-3 border rounded-lg hover:shadow-md cursor-pointer transition-shadow"
                    onClick={() => handleContractSelect(contract.id)}
                  >
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {contract.contractNumber}
                    </div>
                    <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {contract.contractTitle}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{contract.supplierName}</span>
                      {contract.value && (
                        <span className="text-xs font-medium text-green-600">
                          {formatCurrency(contract.value, contract.currency)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {getPriorityBadge(contract.priority)}
                      {getRiskBadge(contract.riskLevel)}
                    </div>
                  </div>
                ))}
                {columnContracts.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No contracts</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Matrix view component
  const MatrixView = () => {
    const priorityLevels = ['LOW', 'MEDIUM', 'HIGH'] // Low to High order
    const riskLevels = ['HIGH', 'MEDIUM', 'LOW'] // High to Low order (rows)

    // Color coding for matrix cells based on risk/priority combination
    const getCellColor = (risk: string, priority: string) => {
      // High-High = Red
      if (risk === 'HIGH' && priority === 'HIGH') {
        return 'bg-red-100 border-red-200'
      }
      
      // Any with Medium = Amber
      if (risk === 'MEDIUM' || priority === 'MEDIUM') {
        return 'bg-amber-100 border-amber-200'
      }
      
      // Low-High or High-Low = Amber
      if ((risk === 'LOW' && priority === 'HIGH') || (risk === 'HIGH' && priority === 'LOW')) {
        return 'bg-amber-100 border-amber-200'
      }
      
      // Low-Low = Green
      if (risk === 'LOW' && priority === 'LOW') {
        return 'bg-green-100 border-green-200'
      }
      
      // Fallback
      return 'bg-gray-100 border-gray-200'
    }

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'HIGH': return 'bg-red-500 text-white'
        case 'MEDIUM': return 'bg-yellow-500 text-white'
        case 'LOW': return 'bg-green-500 text-white'
        default: return 'bg-gray-500 text-white'
      }
    }

    const getRiskColor = (risk: string) => {
      switch (risk) {
        case 'HIGH': return 'bg-red-500 text-white'
        case 'MEDIUM': return 'bg-yellow-500 text-white'
        case 'LOW': return 'bg-green-500 text-white'
        default: return 'bg-gray-500 text-white'
      }
    }

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold text-gray-900">Risk vs Priority Matrix</h3>
        </div>

        {/* Matrix Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="flex">
            <div className="flex items-center justify-center bg-gray-50 px-3 py-8 min-w-12">
              <span className="text-xs font-medium text-gray-700 uppercase transform -rotate-90 whitespace-nowrap">
                Risk
              </span>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b border-gray-300">
                  <tr>
                    <th className="w-1/4 px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                      Risk
                    </th>
                    <th colSpan={3} className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                      Priority
                    </th>
                  </tr>
                  <tr>
                    <th className="w-1/20 px-2 py-3 text-center text-xs font-medium text-gray-700 uppercase">
                      Level
                    </th>
                    {priorityLevels.map((priority, index) => (
                      <th key={priority} className={`${index === 0 ? 'w-1/20' : 'w-1/3'} px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase`}>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(priority)}`}>
                          {priority}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {riskLevels.map(risk => (
                    <tr key={risk} className="border-b border-gray-300">
                      <td className="w-1/20 px-2 py-3 text-center bg-gray-50 border-r border-gray-300">
                        <span className={`px-1 py-1 rounded text-xs font-medium ${getRiskColor(risk)}`}>
                          {risk}
                        </span>
                      </td>
                      {priorityLevels.map((priority, index) => {
                        const contracts = sortedContracts.filter(
                          contract => contract.priority === priority && contract.riskLevel === risk
                        )
                        return (
                          <td key={`${risk}-${priority}`} className={`${index === 0 ? 'w-1/20' : 'w-1/3'} px-4 py-3 text-center border border-gray-300 ${getCellColor(risk, priority)}`}>
                            <div className="space-y-2">
                              <div className="text-xs font-medium text-gray-600">
                                {contracts.length} contract{contracts.length !== 1 ? 's' : ''}
                              </div>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {contracts.slice(0, 4).map(contract => (
                                  <div
                                    key={contract.id}
                                    className="p-2 bg-white rounded border cursor-pointer hover:shadow-sm transition-shadow"
                                    onClick={() => handleContractSelect(contract.id)}
                                    title={`${contract.contractTitle} - ${contract.supplierName}`}
                                  >
                                    <div className="font-medium text-xs truncate">{contract.contractNumber}</div>
                                    <div className="text-xs text-gray-500 truncate">{contract.supplierName}</div>
                                    <div className="text-xs text-gray-400 truncate">{contract.contractTitle}</div>
                                  </div>
                                ))}
                                {contracts.length > 4 && (
                                  <div className="text-xs text-gray-500 font-medium">
                                    +{contracts.length - 4} more
                                  </div>
                                )}
                                {contracts.length === 0 && (
                                  <div className="text-xs text-gray-400 py-2">No contracts</div>
                                )}
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

          {/* Summary Statistics */}
          <div className="bg-white rounded-lg border p-4">
            <h4 className="font-medium text-gray-700 mb-3">Matrix Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {sortedContracts.filter(c => c.riskLevel === 'LOW' && c.priority === 'LOW').length}
                </div>
                <div className="text-gray-600">Low Risk/Low Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {sortedContracts.filter(c => 
                    (c.riskLevel === 'MEDIUM' && c.priority === 'LOW') || 
                    (c.riskLevel === 'LOW' && c.priority === 'MEDIUM') ||
                    (c.riskLevel === 'MEDIUM' && c.priority === 'MEDIUM') ||
                    (c.riskLevel === 'MEDIUM' && c.priority === 'HIGH') ||
                    (c.riskLevel === 'HIGH' && c.priority === 'MEDIUM') ||
                    (c.riskLevel === 'LOW' && c.priority === 'HIGH') ||
                    (c.riskLevel === 'HIGH' && c.priority === 'LOW')
                  ).length}
                </div>
                <div className="text-gray-600">Medium Risk/Priority</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {sortedContracts.filter(c => 
                    c.riskLevel === 'HIGH' && c.priority === 'HIGH'
                  ).length}
                </div>
                <div className="text-gray-600">High Risk/High Priority</div>
              </div>
            </div>
          </div>
      </div>
    )
  }

  // Calendar view component
  const CalendarView = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const getContractsForDate = (day: number) => {
      const date = new Date(currentYear, currentMonth, day)
      return sortedContracts.filter(contract => {
        if (!contract.endDate) return false
        const contractDate = new Date(contract.endDate)
        return contractDate.getDate() === day && 
               contractDate.getMonth() === currentMonth && 
               contractDate.getFullYear() === currentYear
      })
    }

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map(day => (
            <div key={`empty-${day}`} className="h-24"></div>
          ))}
          {days.map(day => {
            const contracts = getContractsForDate(day)
            return (
              <div key={day} className="h-24 border border-gray-200 p-1">
                <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                <div className="space-y-1">
                  {contracts.slice(0, 2).map(contract => (
                    <div
                      key={contract.id}
                      className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                      onClick={() => handleContractSelect(contract.id)}
                      title={contract.contractTitle}
                    >
                      {contract.contractNumber}
                    </div>
                  ))}
                  {contracts.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{contracts.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const SortIcon = useCallback(({ field }: { field: string }) => {
    if (sort.field !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    return sort.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />
  }, [sort])

  if (showForm) {
    return (
      <ContractReviewForm 
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />
    )
  }

  if (showDetailView && selectedContractId) {
    return (
      <ContractReviewDetailView
        contractId={selectedContractId}
        onClose={handleDetailClose}
      />
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Contract Review</h1>
            <p className="text-slate-600 mt-1">Manage contract reviews, approvals, and compliance tracking</p>
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
                Matrix
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
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Contract Review
            </Button>
          </div>
        </div>
      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshContracts}
              className="ml-auto"
            >
              Retry
            </Button>
          </div>
        </div>
      )}


      {/* Dashboard View */}
      {viewMode === 'dashboard' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Contracts</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalContracts}</p>
                  <p className="text-sm text-slate-500 mt-1">Active contract portfolio</p>
                </div>
                <FileText className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Under Review</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">{stats.underReviewCount}</p>
                </div>
                <Clock className="h-10 w-10 text-amber-500" />
              </div>
              <p className="text-sm text-slate-500 mt-2">Require attention</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Approved</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-2">{stats.approvedCount}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {stats.totalContracts > 0 ? Math.round((stats.approvedCount / stats.totalContracts) * 100) : 0}% approved
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Value</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{formatCurrency(stats.totalValue, 'USD')}</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-sm text-slate-500 mt-2">Contract portfolio value</p>
            </div>
          </div>

          {/* Contract Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contract Types</h3>
              <div className="space-y-3">
                {getContractTypeOptions().map(type => {
                  const count = sortedContracts.filter(c => c.contractType === type.value).length
                  const percentage = stats.totalContracts > 0 ? (count / stats.totalContracts) * 100 : 0
                  return (
                    <div key={type.value} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{type.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Status Distribution</h3>
              <div className="space-y-3">
                {getStatusOptions().map(status => {
                  const count = sortedContracts.filter(c => c.status === status.value).length
                  const percentage = stats.totalContracts > 0 ? (count / stats.totalContracts) * 100 : 0
                  return (
                    <div key={status.value} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{status.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent Contracts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Contracts</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Contract #</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Supplier</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Value</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedContracts.slice(0, 5).map((contract) => (
                    <tr 
                      key={contract.id} 
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => handleContractSelect(contract.id)}
                    >
                      <td className="px-4 py-2 text-sm font-medium text-slate-900">{contract.contractNumber}</td>
                      <td className="px-4 py-2 text-sm text-slate-600 max-w-xs truncate">{contract.contractTitle}</td>
                      <td className="px-4 py-2 text-sm text-slate-600">{contract.supplierName}</td>
                      <td className="px-4 py-2">{getStatusBadge(contract.status)}</td>
                      <td className="px-4 py-2 text-sm text-slate-600">
                        {contract.value ? formatCurrency(contract.value, contract.currency) : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm text-slate-500">{formatDate(contract.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      )}

      {/* Export Buttons - Right Justified */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contracts..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
            
            <Select value={filters.contractType} onValueChange={(value) => handleFilterChange('contractType', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {getContractTypeOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                {getStatusOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priority</SelectItem>
                {getPriorityOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.riskLevel} onValueChange={(value) => handleFilterChange('riskLevel', value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Risk</SelectItem>
                {getRiskLevelOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear ({activeFiltersCount})
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div className="flex items-center justify-center" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" aria-hidden="true"></div>
            <span className="ml-2">Loading contracts...</span>
          </div>
        </div>
      ) : sortedContracts.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <div role="status" aria-live="polite">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
            <p className="text-gray-600 mb-4">
              {activeFiltersCount > 0 
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by creating your first contract review.'
              }
            </p>
            <div className="flex items-center justify-center gap-2">
              {activeFiltersCount > 0 && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Contract Review
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'list' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Contract reviews table">
                  <thead className="bg-gray-50">
                    <tr role="row">
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractNumber')}
                        role="button"
                        tabIndex={0}
                        aria-label="Sort by Contract Number"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSort('contractNumber')
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          Contract #
                          <SortIcon field="contractNumber" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('contractTitle')}
                        role="button"
                        tabIndex={0}
                        aria-label="Sort by Contract Title"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSort('contractTitle')
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          Title
                          <SortIcon field="contractTitle" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('supplierName')}
                        role="button"
                        tabIndex={0}
                        aria-label="Sort by Supplier Name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSort('supplierName')
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          Supplier
                          <SortIcon field="supplierName" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('value')}
                        role="button"
                        tabIndex={0}
                        aria-label="Sort by Contract Value"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSort('value')
                          }
                        }}
                      >
                        <div className="flex items-center justify-end gap-2">
                          Value
                          <SortIcon field="value" />
                        </div>
                      </th>
                      <th 
                        className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('status')}
                        role="button"
                        tabIndex={0}
                        aria-label="Sort by Status"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSort('status')
                          }
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          Status
                          <SortIcon field="status" />
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200" role="rowgroup">
                    {sortedContracts.map((contract) => (
                      <tr 
                        key={contract.id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleContractSelect(contract.id)}
                        role="row"
                        tabIndex={0}
                        aria-label={`Contract ${contract.contractNumber}: ${contract.contractTitle}`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleContractSelect(contract.id)
                          }
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap" role="cell">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.contractNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4" role="cell">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={contract.contractTitle}>
                            {contract.contractTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap" role="cell">
                          <div className="text-sm text-gray-900">{contract.supplierName}</div>
                          {contract.supplierEmail && (
                            <div className="text-xs text-gray-500">{contract.supplierEmail}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right" role="cell">
                          <div className="text-sm text-gray-900">
                            {contract.value ? formatCurrency(contract.value, contract.currency) : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center" role="cell">
                          {getStatusBadge(contract.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" role="cell">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleContractSelect(contract.id)
                            }}
                            className="hover:bg-blue-50 hover:text-blue-600"
                            aria-label={`View details for contract ${contract.contractNumber}`}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            </div>
          )}
          
          {viewMode === 'grid' && <MatrixView />}
          {viewMode === 'board' && <BoardView />}
          {viewMode === 'matrix' && <MatrixView />}
          {viewMode === 'calendar' && <CalendarView />}
        </>
      )}
      </div>
    </Shell>
  )
}
