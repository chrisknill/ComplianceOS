'use client'

import { useState, useEffect } from 'react'
import { Shell } from '@/components/layout/Shell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Trash2, 
  Recycle, 
  AlertTriangle,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart
} from 'lucide-react'
import { WasteRecordForm } from '@/components/forms/WasteRecordForm'
import { WasteTypeForm } from '@/components/forms/WasteTypeForm'
import { FacilityForm } from '@/components/forms/FacilityForm'
import { TransporterForm } from '@/components/forms/TransporterForm'

interface WasteType {
  id: string
  name: string
  description?: string
  category: string
  hazardClass?: string
  disposalMethod?: string
  regulatoryCode?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface WasteRecord {
  id: string
  recordNumber: string
  wasteTypeId: string
  quantity: number
  unit: string
  location: string
  generatedBy: string
  generatedDate: string
  storedDate?: string
  disposalDate?: string
  disposalMethod: string
  disposalFacility?: string
  transporter?: string
  manifestNumber?: string
  cost?: number
  status: string
  notes?: string
  attachments?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  wasteType: WasteType
  logs: Array<{
    id: string
    action: string
    performedBy?: string
    comments?: string
    timestamp: string
  }>
}

interface WasteDisposalFacility {
  id: string
  name: string
  facilityType: string
  address?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  licenseNumber?: string
  licenseExpiry?: string
  acceptedWasteTypes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface WasteTransporter {
  id: string
  name: string
  licenseNumber?: string
  contactPerson?: string
  contactPhone?: string
  contactEmail?: string
  address?: string
  licenseExpiry?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function WasteManagementPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>([])
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([])
  const [facilities, setFacilities] = useState<WasteDisposalFacility[]>([])
  const [transporters, setTransporters] = useState<WasteTransporter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [showWasteRecordForm, setShowWasteRecordForm] = useState(false)
  const [showWasteTypeForm, setShowWasteTypeForm] = useState(false)
  const [showFacilityForm, setShowFacilityForm] = useState(false)
  const [showTransporterForm, setShowTransporterForm] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<WasteRecord | null>(null)
  const [selectedType, setSelectedType] = useState<WasteType | null>(null)
  const [selectedFacility, setSelectedFacility] = useState<WasteDisposalFacility | null>(null)
  const [selectedTransporter, setSelectedTransporter] = useState<WasteTransporter | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [dateRange, setDateRange] = useState('ALL')

  // Fetch data
  const fetchWasteRecords = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'ALL') params.append('status', statusFilter)
      if (dateRange !== 'ALL') {
        const now = new Date()
        const startDate = new Date(now.getFullYear(), now.getMonth() - parseInt(dateRange), 1)
        params.append('startDate', startDate.toISOString())
      }
      
