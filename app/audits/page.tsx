'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Calendar,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { AuditForm } from '@/components/forms/AuditForm'

interface AuditType {
  id: string
  name: string
  description?: string
  category: string
  frequency: string
  standard?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Audit {
  id: string
  auditNumber: string
  auditTypeId: string
  title: string
  description?: string
  scope: string
  objectives?: string
  auditStandard: string
  auditCriteria?: string
  plannedStartDate: string
  plannedEndDate: string
  actualStartDate?: string
  actualEndDate?: string
  status: string
  ragStatus: string
  leadAuditor?: string
  leadAuditorName?: string
  auditTeam?: string
  auditee?: string
  auditeeName?: string
  location?: string
  auditMethod?: string
  findings: number
  nonConformities: number
  observations: number
  opportunities: number
  effectiveness?: number
  notes?: string
  attachments?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  auditType: AuditType
  auditFindings: Array<{
    id: string
    findingNumber: string
    type: string
    severity: string
    description: string
    status: string
  }>
  logs: Array<{
    id: string
    action: string
    performedBy?: string
    comments?: string
    timestamp: string
  }>
}

export default function AuditsPage() {
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState('INTERNAL')
  const [viewMode, setViewMode] = useState<'list' | 'matrix' | 'calendar'>('list')
  const [audits, setAudits] = useState<Audit[]>([])
  const [auditTypes, setAuditTypes] = useState<AuditType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [showAuditForm, setShowAuditForm] = useState(false)
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [ragFilter, setRagFilter] = useState('ALL')
  const [standardFilter, setStandardFilter] = useState('ALL')
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString())
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<'monthly' | 'yearly'>('monthly')

  // Define tabs like documents page
  const tabs = [
    { key: 'DASHBOARD', label: 'Dashboard' },
    { key: 'INTERNAL', label: 'Internal Audits' },
    { key: 'EXTERNAL', label: 'External Audits' },
    { key: 'SUPPLIER', label: 'Supplier Audits' },
    { key: 'INSPECTIONS', label: 'Inspections' },
  ]

  // Fetch data
  const fetchAudits = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (ragFilter !== 'ALL') params.append('ragStatus', ragFilter)
      if (standardFilter !== 'ALL') params.append('auditStandard', standardFilter)
      params.append('year', yearFilter)
      
