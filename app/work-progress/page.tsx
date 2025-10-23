'use client'

import { useState, useEffect, useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Building2,
  User,
  FileText,
  TrendingUp,
  Download,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  List,
  Grid3X3,
  Kanban,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from 'lucide-react'

interface WorkProgress {
  id: string
  companyName: string
  owner: string
  dateReceived: Date
  serviceType: string
  costOfSale: number
  status: 'Not Started' | 'WIP' | 'Client Sign' | 'Invoiced' | 'Moved to Next Month'
  description?: string
  clientContact?: string
  clientEmail?: string
  clientPhone?: string
  expectedCompletion?: Date
  actualCompletion?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export default function WorkProgressPage() {
  const [workItems, setWorkItems] = useState<WorkProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('ALL')
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('dateReceived')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<WorkProgress | null>(null)
  const [activeTab, setActiveTab] = useState('DASHBOARD')
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'board' | 'calendar'>('list')
  const [calendarView, setCalendarView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly')
  const [currentDate, setCurrentDate] = useState(new Date())

  const tabs = [
    { key: 'DASHBOARD', label: 'Dashboard' },
    { key: 'ALL', label: 'All Work Items' },
    { key: 'Not Started', label: 'Not Started' },
    { key: 'WIP', label: 'Work in Progress' },
    { key: 'Client Sign', label: 'Client Sign' },
    { key: 'Invoiced', label: 'Invoiced' },
    { key: 'Moved to Next Month', label: 'Moved to Next Month' }
  ]

  const [newWorkItem, setNewWorkItem] = useState<Partial<WorkProgress>>({
    companyName: '',
    owner: '',
    dateReceived: new Date(),
    serviceType: '',
    costOfSale: 0,
    status: 'Not Started',
    description: '',
    clientContact: '',
    clientEmail: '',
    clientPhone: '',
    expectedCompletion: undefined,
    notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API calls
      const mockWorkItems: WorkProgress[] = [
        {
          id: '1',
          companyName: 'Acme Corporation',
          owner: 'John Smith',
          dateReceived: new Date('2025-01-15'),
          serviceType: 'Compliance Audit',
          costOfSale: 15000,
          status: 'WIP',
          description: 'ISO 9001:2015 compliance audit and certification support',
          clientContact: 'Sarah Johnson',
          clientEmail: 'sarah.johnson@acme.com',
          clientPhone: '+44 20 7123 4567',
          expectedCompletion: new Date('2025-03-15'),
          notes: 'Initial assessment completed, awaiting client feedback',
          createdAt: new Date('2025-01-15'),
          updatedAt: new Date()
        },
        {
          id: '2',
          companyName: 'TechStart Ltd',
          owner: 'Emma Wilson',
          dateReceived: new Date('2025-01-20'),
          serviceType: 'Environmental Management',
          costOfSale: 8500,
          status: 'Client Sign',
          description: 'ISO 14001 environmental management system implementation',
          clientContact: 'Mike Brown',
          clientEmail: 'mike.brown@techstart.co.uk',
          clientPhone: '+44 161 234 5678',
          expectedCompletion: new Date('2025-04-20'),
          notes: 'Proposal approved, awaiting contract signature',
          createdAt: new Date('2025-01-20'),
          updatedAt: new Date()
        },
        {
          id: '3',
          companyName: 'Manufacturing Co',
          owner: 'David Lee',
          dateReceived: new Date('2025-01-10'),
          serviceType: 'Safety Assessment',
          costOfSale: 12000,
          status: 'Invoiced',
          description: 'OHSAS 18001 safety management system audit',
          clientContact: 'Lisa Davis',
          clientEmail: 'lisa.davis@manufacturing.co.uk',
          clientPhone: '+44 113 456 7890',
          expectedCompletion: new Date('2025-02-28'),
          actualCompletion: new Date('2025-02-25'),
          notes: 'Project completed successfully, invoice sent',
          createdAt: new Date('2025-01-10'),
          updatedAt: new Date()
        },
        {
          id: '4',
          companyName: 'Retail Solutions',
          owner: 'Sarah Johnson',
          dateReceived: new Date('2025-01-05'),
          serviceType: 'Quality Management',
          costOfSale: 9500,
          status: 'Not Started',
          description: 'ISO 9001:2015 quality management system implementation',
          clientContact: 'Tom Wilson',
          clientEmail: 'tom.wilson@retailsolutions.com',
          clientPhone: '+44 20 7890 1234',
          expectedCompletion: new Date('2025-05-05'),
          notes: 'Project scheduled to begin next week',
          createdAt: new Date('2025-01-05'),
          updatedAt: new Date()
        },
        {
          id: '5',
          companyName: 'Healthcare Systems',
          owner: 'John Smith',
          dateReceived: new Date('2024-12-20'),
          serviceType: 'Compliance Audit',
          costOfSale: 18000,
          status: 'Moved to Next Month',
          description: 'ISO 27001 information security management audit',
          clientContact: 'Dr. Amanda Green',
          clientEmail: 'amanda.green@healthcare.co.uk',
          clientPhone: '+44 161 567 8901',
          expectedCompletion: new Date('2025-01-20'),
          notes: 'Delayed due to client internal restructuring',
          createdAt: new Date('2024-12-20'),
          updatedAt: new Date()
        }
      ]

      setWorkItems(mockWorkItems)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWorkItems = useMemo(() => {
    let filtered = workItems.filter(item => {
      const matchesSearch = item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.clientContact?.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Tab-based filtering
      const matchesTab = activeTab === 'DASHBOARD' || activeTab === 'ALL' || item.status === activeTab
      
      const matchesServiceType = serviceTypeFilter === 'ALL' || item.serviceType === serviceTypeFilter
      const matchesOwner = ownerFilter === 'ALL' || item.owner === ownerFilter
      
      return matchesSearch && matchesTab && matchesServiceType && matchesOwner
    })

    filtered.sort((a, b) => {
      let aVal: any = a[sortField as keyof WorkProgress]
      let bVal: any = b[sortField as keyof WorkProgress]
      
      if (sortField === 'dateReceived' || sortField === 'expectedCompletion' || sortField === 'actualCompletion') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [workItems, searchTerm, activeTab, serviceTypeFilter, ownerFilter, sortField, sortDirection])

  const statusSummary = useMemo(() => {
    const summary = {
      'Not Started': { count: 0, total: 0 },
      'WIP': { count: 0, total: 0 },
      'Client Sign': { count: 0, total: 0 },
      'Invoiced': { count: 0, total: 0 },
      'Moved to Next Month': { count: 0, total: 0 }
    }

    workItems.forEach(item => {
      summary[item.status].count++
      summary[item.status].total += item.costOfSale
    })

    return summary
  }, [workItems])

  const totalValue = useMemo(() => {
    return workItems.reduce((sum, item) => sum + item.costOfSale, 0)
  }, [workItems])

  const handleAddWorkItem = async () => {
    try {
      const workItem: WorkProgress = {
        ...newWorkItem as WorkProgress,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setWorkItems(prev => [...prev, workItem])
      setShowAddDialog(false)
      resetForm()
    } catch (error) {
      console.error('Error adding work item:', error)
    }
  }

  const handleEditWorkItem = async () => {
    if (!editingItem) return
    
    try {
      setWorkItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...editingItem, updatedAt: new Date() }
          : item
      ))
      setEditingItem(null)
    } catch (error) {
      console.error('Error editing work item:', error)
    }
  }

  const handleDeleteWorkItem = async (id: string) => {
    try {
      setWorkItems(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error deleting work item:', error)
    }
  }

  const resetForm = () => {
    setNewWorkItem({
      companyName: '',
      owner: '',
      dateReceived: new Date(),
      serviceType: '',
      costOfSale: 0,
      status: 'Not Started',
      description: '',
      clientContact: '',
      clientEmail: '',
      clientPhone: '',
      expectedCompletion: undefined,
      notes: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-100 text-gray-800'
      case 'WIP': return 'bg-blue-100 text-blue-800'
      case 'Client Sign': return 'bg-yellow-100 text-yellow-800'
      case 'Invoiced': return 'bg-green-100 text-green-800'
      case 'Moved to Next Month': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Not Started': return <Clock className="h-4 w-4" />
      case 'WIP': return <TrendingUp className="h-4 w-4" />
      case 'Client Sign': return <FileText className="h-4 w-4" />
      case 'Invoiced': return <CheckCircle className="h-4 w-4" />
      case 'Moved to Next Month': return <ArrowRight className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const serviceTypes = ['Compliance Audit', 'Environmental Management', 'Safety Assessment', 'Quality Management', 'Information Security', 'Training', 'Consulting']
  const owners = ['John Smith', 'Emma Wilson', 'David Lee', 'Sarah Johnson', 'Mike Brown']
  const statuses = ['Not Started', 'WIP', 'Client Sign', 'Invoiced', 'Moved to Next Month']

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
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
            <h1 className="text-2xl font-bold text-slate-900">Work Progress</h1>
            <p className="text-slate-600">Track and manage work progress across all projects</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Work Item
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.key
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

        {/* Dashboard Tab */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {Object.entries(statusSummary).map(([status, data]) => (
                <Card key={status} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-600 mb-1">{status}</p>
                        <p className="text-3xl font-bold text-slate-900 mb-1">{data.count}</p>
                        <p className="text-lg font-semibold text-green-600">£{data.total.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {workItems.length > 0 ? Math.round((data.count / workItems.length) * 100) : 0}% of total
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${getStatusColor(status).replace('text-', 'bg-').replace('-800', '-200')}`}>
                        {getStatusIcon(status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-600 mb-1">Total Value</p>
                      <p className="text-3xl font-bold text-slate-900 mb-1">{workItems.length}</p>
                      <p className="text-lg font-semibold text-blue-600">£{totalValue.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 mt-1">All work items</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
                <CardDescription>Visual breakdown of work items by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(statusSummary).map(([status, data]) => {
                    const percentage = workItems.length > 0 ? (data.count / workItems.length) * 100 : 0
                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-').replace('-800', '-200')}`}>
                              {getStatusIcon(status)}
                            </div>
                            <div>
                              <span className="font-medium text-slate-900">{status}</span>
                              <span className="text-sm text-slate-500 ml-2">{data.count} items</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-900">£{data.total.toLocaleString()}</div>
                            <div className="text-sm text-slate-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getStatusColor(status).replace('text-', 'bg-').replace('-800', '-500')}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Work Items */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Work Items</CardTitle>
                <CardDescription>Latest 5 work items across all statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Building2 className="h-5 w-5 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900">{item.companyName}</div>
                          <div className="text-sm text-slate-500">{item.serviceType} • {item.owner}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(item.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(item.status)}
                            {item.status}
                          </div>
                        </Badge>
                        <div className="text-right">
                          <div className="font-medium text-slate-900">£{item.costOfSale.toLocaleString()}</div>
                          <div className="text-sm text-slate-500">{item.dateReceived.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Other Tabs */}
        {activeTab !== 'DASHBOARD' && (
          <div className="space-y-4">
            {/* View Mode Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">View:</span>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <List className="h-4 w-4 mr-1 inline" />
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
                    <Grid3X3 className="h-4 w-4 mr-1 inline" />
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
                    <Kanban className="h-4 w-4 mr-1 inline" />
                    Board
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-1.5 text-sm font-medium rounded ${
                      viewMode === 'calendar'
                        ? 'bg-white text-slate-900 shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-1 inline" />
                    Calendar
                  </button>
                </div>
              </div>
              
              {/* Calendar View Controls */}
              {viewMode === 'calendar' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-600">Period:</span>
                  <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                    {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
                      <button
                        key={period}
                        onClick={() => setCalendarView(period)}
                        className={`px-3 py-1.5 text-sm font-medium rounded ${
                          calendarView === period
                            ? 'bg-white text-slate-900 shadow'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search work items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Owners</SelectItem>
                  {owners.map(owner => (
                    <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Work Items Display */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab === 'ALL' ? 'All Work Items' : `${activeTab} Work Items`}
                </CardTitle>
                <CardDescription>
                  {filteredWorkItems.length} of {workItems.length} work items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* List View */}
                {viewMode === 'list' && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-48">Company</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-32">Owner</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-32">Date Received</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-40">Service Type</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-24">Cost</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-32">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-32">Expected Completion</th>
                          <th className="text-left py-3 px-4 font-medium text-slate-600 w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredWorkItems.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <div>
                                  <div className="font-medium text-slate-900">{item.companyName}</div>
                                  {item.clientContact && (
                                    <div className="text-sm text-slate-500">{item.clientContact}</div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-400" />
                                <span className="text-sm">{item.owner}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {item.dateReceived.toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline">{item.serviceType}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4 text-slate-400" />
                                <span className="font-medium">£{item.costOfSale.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={getStatusColor(item.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(item.status)}
                                  {item.status}
                                </div>
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-sm">
                              {item.expectedCompletion ? item.expectedCompletion.toLocaleDateString() : '-'}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteWorkItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWorkItems.map((item) => (
                      <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-5 w-5 text-slate-400" />
                              <div>
                                <CardTitle className="text-sm font-medium">{item.companyName}</CardTitle>
                                <CardDescription className="text-xs">{item.serviceType}</CardDescription>
                              </div>
                            </div>
                            <Badge className={getStatusColor(item.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(item.status)}
                                <span className="text-xs">{item.status}</span>
                              </div>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Owner:</span>
                              <span className="font-medium">{item.owner}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Cost:</span>
                              <span className="font-medium">£{item.costOfSale.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600">Received:</span>
                              <span className="font-medium">{item.dateReceived.toLocaleDateString()}</span>
                            </div>
                            {item.expectedCompletion && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600">Expected:</span>
                                <span className="font-medium">{item.expectedCompletion.toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteWorkItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Board View */}
                {viewMode === 'board' && (
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                    {['Not Started', 'WIP', 'Client Sign', 'Invoiced', 'Moved to Next Month'].map((status) => {
                      const statusItems = filteredWorkItems.filter(item => item.status === status)
                      return (
                        <div key={status} className="bg-slate-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-slate-900">{status}</h3>
                            <span className="text-sm text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                              {statusItems.length}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {statusItems.map((item) => (
                              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-3">
                                  <div className="space-y-2">
                                    <div className="font-medium text-sm">{item.companyName}</div>
                                    <div className="text-xs text-slate-600">{item.serviceType}</div>
                                    <div className="flex items-center justify-between text-xs">
                                      <span>{item.owner}</span>
                                      <span className="font-medium">£{item.costOfSale.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1 pt-1">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => setEditingItem(item)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-6 px-2 text-xs"
                                        onClick={() => handleDeleteWorkItem(item.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            {statusItems.length === 0 && (
                              <div className="text-center py-8 text-slate-400">
                                <FileText className="h-8 w-8 mx-auto mb-2" />
                                <p className="text-sm">No items</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Calendar View */}
                {viewMode === 'calendar' && (
                  <div className="space-y-4">
                    {/* Calendar Navigation */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDate = new Date(currentDate)
                            if (calendarView === 'monthly') {
                              newDate.setMonth(newDate.getMonth() - 1)
                            } else if (calendarView === 'weekly') {
                              newDate.setDate(newDate.getDate() - 7)
                            } else if (calendarView === 'daily') {
                              newDate.setDate(newDate.getDate() - 1)
                            } else if (calendarView === 'yearly') {
                              newDate.setFullYear(newDate.getFullYear() - 1)
                            }
                            setCurrentDate(newDate)
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-lg font-semibold">
                          {calendarView === 'monthly' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          {calendarView === 'weekly' && `Week of ${currentDate.toLocaleDateString()}`}
                          {calendarView === 'daily' && currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          {calendarView === 'yearly' && currentDate.getFullYear().toString()}
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newDate = new Date(currentDate)
                            if (calendarView === 'monthly') {
                              newDate.setMonth(newDate.getMonth() + 1)
                            } else if (calendarView === 'weekly') {
                              newDate.setDate(newDate.getDate() + 7)
                            } else if (calendarView === 'daily') {
                              newDate.setDate(newDate.getDate() + 1)
                            } else if (calendarView === 'yearly') {
                              newDate.setFullYear(newDate.getFullYear() + 1)
                            }
                            setCurrentDate(newDate)
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentDate(new Date())}
                      >
                        Today
                      </Button>
                    </div>

                    {/* Calendar Display */}
                    <div className="bg-white rounded-lg border">
                      {calendarView === 'monthly' && (
                        <div className="p-4">
                          <div className="grid grid-cols-7 gap-1 mb-4">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">
                                {day}
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => {
                              const day = i + 1
                              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                              const dayItems = filteredWorkItems.filter(item => {
                                const itemDate = new Date(item.dateReceived)
                                return itemDate.getDate() === day && 
                                       itemDate.getMonth() === currentDate.getMonth() && 
                                       itemDate.getFullYear() === currentDate.getFullYear()
                              })
                              return (
                                <div key={day} className="h-24 border border-slate-200 p-1">
                                  <div className="text-sm font-medium text-slate-900 mb-1">{day}</div>
                                  <div className="space-y-1">
                                    {dayItems.slice(0, 2).map(item => (
                                      <div
                                        key={item.id}
                                        className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                                        onClick={() => setEditingItem(item)}
                                        title={`${item.companyName} - ${item.serviceType}`}
                                      >
                                        {item.companyName}
                                      </div>
                                    ))}
                                    {dayItems.length > 2 && (
                                      <div className="text-xs text-slate-500">
                                        +{dayItems.length - 2} more
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {calendarView === 'weekly' && (
                        <div className="p-4">
                          <div className="grid grid-cols-7 gap-4">
                            {Array.from({ length: 7 }, (_, i) => {
                              const date = new Date(currentDate)
                              date.setDate(currentDate.getDate() - currentDate.getDay() + i)
                              const dayItems = filteredWorkItems.filter(item => {
                                const itemDate = new Date(item.dateReceived)
                                return itemDate.toDateString() === date.toDateString()
                              })
                              return (
                                <div key={i} className="border border-slate-200 rounded-lg p-3">
                                  <div className="text-sm font-medium text-slate-900 mb-2">
                                    {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                  </div>
                                  <div className="space-y-2">
                                    {dayItems.map(item => (
                                      <div
                                        key={item.id}
                                        className="text-xs p-2 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                                        onClick={() => setEditingItem(item)}
                                      >
                                        <div className="font-medium">{item.companyName}</div>
                                        <div className="text-xs opacity-75">{item.serviceType}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {calendarView === 'daily' && (
                        <div className="p-4">
                          <div className="space-y-4">
                            {filteredWorkItems.filter(item => {
                              const itemDate = new Date(item.dateReceived)
                              return itemDate.toDateString() === currentDate.toDateString()
                            }).map(item => (
                              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <Building2 className="h-5 w-5 text-slate-400" />
                                      <div>
                                        <div className="font-medium text-slate-900">{item.companyName}</div>
                                        <div className="text-sm text-slate-500">{item.serviceType} • {item.owner}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <Badge className={getStatusColor(item.status)}>
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(item.status)}
                                          {item.status}
                                        </div>
                                      </Badge>
                                      <div className="text-right">
                                        <div className="font-medium text-slate-900">£{item.costOfSale.toLocaleString()}</div>
                                        <div className="text-sm text-slate-500">{item.dateReceived.toLocaleTimeString()}</div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {calendarView === 'yearly' && (
                        <div className="p-4">
                          <div className="grid grid-cols-4 gap-4">
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = new Date(currentDate.getFullYear(), i, 1)
                              const monthItems = filteredWorkItems.filter(item => {
                                const itemDate = new Date(item.dateReceived)
                                return itemDate.getMonth() === i && itemDate.getFullYear() === currentDate.getFullYear()
                              })
                              return (
                                <div key={i} className="border border-slate-200 rounded-lg p-3">
                                  <div className="text-sm font-medium text-slate-900 mb-2">
                                    {month.toLocaleDateString('en-US', { month: 'long' })}
                                  </div>
                                  <div className="space-y-1">
                                    {monthItems.slice(0, 3).map(item => (
                                      <div
                                        key={item.id}
                                        className="text-xs p-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200"
                                        onClick={() => setEditingItem(item)}
                                      >
                                        {item.companyName}
                                      </div>
                                    ))}
                                    {monthItems.length > 3 && (
                                      <div className="text-xs text-slate-500">
                                        +{monthItems.length - 3} more
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Work Item Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Work Item</DialogTitle>
              <DialogDescription>
                Create a new work item to track progress
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={newWorkItem.companyName}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <Label htmlFor="owner">Owner</Label>
                  <Select value={newWorkItem.owner} onValueChange={(value) => setNewWorkItem(prev => ({ ...prev, owner: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map(owner => (
                        <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateReceived">Date Received</Label>
                  <Input
                    id="dateReceived"
                    type="date"
                    value={newWorkItem.dateReceived?.toISOString().split('T')[0]}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, dateReceived: new Date(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="expectedCompletion">Expected Completion</Label>
                  <Input
                    id="expectedCompletion"
                    type="date"
                    value={newWorkItem.expectedCompletion?.toISOString().split('T')[0]}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, expectedCompletion: new Date(e.target.value) }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select value={newWorkItem.serviceType} onValueChange={(value) => setNewWorkItem(prev => ({ ...prev, serviceType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="costOfSale">Cost of Sale (£)</Label>
                  <Input
                    id="costOfSale"
                    type="number"
                    value={newWorkItem.costOfSale}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, costOfSale: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newWorkItem.status} onValueChange={(value) => setNewWorkItem(prev => ({ ...prev, status: value as any }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newWorkItem.description}
                  onChange={(e) => setNewWorkItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the work item"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="clientContact">Client Contact</Label>
                  <Input
                    id="clientContact"
                    value={newWorkItem.clientContact}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, clientContact: e.target.value }))}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={newWorkItem.clientEmail}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    value={newWorkItem.clientPhone}
                    onChange={(e) => setNewWorkItem(prev => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="+44 20 1234 5678"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newWorkItem.notes}
                  onChange={(e) => setNewWorkItem(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes"
                  rows={2}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWorkItem}>
                Add Work Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Work Item Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Work Item</DialogTitle>
              <DialogDescription>
                Update work item details
              </DialogDescription>
            </DialogHeader>
            
            {editingItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-companyName">Company Name</Label>
                    <Input
                      id="edit-companyName"
                      value={editingItem.companyName}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, companyName: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-owner">Owner</Label>
                    <Select value={editingItem.owner} onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, owner: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map(owner => (
                          <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-serviceType">Service Type</Label>
                    <Select value={editingItem.serviceType} onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, serviceType: value } : null)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-costOfSale">Cost of Sale (£)</Label>
                    <Input
                      id="edit-costOfSale"
                      type="number"
                      value={editingItem.costOfSale}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, costOfSale: Number(e.target.value) } : null)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingItem.status} onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, status: value as any } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingItem.notes}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    rows={2}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditWorkItem}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Shell>
  )
}