      const response = await fetch(`/api/waste-management/records?${params}`)
      if (!response.ok) throw new Error('Failed to fetch waste records')
      const data = await response.json()
      setWasteRecords(data.wasteRecords || [])
    } catch (err) {
      console.error('Error fetching waste records:', err)
      setError('Failed to load waste records')
    }
  }

  const fetchWasteTypes = async () => {
    try {
      const response = await fetch('/api/waste-management/types')
      if (!response.ok) throw new Error('Failed to fetch waste types')
      const data = await response.json()
      setWasteTypes(data || [])
    } catch (err) {
      console.error('Error fetching waste types:', err)
      setError('Failed to load waste types')
    }
  }

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/waste-management/facilities')
      if (!response.ok) throw new Error('Failed to fetch facilities')
      const data = await response.json()
      setFacilities(data || [])
    } catch (err) {
      console.error('Error fetching facilities:', err)
      setError('Failed to load facilities')
    }
  }

  const fetchTransporters = async () => {
    try {
      const response = await fetch('/api/waste-management/transporters')
      if (!response.ok) throw new Error('Failed to fetch transporters')
      const data = await response.json()
      setTransporters(data || [])
    } catch (err) {
      console.error('Error fetching transporters:', err)
      setError('Failed to load transporters')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchWasteRecords(),
        fetchWasteTypes(),
        fetchFacilities(),
        fetchTransporters(),
      ])
      setLoading(false)
    }
    loadData()
  }, [statusFilter, dateRange])

  // Calculate statistics
  const stats = {
    totalRecords: wasteRecords.length,
    totalQuantity: wasteRecords.reduce((sum, record) => sum + record.quantity, 0),
    totalCost: wasteRecords.reduce((sum, record) => sum + (record.cost || 0), 0),
    pendingDisposal: wasteRecords.filter(r => r.status !== 'DISPOSED').length,
    disposedThisMonth: wasteRecords.filter(r => {
      const disposalDate = new Date(r.disposalDate || r.createdAt)
      const now = new Date()
      return disposalDate.getMonth() === now.getMonth() && 
             disposalDate.getFullYear() === now.getFullYear() &&
             r.status === 'DISPOSED'
    }).length,
  }

  // Filter records
  const filteredRecords = wasteRecords.filter(record => {
    const matchesSearch = record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.generatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.wasteType.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'ALL' || record.wasteType.category === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const handleFormSubmit = async () => {
    await Promise.all([
      fetchWasteRecords(),
      fetchWasteTypes(),
      fetchFacilities(),
      fetchTransporters(),
    ])
    setShowWasteRecordForm(false)
    setShowWasteTypeForm(false)
    setShowFacilityForm(false)
    setShowTransporterForm(false)
    setSelectedRecord(null)
    setSelectedType(null)
    setSelectedFacility(null)
    setSelectedTransporter(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      GENERATED: 'default',
      STORED: 'secondary',
      IN_TRANSIT: 'outline',
      DISPOSED: 'destructive',
    } as const
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const colors = {
      HAZARDOUS: 'destructive',
      NON_HAZARDOUS: 'default',
      RECYCLABLE: 'secondary',
      ORGANIC: 'outline',
      ELECTRONIC: 'default',
    } as const
    
    return (
      <Badge variant={colors[category as keyof typeof colors] || 'default'}>
        {category.replace('_', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Shell>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading waste management data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Waste Management</h1>
            <p className="text-gray-600 mt-1">ISO 14001 Environmental Management System</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={showWasteRecordForm} onOpenChange={setShowWasteRecordForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Waste Record
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {selectedRecord ? 'Edit Waste Record' : 'New Waste Record'}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedRecord ? 'Update waste record details' : 'Create a new waste record'}
                  </DialogDescription>
                </DialogHeader>
                <WasteRecordForm
                  wasteRecord={selectedRecord}
                  wasteTypes={wasteTypes}
                  facilities={facilities}
                  transporters={transporters}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowWasteRecordForm(false)
                    setSelectedRecord(null)
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
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords}</div>
              <p className="text-xs text-muted-foreground">
                Waste records tracked
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuantity.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Units of waste managed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Disposal costs incurred
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Disposal</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDisposal}</div>
              <p className="text-xs text-muted-foreground">
                Records awaiting disposal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="records">Waste Records</TabsTrigger>
            <TabsTrigger value="types">Waste Types</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="transporters">Transporters</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Records */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Waste Records</CardTitle>
                  <CardDescription>Latest waste records created</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wasteRecords.slice(0, 5).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{record.recordNumber}</p>
                          <p className="text-sm text-gray-600">{record.wasteType.name}</p>
                          <p className="text-xs text-gray-500">{record.location}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(record.status)}
                          <p className="text-sm text-gray-600 mt-1">
                            {record.quantity} {record.unit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Waste Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Waste Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['HAZARDOUS', 'NON_HAZARDOUS', 'RECYCLABLE', 'ORGANIC', 'ELECTRONIC'].map((category) => {
                      const count = wasteRecords.filter(r => r.wasteType.category === category).length
                      const percentage = wasteRecords.length > 0 ? (count / wasteRecords.length) * 100 : 0
                      
                      return (
                        <div key={category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getCategoryBadge(category)}
                            <span className="text-sm">{count} records</span>
                          </div>
                          <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Waste Records Tab */}
          <TabsContent value="records" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search records..."
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
                      <SelectItem value="GENERATED">Generated</SelectItem>
                      <SelectItem value="STORED">Stored</SelectItem>
                      <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                      <SelectItem value="DISPOSED">Disposed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Categories</SelectItem>
                      <SelectItem value="HAZARDOUS">Hazardous</SelectItem>
                      <SelectItem value="NON_HAZARDOUS">Non-Hazardous</SelectItem>
                      <SelectItem value="RECYCLABLE">Recyclable</SelectItem>
                      <SelectItem value="ORGANIC">Organic</SelectItem>
                      <SelectItem value="ELECTRONIC">Electronic</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Time</SelectItem>
                      <SelectItem value="1">Last Month</SelectItem>
                      <SelectItem value="3">Last 3 Months</SelectItem>
                      <SelectItem value="6">Last 6 Months</SelectItem>
                      <SelectItem value="12">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Records Table */}
            <Card>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Record #</th>
                        <th className="text-left p-3">Waste Type</th>
                        <th className="text-left p-3">Quantity</th>
                        <th className="text-left p-3">Location</th>
                        <th className="text-left p-3">Generated By</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{record.recordNumber}</td>
                          <td className="p-3">
                            <div>
                              <p className="font-medium">{record.wasteType.name}</p>
                              {getCategoryBadge(record.wasteType.category)}
                            </div>
                          </td>
                          <td className="p-3">{record.quantity} {record.unit}</td>
                          <td className="p-3">{record.location}</td>
                          <td className="p-3">{record.generatedBy}</td>
                          <td className="p-3">{getStatusBadge(record.status)}</td>
                          <td className="p-3">
                            {new Date(record.generatedDate).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedRecord(record)
                                  setShowWasteRecordForm(true)
                                }}
                              >
                                Edit
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
          </TabsContent>

          {/* Waste Types Tab */}
          <TabsContent value="types" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Waste Types</h3>
              <Dialog open={showWasteTypeForm} onOpenChange={setShowWasteTypeForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Waste Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedType ? 'Edit Waste Type' : 'New Waste Type'}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedType ? 'Update waste type details' : 'Create a new waste type'}
                    </DialogDescription>
                  </DialogHeader>
                  <WasteTypeForm
                    wasteType={selectedType}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setShowWasteTypeForm(false)
                      setSelectedType(null)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wasteTypes.map((type) => (
                <Card key={type.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                      {getCategoryBadge(type.category)}
                    </div>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {type.hazardClass && (
                        <p><span className="font-medium">Hazard Class:</span> {type.hazardClass}</p>
                      )}
                      {type.disposalMethod && (
                        <p><span className="font-medium">Disposal Method:</span> {type.disposalMethod}</p>
                      )}
                      {type.regulatoryCode && (
                        <p><span className="font-medium">Regulatory Code:</span> {type.regulatoryCode}</p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedType(type)
                          setShowWasteTypeForm(true)
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Facilities Tab */}
          <TabsContent value="facilities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Disposal Facilities</h3>
              <Dialog open={showFacilityForm} onOpenChange={setShowFacilityForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Facility
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedFacility ? 'Edit Facility' : 'New Facility'}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedFacility ? 'Update facility details' : 'Add a new disposal facility'}
                    </DialogDescription>
                  </DialogHeader>
                  <FacilityForm
                    facility={selectedFacility}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setShowFacilityForm(false)
                      setSelectedFacility(null)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((facility) => (
                <Card key={facility.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{facility.name}</CardTitle>
                      <Badge variant="outline">{facility.facilityType}</Badge>
                    </div>
                    {facility.address && (
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {facility.address}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {facility.contactPerson && (
                        <p><span className="font-medium">Contact:</span> {facility.contactPerson}</p>
                      )}
                      {facility.contactPhone && (
                        <p><span className="font-medium">Phone:</span> {facility.contactPhone}</p>
                      )}
                      {facility.licenseNumber && (
                        <p><span className="font-medium">License:</span> {facility.licenseNumber}</p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFacility(facility)
                          setShowFacilityForm(true)
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transporters Tab */}
          <TabsContent value="transporters" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Waste Transporters</h3>
              <Dialog open={showTransporterForm} onOpenChange={setShowTransporterForm}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Transporter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedTransporter ? 'Edit Transporter' : 'New Transporter'}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedTransporter ? 'Update transporter details' : 'Add a new waste transporter'}
                    </DialogDescription>
                  </DialogHeader>
                  <TransporterForm
                    transporter={selectedTransporter}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                      setShowTransporterForm(false)
                      setSelectedTransporter(null)
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {transporters.map((transporter) => (
                <Card key={transporter.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{transporter.name}</CardTitle>
                    {transporter.address && (
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {transporter.address}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      {transporter.contactPerson && (
                        <p><span className="font-medium">Contact:</span> {transporter.contactPerson}</p>
                      )}
                      {transporter.contactPhone && (
                        <p><span className="font-medium">Phone:</span> {transporter.contactPhone}</p>
                      )}
                      {transporter.licenseNumber && (
                        <p><span className="font-medium">License:</span> {transporter.licenseNumber}</p>
                      )}
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTransporter(transporter)
                          setShowTransporterForm(true)
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  )
}
