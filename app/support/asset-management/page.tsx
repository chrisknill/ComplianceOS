'use client'

import { useEffect, useState, useMemo } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { 
  Server, Wrench, Calendar, Plus, Download, Search, Filter, ArrowUpDown, ArrowUp, ArrowDown,
  LayoutDashboard, CheckCircle, AlertCircle, Clock, Settings, Building2, FileCheck,
  TrendingUp, Activity, AlertTriangle, Target, List, Grid3X3, Calendar as CalendarIcon,
  Package, ChevronLeft, ChevronRight, Eye, Edit, Trash2
} from 'lucide-react'
import { EquipmentForm } from '@/components/forms/EquipmentForm'
import { CalibrationForm } from '@/components/forms/CalibrationForm'
import { convertToCSV, downloadFile } from '@/lib/export'
import { exportTableToPDF } from '@/lib/pdf'
import { StatusBadge } from '@/components/rag/StatusBadge'
import { getCalibrationRAG } from '@/lib/rag'
import { ViewToggle } from '@/components/ui/view-toggle'

// Interfaces
interface Equipment {
  id: string
  name: string
  assetTag: string | null
  location: string | null
  maintDue: Date | null
  status: string
  calibrations: Array<{
    id: string
    dueDate: Date
    performedOn: Date | null
  }>
}

interface Calibration {
  id: string
  dueDate: Date
  performedOn: Date | null
  certificateUrl: string | null
  result: string | null
  equipment: {
    id: string
    name: string
    assetTag: string | null
  }
}

interface InfrastructureAsset {
  id: string
  asset: string
  type: string
  location: string
  status: string
  nextMaintenance: string
}

type ViewMode = 'list' | 'grid' | 'board' | 'calendar'
type CalendarView = 'daily' | 'weekly' | 'monthly' | 'yearly'