      const response = await fetch(`/api/audits?${params}`)
      if (!response.ok) throw new Error('Failed to fetch audits')
      const data = await response.json()
      setAudits(data.audits || [])
    } catch (err) {
      console.error('Error fetching audits:', err)
      setError('Failed to load audits')
    }
  }

  const fetchAuditTypes = async () => {
    try {
      const response = await fetch('/api/audits/types')
      if (!response.ok) throw new Error('Failed to fetch audit types')
      const data = await response.json()
      setAuditTypes(data || [])
    } catch (err) {
      console.error('Error fetching audit types:', err)
      setError('Failed to load audit types')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchAudits(),
        fetchAuditTypes(),
      ])
      setLoading(false)
    }
    loadData()
  }, [statusFilter, ragFilter, standardFilter, yearFilter])

  // Handle URL parameters for view mode
  useEffect(() => {
    const viewParam = searchParams.get('view')
    if (viewParam && ['list', 'matrix', 'calendar'].includes(viewParam)) {
      setViewMode(viewParam as 'list' | 'matrix' | 'calendar')
    }
  }, [searchParams])

  // Calculate statistics based on active tab
  const getTabAudits = () => {
    if (filter === 'INTERNAL') {
      return (audits || []).filter(audit => audit.auditType.category === 'INTERNAL')
    } else if (filter === 'EXTERNAL') {
      return (audits || []).filter(audit => audit.auditType.category === 'EXTERNAL')
    } else if (filter === 'SUPPLIER') {
      return (audits || []).filter(audit => audit.auditType.category === 'SUPPLIER')
    }
    return audits || []
  }

  const tabAudits = getTabAudits()
  const stats = {
    totalAudits: tabAudits.length,
    plannedAudits: tabAudits.filter(a => a.status === 'PLANNED').length,
    inProgressAudits: tabAudits.filter(a => a.status === 'IN_PROGRESS').length,
    completedAudits: tabAudits.filter(a => a.status === 'COMPLETED').length,
    overdueAudits: tabAudits.filter(a => {
      const plannedEnd = new Date(a.plannedEndDate)
      const now = new Date()
      return plannedEnd < now && a.status !== 'COMPLETED'
    }).length,
    totalFindings: tabAudits.reduce((sum, audit) => sum + audit.findings, 0),
    totalNCs: tabAudits.reduce((sum, audit) => sum + audit.nonConformities, 0),
    redStatusAudits: tabAudits.filter(a => a.ragStatus === 'RED').length,
  }

  // Filter audits by tab and search
  const filteredAudits = (audits || []).filter(audit => {
    // Filter by tab
    let matchesTab = true
    if (filter === 'INTERNAL') {
      matchesTab = audit.auditType.category === 'INTERNAL'
    } else if (filter === 'EXTERNAL') {
      matchesTab = audit.auditType.category === 'EXTERNAL'
    } else if (filter === 'SUPPLIER') {
      matchesTab = audit.auditType.category === 'SUPPLIER'
    }
    
    // Filter by search
    const matchesSearch = audit.auditNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.scope.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         audit.auditType.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesSearch
  })

  const handleFormSubmit = async () => {
    await Promise.all([
      fetchAudits(),
      fetchAuditTypes(),
    ])
    setShowAuditForm(false)
    setSelectedAudit(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PLANNED: 'secondary',
      IN_PROGRESS: 'default',
      COMPLETED: 'destructive',
      CANCELLED: 'outline',
      DEFERRED: 'outline',
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getRagBadge = (ragStatus: string) => {
    const variants = {
      GREEN: 'default',
      AMBER: 'secondary',
      RED: 'destructive',
    } as const
    
    const colors = {
      GREEN: 'bg-green-100 text-green-800 border-green-200',
      AMBER: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      RED: 'bg-red-100 text-red-800 border-red-200',
    }
    
    return (
      <Badge variant="outline" className={colors[ragStatus as keyof typeof colors]}>
        {ragStatus}
      </Badge>
    )
  }

  // Matrix view data
  const getMatrixData = () => {
    const procedures = [
      'Document Control',
      'Management Review',
      'Internal Audit',
      'Corrective Action',
      'Training',
      'Risk Management',
      'Supplier Management',
      'Customer Satisfaction',
      'Quality Planning',
      'Process Control',
      'Product Realization',
      'Measurement & Analysis',
      'Continual Improvement',
      'Environmental Management',
      'Health & Safety',
      'Emergency Preparedness',
      'Waste Management',
      'Energy Management',
      'Incident Management',
      'Compliance Monitoring',
    ]

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const matrixData = procedures.map(procedure => {
      const procedureAudits = tabAudits.filter(audit => 
        audit.scope.toLowerCase().includes(procedure.toLowerCase()) ||
        audit.title.toLowerCase().includes(procedure.toLowerCase())
      )

      const monthData = months.map((month, index) => {
        const monthAudits = procedureAudits.filter(audit => {
          const plannedDate = new Date(audit.plannedStartDate)
          return plannedDate.getMonth() === index && plannedDate.getFullYear() === parseInt(yearFilter)
        })

        return {
          month,
          audits: monthAudits,
          count: monthAudits.length,
          ragStatus: monthAudits.length > 0 ? 
            (monthAudits.some(a => a.ragStatus === 'RED') ? 'RED' :
             monthAudits.some(a => a.ragStatus === 'AMBER') ? 'AMBER' : 'GREEN') : null
        }
      })

      return {
        procedure,
        monthData
      }
    })

    return matrixData
  }

  // Calendar helpers
  const getCalendarEvents = () => {
    return tabAudits.map(audit => ({
      id: audit.id,
      title: audit.title,
      date: audit.plannedStartDate,
      endDate: audit.plannedEndDate,
      status: audit.status,
      ragStatus: audit.ragStatus,
      auditNumber: audit.auditNumber,
      type: 'audit'
    }))
  }

  const getYearlyCalendarData = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]

    return months.map((month, index) => {
      const monthAudits = tabAudits.filter(audit => {
        const plannedDate = new Date(audit.plannedStartDate)
        return plannedDate.getMonth() === index && plannedDate.getFullYear() === parseInt(yearFilter)
      })

      return {
        month,
        audits: monthAudits,
        count: monthAudits.length
      }
    })
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading audits data...</p>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Audits & Inspections</h1>
            <p className="text-gray-600 mt-1">Internal Audit Program Management</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={showAuditForm} onOpenChange={setShowAuditForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedAudit ? 'Edit Audit' : 'New Audit'}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedAudit ? 'Update audit details' : 'Create a new audit'}
                  </DialogDescription>
                </DialogHeader>
                <AuditForm
                  audit={selectedAudit}
                  auditTypes={auditTypes}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowAuditForm(false)
                    setSelectedAudit(null)
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAudits}</div>
              <p className="text-xs text-muted-foreground">
                {yearFilter} audit program
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAudits}</div>
              <p className="text-xs text-muted-foreground">
                Audits completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressAudits}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.overdueAudits}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    filter === tab.key
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* View Mode Selector - only show for internal audits */}
        {filter === 'INTERNAL' && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === 'matrix' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('matrix')}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Matrix
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
            </div>
            
            {/* RAG Key */}
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">Status Key:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">GREEN</Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">AMBER</Badge>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">RED</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PLANNED">Planned</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="DEFERRED">Deferred</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ragFilter} onValueChange={setRagFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="RAG Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All RAG</SelectItem>
                  <SelectItem value="GREEN">Green</SelectItem>
                  <SelectItem value="AMBER">Amber</SelectItem>
                  <SelectItem value="RED">Red</SelectItem>
                </SelectContent>
              </Select>
              <Select value={standardFilter} onValueChange={setStandardFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Standards</SelectItem>
                  <SelectItem value="ISO 9001">ISO 9001</SelectItem>
                  <SelectItem value="ISO 14001">ISO 14001</SelectItem>
                  <SelectItem value="ISO 45001">ISO 45001</SelectItem>
                  <SelectItem value="CUSTOM">Custom</SelectItem>
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Internal Audits Tab */}
        {filter === 'INTERNAL' && (
          <div className="space-y-6">
            {/* Main Content */}
            {viewMode === 'list' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Audit #</th>
                          <th className="text-left p-3">Title</th>
                          <th className="text-left p-3">Type</th>
                          <th className="text-left p-3">Standard</th>
                          <th className="text-left p-3">Planned Date</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">RAG</th>
                          <th className="text-left p-3">Findings</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAudits.map((audit) => (
                          <tr key={audit.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{audit.auditNumber}</td>
                            <td className="p-3">
                              <div>
                                <p className="font-medium">{audit.title}</p>
                                <p className="text-sm text-gray-600">{audit.scope}</p>
                              </div>
                            </td>
                            <td className="p-3">{audit.auditType.name}</td>
                            <td className="p-3">{audit.auditStandard}</td>
                            <td className="p-3">
                              {new Date(audit.plannedStartDate).toLocaleDateString()}
                            </td>
                            <td className="p-3">{getStatusBadge(audit.status)}</td>
                            <td className="p-3">{getRagBadge(audit.ragStatus)}</td>
                            <td className="p-3">
                              <div className="text-sm">
                                <p>Total: {audit.findings}</p>
                                <p>NCs: {audit.nonConformities}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAudit(audit)
                                    setShowAuditForm(true)
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === 'matrix' && (
              <Card>
                <CardHeader>
                  <CardTitle>Audit Schedule Matrix - {yearFilter}</CardTitle>
                  <CardDescription>Procedures vs Months - Internal Audit Program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 text-left bg-gray-50 font-medium">Procedure</th>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                            <th key={month} className="border p-2 text-center bg-gray-50 font-medium min-w-[80px]">
                              {month}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getMatrixData().map((row, index) => (
                          <tr key={index}>
                            <td className="border p-2 font-medium bg-gray-50">{row.procedure}</td>
                            {row.monthData.map((month, monthIndex) => (
                              <td key={monthIndex} className="border p-2 text-center">
                                {month.count > 0 ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <Badge 
                                      variant="outline" 
                                      className={
                                        month.ragStatus === 'RED' ? 'bg-red-100 text-red-800 border-red-200' :
                                        month.ragStatus === 'AMBER' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        'bg-green-100 text-green-800 border-green-200'
                                      }
                                    >
                                      {month.count}
                                    </Badge>
                                    <div className="text-xs text-gray-600">
                                      {month.audits.map(audit => audit.auditNumber).join(', ')}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {viewMode === 'calendar' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Audit Calendar - {yearFilter}</CardTitle>
                      <CardDescription>Audit schedule overview</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={calendarView === 'monthly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCalendarView('monthly')}
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={calendarView === 'yearly' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCalendarView('yearly')}
                      >
                        Yearly
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {calendarView === 'yearly' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getYearlyCalendarData().map((monthData, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{monthData.month}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {monthData.audits.length > 0 ? (
                                monthData.audits.map((audit) => (
                                  <div key={audit.id} className="p-2 border rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <p className="font-medium text-sm">{audit.auditNumber}</p>
                                        <p className="text-xs text-gray-600">{audit.title}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {getStatusBadge(audit.status)}
                                        {getRagBadge(audit.ragStatus)}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-400 text-sm">No audits scheduled</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Monthly calendar view coming soon</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* External Audits Tab */}
        {filter === 'EXTERNAL' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>External Audits</CardTitle>
                <CardDescription>Third-party and certification audits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">External audits coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Supplier Audits Tab */}
        {filter === 'SUPPLIER' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Audits</CardTitle>
                <CardDescription>Audits of suppliers and vendors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Supplier audits coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Inspections Tab */}
        {filter === 'INSPECTIONS' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inspections</CardTitle>
                <CardDescription>Safety, environmental, and equipment inspections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Inspections coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dashboard Tab */}
        {filter === 'DASHBOARD' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Audits</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalAudits}</div>
                  <p className="text-xs text-muted-foreground">
                    All audit types
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalFindings}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all audits
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Non-Conformities</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalNCs}</div>
                  <p className="text-xs text-muted-foreground">
                    Require action
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Red Status</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.redStatusAudits}</div>
                  <p className="text-xs text-muted-foreground">
                    Critical issues
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Shell>
  )
}