export default function AssetManagementPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [calibrations, setCalibrations] = useState<Calibration[]>([])
  const [infrastructure, setInfrastructure] = useState<InfrastructureAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [calendarView, setCalendarView] = useState<CalendarView>('monthly')
  const [showEquipmentForm, setShowEquipmentForm] = useState(false)
  const [showCalibrationForm, setShowCalibrationForm] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>()
  const [editingCalibration, setEditingCalibration] = useState<Calibration | undefined>()

  // Filters and sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [locationFilter, setLocationFilter] = useState<string>('ALL')
  const [resultFilter, setResultFilter] = useState<string>('ALL')
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'all-assets', label: 'All Assets' },
    { key: 'infrastructure', label: 'Infrastructure' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'calibration', label: 'Calibration' },
  ]

  // Load data
  const loadEquipment = () => {
    fetch('/api/equipment')
      .then((res) => res.json())
      .then((data) => {
        setEquipment(data || [])
      })
      .catch((err) => {
        console.error('Failed to load equipment:', err)
        setEquipment([])
      })
  }

  const loadCalibrations = () => {
    fetch('/api/calibrations')
      .then((res) => res.json())
      .then((data) => {
        setCalibrations(data || [])
      })
      .catch((err) => {
        console.error('Failed to load calibrations:', err)
        setCalibrations([])
      })
  }

  const loadInfrastructure = () => {
    fetch('/api/infrastructure')
      .then((res) => res.json())
      .then((data) => {
        setInfrastructure(data || [])
      })
      .catch((err) => {
        console.error('Failed to load infrastructure:', err)
        setInfrastructure([])
      })
  }

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      await Promise.all([
        loadEquipment(),
        loadCalibrations(),
        loadInfrastructure()
      ])
      setLoading(false)
    }
    loadAllData()
  }, [])

  // Combined assets data
  const allAssets = useMemo(() => {
    const assets = [
      ...equipment.map(e => ({
        id: e.id,
        name: e.name,
        type: 'Equipment',
        assetTag: e.assetTag,
        location: e.location,
        status: e.status,
        nextMaintenance: e.maintDue,
        category: 'equipment'
      })),
      ...infrastructure.map(i => ({
        id: i.id,
        name: i.asset,
        type: i.type,
        assetTag: null,
        location: i.location,
        status: i.status,
        nextMaintenance: i.nextMaintenance,
        category: 'infrastructure'
      })),
      ...calibrations.map(c => ({
        id: c.id,
        name: c.equipment.name,
        type: 'Calibration',
        assetTag: c.equipment.assetTag,
        location: c.equipment.location,
        status: c.performedOn ? 'Completed' : 'Pending',
        nextMaintenance: c.dueDate,
        category: 'calibration'
      }))
    ]
    return assets
  }, [equipment, infrastructure, calibrations])

  // Filtering and sorting logic
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredAllAssets = allAssets
    .filter(asset => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          asset.name.toLowerCase().includes(search) ||
          (asset.assetTag?.toLowerCase() || '').includes(search) ||
          (asset.location?.toLowerCase() || '').includes(search) ||
          asset.type.toLowerCase().includes(search)
        )
      }
      return true
    })
    .filter(asset => statusFilter === 'ALL' || asset.status === statusFilter)
    .filter(asset => locationFilter === 'ALL' || (asset.location || '') === locationFilter)
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof typeof a]
      let bVal: any = b[sortField as keyof typeof b]
      
      if (sortField === 'nextMaintenance') {
        aVal = a.nextMaintenance ? new Date(a.nextMaintenance).getTime() : 0
        bVal = b.nextMaintenance ? new Date(b.nextMaintenance).getTime() : 0
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredEquipment = equipment
    .filter(e => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          e.name.toLowerCase().includes(search) ||
          (e.assetTag?.toLowerCase() || '').includes(search) ||
          (e.location?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(e => statusFilter === 'ALL' || e.status === statusFilter)
    .filter(e => locationFilter === 'ALL' || e.location === locationFilter)
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof Equipment]
      let bVal: any = b[sortField as keyof Equipment]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredCalibrations = calibrations
    .filter(c => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          c.equipment.name.toLowerCase().includes(search) ||
          (c.equipment.assetTag?.toLowerCase() || '').includes(search)
        )
      }
      return true
    })
    .filter(c => statusFilter === 'ALL' || (c.performedOn ? 'COMPLETED' : 'PENDING') === statusFilter)
    .filter(c => resultFilter === 'ALL' || (c.result || 'PENDING') === resultFilter)
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof Calibration]
      let bVal: any = b[sortField as keyof Calibration]
      
      if (sortField === 'dueDate') {
        aVal = a.dueDate ? new Date(a.dueDate).getTime() : 0
        bVal = b.dueDate ? new Date(b.dueDate).getTime() : 0
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  const filteredInfrastructure = infrastructure
    .filter(i => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          i.asset.toLowerCase().includes(search) ||
          i.type.toLowerCase().includes(search) ||
          i.location.toLowerCase().includes(search)
        )
      }
      return true
    })
    .filter(i => statusFilter === 'ALL' || i.status === statusFilter)
    .filter(i => locationFilter === 'ALL' || i.location === locationFilter)
    .sort((a, b) => {
      let aVal: any = a[sortField as keyof InfrastructureAsset]
      let bVal: any = b[sortField as keyof InfrastructureAsset]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  // Calculate statistics
  const stats = {
    totalAssets: allAssets.length,
    totalEquipment: equipment.length,
    activeEquipment: equipment.filter(e => e.status === 'ACTIVE').length,
    maintenanceDue: equipment.filter(e => e.maintDue && new Date(e.maintDue) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
    totalCalibrations: calibrations.length,
    overdueCalibrations: calibrations.filter(c => c.dueDate && new Date(c.dueDate) < new Date()).length,
    totalInfrastructure: infrastructure.length,
    operationalInfrastructure: infrastructure.filter(i => i.status === 'Operational').length,
    maintenanceDueInfrastructure: infrastructure.filter(i => {
      const nextMaint = new Date(i.nextMaintenance)
      return nextMaint <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }).length
  }

  const handleExport = (type: 'equipment' | 'calibrations' | 'infrastructure') => {
    let data: any[] = []
    let filename = ''
    
    switch (type) {
      case 'equipment':
        data = filteredEquipment.map(e => ({
          Name: e.name,
          'Asset Tag': e.assetTag || '-',
          Location: e.location || '-',
          Status: e.status,
          'Maintenance Due': e.maintDue ? formatDate(e.maintDue) : '-',
        }))
        filename = 'equipment'
        break
      case 'calibrations':
        data = filteredCalibrations.map(c => ({
          Equipment: c.equipment.name,
          'Asset Tag': c.equipment.assetTag || '-',
          'Due Date': formatDate(c.dueDate),
          'Performed On': c.performedOn ? formatDate(c.performedOn) : 'Pending',
          Result: c.result || '-',
        }))
        filename = 'calibrations'
        break
      case 'infrastructure':
        data = filteredInfrastructure.map(i => ({
          Asset: i.asset,
          Type: i.type,
          Location: i.location,
          Status: i.status,
          'Next Maintenance': i.nextMaintenance,
        }))
        filename = 'infrastructure'
        break
    }
    
    const csv = convertToCSV(data)
    downloadFile(csv, `${filename}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv')
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Loading asset management data...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Asset Management</h1>
            <p className="text-slate-600 mt-1">Comprehensive management of equipment, infrastructure, and calibration</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handleExport('equipment')}>
              <Download className="h-4 w-4 mr-2" />
              Export Equipment
            </Button>
            <Button variant="outline" onClick={() => handleExport('calibrations')}>
              <Download className="h-4 w-4 mr-2" />
              Export Calibrations
            </Button>
            <Button variant="outline" onClick={() => handleExport('infrastructure')}>
              <Download className="h-4 w-4 mr-2" />
              Export Infrastructure
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

        {/* View Controls */}
        {activeTab !== 'dashboard' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
              {viewMode === 'calendar' && (
                <div className="border-b border-slate-200">
                  <nav className="-mb-px flex space-x-6">
                    {[
                      { key: 'daily', label: 'Daily' },
                      { key: 'weekly', label: 'Weekly' },
                      { key: 'monthly', label: 'Monthly' },
                      { key: 'yearly', label: 'Yearly' }
                    ].map((calendarTab) => (
                      <button
                        key={calendarTab.key}
                        onClick={() => setCalendarView(calendarTab.key as CalendarView)}
                        className={`
                          whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                          ${
                            calendarView === calendarTab.key
                              ? 'border-slate-900 text-slate-900'
                              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                          }
                        `}
                      >
                        {calendarTab.label}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Equipment</CardTitle>
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEquipment}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeEquipment} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Infrastructure Assets</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalInfrastructure}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.operationalInfrastructure} operational
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calibrations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCalibrations}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.overdueCalibrations} overdue
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance Due</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.maintenanceDue + stats.maintenanceDueInfrastructure}</div>
                  <p className="text-xs text-muted-foreground">
                    Next 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Asset Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Status</CardTitle>
                  <CardDescription>Current status of all equipment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Active</span>
                      </div>
                      <span className="text-sm font-medium">{stats.activeEquipment}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Maintenance Due</span>
                      </div>
                      <span className="text-sm font-medium">{stats.maintenanceDue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">Inactive</span>
                      </div>
                      <span className="text-sm font-medium">{stats.totalEquipment - stats.activeEquipment}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Infrastructure Status</CardTitle>
                  <CardDescription>Current status of infrastructure assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Operational</span>
                      </div>
                      <span className="text-sm font-medium">{stats.operationalInfrastructure}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Under Maintenance</span>
                      </div>
                      <span className="text-sm font-medium">{stats.totalInfrastructure - stats.operationalInfrastructure}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Maintenance Due</span>
                      </div>
                      <span className="text-sm font-medium">{stats.maintenanceDueInfrastructure}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* All Assets Tab */}
        {activeTab === 'all-assets' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Operational">Operational</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Locations</SelectItem>
                  <SelectItem value="Plant Floor">Plant Floor</SelectItem>
                  <SelectItem value="Main Building">Main Building</SelectItem>
                  <SelectItem value="Data Center">Data Center</SelectItem>
                  <SelectItem value="Server Room">Server Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Content */}
            {viewMode === 'list' && (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          <button onClick={() => handleSort('name')} className="flex items-center gap-1">
                            Asset Name
                            {sortField === 'name' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Asset Tag</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          <button onClick={() => handleSort('nextMaintenance')} className="flex items-center gap-1">
                            Next Maintenance
                            {sortField === 'nextMaintenance' && (sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
                          </button>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredAllAssets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                {asset.category === 'equipment' && <Wrench className="h-5 w-5 text-blue-500" />}
                                {asset.category === 'infrastructure' && <Server className="h-5 w-5 text-green-500" />}
                                {asset.category === 'calibration' && <Calendar className="h-5 w-5 text-orange-500" />}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{asset.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{asset.type}</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {asset.assetTag || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {asset.location || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge 
                              status={asset.status === 'Active' || asset.status === 'Operational' || asset.status === 'Completed' ? 'green' : 
                                     asset.status === 'Pending' || asset.status === 'Under Maintenance' ? 'amber' : 'red'} 
                              label={asset.status} 
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {asset.nextMaintenance ? formatDate(asset.nextMaintenance) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllAssets.map((asset) => (
                  <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {asset.category === 'equipment' && <Wrench className="h-5 w-5 text-blue-500" />}
                          {asset.category === 'infrastructure' && <Server className="h-5 w-5 text-green-500" />}
                          {asset.category === 'calibration' && <Calendar className="h-5 w-5 text-orange-500" />}
                          <CardTitle className="text-lg">{asset.name}</CardTitle>
                        </div>
                        <StatusBadge 
                          status={asset.status === 'Active' || asset.status === 'Operational' || asset.status === 'Completed' ? 'green' : 
                                 asset.status === 'Pending' || asset.status === 'Under Maintenance' ? 'amber' : 'red'} 
                          label={asset.status} 
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Type:</span>
                        <Badge variant="outline">{asset.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Asset Tag:</span>
                        <span className="text-sm">{asset.assetTag || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Location:</span>
                        <span className="text-sm">{asset.location || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Next Maintenance:</span>
                        <span className="text-sm">{asset.nextMaintenance ? formatDate(asset.nextMaintenance) : '-'}</span>
                      </div>
                      <div className="flex justify-center gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {viewMode === 'board' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Active', 'Pending', 'Under Maintenance'].map((status) => (
                  <div key={status} className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-medium text-slate-900 mb-4">{status}</h3>
                    <div className="space-y-3">
                      {filteredAllAssets.filter(asset => asset.status === status).map((asset) => (
                        <Card key={asset.id} className="p-3">
                          <div className="flex items-center gap-2 mb-2">
                            {asset.category === 'equipment' && <Wrench className="h-4 w-4 text-blue-500" />}
                            {asset.category === 'infrastructure' && <Server className="h-4 w-4 text-green-500" />}
                            {asset.category === 'calibration' && <Calendar className="h-4 w-4 text-orange-500" />}
                            <span className="text-sm font-medium">{asset.name}</span>
                          </div>
                          <div className="text-xs text-slate-500">
                            <div>{asset.type}</div>
                            <div>{asset.location || 'No location'}</div>
                            {asset.nextMaintenance && (
                              <div>Due: {formatDate(asset.nextMaintenance)}</div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {viewMode === 'calendar' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Asset Maintenance Calendar - {calendarView.charAt(0).toUpperCase() + calendarView.slice(1)} View</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">January 2025</span>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {calendarView === 'monthly' && (
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-slate-500">{day}</div>
                    ))}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <div key={day} className="p-2 min-h-[80px] border border-slate-200">
                        <div className="text-sm font-medium mb-1">{day}</div>
                        <div className="space-y-1">
                          {filteredAllAssets.filter(asset => {
                            if (!asset.nextMaintenance) return false
                            const maintenanceDate = new Date(asset.nextMaintenance)
                            return maintenanceDate.getDate() === day
                          }).slice(0, 2).map(asset => (
                            <div key={asset.id} className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                              {asset.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {calendarView === 'weekly' && (
                  <div className="space-y-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-24 text-sm font-medium">{day}</div>
                        <div className="flex-1 flex gap-2">
                          {filteredAllAssets.filter(asset => {
                            // Mock logic for weekly view
                            return Math.random() > 0.7
                          }).slice(0, 3).map(asset => (
                            <div key={asset.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {asset.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {calendarView === 'daily' && (
                  <div className="space-y-4">
                    <div className="text-center text-lg font-medium">January 15, 2025</div>
                    <div className="grid grid-cols-24 gap-1">
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <div key={hour} className="p-2 border border-slate-200 min-h-[60px]">
                          <div className="text-xs text-slate-500 mb-1">{hour}:00</div>
                          <div className="space-y-1">
                            {filteredAllAssets.filter(asset => {
                              // Mock logic for daily view
                              return Math.random() > 0.8
                            }).slice(0, 1).map(asset => (
                              <div key={asset.id} className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                                {asset.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {calendarView === 'yearly' && (
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      'January', 'February', 'March', 'April',
                      'May', 'June', 'July', 'August',
                      'September', 'October', 'November', 'December'
                    ].map(month => (
                      <div key={month} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-3">{month} 2025</h4>
                        <div className="space-y-2">
                          {filteredAllAssets.filter(asset => {
                            // Mock logic for yearly view - show some assets for each month
                            const monthIndex = [
                              'January', 'February', 'March', 'April',
                              'May', 'June', 'July', 'August',
                              'September', 'October', 'November', 'December'
                            ].indexOf(month)
                            return Math.random() > 0.7 && monthIndex % 3 === 0
                          }).slice(0, 3).map(asset => (
                            <div key={asset.id} className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {asset.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Infrastructure Tab */}
        {activeTab === 'infrastructure' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Infrastructure Assets</h2>
              <Button onClick={() => console.log('Add infrastructure')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Infrastructure
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search infrastructure..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="Out of Service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Locations</SelectItem>
                    <SelectItem value="Plant Floor">Plant Floor</SelectItem>
                    <SelectItem value="Main Building">Main Building</SelectItem>
                    <SelectItem value="Data Center">Data Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Infrastructure Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('asset')}
                    >
                      <div className="flex items-center gap-2">
                        Asset
                        {sortField === 'asset' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('type')}
                    >
                      <div className="flex items-center gap-2">
                        Type
                        {sortField === 'type' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {sortField === 'location' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortField === 'status' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('nextMaintenance')}
                    >
                      <div className="flex items-center gap-2">
                        Next Maintenance
                        {sortField === 'nextMaintenance' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredInfrastructure.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Server className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{asset.asset}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{asset.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.location}</td>
                      <td className="px-6 py-4">
                        <Badge variant={asset.status === 'Operational' ? 'default' : 'secondary'}>
                          {asset.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{asset.nextMaintenance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Equipment</h2>
              <Button onClick={() => { setEditingEquipment(undefined); setShowEquipmentForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search equipment..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="MAINTENANCE">Under Maintenance</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Locations</SelectItem>
                    <SelectItem value="Plant Floor">Plant Floor</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Equipment Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Name
                        {sortField === 'name' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('assetTag')}
                    >
                      <div className="flex items-center gap-2">
                        Asset Tag
                        {sortField === 'assetTag' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('location')}
                    >
                      <div className="flex items-center gap-2">
                        Location
                        {sortField === 'location' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-2">
                        Status
                        {sortField === 'status' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('maintDue')}
                    >
                      <div className="flex items-center gap-2">
                        Maintenance Due
                        {sortField === 'maintDue' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEquipment.map((equipment) => (
                    <tr key={equipment.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Wrench className="h-5 w-5 text-slate-400" />
                          <span className="font-medium text-slate-900">{equipment.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{equipment.assetTag || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{equipment.location || '-'}</td>
                      <td className="px-6 py-4">
                        <Badge variant={equipment.status === 'ACTIVE' ? 'default' : 'secondary'}>
                          {equipment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {equipment.maintDue ? formatDate(equipment.maintDue) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calibration Tab */}
        {activeTab === 'calibration' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Calibration</h2>
              <Button onClick={() => { setEditingCalibration(undefined); setShowCalibrationForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Calibration
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search calibrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Results</SelectItem>
                    <SelectItem value="PASS">Pass</SelectItem>
                    <SelectItem value="FAIL">Fail</SelectItem>
                    <SelectItem value="ADJUSTED">Adjusted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Calibration Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('equipment')}
                    >
                      <div className="flex items-center gap-2">
                        Equipment
                        {sortField === 'equipment' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('dueDate')}
                    >
                      <div className="flex items-center gap-2">
                        Due Date
                        {sortField === 'dueDate' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('performedOn')}
                    >
                      <div className="flex items-center gap-2">
                        Performed On
                        {sortField === 'performedOn' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase cursor-pointer hover:bg-slate-100"
                      onClick={() => handleSort('result')}
                    >
                      <div className="flex items-center gap-2">
                        Result
                        {sortField === 'result' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCalibrations.map((calibration) => (
                    <tr key={calibration.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">{calibration.equipment.name}</div>
                            <div className="text-sm text-slate-500">{calibration.equipment.assetTag || 'No tag'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(calibration.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {calibration.performedOn ? formatDate(calibration.performedOn) : 'Pending'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {calibration.result || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge 
                          status={getCalibrationRAG(calibration.dueDate, calibration.performedOn)} 
                          label={calibration.performedOn ? 'Completed' : 'Pending'} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Forms */}
        <EquipmentForm
          open={showEquipmentForm}
          onClose={() => { setShowEquipmentForm(false); setEditingEquipment(undefined); }}
          equipment={editingEquipment}
          onSave={loadEquipment}
        />

        <CalibrationForm
          open={showCalibrationForm}
          onClose={() => { setShowCalibrationForm(false); setEditingCalibration(undefined); }}
          calibration={editingCalibration}
          onSave={loadCalibrations}
        />
      </div>
    </Shell>
  )
}
